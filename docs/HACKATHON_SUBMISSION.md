# HeatReach — Environmental Hacks submission draft

Track: **Heat and Water**. Status: functional prototype; **AWS deployment and submission pending**.

## Short write-up

HeatReach helps city planners, NGOs and campus administrators explore where a limited cooling-infrastructure budget could improve access. Its browser-based planner compares existing modelled coverage with proposed sites, accounting for overlapping coverage and explicit vulnerability weights. Users adjust budget, site count, coverage radius and candidate availability, then inspect an exact recommendation, explanations and a matched simple baseline.

The core contribution is a transparent, interactive planning workflow: every feasible candidate subset is evaluated, overlapping population is counted once, and the trade-offs are visible in maps, tables and exports. It is an application of exact optimization, not a claim to invent a new mathematical algorithm. The objective maximizes additional population-weighted vulnerability access subject to budget, site-cap and eligibility constraints. Deterministic tie-breaks prefer greater raw coverage, lower cost, then site-ID order. At most 12 candidates and 20 demand zones are supported.

The canonical illustrative scenario uses budget 2, cap 2 and a 180-metre straight-line radius. The engine selects A + C: existing modelled access 780, optimized access 2,150, additional access 1,370 and additional vulnerability-weighted gain 2,241 points. The first-eligible A + B baseline reaches 1,750 with 1,385 weighted points. These are reproducible synthetic calculations, not measured benefits or census counts.

AWS Amplify Hosting is the **planned** static hosting service for the React/TypeScript/Vite production build. It will serve the application, local fonts, fixture and empty public catalog over HTTPS. Computation occurs in the visitor's browser; no backend, database or AWS inference service is used. Deployment has not yet been performed. Replace this paragraph's status only after verifying the real public URL and successful Amplify build.

The potential value is helping planners compare proposed investments and explain why a particular combination improves the chosen access objective. A real deployment would first require independently reviewed population inputs, weighting assumptions, site permissions and operating records. We claim no measured reduction in heatstroke, mortality, flooding or environmental harm.

## Data and limitations

The original team-supplied fixture is wholly illustrative: coordinates, populations, weights, existing facilities, proposals and costs are synthetic. Proposed sites are not operating centres. Straight-line radius is not a verified walking route, and capacity and opening hours are not solver constraints. Weights are assumptions, not validated vulnerability measurements. No verified public inventory was supplied, so the public directory intentionally contains zero records. Imported geographic pilots stay in browser memory and cannot publish themselves to the directory.

Optional Open-Meteo weather for the Nagpur region is separate forecast context, not the location or source of the synthetic planning scenario. Weather never changes vulnerability weights or optimization results. Optional Leaflet/OpenStreetMap views apply to documented geographic inputs, not the fictional schematic.

See [methodology](METHODOLOGY.md), [provenance](DATA_PROVENANCE.md), [limitations](LIMITATIONS.md) and [publication data requirements](../public/data/README.md).

## Stack and fresh testing evidence

React, TypeScript, Vite, Zod, Leaflet/React Leaflet, self-hosted Fontsource fonts, Vitest, Testing Library and Playwright. Existing Amplify configuration installs Node 22, runs npm ci, tests and a Vite build, and publishes dist.

Reverified on 11 October 2026 against commit `5eb8a132ed2c7b2b7e853a119a9bfc7b00aa329a`: 67 unit/UI tests, 8 Edge production-browser tests, strict TypeScript, production build and formatting all passed. Browser workflows cover desktop/tablet/mobile widths, controls, network failures, geographic import, public-directory expiry, CSV and print. A supplemental smoke check verified radius changes, baseline metrics and all 15 production assets.

Final documentation/license-only corrections were reverified at 18:41 IST: all 67 tests, strict TypeScript, production build and formatting passed. Application code and canonical values were unchanged; the earlier 8 browser tests remain applicable. The build now also ships the team MIT notice.

A genuine Edge request to Open-Meteo returned HTTP 200 at 17:49 IST on 11 October; CORS, parsing, Celsius/percent units, IST timestamps, cache labeling and offline planner independence were verified. This is historical test evidence, not a current weather promise. npm audit reported zero known vulnerabilities at this check; this is not a security certification.

## Credits, AI and owner decisions

ChatGPT generated the master specification and illustrative fixture specifically for HeatReach. Google Stitch generated the UI reference, which the team adapted into the application. OpenAI Codex assisted implementation, testing, documentation and release preparation. The team confirmed publication and MIT approval for all authorized original contributions under the collective designation HeatReach Contributors. Individual member names and roles still need the captain's submission details.

Preserve [full attribution](AI_AND_ATTRIBUTION.md) and the shipped [runtime notices](../public/THIRD_PARTY_NOTICES.txt): React/React DOM and Zod MIT; Leaflet BSD-2-Clause; React Leaflet and core Hippocratic-2.1; Space Grotesk/Public Sans SIL OFL 1.1. Development dependencies include MIT, MIT-0, Apache-2.0, BSD-2-Clause, BSD-3-Clause, ISC and MPL-2.0 components, each retaining its own terms. Lightning CSS is a build tool and is not distributed as a tool in the website. Open-Meteo attribution and noncommercial API terms apply; optional maps retain OpenStreetMap attribution and tile-policy obligations. The Stitch reference is credited; its demo scripts and hotlinked imagery are not shipped.

**Licensing:** MIT is approved for rights the HeatReach Contributors hold and may license, including authorized AI-assisted contributions. The fixture/design publication review is complete based on the team's provenance confirmation and applicable provider terms; no specific material rights conflict was identified. This does not assert copyright protection for all AI output or relicense third-party material. Third-party conditions, including Hippocratic-2.1, remain in force. See [rights review](RIGHTS_REVIEW.md).

## Submission fields — complete before submitting

- Project: HeatReach
- Track: Heat and Water
- Repository: https://github.com/AamirrH/HeatReach — anonymous access verified; fixture/design publication review complete.
- Actual AWS HTTPS URL: **PENDING DEPLOYMENT**
- Successful Amplify job/branch and deployment time: **PENDING DEPLOYMENT**
- YouTube demo, public or unlisted, under 3:00: **PENDING RECORDING AND UPLOAD**
- Team name/captain: **TEAM TO CONFIRM**
- Member names, registrations and individual contributions: **TEAM TO CONFIRM**
- Student/Builder Center verification and event-window compliance: **TEAM TO CONFIRM**
- Original team-owned contribution license: **MIT APPROVED — HeatReach Contributors, 2026**
- Fixture/design redistribution rights and terms: **PUBLICATION CLEARED — see RIGHTS_REVIEW.md**
- Submission confirmation and timestamp: **PENDING SUBMISSION**

## Rules and deadline checked

The [official rules](https://www.wemakedevs.org/aws/env/rules) require a new event-period project, public repository, credited reuse/AI tools, short write-up and a YouTube video under three minutes showing actual AWS use. The [event overview](https://www.wemakedevs.org/aws/env) identifies Heat and Water and recognizes AWS hosting as an eligibility route. HeatReach still needs its actual Amplify deployment for the selected route.

The organizer's [6 October announcement](https://www.wemakedevs.org/blogs/what-is-happening-in-delhi-on-10-october) states **11 October 2026, 8:00 PM IST**. The [submission page](https://www.wemakedevs.org/aws/env/submit) did not expose the authenticated form during this audit. The captain must verify its final cutoff and submit once for the team. No authenticated submission or acceptance is claimed.

Record the [2:55 demo script](DEMO_SCRIPT.md) after deployment. Show the real app and actual AWS console/URL, then verify the YouTube and repository links while signed out.
