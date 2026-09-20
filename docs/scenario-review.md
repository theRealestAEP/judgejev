# Scenario implementation and review

Current generator: `criminal-50-v1`. It contains 50 stories and 150 complete evidence variants across homicide, assault, burglary, robbery, fraud, and arson. Supported records account for half of draws; two contested branches share the other half.

## Current revision

The pool adds 38 distinct incidents to the original 12. Each new story has five sourced exhibits authored together for three branches. The generator derives dates and amounts from a seed. It preserves exhibit order and avoids the last 12 stories played. The bank, bus, workshop, courier, and storage records have clearer wording or evidence sequences. The UI displays each evidence source separately from its finding. [The catalog](scenarios.md) lists all stories and generation constraints.

The case tests cover 150,000 records, five distinct sourced exhibits, role labels, date ordering, year boundaries, all 150 variants, seeded reproducibility, draw distribution, and 1,000 continuous rounds. All branches are checked against the public-only Jev request boundary. All 33 tests pass, along with lint and the production build. A browser check verified the source-label layout on desktop and at a 390-pixel mobile width. The complete suite also covers input validation, encrypted tokens, origin checks, rate limits, response shape, and provider probability validation.

Supported records retain an authored guilty expectation. Contested records have no fixed expected verdict. Their private notes identify a material question and competing interpretations. Private notes never enter the provider request. The new-story evaluation defenses are issue-focused prompts; they need further editorial review before use as a benchmark of optimal player arguments.

## Historical live evaluation

The following results concern `criminal-12-v3` and its earlier wording. They do not measure the expanded 50-story release.

A development run evaluated all 36 branches at two seeds, using a period and a specific defense: **144 judgments**. The report is `outputs/live-evaluation-criminal-12-v3-development.json`.

| Records | Period response | Specific defense |
| --- | --- | --- |
| 24 supported controls | 20 guilty; 4 not guilty | 21 guilty; 3 not guilty |
| 48 contested records | 12 guilty; 36 not guilty | 12 guilty; 36 not guilty |

Among the 48 contested records, the specific defense increased not-guilty probability in 28, left it unchanged in 5, and decreased it in 15. The mean increase was about 2.8 percentage points. Matching aggregate verdict counts conceal individual changes. For example, one shared-terminal fraud record moved from 24% to 60% not-guilty probability when the response addressed authorship separately from financial benefit. These are observations from a small single-run comparison, not a guarantee of repeatable gains.

The seven supported-control disagreements remain in the report for review. Contested judgments are deliberately unscored. Earlier version-2 evaluation figures apply to the earlier wording and fixed expectations and should not be used as version-3 accuracy figures.

## Open review

Independent narrative review, three-minute human playtests, and a full live and held-out evaluation of the 50-story pool remain open. Automated checks cover the stated constraints; they do not establish literary quality or Jev's judgment accuracy. Deployment is authorized by the user.
