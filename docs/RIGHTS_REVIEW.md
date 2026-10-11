# Release rights review — 11 October 2026

Status: original team-owned contributions approved under MIT; fixture/design input rights remain unresolved. This review supports a **draft PR only**, not merge or deployment clearance. No contrary evidence found is not proof of ownership.

## Canonical fixture evidence

- `public/fixtures/illustrative_district.json` and `context/fixtures/illustrative_district.json` were both introduced in `5d948c770d27d32b11a969195a8622445afe3d6e` (11 October 2026). The public file's blame attributes its entire contents to that commit, with no later edits.
- `context/HEATREACH_MASTER_BUILD_SPEC.md`, section “Standalone fallback: embedded canonical fixture”, supplies the complete same JSON and instructs the implementer to copy it unchanged. Metadata describes purpose-built synthetic algorithm-test data, not population or facility records. There is no external population/facility source in the fixture; Open-Meteo is linked only for optional regional weather.
- The source is therefore traceable to the **supplied master-specification bundle**, not to a data-generation script in this repository. No generator, upstream data license or rights-holder permission record was found in the reviewed source/history. Commit authorship does not prove who created or owns the supplied bundle.
- This evidence supports synthetic intent and integrity, but does not establish whether the supplier created it for the team or copied it from another source. It is not automatically covered by the approval for team-owned original contributions.

Exact remaining question: **Was the JSON embedded in the supplied HeatReach master specification created by the team (including commissioned/AI-assisted work the team may distribute), and is the team authorized to distribute it under MIT? If it was supplied by someone else, identify that source and the permitted distribution terms.**

No separate permissive terms are recorded under which the original fixture can be declared cleared. Replacing it safely would require an independently constructed scenario and validation of every benchmark/demo claim; reproducing an uncertain source verbatim under a new filename is not independent creation. That change is not necessary if the supplier confirms the actual provenance, and it cannot resolve the separate design-input question. The working canonical fixture and benchmark are preserved while that narrow confirmation is pending.

## Design evidence

- Commit `1991b3e97576ee21fcb600906e0d7460647e73a2` adapts React components/CSS and adds inline SVG icons and Fontsource dependencies. `docs/DESIGN.md` identifies the supplied `stitch_heatreach_resilience_planner_ui.zip` as the visual reference, with two mobile exports and a design guide. Desktop/tablet/public views were implemented in project source.
- The actual Stitch export, its prompts/reference uploads, accepted account-specific terms and supplier permissions are not tracked in this checkout. The accessible attachment inventory did not provide the named export. Available local creation records did not supply independent earlier rights evidence.
- Production source inspection found inline SVG/HTML artwork, CSS styling and locally packaged fonts. No stock photograph, externally hosted illustration, remote executable design script or original Stitch demonstration script was identified. Repository screenshots depict the application; they inherit any unresolved rights in depicted material rather than independently clearing it.
- All installed runtime font/library license texts are present in `public/THIRD_PARTY_NOTICES.txt`. Google does not claim ownership of original generated content under its [general terms](https://policies.google.com/terms), but those terms also require rights to supplied/third-party content. This is not evidence that the specific Stitch inputs were authorized. The public Stitch FAQ did not expose additional usable rights evidence during this review.

Exact remaining question: **Did the supplier generate the named Stitch export from team-owned/authorized inputs, and may the resulting adapted design be publicly distributed and reused? If outside reference artwork/designs were supplied, identify their applicable permission/license.**

No specific unlicensed image or icon has been identified for targeted replacement. Replacing fonts or generic icons would not clear unknown reference-design provenance. Recreating the entire UI merely to avoid asking its supplier would be disproportionate and would still require careful independence verification. Preserve the implemented UI until this precise input question is answered.

## License and distribution boundaries

MIT applies to the approved original team-owned contributions, copyright 2026 HeatReach Contributors. The root grant excludes unresolved fixture/design inputs and does not replace third-party terms. `public/HEATREACH_LICENSE.txt` ships the same grant with static distributions; keep it synchronized with root LICENSE. Third-party notices remain unchanged.

React Leaflet/core are Hippocratic-2.1, Leaflet BSD-2-Clause, React/React DOM/scheduler/Zod MIT, and fonts OFL-1.1. Build dependencies also include MPL-2.0, Apache-2.0, ISC, BSD and MIT-0 components. Open-Meteo and OpenStreetMap retain their provider/data conditions. See `AI_AND_ATTRIBUTION.md`; attribution is not a replacement for permission.

GitHub was observed public with anonymous API HTTP 200 during this review. This is observed accessibility, not proof of rights clearance; the reviewer did not change visibility. Historical reports of private visibility describe earlier checks. Keep this release PR in draft and do not merge or deploy until the two input questions are resolved.
