# Data provenance

| Input or output | Source | Status and interpretation |
|---|---|---|
| Eight zones, population, weights, X1/X2, A–E and costs | User-provided `context/fixtures/illustrative_district.json` | Wholly synthetic, including fictional existing facilities; not census or municipal data |
| Radius 180, budget 2, site cap 2 | Same fixture defaults | Editable planning assumptions; costs are arbitrary budget units, not rupees |
| Coverage and weighted access | Pure local engine | Modelled results; points are not people or measured health outcomes |
| Default geometry | Fixture x/y meters | Fictional schematic, never rendered on real tiles |
| Scenario date | Fixture `dataAsOf: 2026-10-11` | Synthetic dataset version, not field verification |
| Optional regional forecast | [Open-Meteo](https://open-meteo.com/en/docs), using fixture Nagpur coordinates or imported pilot origin | Modelled regional context only; displayed forecast/fetch timestamps, attribution and cache state; no optimization influence |
| Imported geographic pilot | Operator-supplied JSON | Requires evidence URL, license, date, resolution, uncertainty note, weighting basis, permission and operating details; operator attestation is not independent verification |
| Geographic base tiles | OpenStreetMap, explicitly loaded on demand | Visual geographic reference, not a source of population, weight or facility truth |
| Published facility inventory | `public/data/verified-facilities.json` | Intentionally empty: no verified inventory supplied; no real destinations claimed |
| General safety/contact references | WHO heat-and-health factsheet and India's official 112 service | Source-linked general advice and voluntary contact link; no clinical assessment or emergency integration |

The canonical fixture is preserved byte-for-byte. All its weights lie in 1–2 and are labelled synthetic assumptions. No WorldPop raster or external population dataset is redistributed. Neither physical heat exposure nor individual health is inferred.

**Illustrative** means constructed demonstration data. **Modelled** means an estimate or calculation. **Verified** requires documented evidence, scope and date; no shipped facility makes that claim. Labels appear in banners, tables, results, sources and exports. Geographic test records under `src/tests/fixtures/` are invented test data only; they are not included in the production catalog, and browser tests block their tile requests.

Open-Meteo data attribution uses CC BY 4.0; its free API's noncommercial terms also apply. Weather/map requests are optional. Their providers receive normal browser request information, including the requested geographic area. No secret key is used. See [attribution](AI_AND_ATTRIBUTION.md) and [limitations](LIMITATIONS.md).

Before presenting a real pilot or publishing public facilities, follow the [data contract](../public/data/README.md), verify facts and redistribution rights, and review source dates, permissions, hours, capacity uncertainty and accessibility. Existing public verification must expire within 30 days; automatic expiry is not a substitute for timely operator updates. Original team-owned contributions are licensed under MIT, copyright 2026 HeatReach Contributors. Fixture redistribution rights and permitted terms remain unconfirmed; the fixture is excluded from that grant pending rights-holder confirmation.

See [release rights evidence](RIGHTS_REVIEW.md) for the traced source commits, supplied-input boundary and exact remaining confirmations.
