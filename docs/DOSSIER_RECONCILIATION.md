# How the Word dossier informed P1 and P2

The user asked that `context/HeatReach_Hackathon_Winning_Strategy_Team_Dossier.docx` be read and incorporated during P1/P2 implementation. Its complete body text and tables were read. The original file is preserved unchanged and is not automatically published in the repository.

The dossier is dated 10 October 2026; the master build specification is dated 11 October 2026 and explicitly takes precedence over older plans. The user's newer request authorizes implementing P1 and P2 despite the original P0 scope freeze. It does not establish missing real-world facility evidence.

| Dossier guidance | Implementation |
|---|---|
| Distinct planner, resident and evaluator journeys | Separate Community planner and Public facilities views; planner state survives switching |
| Live regional context with cached fallback | Lazy Open-Meteo fetch, timestamp validation, 6-second timeout, 30-minute session cache and explicit cached/unavailable states |
| Export with constraints, sources and limitations | CSV with IDs, metrics, exclusions, verification notes and source manifest; print layout includes planning constraints and provenance |
| Smaller-radius and changed-weight sensitivity | Exact recomputation at neighboring radii and comparison with an all-weights-equal raw-reach objective |
| Sources, year, resolution and uncertainty | Required geographic evidence URL, license, date, resolution, note and weighting basis; exposed in the source panel/export |
| Hours, capacity, accessibility, eligibility and permission | Geographic site schema and accessible site details; capacity null/unknown explicitly shown; capacity is not an optimization constraint |
| Map failure leaves a usable table | Geographic data table and public cards remain available when OSM tiles fail |
| Citizen guidance and voluntary emergency contact | Source-linked WHO information plus manual `tel:112`; no automatic action or emergency integration |
| No verified cooling inventory supplied | Empty public catalog with truthful absence state; verification and publication workflow provided |
| No unnecessary cloud/backend infrastructure | All new functionality remains browser-side, statically hostable on Amplify |

## Differences resolved deliberately

- The dossier uses an older 2,100/1,750 synthetic example and a 550 m radius. The newer canonical fixture and its exact 2,150/1,750 benchmark at 180 m remain unchanged.
- The dossier calls citizen view P1; the master spec calls it P2. The requested functionality is implemented under the newer labels.
- The dossier mentions alternative greedy baselines and possible post-event backend/capacity/route work. The fixed first-eligible baseline remains the required comparator; no extra backend, routing or capacity solver is added.
- Neither document supplies a verified real facility inventory. Structured metadata and an operator attestation are input safeguards, not independent fact verification. No candidate is published as an operational destination.
- The internal research score and projected competition outcomes are not product claims or earned judging results.
- The radius-monotonicity caveat in the existing methodology still applies: incremental gain can fall when existing coverage expands.

Future field evidence, cloud deployment and event submission are separate from local software completeness. The existing non-root AWS requirement and external account blockers are unchanged.
