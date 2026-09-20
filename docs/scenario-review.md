# Scenario implementation and review

Current generator: `criminal-12-v5`. The user selected a **50/50 mix of stronger accusations and genuinely contested records**, with weaknesses that support an argument without settling the whole case. There are 12 structures and 36 branches. People use role labels; the player is addressed as “you” in the accusation.

## Case revision

Version 5 reviews the full criminal pool and replaces the renovation and invoice structures with bank impersonation and a fabricated hospital collection. Both new structures include a false claim, a victim who relies on it, actual loss, and evidence bearing on the actor’s identity. The 50/50 mix remains. The pharmacy journey now describes a timed trial, allowing the stated range to include faster journeys.

Version 4 prints day, month, year, and time for each timestamp and dates both fraud accusations. Fingerprint collection follows the burglary, with laboratory examination later. Lawful repair contact has its own earlier date. Fire evidence has separate collection, intake, and examination dates. The jeweler’s collection description now consistently refers to the broken handle. Tests reject collection before the crime and examination before collection, and check records across midnight and year boundaries. Routine repairs, payment events, and laboratory work use daytime hours.

The author revised all 12 structures and their private review notes to retain an identifiable prosecution argument and a specific defense. The [catalog](scenarios.md) lists the competing evidence and numerical constraints. Decisive escape routes were replaced where needed: contested timing ranges overlap the incident; a van sale leaves access to a spare key; badge reassignment records administration rather than witnessed possession; an incomplete sample-transfer record has photographic support for continuity.

The assault branch places the push shortly after a hook was lowered, leaving the necessity and degree of force open to argument. The disputed fire record includes competing origin assessments alongside access, a threatening remark, and possession of fuel.

Some ordinary records remain incomplete or imprecise. Each contested case also has evidence supporting the charge that an effective defense should address. Jev's general reasonable-doubt rules remain unchanged. A gap has no special game effect, and an empty response can still result in either verdict.

## Evaluation policy

Supported controls retain an authored guilty expectation. Contested cases have `expectedVerdict: null`. Their actual verdict and probabilities are recorded, while `matched` is also null and neither verdict is automatically classified as a model error. Private notes contain the prosecution argument, defense argument, and underlying event account; none of these are added to Jev's request.

The evaluation script compares a period with a specific defense for each identical record and stores the change in not-guilty probability. The defense can acknowledge strong opposing evidence. This measures response sensitivity; it does not establish that a particular argument is objectively correct or that a single probability change will repeat.

## Verification

All **32 automated tests pass**, including 36,000 generated records, schema bounds, five distinct sourced exhibits, role labels, 50/50 branch distribution, seeded reproducibility, and 1,000 continuous rounds. New checks independently verify that both contested timing ranges span the incident and that a vehicle sale leaves the defendant access to a key. Every branch is tested against the public-only Jev request boundary. Token, input, provider, origin, rate-limit, and probability checks also pass.

Lint and production build pass. The courtroom copy now tells the player to explain how a weakness affects the whole case and to address the evidence against them. Timer, audio, provider rules, and actual-verdict display logic are unchanged. The earlier browser playthrough verified the three-minute timer, automatic submission, role-based evidence, mobile layout, and real verdict display; that UI evidence predates this prose revision.

## Live checks

These live results cover version 3. Versions 4 and 5 add calendar dates, validated forensic timelines, and the two replacement fraud stories. These revisions have not had a new live model evaluation.

A development run evaluated all 36 branches at two seeds, using a period and a specific defense: **144 judgments**. The report is `outputs/live-evaluation-criminal-12-v3-development.json`.

| Records | Period response | Specific defense |
| --- | --- | --- |
| 24 supported controls | 20 guilty; 4 not guilty | 21 guilty; 3 not guilty |
| 48 contested records | 12 guilty; 36 not guilty | 12 guilty; 36 not guilty |

Among the 48 contested records, the specific defense increased not-guilty probability in 28, left it unchanged in 5, and decreased it in 15. The mean increase was about 2.8 percentage points. Matching aggregate verdict counts conceal individual changes. For example, one shared-terminal fraud record moved from 24% to 60% not-guilty probability when the response addressed authorship separately from financial benefit. These are observations from a small single-run comparison, not a guarantee of repeatable gains.

The seven supported-control disagreements remain in the report for review. Contested judgments are deliberately unscored. Earlier version-2 evaluation figures apply to the earlier wording and fixed expectations and should not be used as version-3 accuracy figures.

## Open review

Independent case review, human three-minute playtests, and version-5 live and held-out evaluation remain open. Playtests should examine whether the prosecution remains credible, whether a defense can explain a material weakness, and whether the player perceives meaningful variety. Deployment was authorized on 20 September 2026. The remaining reviews are follow-up quality checks; version-3 model results remain historical.
