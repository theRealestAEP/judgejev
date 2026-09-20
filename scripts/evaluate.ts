import { mkdir, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import {
  caseKinds,
  caseBranches,
  createScenario,
  renderScenario,
  reviewScenario,
  scenarioVersion,
} from '../server/scenarios.ts';
import { judgeDefense, sealCase } from '../server/game.ts';

// Start with --limit 150 for one response across all 150 branches. No calls occur with --samples.
const args = process.argv.slice(2);
const option = (name: string, fallback: string) =>
  args.includes(name) ? args[args.indexOf(name) + 1] : fallback;
const split = option('--split', 'development');
if (!['development', 'heldout'].includes(split))
  throw new Error('--split must be development or heldout');
const limit = Number(option('--limit', '150'));
if (!Number.isInteger(limit) || limit < 1)
  throw new Error('--limit must be a positive integer');
const seeds =
  split === 'development' ? [20260919, 1976] : [971873113, 24680621];
const samples = args.includes('--samples');
if (!samples && existsSync('.env.local')) process.loadEnvFile('.env.local');
const env = { JEV_KEY: process.env.JEV_KEY };
if (!samples && !env.JEV_KEY)
  throw new Error('Add JEV_KEY to .env.local before live evaluation.');
const results: unknown[] = [];
const report = `outputs/${samples ? 'scenario-samples' : 'live-evaluation'}-${scenarioVersion}-${split}.json`;
await mkdir('outputs', { recursive: true });
const save = () =>
  writeFile(
    report,
    JSON.stringify(
      {
        date: new Date().toISOString(),
        judge: samples ? null : 'jev-latest',
        generator: scenarioVersion,
        split,
        seeds,
        responseScope: 'public-evidence-and-player-defense',
        results,
      },
      null,
      2,
    ),
  );
let disagreements = 0;
let contested = 0;
const baselines = new Map<string, number>();
const responseKinds = [
  'minimal',
  'strong',
  'concise',
  'plausible_mistake',
  'unsupported',
  'irrelevant',
] as const;
// Iterate response first so a small limit still covers every structure and branch.
outer: for (const responseKind of samples
  ? responseKinds.slice(0, 1)
  : responseKinds) {
  for (const seed of seeds) {
    for (const kind of caseKinds) {
      for (const branch of caseBranches) {
        const scenario = createScenario(kind, seed, branch);
        const file = renderScenario(scenario);
        const review = reviewScenario(scenario);
        const defense = {
          minimal: '.',
          strong: review.defenseArgument,
          concise: review.conciseDefense,
          plausible_mistake: review.plausibleMistake,
          unsupported:
            'I was at a family dinner somewhere else. There is no record of it here, but I promise it is true.',
          irrelevant: 'I like rainy days and would rather be reading a book.',
        }[responseKind];
        const fixture = {
          kind,
          branch,
          seed,
          facts: scenario,
          accusation: file.accusation,
          evidence: file.evidence,
          review,
          responseKind,
          defense,
        };
        if (samples) {
          results.push(fixture);
        } else {
          const started = Date.now();
          const token = await sealCase(file, env.JEV_KEY!);
          try {
            const result = await judgeDefense(token, defense, env);
            const matched =
              review.expectedVerdict === null
                ? null
                : result.verdict === review.expectedVerdict;
            if (matched === false) disagreements++;
            if (matched === null) contested++;
            const caseId = `${kind}/${branch}/${seed}`;
            if (responseKind === 'minimal')
              baselines.set(caseId, result.probabilities.not_guilty);
            const baseline = baselines.get(caseId);
            const argumentEffect =
              responseKind === 'strong' && baseline !== undefined
                ? {
                    baselineNotGuilty: baseline,
                    changeInNotGuilty:
                      result.probabilities.not_guilty - baseline,
                  }
                : undefined;
            results.push({
              ...fixture,
              ...result,
              matched,
              argumentEffect,
              milliseconds: Date.now() - started,
              disagreement:
                matched !== false
                  ? null
                  : {
                      classification: 'unreviewed',
                      reason: '',
                      allowedClassifications: [
                        'case_ambiguity',
                        'incorrect_expected_outcome',
                        'model_judgment_error',
                      ],
                    },
            });
            console.log(
              `${kind}/${branch}/${responseKind}/${seed}: ${result.verdict}${matched === null ? ' — contested' : matched ? '' : ' — review needed'}`,
            );
          } catch (error) {
            results.push({
              ...fixture,
              error: error instanceof Error ? error.message : String(error),
            });
            await save();
            throw error;
          }
        }
        await save();
        if (results.length >= limit) break outer;
      }
    }
  }
}
console.log(
  `${results.length} ${samples ? 'samples' : 'judgments'}; ${contested} contested records (unscored); ${disagreements} supported-control disagreements. ${report}`,
);
if (disagreements) process.exitCode = 1;
