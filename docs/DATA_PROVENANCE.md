# Data provenance

| Input or output | Source | Status and interpretation |
|---|---|---|
| Eight zone points, populations and weights | User-provided `context/fixtures/illustrative_district.json` | Illustrative, wholly synthetic; not city census data |
| Existing examples X1/X2 | Same canonical fixture | Fictional existing examples, not verified operational facilities |
| Candidates A–E, costs and initial eligibility | Same fixture | Illustrative assumptions; costs are arbitrary budget units, not rupees |
| Radius 180, budget 2, site cap 2 | Same fixture defaults | Planning assumptions, editable in the UI |
| Weighted access and raw coverage outputs | Pure local engine | Modelled calculations over illustrative inputs |
| Geometry | Fixture local x/y meters | Fictional schematic plane, not actual city coordinates |
| Scenario date | Fixture `dataAsOf: 2026-10-11` | Version date for this synthetic dataset, not field verification date |
| Weather location metadata | Fixture Nagpur latitude/longitude and Open-Meteo reference | Preserved verbatim in JSON; unused in this release |

The fixture was copied without modifying its values. Tests validate its schema and golden calculations; the original handoff and shipped copy can be compared byte-for-byte. All fixture weights lie in 1–2 and are explicitly labelled “Synthetic test weight.” Neither physical heat exposure nor individual health is inferred.

**Illustrative** denotes constructed demonstration data. **Modelled** denotes an estimate or calculation. **Verified** requires documented evidence with verification scope and date; it is not claimed for any shipped facility.

The UI banner, map, proposal labels, metrics, accessible tables and evidence panel carry these distinctions. No fictional coordinates appear on real map tiles. Weather has not been integrated, so no forecast data, timestamp or license use is implied; the retained reference is [Open-Meteo documentation](https://open-meteo.com/en/docs). No WorldPop data, OSM tiles or external facility records are downloaded or redistributed.

Fixture authorship/redistribution approval remains with the user/team; see `LICENSE` and the attribution document. A future real pilot needs source URLs, dates, population resolution, documented weighting basis, data licenses, facility permissions and verification of operating conditions before presentation as real.
