# Scenario revision plan

Historical document. The current 50-story implementation is documented in [the catalog](scenarios.md) and [review report](scenario-review.md).


## Current direction

The user selected a 50/50 mix of supported and contested records, with subtler weaknesses that can support an argument. Version `criminal-12-v3` replaces decisive escape routes with competing evidence. Contested branches carry no fixed verdict expectation; evaluation compares Jev’s judgments and probabilities across responses. This supersedes the fixed doubtful-case labels in the original milestones below. Current evidence is in [the review report](scenario-review.md).

## Overarching goal

Build a credible, mechanically generated criminal case pool for testing Jev's judgment. Begin with 12 reviewed structures: two each for homicide, assault, burglary, robbery, fraud, and arson. Expand after evidence review and playtesting establish quality. Each round presents an accusation, five exhibits, and three minutes to respond.

The replacement generator is implemented and active locally. Author review, automated verification, and initial live evaluation are complete; independent blind review and human playtesting remain open before the release gate. See [implementation evidence](scenario-review.md).

## Implementation principles

Use explicit, seeded facts and handwritten prose. Keep the incident, the source accounts, and the conclusion supported by the public record distinct. A private account of what happened helps maintain coherence; the expected verdict must depend entirely on the public evidence. Every guilty expectation must establish the alleged act, the defendant's involvement, and any intent asserted in the accusation.

Preserve both well-supported and doubtful accusations. Doubt may arise from conflicting sources, uncertain identification, or missing proof. Consistent evidence can still leave doubt. Derive the expected verdict from a reviewed branch; record contradictions separately. A weak player response contributes no proof of guilt.

Each exhibit names its source and states relevant facts in neutral language. Use “the defendant” and stable role labels in exhibits and reserve “you” for the accusation. Titles identify incidents. Exclude sexual crimes and sexualized details. Keep violence descriptions brief and factual.

Jev continues to receive only the accusation, five exhibits, player response, and general judging rules, with `guilty` and `not_guilty` as its choices. Keep author notes, truth models, and expected outcomes in server/test data. Show Jev's returned probabilities. Preserve the existing timer, audio sequence, geometric courtroom, and API security boundaries.

## Testing strategy

Test fact relationships and rendered records separately. Combine deterministic fixtures, boundary cases, invalid fact models, and sampled generated prose. Review every authored branch before running live Jev evaluation. Reserve separate seeds and meaningful branch combinations for final evaluation. Report case quality and model agreement separately.

The existing seeded tests establish arithmetic and schema behavior. Their volume does not establish narrative credibility or the validity of criminal verdict expectations. See [the audit](scenario-catalog-audit.md) for the current gaps.

## Phase S1: Author and review the replacement structures

**Goal:** Establish 12 credible incidents with evidence-supported outcomes.

**Scope:** Apply the audit dispositions to the current catalog. Draft the structures below. Each needs a defendant identified by role, harmed person or organization, concrete criminal act, plausible reason for suspicion, timeline, exactly five sourced exhibits, and a private explanation of what the public record establishes. Write at least one well-supported and one doubtful branch per structure. Some doubtful records should be internally consistent.

These summaries describe the implemented structures. The full exhibit records and private expectations are in the generator; independent review remains open.

| ID | Category | Incident | Relationship to develop | Proof required for the supported branch |
| --- | --- | --- | --- | --- |
| H1 | Homicide | Death at a repair workshop | Door-camera clock calibration, observed assault, and recorded departure | Reliable identification of the fatal attacker and evidence of deliberate violence; timing agrees with the incident |
| H2 | Homicide | Death in a shared stairwell | Witness viewpoint, lighting, and an independent recording | Independent support for identification and a deliberate fatal act; access or motive alone contributes context |
| A1 | Assault | Injury outside a loading dock | Full recording compared with a cropped witness clip and injury record | Who initiated the attack, what force occurred, and whether the record supports a defensive explanation |
| A2 | Assault | Attack in a station passage | Witness route, obstruction interval, and another source's identification | A reliable connection between the defendant and the deliberate attack; examine whether sources are independent |
| B1 | Burglary | Overnight pharmacy entry | Travel interval, entry footage, and recovered serialized property | Unauthorized entry with an intent to steal and reliable identification; property recovery must have a documented connection |
| B2 | Burglary | Break-in at a jeweler's workshop | Authorized earlier visit, trace recovery location, and intrusion sequence | A trace or recording connected to the break-in, plus evidence of theft intent; distinguish earlier lawful contact |
| R1 | Robbery | Cash taken from a late bus service | Victim's account, vehicle identity at the incident time, and loading footage | Taking by force or threat and identification of the participant; vehicle ownership alone contributes context |
| R2 | Robbery | Courier parcel taken at a depot | Dispatch identity, badge assignment, and original incident recording | A documented threat and taking, tied to the defendant through independent evidence |
| F1 | Fraud | Diverted renovation payment | Signed document version, later payment instruction, and recipient account | Knowing deception that caused the payer's loss, with evidence identifying the person who issued the instruction |
| F2 | Fraud | Duplicate supplier payment | Invoice identity, bank settlement records, and approval correspondence | Two actual payments obtained through a knowingly false claim; distinguish a repeated export row from a second settlement |
| AR1 | Arson | Fire in a rented storage unit | Ignition interval, entry records, and a laboratory sample's provenance | Deliberate ignition tied to the defendant, with a valid physical link and an addressed accidental explanation |
| AR2 | Arson | Fire at a closed restaurant | Origin report, circuit records, and independently recorded access | Evidence of deliberate ignition and the defendant's act; assess the documented electrical alternative |

**Completion gate:** All 12 structures and every initial branch have reviewed exhibits, timelines, and expected conclusions. Each case can be assessed entirely from its public record. Every doubtful branch identifies a material gap or conflict; every supported branch explains the complete evidentiary connection.

**Testing plan:** Read each branch without its expected label first. Record the conclusion and reasons, then compare with the author's expectation. Check whether removing each exhibit loses a useful fact or necessary corroboration. Record unresolved readings and revise before approval.

### Status ledger

| Status | Type | Item | Evidence or Gap |
| --- | --- | --- | --- |
| Complete | Work | S1A: Audit current catalog | [Catalog audit](scenario-catalog-audit.md) covers all 100 setups and proposed dispositions. |
| Complete | Work | S1B: Author 12 replacement structures | `server/scenarios.ts`: 12 structures, 36 branches, five exhibits each; author review in `scenario-review.md`. |
| In Progress | Test | S1C: Review public-record sufficiency | Author review and source checks complete; independent label-blind review remains open. |
| Incomplete | Gate | S1D: Approve initial case set | Requires S1B–S1C and an approved disposition for each branch. |

## Phase S2: Generate coherent facts and meaningful variants

**Goal:** Produce varied rounds whose facts and deductions remain coherent.

**Scope:** Give each structure a small typed fact model and a direct renderer. Store event timestamps, durations, clock offsets, measurements with units, source identity, and source uncertainty explicitly. Derive arrival from departure plus duration, recorded time from actual time plus clock offset, and document availability from version history. Define plausible ranges per structure. Include dates when an interval can cross midnight.

Represent what happened and each source's claim separately, with explicit reasons for any mismatch. Derive the expected public conclusion from the reviewed branch. Separate `hasContradiction` from `expectedVerdict`; replace the current automatic `consistent → guilty` expectation. Allow uncertainty ranges to overlap; classify an overlapping interval according to what it establishes.

Start with the reviewed branch pairs. Add branches that change a witness's opportunity to observe, a trace's provenance, the independence of corroboration, or the relevance of an alternative explanation. Document each new deduction and its expected conclusion. Locations and numbers provide additional surface variety. Report structure and branch counts separately from parameter combinations.

Replace the last-12 exclusion with a last-five-structures window for this pool. Keep the initial selector simple and test continuous play. Reassess perceived repetition during S3 before adding further selection rules.

**Completion gate:** Every enabled branch renders a coherent case within the API's text limits, with five distinct neutral exhibits and a reviewed public-record conclusion. The selector always has candidates and is deterministic for test seeds.

**Testing plan:** Exercise each branch at minimum, maximum, and boundary values. Include midnight rollover, uncertainty overlap, exact event boundaries, source misidentification, and deliberately invalid chronology or units where the structure uses them. Run at least 1,000 seeds per branch through independent fact checks and the public schema. Review three rendered seeds per branch, including a boundary example. Test counterfactual pairs: changing one decisive underlying fact updates every dependent exhibit and changes the warranted verdict only when the remaining record supports that change. Run 1,000 consecutive draws. Preserve tests proving that private notes never enter Jev's request.

### Status ledger

| Status | Type | Item | Evidence or Gap |
| --- | --- | --- | --- |
| Complete | Work | S2A: Fact models, ranges, and renderers | `server/scenarios.ts`; ranges and source relationships in `scenarios.md`. |
| Complete | Work | S2B: Branch-based expected outcomes | `reviewScenario` derives expectations from facts; contradiction status is separate. Old mode-derived labels removed. |
| Complete | Work | S2C: Continuous case selection | Last-five exclusion; 1,000-round test covers all 12 structures. |
| In Progress | Test | S2D: Facts, boundaries, and counterfactuals | 36,000 records, boundaries, invalid examples, and counterfactual tests pass. Author prose review complete; independent sample review remains open. |
| Complete | Test | S2E: Preserve request privacy and schema | All 28 tests pass; every branch verifies the public-only Jev request and canonical schema. Client bundle scan passed. |
| Incomplete | Gate | S2F: Coherent procedural pool | Requires S2A–S2E with every enabled branch reviewed. |

## Phase S3: Evaluate, playtest, and replace the playable pool

**Goal:** Separate defects in cases from Jev judgment errors, then release the reviewed pool.

**Scope:** Update `scripts/evaluate.ts` to use reviewed expectations and separate development and held-out fixtures. Exercise concise evidence-grounded responses, strong arguments, plausible mistakes, unsupported claims, irrelevant text, and a single period. Preserve the accusation, exhibits, response, expected reasoning, actual verdict, probabilities, model identifier, generator version, and seed in the local report.

Review each disagreement against the whole public record. Classify it as case ambiguity, incorrect expected outcome, or model judgment error, with a short reason. Revise ambiguous cases and incorrect expectations before final evaluation. Keep model errors visible in the report; Jev's actual verdict remains the game result. Any change informed by a held-out case moves that case into development and requires a fresh final fixture.

Playtest three-minute rounds with people. Cover each structure and both expected outcomes across sessions. Record whether players understood the allegation, could use the exhibits, completed a response in time, and recognized repeated deductions. Use findings to revise prose or add reviewed branches. Continuous play has a finite authored foundation; new deductions provide lasting variety.

**Completion gate:** All enabled branches have no unresolved factual defects or verdict-label disputes. Final evaluation disagreements have documented classifications. Playtest records cover all 12 structures and support clarity and usable variety. Typecheck, lint, server tests, production build, and browser playthrough pass. Then switch the playable pool and update `docs/scenarios.md` to describe the shipped structures and branches.

**Testing plan:** Confirm both returned verdicts, exact probability mapping, the three-minute timer, automatic submission, retry behavior, two-second minimum deliberation, double gavel, stamp, and mute. Inspect desktop and mobile layouts with the replacement prose. Verify the built frontend contains no expected-outcome data or secrets. Attach the evaluation report and playtest findings to the release decision.

### Status ledger

| Status | Type | Item | Evidence or Gap |
| --- | --- | --- | --- |
| Complete | Work | S3A: Evaluation fixtures and harness | `scripts/evaluate.ts`: separate seed sets, six response types, sample export, limits, supported-control disagreements, and paired probability changes. |
| In Progress | Test | S3B: Live evaluation and disagreement review | Version 3: 144 paired development judgments; contested cases are unscored. Independent review and version-3 held-out evaluation remain open. |
| Incomplete | Test | S3C: Human playtests | Missing coverage, comprehension, timing, and repetition findings. |
| Complete | Work | S3D: Replace active pool and catalog documentation | Replacement enabled locally; retired generator modules removed; `scenarios.md` updated. Production release is separate. |
| Complete | Test | S3E: Application and security regression checks | Tests, lint, build, client secrecy scan, mobile layout, live verdict, and automatic submission verified; evidence in `scenario-review.md`. |
| Incomplete | Gate | S3F: Release reviewed pool | Requires completed S1–S2 and S3A–S3E. |

## Expansion rule

After S3, add criminal situations with new evidence relationships. Each addition passes the same writing, fact validation, public-record review, and evaluation gates. Track authored structures, reviewed deduction branches, and playtest repetition separately. Expand toward 100 structures only as those gates pass.
