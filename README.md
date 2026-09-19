# Judge Jev

A courtroom game with a geometric judge, pop-art styling, five evidence exhibits, and a typed defense. Jev decides GUILTY or NOT GUILTY. An OpenAI model writes fresh scenarios on demand, so play has no fixed case limit.

## API keys

Add these values to `.env.local` in this directory. A blank file is already present; `.env.example` is the committed template.

| Variable           | Obtain from                                             | Purpose                                                         |
| ------------------ | ------------------------------------------------------- | --------------------------------------------------------------- |
| `TYPESAFE_API_KEY` | [TypeSafe console](https://console.typesafe.ai/)        | Jev verdicts and generated-case review.                         |
| `OPENAI_API_KEY`   | [OpenAI API keys](https://platform.openai.com/api-keys) | Fresh accusations, five exhibits, and private solution rubrics. |
| `OPENAI_MODEL`     | Optional; defaults to `gpt-5.4-mini`                    | Scenario-writing model.                                         |

Use a Node.js version of 22.13 or newer. Install and start from this directory:

```sh
npm install
npm run dev
```

Restart the development server after adding keys. Hosted copies use the same variables as runtime secrets in Sites; local environment files stay on your computer. Set provider usage budgets to suit your expected traffic. Fresh cases require paid provider requests and remain subject to their rate and account limits.

With empty keys, the opening case supports writing a defense and revealing its notes. The screen labels this as unscored practice. With just TypeSafe connected, Jev judges the opening case. With both connected, **Deal a fresh case** and **Next case** generate new scenarios continuously.

## How cases work

Each generation request varies the setting, contradiction, and random seed. The writer receives up to twelve recent titles to reduce repetition. It returns a strict structured object with exactly five distinct exhibits, a solution, a rubric, and an example defense. Jev checks that the case is solvable before it reaches the player. A rejected case is regenerated once; persistent failures show a retry message and preserve the current case.

The server seals each complete case with authenticated encryption and returns its public fields plus an opaque token. Tokens expire after 24 hours. The encryption key derives from the TypeSafe secret; rotating that secret invalidates open generated cases. The server recovers canonical evidence from the token when judging, so browser-supplied evidence and rubrics cannot alter a case. This works across Worker instances without a case database.

Jev returns one fixed verdict. Case notes are written by the scenario writer and explain the puzzle; they are separate from Jev's decision. A valid defense can use a clear paraphrase or another sound argument grounded in the exhibits. The animated judge reacts to the game state.

Generated scenarios have no fixed library limit. Semantic uniqueness and consistent judging quality require real playtesting; structural validation and Jev review reduce malformed or unfair cases but do not guarantee correctness.

## Checks

```sh
npm test
npm run typecheck
npm run lint
npm run build
npm run evaluate
```

The first four commands run locally without keys. Unit tests mock provider responses and cover the API contracts, verdict propagation, encrypted cases, tampering, expiry, generation review, retries, request validation, and burst limits. Lint checks application code; the generated Shadcn catalog is excluded.

`npm run evaluate` makes paid live calls with the configured keys. It repeats ten labeled opening-case defenses three times and checks three generated cases with a valid answer, a bare denial, and an instruction-override attempt. It saves results to ignored `outputs/live-evaluation.json`. Review any mismatch before widening access. This is a starter evaluation set, not a completed model-quality benchmark.

The page also exposes optional WebMCP tools for reading the case, submitting a defense, and dealing a fresh case in supporting browsers. Browser-level WebMCP validation and desktop/mobile visual testing remain pending.

## Runtime and access

The app uses React, TypeScript, Vinext, and the Sites Cloudflare Worker runtime. Secrets stay on the server. API endpoints reject cross-origin browser requests, bound request sizes, and apply a per-isolate burst guard. Hosted access starts owner-private. Before opening public access, configure distributed platform rate limits and provider spending budgets; the in-memory guard limits bursts within one Worker instance.

No live keys were available during implementation. Build and mocked-provider checks establish the code path; live generation and verdict quality remain to be verified after configuration.

## Sources

- [TypeSafe API](https://docs.typesafe.ai/api)
- [TypeSafe Choice](https://docs.typesafe.ai/primitives/choice)
- [OpenAI structured outputs](https://developers.openai.com/api/docs/guides/structured-outputs)
- [GPT-5.4 mini](https://developers.openai.com/api/docs/models/gpt-5.4-mini)

Dependency audit: the initializer reported 11 advisories (8 high, 2 moderate, 1 low). Follow-up audit requests failed because the registry audit endpoints returned errors. Advisory details and remediation remain to be reviewed before public release.
