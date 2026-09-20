# Criminal case catalog

The current generator, `criminal-50-v1`, contains **50 criminal stories and 150 authored evidence variants**. Each round has an accusation and five sourced exhibits. People use role labels. The draw remains 50% supported accusations, 25% alternative explanations, and 25% unresolved records. Contested variants retain prosecution evidence and a material issue the player can address. Jev decides from the whole public record and the response.

## Stories

| Category | Stories |
| --- | --- |
| HOMICIDE | Death at the workshop; The stairwell death; Death at the canal; The dinner guest; The car park collision; The rehearsal room shooting; The quarry edge; Death aboard the trawler |
| ASSAULT | The loading dock assault; The station passage; The broken glass; The taxi queue; Outside the stadium; The yard gate; The path collision; The warehouse gate |
| BURGLARY | The pharmacy break-in; The jeweler’s workshop; The missing bronze; The shuttered bicycle shop; The ransacked flat; The school office safe; The copper at the yard; The empty control room; The boathouse door; The laundrette collection |
| ROBBERY | The last bus; The depot collection; The final taxi fare; The night deposit bag; The phone at the crossing; The jeweller’s delivery; The arcade closing shift; The cash van stop; The photographer’s bag; The luggage rack |
| FRAUD | The bank impersonator; The hospital collection; The duplicated tickets; The false letting agent; The emergency caller; The counterfeit watch; The prize that did not exist; The meter inspector |
| ARSON | The storage unit fire; The restaurant fire; The cinema storeroom fire; The barn fire; The repair garage fire; The marina fire |

## How generation works

The server selects a story while excluding the last 12 stories played. It selects one complete evidence variant, then uses a seed to choose the place, incident date, time, and applicable amounts or measurements. Related timestamps and quantities are derived together. These substitutions create repeatable variations; the 150 authored records supply the different evidence relationships. Generation makes no language-model call.

The original 12 stories keep their specific models for clocks, journeys, access, source identification, and forensic records. The 38 added stories live in `server/story-catalog.ts`. Their five exhibits are written together for each branch, with shared facts where appropriate. Selecting the same branch across every exhibit preserves the story. The renderer keeps the authored order. The UI separates each source label from its finding.

Dates include day, month, year, and time. Incidents fall on days 1–27 of 2026; fraud incidents use 09:00–16:59 and other incidents use 18:00–23:59. Derived events can cross midnight or year boundaries. In the added stories, earlier activity is 15 minutes before the incident, later activity is 30 minutes after it, previous-day records use 10:00, next-day searches use 10:00, and laboratory work occurs three days later at 14:00. Earlier-week records are seven days before the incident at 10:00. Amounts range from $200 to $900. Each story uses the fields relevant to its evidence.

The bank case names the recipient account owner, card user, computer records, and ATM identification. The bus case describes the actual loan and return of the van and keys. Its supported record follows the robbery, identification, vehicle, recovered property, and route. Its contested records explain who could drive the van at the time.

## Judgment and verification

Supported controls have an authored guilty expectation. Contested cases have `expectedVerdict: null`; either judgment requires considering the whole record. Private review notes identify the disputed question. Jev receives only the accusation, five exhibits, player response, and general judging rules. The frontend receives public fields and an encrypted case token. The key remains a Worker secret.

Run `npm test`, `npm run lint`, and `npm run build`. Tests cover 150,000 generated records, all 150 evidence variants, chronology, midnight/year boundaries, source labels, size limits, seeded reproducibility, the 50/50 mix, 1,000 consecutive rounds, and the public-only judging boundary. These checks establish structural and factual constraints; human playtesting is still needed to assess clarity and difficulty.

`npm run evaluate -- --samples` exports fixtures without provider calls. `npm run evaluate -- --limit 150` sends one minimal response for each variant at the first development seed. Larger limits continue through the second seed and then specific defenses and other response types; a 600-call run includes minimal/specific-defense pairs for both development seeds. `--split heldout` selects reserved seeds. Reports are versioned under ignored `outputs/`. Live evaluation requires JEV_KEY. The 50-story pool has not had a full live model benchmark; earlier results are documented in [the review report](scenario-review.md).
