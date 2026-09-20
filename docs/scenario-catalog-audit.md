# Previous scenario catalog audit

Audited for the proposed criminal-case replacement on September 19, 2026. This is a source and catalog audit; full branch-by-branch narrative review remains part of S1. Dispositions describe proposed changes. This records the baseline before the replacement implementation. The local generator now uses the replacement pool; the production release remains separate.

## Findings

The catalog contains 100 setups: eight original mechanisms, 16 additional mechanisms, and 76 setups built from 19 shared rules. The last 76 chiefly concern compliance, measurements, payments, permissions, or administrative decisions. They do not provide the requested six-category criminal pool.

The proposed disposition is **zero retained unchanged, 12 mechanisms selected for rewriting, and 88 setups retired from the replacement pool**. A rewrite keeps a useful evidence relationship while rebuilding the incident and public proof. It does not count as an approved replacement structure. The 12 new structures and these 12 selected mechanisms have separate counts; some replacements combine mechanisms or require new ones.

Several current cases turn on whether an act was possible, an account was shared, or a measurement exceeded a limit. Their consistent branches do not necessarily establish identity, intent, or the entire alleged crime. `scripts/evaluate.ts` currently assigns `guilty` to every consistent branch. That label needs independent evidence review.

`server/scenarios.ts` and `server/additional-scenarios.ts` mix generated facts, claims, and outcome labels. They validate authored predicates but lack a general separation between underlying events and a mistaken source's account. Some exhibits address the defendant as “you.” The replacements need consistent role labels, explicit sources, coherent source errors, and neutral wording.

`server/scenarios.test.ts` checks many seeds, numerical predicates, schema limits, pairing, and selection. It does not establish realism or complete criminal proof. `scripts/evaluate.ts` uses one seed per setup/mode and three responses. It needs varied response fixtures, reviewed expected outcomes, held-out cases, and disagreement classifications.

The current selector excludes the last 12 setups and last three rule families. Reducing the catalog to 12 while preserving that rule can leave no available case. S2 replaces the selection window.

The existing Jev request boundary is suitable: `server/game.ts:judgeDefense` passes the accusation, evidence, and player defense with general rules. Private solutions and rubrics are excluded. Preserve this boundary.

## Disposition of all 100 setups

“Retire” applies to the current story in the replacement playable pool. A useful arithmetic operation may still support a future reviewed criminal case.

| # | Current setup | Rule | Disposition | Reason / next use |
| --- | --- | --- | --- | --- |
| 1 | After-hours theft | clock | Rewrite mechanism | Clock calibration can support a new incident timeline; establish criminal participation separately. |
| 2 | Archive burglary | travel | Rewrite mechanism | Travel timing fits B1; resolve conflicting identification accounts in the source model. |
| 3 | Loading-bay arson | visibility | Rewrite mechanism | Visibility can support H2 or arson identification; establish the act and its cause. |
| 4 | Unauthorized transfer | access | Rewrite mechanism | Credential attribution can support fraud; document who issued the deceptive instruction. |
| 5 | Missing funds | ledger | Rewrite mechanism | Transaction identity fits F2; include knowledge, actual settlement, and loss. |
| 6 | Vehicle identification | vehicle | Rewrite mechanism | Vehicle identity fits R1; include the taking, threat, and participant identification. |
| 7 | The recovered sample | custody | Rewrite mechanism | Sample provenance fits AR1; connect a valid sample to deliberate ignition and the defendant. |
| 8 | The disputed contract | revision | Rewrite mechanism | Document version history fits F1; establish knowing deception, reliance, and loss. |
| 9 | The drawer print | trace age | Rewrite mechanism | Trace timing fits B2; distinguish lawful contact from evidence tied to the intrusion. |
| 10 | Restricted access | door event | Retire setup | Outside the proposed incident set; current predicate does not establish the complete criminal accusation. |
| 11 | The short shipment | mass | Retire setup | Outside the proposed incident set; current predicate does not establish the complete criminal accusation. |
| 12 | The service hatch | dimensions | Retire setup | Outside the proposed incident set; current predicate does not establish the complete criminal accusation. |
| 13 | Cold storage | temperature | Retire setup | Outside the proposed incident set; current predicate does not establish the complete criminal accusation. |
| 14 | The measured journey | speed | Retire setup | Outside the proposed incident set; current predicate does not establish the complete criminal accusation. |
| 15 | The laboratory control | control sample | Rewrite mechanism | Laboratory control findings can support AR1; review realistic uncertainty and corroboration. |
| 16 | The access order | notice | Retire setup | Outside the proposed incident set; current predicate does not establish the complete criminal accusation. |
| 17 | The purchase approvals | spending | Retire setup | Outside the proposed incident set; current predicate does not establish the complete criminal accusation. |
| 18 | The external upload | network | Rewrite mechanism | Network attribution can support fraud; identify the actor beyond a shared connection. |
| 19 | The courtyard witness | sightline | Rewrite mechanism | Witness viewpoint fits A2; connect reliable identification to an actual assault. |
| 20 | The disputed invoice | invoice | Retire setup | Outside the proposed incident set; current predicate does not establish the complete criminal accusation. |
| 21 | The specimen test | cure age | Retire setup | Outside the proposed incident set; current predicate does not establish the complete criminal accusation. |
| 22 | The deleted project | backup | Retire setup | Outside the proposed incident set; current predicate does not establish the complete criminal accusation. |
| 23 | The stored mixture | concentration | Retire setup | Outside the proposed incident set; current predicate does not establish the complete criminal accusation. |
| 24 | The outbound file | delivery | Retire setup | Outside the proposed incident set; current predicate does not establish the complete criminal accusation. |
| 25 | The crane restart | rest | Retire setup | Compliance or administrative calculation; replace with a complete criminal incident. |
| 26 | The tunnel re-entry | rest | Retire setup | Compliance or administrative calculation; replace with a complete criminal incident. |
| 27 | The freight driver’s break | rest | Retire setup | Compliance or administrative calculation; replace with a complete criminal incident. |
| 28 | The reopened walkway | rest | Retire setup | Compliance or administrative calculation; replace with a complete criminal incident. |
| 29 | The reservoir allocation | aggregate | Retire setup | Compliance or administrative calculation; replace with a complete criminal incident. |
| 30 | The quarry departure | aggregate | Retire setup | Compliance or administrative calculation; replace with a complete criminal incident. |
| 31 | The occupied gallery | aggregate | Retire setup | Compliance or administrative calculation; replace with a complete criminal incident. |
| 32 | The overtime approval | aggregate | Retire setup | Compliance or administrative calculation; replace with a complete criminal incident. |
| 33 | The returned deposit | refund | Retire setup | Compliance or administrative calculation; replace with a complete criminal incident. |
| 34 | The escrow release | refund | Retire setup | Compliance or administrative calculation; replace with a complete criminal incident. |
| 35 | The advance repayment | refund | Retire setup | Compliance or administrative calculation; replace with a complete criminal incident. |
| 36 | The grant recovery | refund | Retire setup | Compliance or administrative calculation; replace with a complete criminal incident. |
| 37 | The disputed noise reading | uncertainty | Retire setup | Compliance or administrative calculation; replace with a complete criminal incident. |
| 38 | The bridge load test | uncertainty | Retire setup | Compliance or administrative calculation; replace with a complete criminal incident. |
| 39 | The boundary survey | uncertainty | Retire setup | Compliance or administrative calculation; replace with a complete criminal incident. |
| 40 | The stack reading | uncertainty | Retire setup | Compliance or administrative calculation; replace with a complete criminal incident. |
| 41 | The blended fuel | weighted | Retire setup | Compliance or administrative calculation; replace with a complete criminal incident. |
| 42 | The ore certificate | weighted | Retire setup | Compliance or administrative calculation; replace with a complete criminal incident. |
| 43 | The polymer batch | weighted | Retire setup | Compliance or administrative calculation; replace with a complete criminal incident. |
| 44 | The irrigation blend | weighted | Retire setup | Compliance or administrative calculation; replace with a complete criminal incident. |
| 45 | The equipment rebate | discount | Retire setup | Compliance or administrative calculation; replace with a complete criminal incident. |
| 46 | The venue booking | discount | Retire setup | Compliance or administrative calculation; replace with a complete criminal incident. |
| 47 | The renewal invoice | discount | Retire setup | Compliance or administrative calculation; replace with a complete criminal incident. |
| 48 | The fleet service bill | discount | Retire setup | Compliance or administrative calculation; replace with a complete criminal incident. |
| 49 | The filled vessel | displacement | Retire setup | Compliance or administrative calculation; replace with a complete criminal incident. |
| 50 | The ballast order | displacement | Retire setup | Compliance or administrative calculation; replace with a complete criminal incident. |
| 51 | The sealed archive chest | displacement | Retire setup | Compliance or administrative calculation; replace with a complete criminal incident. |
| 52 | The cargo compartment | displacement | Retire setup | Compliance or administrative calculation; replace with a complete criminal incident. |
| 53 | The packaging count | output | Retire setup | Compliance or administrative calculation; replace with a complete criminal incident. |
| 54 | The treatment certificate | output | Retire setup | Compliance or administrative calculation; replace with a complete criminal incident. |
| 55 | The ballot print run | output | Retire setup | Compliance or administrative calculation; replace with a complete criminal incident. |
| 56 | The exported records | output | Retire setup | Compliance or administrative calculation; replace with a complete criminal incident. |
| 57 | The shared roof bill | allocation | Retire setup | Compliance or administrative calculation; replace with a complete criminal incident. |
| 58 | The freight allocation | allocation | Retire setup | Compliance or administrative calculation; replace with a complete criminal incident. |
| 59 | The pool contribution | allocation | Retire setup | Compliance or administrative calculation; replace with a complete criminal incident. |
| 60 | The heating assessment | allocation | Retire setup | Compliance or administrative calculation; replace with a complete criminal incident. |
| 61 | The released lift | prerequisite | Retire setup | Compliance or administrative calculation; replace with a complete criminal incident. |
| 62 | The released consignment | prerequisite | Retire setup | Compliance or administrative calculation; replace with a complete criminal incident. |
| 63 | The reopened track | prerequisite | Retire setup | Compliance or administrative calculation; replace with a complete criminal incident. |
| 64 | The cleared payment | prerequisite | Retire setup | Compliance or administrative calculation; replace with a complete criminal incident. |
| 65 | The welder’s approval | expiry | Retire setup | Compliance or administrative calculation; replace with a complete criminal incident. |
| 66 | The flight clearance | expiry | Retire setup | Compliance or administrative calculation; replace with a complete criminal incident. |
| 67 | The demolition permit | expiry | Retire setup | Compliance or administrative calculation; replace with a complete criminal incident. |
| 68 | The export license | expiry | Retire setup | Compliance or administrative calculation; replace with a complete criminal incident. |
| 69 | The excavation zone | scope | Retire setup | Compliance or administrative calculation; replace with a complete criminal incident. |
| 70 | The licensed sector | scope | Retire setup | Compliance or administrative calculation; replace with a complete criminal incident. |
| 71 | The archive clearance | scope | Retire setup | Compliance or administrative calculation; replace with a complete criminal incident. |
| 72 | The broadcast license | scope | Retire setup | Compliance or administrative calculation; replace with a complete criminal incident. |
| 73 | The weighed vehicle | identity | Retire setup | Compliance or administrative calculation; replace with a complete criminal incident. |
| 74 | The rejected valve | identity | Retire setup | Compliance or administrative calculation; replace with a complete criminal incident. |
| 75 | The fire-door report | identity | Retire setup | Compliance or administrative calculation; replace with a complete criminal incident. |
| 76 | The failed radio | identity | Retire setup | Compliance or administrative calculation; replace with a complete criminal incident. |
| 77 | The converted invoice | currency | Retire setup | Compliance or administrative calculation; replace with a complete criminal incident. |
| 78 | The overseas expense | currency | Retire setup | Compliance or administrative calculation; replace with a complete criminal incident. |
| 79 | The customs valuation | currency | Retire setup | Compliance or administrative calculation; replace with a complete criminal incident. |
| 80 | The royalty conversion | currency | Retire setup | Compliance or administrative calculation; replace with a complete criminal incident. |
| 81 | The water meter rollover | rollover | Retire setup | Compliance or administrative calculation; replace with a complete criminal incident. |
| 82 | The cycle counter | rollover | Retire setup | Compliance or administrative calculation; replace with a complete criminal incident. |
| 83 | The toll record | rollover | Retire setup | Compliance or administrative calculation; replace with a complete criminal incident. |
| 84 | The energy register | rollover | Retire setup | Compliance or administrative calculation; replace with a complete criminal incident. |
| 85 | The blast window | window | Retire setup | Compliance or administrative calculation; replace with a complete criminal incident. |
| 86 | The alarm resets | window | Retire setup | Compliance or administrative calculation; replace with a complete criminal incident. |
| 87 | The outfall flushes | window | Retire setup | Compliance or administrative calculation; replace with a complete criminal incident. |
| 88 | The siren activations | window | Retire setup | Compliance or administrative calculation; replace with a complete criminal incident. |
| 89 | The destroyed safety file | retention | Retire setup | Compliance or administrative calculation; replace with a complete criminal incident. |
| 90 | The removed contract file | retention | Retire setup | Compliance or administrative calculation; replace with a complete criminal incident. |
| 91 | The calibration archive | retention | Retire setup | Compliance or administrative calculation; replace with a complete criminal incident. |
| 92 | The erased inspection images | retention | Retire setup | Compliance or administrative calculation; replace with a complete criminal incident. |
| 93 | The procurement decision | quorum | Retire setup | Compliance or administrative calculation; replace with a complete criminal incident. |
| 94 | The trustees’ release | quorum | Retire setup | Compliance or administrative calculation; replace with a complete criminal incident. |
| 95 | The dataset approval | quorum | Retire setup | Compliance or administrative calculation; replace with a complete criminal incident. |
| 96 | The reserve decision | quorum | Retire setup | Compliance or administrative calculation; replace with a complete criminal incident. |
| 97 | The chamber opening | interlock | Retire setup | Compliance or administrative calculation; replace with a complete criminal incident. |
| 98 | The battery dispatch | interlock | Retire setup | Compliance or administrative calculation; replace with a complete criminal incident. |
| 99 | The gas transfer | interlock | Retire setup | Compliance or administrative calculation; replace with a complete criminal incident. |
| 100 | The furnace access | interlock | Retire setup | Compliance or administrative calculation; replace with a complete criminal incident. |


## Current criminal pool review

Version `criminal-12-v5` replaces the full 100-setup live baseline with 12 criminal structures and 36 evidence branches. All 12 accusations and generated contested samples were read in this revision. Each structure has a harmed person or organization, a concrete alleged act, and evidence linking the defendant to that act. The stronger branches have an authored guilty expectation; contested branches preserve competing arguments and leave the verdict to Jev. Independent narrative review and live model evaluation remain open.

| Structure | Criminal incident and harm | Evidence supporting the stronger branch | Point contested in other branches |
| --- | --- | --- | --- |
| Workshop | Repeated bar strikes kill the victim. | Synchronized assault footage and exclusive access. | Corrected departure uncertainty and the witness’s view of an object. |
| Stairwell | A deliberate shove causes a fatal fall. | Close independent footage identifies the push. | Brief distant identification, lamp timing, and voice recognition. |
| Loading dock | A push causes a broken wrist; the allegation is unlawful force. | Full lead-in shows an unprovoked attack. | Whether a recent hook threat justified the particular push. |
| Station | A passenger is struck and suffers a facial injury. | Separate close footage identifies the strike. | What witnesses saw before and after the impact. |
| Pharmacy | Forced entry takes prescription stock. | Clear identification, a feasible journey, and recovered stock. | Image quality, travel uncertainty, and shared storage. |
| Jeweler | Forced entry and a broken safe lead to stolen watches. | Print on a newly exposed fracture plus an identified sale. | Earlier lawful contact and the authorship of a sale listing. |
| Bus | A knife threat takes the driver’s fare cash. | Continuous footage identifies the threat and taking. | Vehicle access and a distracted identification. |
| Courier | A metal-bar threat takes a sealed parcel. | Continuous footage identifies the badge user and robbery. | Badge possession, partial identification, and a shared recovery area. |
| Bank impersonator | A false bank investigator directs a victim to transfer savings, then takes the money. | Call and session records, the recipient account, and clear withdrawal footage. | Remote or shared computer/card access and a partial cashpoint image. |
| Hospital collection | A fabricated hospital appeal induces donors to give cash that is kept. | A recorded false appeal, clear collector footage, and recovered proceeds. | Prompted identification or a partial view, prior handling, and shared equipment. |
| Storage | Poured liquid is ignited and burns another person’s unit. | A documented scene scrap physically fits the coat worn through the incident. | Repackaging provenance or a fabric-level match. |
| Restaurant | The allegation is deliberate ignition that damages the restaurant. | Poured-fuel traces, an ignition match, and exclusive access. | Competing origin assessments or inconclusive fire damage. |

The renovation payment and duplicate-invoice branches were retired in version 5. Toll counts, contract conditions, approval limits, compliance checks, and meter puzzles remain outside the playable pool. Sale papers in the bus case and repair records in the jeweler case establish access or prior contact within a robbery or burglary investigation.
