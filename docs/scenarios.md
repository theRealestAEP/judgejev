# Criminal case catalog

`criminal-12-v5` contains 12 criminal structures and 36 evidence branches. Generation uses seeded facts and handwritten exhibits, with role labels such as “the defendant.” Every round has an accusation and five sourced exhibits. People have no generated personal names. All 100 earlier setups have been replaced. The current pool contains concrete criminal incidents; the two fraud cases concern deliberate impersonation and fabricated fundraising. The 12-structure review is recorded in [the catalog audit](scenario-catalog-audit.md#current-criminal-pool-review).

The draw remains **50% supported accusations and 50% contested cases**, with two contested branches per structure sharing that half equally. Contested cases contain evidence supporting the accusation alongside a material point the player can challenge. Finding a weak link does not settle the rest of the record. Jev receives the public evidence and response and decides the verdict under the existing reasonable-doubt rule.

| Structure | Category | Stronger record | Contested argument and prosecution counterweight |
| --- | --- | --- | --- |
| Death at the workshop | Homicide | Exclusive access spans the filmed fatal assault | The corrected departure range overlaps the attack; the defendant was alone with the victim beforehand and carried a bar-shaped object afterward. |
| The stairwell death | Homicide | A close independent recording identifies the push | Lighting and a brief distant view affect identification, while a separate witness recognizes a voice. |
| The loading dock assault | Assault | Full footage records an unprovoked attack | A hook threat precedes the push, but the worker has stepped back; the timing and degree of force remain disputed. A cropped branch leaves the lead-in incomplete. |
| The station passage | Assault | Independent close footage records the strike | A screen can hide hand movements, but a familiar witness sees the defendant nearby and another describes the departing person. |
| The pharmacy break-in | Burglary | Clear identification and a feasible journey corroborate entry and theft | The trial journey range and image quality invite challenge; the owner’s identification, recovered stock, and exterior bag print still support the accusation. |
| The jeweler’s workshop | Burglary | A fresh internal print and an identified sale connect the defendant | Earlier lawful contact may explain the print; the defendant was nearby and the stolen watch was advertised from their shared work laptop. |
| The last bus | Robbery | Continuous face-visible footage identifies the robber | A sale creates another possible driver, but the defendant retained a spare key and the victim recognizes aspects of the robber’s voice and profile. |
| The depot collection | Robbery | Continuous footage identifies the badge user and taking | Administrative reassignment leaves physical possession uncertain; a partial profile and recovery beneath the defendant’s bench support involvement. |
| The bank impersonator | Fraud | A recorded false bank identity, a local computer session, and clear withdrawal footage connect the defendant to stolen savings | Remote control or a shared laptop and card leave another possible actor; the recipient account, saved scam script, and cashpoint resemblance support the prosecution. |
| The hospital collection | Fraud | Continuous footage identifies the defendant making a fabricated hospital appeal and keeping the donations | Prompted or partial identification and shared collection equipment invite challenge; a matching tin, print, and cash were recovered from the defendant’s garage. |
| The storage unit fire | Arson | A documented scene sample physically fits the coat worn throughout the incident | An incomplete repackaging record weakens provenance while a photograph supports continuity; another branch has compatible fabric with edges too burned for an individual comparison. |
| The restaurant fire | Arson | Deliberate ignition and exclusive access connect the defendant | Conflicting origin assessments or damaged traces leave cause open; access, a threat, and possession of fuel support the prosecution. |

## Fact constraints

Timestamps use UTC milliseconds; printed timestamps include the day, named month, year, and 24-hour time (for example, `22 Jan 2026, 23:30`). Every accusation includes the incident date. Earlier lawful contact, later collection, and laboratory examination have separate dates. Durations and offsets have explicit minute units. The private event account describes what happened, while public sources can leave competing interpretations.

| Facts | Range / relationship |
| --- | --- |
| Incident | January–December 2026, days 1–27, 09:00–16:59 for fraud cases and 18:00–23:59 for the other cases; derived timestamps can cross midnight or a year boundary. |
| Workshop clock | Strong control: zero offset and uncertainty. Contested: 4–7 minutes fast with ±2 minutes uncertainty, or zero estimated offset with ±5–8 minutes uncertainty. Both contested departure ranges span the assault. |
| Lighting / screen | Restoration or removal falls 3–6 minutes before or after the incident. Emergency light and partial visibility prevent treating these details as absolute exclusions. |
| Pharmacy journey | Trial duration 24–38 minutes; contested ranges vary by ±5–8 minutes and permit both earlier and later arrival relative to the intrusion. |
| Repair and print | Authorized repair at 10:00, 3–7 calendar days before the burglary. Collection is two hours after the burglary; examination is two calendar days later at 14:00. The watch offer occurs 45 minutes after the burglary. |
| Pharmacy search | 09:00 on the next calendar day; print examination at 14:00 two calendar days after the burglary. |
| Fire evidence | Collection three hours after ignition; laboratory intake at 10:00 the next calendar day; examination at 14:00 three calendar days after ignition. |
| Vehicle sale | Signed 3–6 days before or after the robbery; the spare key is returned seven days after signature. Sale before the robbery still permits the defendant access. |
| Badge reassignment | 3–6 minutes before or after entry; the roster is an hour old. The physical handover is not recorded. |
| Bank impersonation | $200–$900 stolen and withdrawn at a cashpoint. The computer session spans the call/transfer; withdrawal follows 45 minutes later; examination is two calendar days later at 14:00. |
| Hospital collection | $800–$3,000 taken from donors. An earlier authorized event is 14–28 calendar days before the false appeal; the garage search is at 09:00 the next day. |
| Sample seals | Scene package 1000–8999; repackaged scene sample uses +1; coat reference uses +2. They remain distinct sources. |

`server/scenarios.ts` contains the models, validators, renderers, and private review notes. New rounds exclude the last five structures. The frontend receives public fields and an encrypted token. Jev receives neither the branch nor the private arguments, event account, or expected outcome.

## Evaluation

Supported controls have an authored `guilty` expectation. Contested branches have `expectedVerdict: null` and preserve both a prosecution argument and an evidence-grounded defense. Their verdicts are recorded without marking either answer as an automatic pass or failure. A single phrase or a missing signature carries no special game rule.

Run `npm test`, `npm run lint`, and `npm run build`. The suite covers 36,000 records, branch distribution, continuous play, schema and privacy boundaries, forensic collection/examination order, midnight and year boundaries, and timing ranges that keep both accounts possible.

`npm run evaluate -- --samples` exports fixtures without calling Jev. `npm run evaluate -- --limit 144` compares a period with a specific defense across all branches and two development seeds. Each paired defense result includes the change in Jev’s not-guilty probability. The default full run also includes concise challenges, plausible mistakes, unsupported claims, and irrelevant responses. `--split heldout` selects the reserved seeds. Reports include the generator version in their filename under ignored `outputs/`.

Live evaluation requires `JEV_KEY`. Supported-control disagreements require review; contested results measure how Jev weighs competing evidence and arguments. See [the review report](scenario-review.md) for current verification and limitations.
