# HeatReach

**Find the communities cooling infrastructure misses. Place relief where it matters.**

A working, browser-only community cooling-access planner for campus administrators, NGOs and ward planners. Adjust a budget, site cap, radius and candidate availability. An exact optimizer recommends the feasible subset with the greatest additional vulnerability-weighted access and compares it with an explicitly defined simple baseline.

**This demonstration is entirely illustrative.** Locations, populations, weights, facilities and costs are synthetic. Proposed sites are not operational cooling centers. Straight-line coverage is not verified walking access or a health outcome.

![HeatReach desktop planner](docs/screenshots/planner-1280.png)

## Run locally

Prerequisites: Node.js **22.12 or newer** (Node 22 LTS recommended), npm, and a modern browser. No API keys, database or backend.

```sh
npm ci
npm run dev
```

Open the printed local URL, normally `http://127.0.0.1:5173`. The scenario JSON is served locally; the application makes no third-party requests. It works without external APIs after the local server starts. It is not a service-worker offline installation.

```sh
npm test                 # Vitest domain + React tests
npm run typecheck        # strict TypeScript
npm run build            # typecheck + Vite -> dist/
npm run preview          # serve production build
npm run test:e2e          # real Edge browser; builds must already exist
npm run format:check
```

Browser tests use installed Microsoft Edge. On Linux/macOS CI, install an appropriate supported Playwright browser and update `channel` in `playwright.config.ts`, or install Edge with `npx playwright install msedge` where supported. Domain/UI tests and production builds do not require Edge.

## Verified benchmark

At budget 2, cap 2, radius 180 meters:

| Calculation | Exact result |
|---|---:|
| Existing coverage | Z1, Z8 / 780 modelled people |
| Selected proposals | A + C |
| Newly covered zones | Z3, Z5, Z6, Z7 |
| Optimized total | 2,150 modelled people |
| Additional raw access | 1,370 modelled people |
| Optimized weighted gain | 2,241 access points |
| Baseline selection | A + B |
| Baseline total | 1,750 modelled people |
| Baseline weighted gain | 1,385 access points |
| Budget 1 selection / total | C / 1,480 modelled people |

All figures are calculated by the engine, never hard-coded into result components. The original fixture is preserved in `public/fixtures/illustrative_district.json`.

## Implemented scope and architecture

```text
src/engine/       validation, Euclidean geometry, union coverage,
                  exact subset optimization, baseline, marginal explanations
src/types/        strict domain contracts
src/data/         validated fixture loading and source terminology
src/hooks/        planner controls, eligibility and synchronized results
src/components/   controls, schematic SVG, accessible tables, recommendations,
                  metrics, baseline comparison, provenance and limitations
src/styles/       responsive plain CSS, keyboard focus and visual tokens
src/tests/        domain + React integration tests
e2e/             desktop/mobile browser workflows
public/fixtures/  unchanged canonical synthetic fixture
scripts/         validated deployment packaging and non-root AWS deployment
docs/            methodology, provenance, limits, demo and release evidence
amplify.yml      Git-connected static Amplify build configuration
```

Enumeration supports at most 12 candidates and 20 demand zones. No ML, accounts, sensors, emergency dispatch, map tiles, resident tracking or unnecessary services. Optional live weather, geographic pilots, exports and public facility navigation are deliberately outside this P0 release. Raw-versus-weighted comparison and radius/eligibility sensitivity are available in the core workflow.

## Hosting and release status

Repository: <https://github.com/AamirrH/HeatReach>. Milestones are committed and pushed with actual timestamps. GitHub currently reports private visibility; the owner must make it public for submission.

**AWS: PENDING AUTHORIZED NON-ROOT AWS ACCOUNT.** The existing local AWS session identifies as root, which the supplied specification prohibits using for deployment. No Amplify resources were created; no deployment URL is claimed. AWS's planned role is static Amplify Hosting only. Production output and a verified upload ZIP are available locally after packaging.

Windows packaging: `npm run package`. See [AWS deployment](docs/DEPLOY_AWS.md) for Console, Git and guarded CLI workflows. Human actions still include approving the project license, confirming the event cutoff and eligibility, recording/uploading the video, and submitting the actual form. See [acceptance report](docs/EXECUTION_REPORT.md) and [submission checklist](docs/SUBMISSION_CHECKLIST.md).

## Method and integrity

[Methodology](docs/METHODOLOGY.md) · [Data provenance](docs/DATA_PROVENANCE.md) · [Limitations](docs/LIMITATIONS.md) · [Demo script](docs/DEMO_SCRIPT.md) · [AI and dependency credits](docs/AI_AND_ATTRIBUTION.md)

The supplied specification is preserved as handoff context, not evidence that its external event or deployment claims are verified. Source creation began during this build session; no history was backdated. Original application licensing is **pending team choice**; see `LICENSE`. Dependencies retain their own licenses.

