# Judge Jev

A React + Vite courtroom game with a Cloudflare Worker API. A mechanical generator creates serious fictional cases with exactly five exhibits. Jev judges the evidence and the player's defense and returns its verdict probabilities. The browser renders the animated geometric courtroom and a three-minute countdown.

## Local development

Use Node.js 22.13 or newer. From this directory:

```sh
npm install
npm run dev
```

Open [the local game](http://localhost:3000/). Vite runs the frontend and Cloudflare's plugin runs the API locally. The entry points are `src/main.tsx` and `server/worker.ts`.

Set `JEV_KEY` in the ignored `.env.local` file, using a key from the [TypeSafe console](https://console.typesafe.ai/). `.env.example` is the committed template. Restart Vite after changing the key. Keep the key in the Worker environment; `VITE_` variables are exposed to the browser.

This is the only required key. Case generation runs locally on the server; Jev calls occur when a defense is submitted.

## Procedural generation

The generator contains **100 authored case setups**, each with a flawed and a consistent evidence variant. It draws the two variants with equal probability. A seed, setup, and variant reproduce a case under the current generator version. See [the full scenario catalog](docs/scenarios.md).

The original 24 patterns live in `server/scenarios.ts` and `server/additional-scenarios.ts`. The 76 added setups live in `server/case-catalog.ts` and share 19 rule families in `server/catalog-rules.ts`. Each catalog entry keeps its charge, subject, units, and responsibility evidence together. Rules generate structured facts, validate their relationships, and render all numerical exhibits from those facts. Each family has four authored settings; combinations across incompatible settings are never drawn.

| Patterns | Evidence relationships |
| --- | --- |
| Clock offset, travel time, visibility, shared access | Corrected timestamps, possible journeys, outage timing, and credential revocation |
| Duplicate transaction, vehicle identification, evidence custody, document revision | Transaction IDs, plate assignment dates, seal transfers, and signed versions |
| Trace age, door events, shipment mass, object dimensions | Cleaning chronology, reader event codes, tare weight, and physical clearance |
| Temperature, speed, control samples, suspension notices | Unit conversion, distance and time, laboratory controls, and effective dates |
| Spending limits, network attribution, sightlines, invoices | Per-order limits, port mappings, obstructions, and tax calculations |
| Concrete cure age, backups, chemical concentration, delivery records | Test maturity, snapshot timing, mixture ratios, and delivery receipts |

The new families cover waiting intervals, combined allowances, deductions, measurement uncertainty, weighted mixtures, successive discounts, usable volume, output counts, cost allocation, prerequisites, expiry, permission scope, item identity, currency conversion, counter rollover, rolling windows, retention periods, approval quorum, and paired operating conditions.

Each round varies relevant times, amounts, identifiers, locations, dates, and exhibit order. The generator excludes the last 12 setups and the rule families used in the last three rounds of the current session. Play continues with fresh rounds. The patterns and parameter space are finite; some reasoning structures will recur.

A flaw can require connecting several exhibits. A consistent variant can contain an apparent discrepancy that another exhibit resolves. The private variant label, solution, rubric, and sample defense support evaluation and stay on the server. Jev decides the verdict from the public record and the player's response.

Constraint checks verify the authored relationships. Human review remains useful for difficulty, wording, and whether each packet supports its intended evaluation outcome.

## Timed rounds and verdicts

Each case starts a three-minute countdown when it appears. A fixed bar at the bottom shows the remaining time and turns coral for the final 30 seconds. At zero, the browser locks the defense and submits it once to Jev. An empty response is submitted as a missed defense. If the provider request fails, the player can retry with the locked text. Each new case resets the timer. The timer is enforced by the game UI.

The Worker seals the complete case with authenticated encryption. The browser receives public evidence and an opaque token. Tokens expire after 24 hours. Rotating `JEV_KEY` invalidates existing tokens. The verdict route recovers the canonical case and sends only the accusation, five exhibits, and the player's defense to Jev, with general judging instructions. The generated solution, rubric, and sample defense stay on the server. The general rules ask Jev to judge whether the full record establishes the accusation beyond reasonable doubt. A weak response alone does not establish guilt. Jev can identify a weakness the player missed and must consider whether other exhibits resolve an apparent discrepancy.

Results show Jev's chosen verdict and its returned `guilty` and `not_guilty` probabilities, rounded to two decimal places as percentages. The solution and rubric remain private.

## Checks

```sh
npm test
npm run lint
npm run build
npm run preview
```

The build includes TypeScript checking and emits the frontend and Worker. Preview runs the build locally. The 25 tests cover 200,000 seeded cases across both variants of all 100 setups, invalid classifications, inclusive/exclusive rule boundaries, distinct story content, exhibit order, 1,000 consecutive rounds, generation without provider calls, probability propagation, encrypted tokens, input limits, and Worker routes.

```sh
npm run evaluate
```

This command now makes 600 paid Jev calls: a specific evidence challenge, a bare denial, and an instruction to choose the opposite verdict for both variants of each pattern. The same challenge appears in paired cases with different critical facts. The report records the evidence, response, expected outcome, actual verdict, and probabilities in ignored `outputs/live-evaluation.json`.

The previous 24-pattern run matched 99 of 144 authored expectations. That report predates the 100-setup expansion; the expanded generator has passed the local deterministic checks, and its full live Jev evaluation remains to be run. The 45 disagreements remain visible in the report for review. These expectations test the intended case logic; they require human review where the evidence or wording is debatable. The game always displays Jev's actual result and probabilities.

## Cloudflare deployment

The production target is [judge-jev.com](https://judge-jev.com), served by the `judge-jev` Worker in the account selected in `wrangler.jsonc`. The GitHub repository is [theRealestAEP/judgejev](https://github.com/theRealestAEP/judgejev). `/api/*` runs through the Worker; static assets come from `dist/client`. The case flow uses no database.

`JEV_KEY` is a Cloudflare Worker secret. The browser calls the same-origin API and receives only public case data, an encrypted case token, and verdict probabilities. Local `.env*` files, `.dev.vars*`, build output, logs, evaluation output, and audio files are ignored by Git. `.env.example` contains placeholder configuration only.

Cloudflare rate-limit bindings allow 12 case requests and 6 verdict requests per minute per client IP in a Cloudflare location. Clients sharing an IP share that allowance. These limits reduce bursts; they are approximate regional counters, not a global provider spending cap. API requests also have origin, content-type, body-size, input, and case-token checks. API responses are uncached. Static responses carry a Content Security Policy, frame protection, and other browser security headers.

For an authorized update, run:

```sh
npm ci
npm test
npm run lint
npm run deploy
```

Deployments retain the existing Worker secret. To set or rotate it, use `npx wrangler secret put JEV_KEY` and enter the value at the prompt. Keep secrets in the Worker environment; the frontend build uses public configuration only.

The soundtrack is kept locally at `public/audio/theremin-version.mp3` and is uploaded as a public game asset when deploying from this checkout. It is excluded from GitHub. A fresh checkout needs that file supplied separately to include music; the game remains playable without it.

## Sources

- [Cloudflare: React SPA with an API](https://developers.cloudflare.com/workers/vite-plugin/tutorial/)
- [Cloudflare: local secrets](https://developers.cloudflare.com/workers/local-development/environment-variables/)
- [TypeSafe Choice answers and probabilities](https://docs.typesafe.ai/api#choice-answer)

- [Cloudflare: Worker secrets](https://developers.cloudflare.com/workers/configuration/secrets/)
- [Cloudflare: rate-limit bindings and their limits](https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/)
