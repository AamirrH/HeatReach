# HEATREACH — MASTER END-TO-END IMPLEMENTATION SPECIFICATION

**Intended readers:** Claude Code, OpenAI Codex, any autonomous coding agent, and the HeatReach student team.  
**Specification version:** 1.0 • **Prepared:** 11 October 2026 (Asia/Kolkata).  
**Project:** HeatReach — *Find the communities cooling infrastructure misses. Place relief where it matters.*  
**Hackathon:** WeMakeDevs × AWS, Bharat Builds Tour, Environmental Hacks, **Track 2 — Heat and Water**, 8–11 October 2026.  
**Primary artifact:** A working, attractive, testable, AWS-hostable web MVP, built newly during the official event window.  
**Status:** Implementation brief, NOT a claim that the application already exists, that a live service has been deployed, or that any cooling center has been verified.

> ## AGENT: READ THIS FIRST — EXECUTE, DON'T ONLY PLAN
> You are the **lead engineer, product designer, data-integrity reviewer, test engineer, and release engineer** for this project. Starting from the repository provided to you, **implement the complete HeatReach MVP end-to-end**. You must actually create source files in their intended final directories, install supported dependencies, run tests, build the application, fix failures, write documentation, and attempt deployment if credentials are available. **Do not stop after producing a plan, mockups, pseudocode, or an isolated prototype.** Do not request permission for routine implementation decisions already settled here. If an external action requires the human user's login, AWS permissions, verification, billing authorization, GitHub access, or a confirmed deadline, report the exact blocker and provide executable steps rather than inventing a success.
>
> **Scope comes before features:** Complete the P0 optimization workflow, tests, polish, and AWS deployment before adding anything optional. Every project feature and number must obey the provenance and safety rules below. **Do not build phone-temperature heatstroke detection, passive fainting detection, emergency auto-dispatch, or fake live SMS.**
>
> **Deliverable:** A complete project repository with runnable frontend, deterministic optimizer, authentic source labeling, scenario fixture, responsive UI, tests, README, data/methodology docs, demo script, deployment configuration, and a candid completion report. The code must work without a paid API key or backend.

---

## 1. Product in one minute

**Problem.** Extreme heat disproportionately affects people who lack access to safe, nearby cooling spaces. A campus administrator, NGO, or city ward planner may know that heat is a problem but cannot easily decide **which eligible temporary cooling sites should be prioritized when money and sites are limited**. Weather maps and station directories show conditions or facilities but rarely give a transparent resource-allocation plan.

**Answer.** HeatReach is a **budget-constrained community cooling-access planner**. It visualizes aggregated demand zones and existing cooling-access assumptions, finds underserved zones, and selects a feasible subset of **candidate** sites to maximize additional **vulnerability-weighted access**. It reports actual solver calculations, raw estimated residents newly covered, constraints, a naive baseline, excluded sites, and uncertainty/provenance. A planner changes budget, coverage radius, or availability and gets an immediate, explainable new plan.

**The demo's memorable moment:** A planner with a budget of two **illustrative budget units** clicks **Optimize Coverage**, sees **Candidate A + Candidate C** selected, **2,150** modeled people within the coverage proxy compared with **1,750** using the defined baseline, then changes the budget to one and sees the plan recalculate. THESE FIGURES ARE **SYNTHETIC FIXTURE OUTPUTS**, NOT REAL PEOPLE or field-tested environmental impact.

**Non-goal:** HeatReach does not measure human body temperature, diagnose heatstroke, predict an individual's mortality risk, infer real street-level heat from regional forecasts, or assert proposed facilities are open. Never imply that it does.

### Two intended audiences (do not blend them)

1. **Primary — Planner (P0):** campus administrator, city ward official, nonprofit community coordinator. Can assess potential cooling reach and choose candidate facilities under budget.
2. **Secondary — Public visitor (P1 only if real verified open facilities exist):** may view verified facilities and safety advice, but must **never** be directed to a hypothetical or unconfirmed center.

---

## 2. Ground truth: contest constraints and how to optimize for judging

**Primary source:** https://www.wemakedevs.org/aws/env/rules  
**Track/judging:** https://www.wemakedevs.org/aws/env  
**Schedule:** https://www.wemakedevs.org/aws/env/schedule

### Official rules verified on 11 October 2026

- Hackathon runs **8–11 October 2026**; team limit **1–4 university students** in India, aged 18+. Each teammate registers individually; team submits once.
- Build new work only during the event window. **Do not represent work created before the event as event-time code.** Open-source dependencies, starter templates, public APIs and AI coding tools are permitted; credit their sources and disclose AI tools used.
- Prize eligibility needs **AWS services or a qualifying AWS open-source tool**. The demo video must **show actual AWS involvement**, not merely name it.
- Submission requires **public repository**, **YouTube video shorter than three minutes** (public/unlisted), and **short write-up** describing problem, build, AWS role. The official form must receive these before its deadline.
- There is **no live demo**. Judges evaluate what the submission/video shows; unverifiable planned features do not count.
- Official evaluation dimensions: **idea and environmental impact; AWS integration; design/usability; working execution; three-minute video**. No official numeric weights are published. Do NOT say “judges give X% to...”
- The public schedule currently says the **exact closing hour is being finalized**. The agent cannot infer midnight. The **human team captain must immediately verify the logged-in portal, messages, and updates**.
- Team members must ensure proper account/Builder Center verification in their own accounts. Amazon fast-track interviews have separate eligibility and are not guaranteed by prizes.

**Judge-oriented decisions:** One tested decision workflow beats five broken features. A transparent solver + baseline + credible provenance + accessible UI + live AWS deployment + concise demo is the P0 path. Never score your own project 100/100 as a factual judging result.

### Release blocker conditions (operator must confirm)

1. Captain has verified the actual submission cutoff and time zone.
2. Repository history and contributors comply with the event dates.
3. Team members' eligibility, registrations and student verification status checked as appropriate.
4. AWS app accessible on public HTTPS URL from an incognito browser.
5. A real YouTube video under 3:00 exists and link works signed out.
6. Submission form accepted and confirmation saved. If an external account is inaccessible, mark it **PENDING HUMAN ACTION**; do not claim completion.

---

## 3. Product scope freeze: P0 / P1 / prohibited

| Level | Deliverable | Required behavior |
|---|---|---|
| **P0** | Single-page planner dashboard | Load independently without live API and show clearly fictional example scenario |
| **P0** | Schematic scenario map | Display all zone points, existing illustrative facilities, candidates, selected candidates and clear legend |
| **P0** | Scenario controls | Edit planning budget, coverage radius, max sites, and eligibility of each candidate |
| **P0** | Coverage engine | Calculate existing-site union coverage using radius; no double-counting |
| **P0** | Exact optimization | Enumerate eligible candidate subsets under budget and max-site cap; maximize incremental vulnerability-weighted coverage |
| **P0** | Matched baseline | Select eligible candidates in alphabetic ID order while budgets allow; compare against exact solver using identical constraints |
| **P0** | Result explanations | Selected sites, cost, incremental raw estimated population, weighted access proxy, still-unserved zones, overlap and caveats |
| **P0** | Data provenance and limitations | Every demo datum clearly illustrative; distinguish forecast/modelled vs real vs verified |
| **P0** | Automated tests + build | Unit tests (fixture and edge cases), zero TypeScript errors, production build succeeds |
| **P0** | AWS deployment | React build served via Amplify Hosting where permissions allow; deployment otherwise ready with exact steps |
| **P0** | Submission materials | Public-ready README, demo script, technical methodology, AI-tool/licence disclosure placeholders, checklists |
| **P1** | Regional forecast | Open-Meteo weather context with timestamp and conspicuous fallback on failure; **not** part of site risk scoring |
| **P1** | Export | Export selected plan to a clearly labeled CSV or print-friendly summary |
| **P1** | Verified geographic mode | Leaflet/OSM real map only for actual georeferenced, licensed inputs; show sources and verification status |
| **P1** | Fairness/sensitivity panel | Show raw reach vs weighted reach, explain weighting, test different radii and exclusions |
| **P2** | Public verified centers view | Only once operational facilities/hours are verified; never route to candidate-only sites |
| **PROHIBITED in MVP** | Auto-detect heatstroke, phone battery temp, fall diagnosis, auto-call 112/108, untested SMS, unsolicited personal tracking, make-believe “open now” labels | Not implemented or advertised |

**Order of work:** engine + fixture → tests → planner inputs/results → map → weather → deployment → demo package → extras. Deploy a minimal but working application early; if the deadline is near, skip all P1/P2.

---

## 4. Fixed implementation choices — do not introduce a backend unnecessarily

### Stack

- **Language:** TypeScript (strict) end-to-end.
- **Frontend:** React + Vite (current compatible stable versions), responsive CSS (plain CSS/CSS modules; do not spend hours installing a UI framework).
- **Core state:** React hooks plus pure domain functions, no unnecessary state management framework.
- **Schemas:** Zod for runtime validation of source scenarios, or an equivalent small hand-validated schema if dependency issues arise.
- **Math/optimization:** typed pure functions; **no** model training, LLM, Python backend, expensive geospatial solver or cloud inference. Exact enumeration is reliable for 12 candidates.
- **Visualization P0:** custom SVG/HTML **schematic map** using scenario `x/y` in **local meters**, since fixture coordinates are fictional. Make it attractive (grid, demand circles, radius outlines, distinct site markers, explanatory legend). It is a diagram, **not a street map**.
- **Mapping P1:** React Leaflet + OSM only for real sourced latitude/longitude; comply with OSM attribution/tile usage. Do not place fictional locations on a real city basemap.
- **Weather P1:** Open-Meteo free forecast API, client fetch, no API key; show region-level weather only, fetch lazily/cached, no fake hyperlocal overlay.
- **Persistence:** locally versioned JSON fixture + optional in-memory state / localStorage for **nonpersonal** planning controls. Reset scenario button. No user accounts.
- **Testing:** Vitest for pure domain functions; React Testing Library for main UI; optional Playwright smoke test if available.
- **Hosting:** **AWS Amplify Hosting** for the static Vite `dist/` output. Keep a one-route SPA for easiest hosting; if multiple history-based routes are added, configure official SPA rewrites.
- **Icons:** lucide-react (optional), accessible labels, no hotlinked copyrighted images.
- **Responsiveness:** desktop 1280px demo primary, phone width 375px secondary.

### Decisions intended to save time

- No MySQL/PostgreSQL; not needed for a static planner MVP. A database may be appropriate only for a future multi-user version.
- No FastAPI, Kubernetes, Bedrock, SageMaker, Amazon SNS or paid SMS for P0.
- No large WorldPop GeoTIFF download as a prerequisite for the demo; only attempt a verified pilot after P0 works.
- No hidden randomness in recommendation results. Same inputs => same outputs.
- No geolocation permissions for P0.
- No third-party authentication, cookies analytics, resident medical information or emergency contact collection.

---

## 5. Repository architecture: create code in final locations from the start

Build this structure (minor file splits permissible if all responsibilities remain clear):

```text
heatreach/
├── README.md
├── package.json
├── package-lock.json                  # committed if npm used
├── index.html
├── vite.config.ts
├── tsconfig.json
├── tsconfig.app.json                  # if Vite generates this
├── .gitignore
├── .env.example                       # only if needed; no secrets
├── amplify.yml                        # optional Git-connected AWS build
├── public/
│   └── fixtures/
│       └── illustrative_district.json # EXACT fixture shipped with this handoff
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── styles/
│   │   ├── tokens.css
│   │   ├── global.css
│   │   └── planner.css
│   ├── types/
│   │   ├── domain.ts                   # Zone, Site, Scenario, Result, Provenance
│   │   └── weather.ts
│   ├── engine/
│   │   ├── validation.ts               # parse & user-input guards
│   │   ├── geometry.ts                 # Euclidean distance in local meters
│   │   ├── coverage.ts                 # union, before/after, raw + weighted metrics
│   │   ├── optimize.ts                 # exact bounded subset solver
│   │   ├── baselines.ts                # first-eligible baseline
│   │   └── explain.ts                  # transparent per-site reasons
│   ├── data/
│   │   ├── scenarios.ts                # load, validate, annotate
│   │   └── provenance.ts               # source manifest + disclaimers
│   ├── services/
│   │   └── weather.ts                  # nonblocking Open-Meteo integration
│   ├── hooks/
│   │   ├── usePlanner.ts
│   │   └── useWeather.ts
│   ├── components/
│   │   ├── Header.tsx
│   │   ├── SourceBanner.tsx
│   │   ├── ScenarioMap.tsx             # schematic SVG, not streetmap
│   │   ├── PlannerControls.tsx
│   │   ├── SiteEligibilityList.tsx
│   │   ├── MetricsStrip.tsx
│   │   ├── ResultComparison.tsx
│   │   ├── RecommendationList.tsx
│   │   ├── WeatherContext.tsx
│   │   ├── EvidenceDrawer.tsx
│   │   └── Footer.tsx
│   └── tests/
│       ├── fixture.test.ts
│       ├── geometry.test.ts
│       ├── optimize.test.ts
│       ├── baseline.test.ts
│       ├── validation.test.ts
│       └── planner-ui.test.tsx
├── docs/
│   ├── METHODOLOGY.md
│   ├── DATA_PROVENANCE.md
│   ├── LIMITATIONS.md
│   ├── DEMO_SCRIPT.md
│   ├── DEPLOY_AWS.md
│   ├── SUBMISSION_CHECKLIST.md
│   └── AI_AND_ATTRIBUTION.md
└── LICENSE
```

**No temporary `App.tsx` business logic blob.** Put all optimization logic in `src/engine/` immediately, independent from React. Components must not recompute independent copies of weighted coverage. `Result` comes only from engine functions. Don't overwrite any existing project without reviewing its files first.

---

## 6. Domain schemas and data integrity

TypeScript interfaces should implement the following contracts (expand only when necessary):

```ts
export type Provenance = 'illustrative' | 'modelled' | 'verified';
export type SiteKind = 'existing' | 'candidate';
export type SiteStatus =
  | 'illustrative_existing'
  | 'illustrative_candidate'
  | 'verified_open'
  | 'eligible_candidate'
  | 'unavailable';

export interface DemandZone {
  id: string;
  name: string;
  x: number; y: number; // metres in synthetic local coordinate plane
  estimatedPopulation: number; // finite nonnegative, can be zero
  vulnerabilityWeight: number;  // documented 1.0..2.0 in fixture
  vulnerabilityBasis: string;
  provenance: Provenance;
}

export interface CoolingSite {
  id: string;
  name: string;
  x: number; y: number;
  kind: SiteKind;
  status: SiteStatus;
  eligible: boolean;
  costUnits: number;         // finite nonnegative; candidates strictly > 0
  provenance: Provenance;
  verificationNote: string;
}

export interface Scenario {
  id: string; name: string; mode: 'illustrative' | 'verified-pilot';
  description: string;
  coordinateSystem: 'local-meters';
  dataAsOf: string;
  radiusMeters: number;
  budgetUnits: number;
  maxNewSites: number;
  zones: DemandZone[];
  sites: CoolingSite[];
  weatherLocation?: {label:string; latitude:number; longitude:number};
  sourceManifest: Array<{label:string; type:Provenance; sourceUrl:string|null; note:string}>;
}

export interface PlanResult {
  selectedSiteIds: string[]; // ascending alphabetic order
  beforeCoveredZoneIds: string[];
  afterCoveredZoneIds: string[];
  newlyCoveredZoneIds: string[];
  stillUncoveredZoneIds: string[];
  beforeRawPeople: number;
  afterRawPeople: number;
  newRawPeople: number;
  beforeWeightedReach: number;
  afterWeightedReach: number;
  incrementalWeightedReach: number;
  totalCostUnits: number;
  baseline: {
    selectedSiteIds: string[];
    afterRawPeople: number;
    incrementalWeightedReach: number;
    totalCostUnits: number;
  };
  warnings: string[];
  explanations: Array<{siteId:string; newZoneIds:string[]; marginalWeightedReach:number}>;
}
```

**Parsing & errors:** Validate unique IDs across each entity group (prefer unique globally), finite coordinates, nonnegative populations/budgets, nonnegative integer site cap, positive radius, candidate cost > 0, valid status-kind combinations, and documented weights. Reject invalid fixture with a helpful page-level error—not a blank screen. User inputs must be clamped or rejected (e.g., 0..20 budget units, 0..12 max sites, 50..1000 metres radius for the demo). No NaN/Infinity division. Nothing is silently substituted for invalid inputs.

**Terminology:**

- **Estimated people within radius** = sum of `estimatedPopulation` once per zone, not individually observed residents.
- **Vulnerability-weighted access points** = Σ (estimated population × transparent weight), **NOT people, hospital admissions, lives saved, or actual heat risk percentage**.
- **Additional access** = previously uncovered zones covered by at least one selected candidate.
- **Coverage radius** is a **straight-line distance proxy**, **NOT walking distance / transit accessibility**.
- **Budget units** are arbitrary planning units in the fixture; **NOT verified Indian rupee construction costs**.
- **Proposed sites** are candidate locations, **NOT open cooling centers**.
- **Regional forecast** cannot resolve variation among synthetic neighbourhoods.

---

## 7. Exact optimization and comparison logic — MUST BE CORRECT

Let `Z` be demand zones, `E` existing sites, `C` eligible candidates, `r` radius, `B` budget units, `K` maximum new sites.

### Distance and coverage

- In P0 scenario with `coordinateSystem = 'local-meters'`: `distance(z,s) = Math.hypot(z.x-s.x, z.y-s.y)`.
- A zone is reachable from a site if `distance <= radius + 1e-9` (consistent boundary treatment).
- Existing coverage `E_cov` = **union** of zones reached by all `kind === 'existing'` sites whose status is `illustrative_existing` in demo mode or `verified_open` in a verified-pilot mode; exclude unavailable. Existing demo stations **must** be labeled fictional.
- For candidate subset `S`, coverage after = `E_cov ∪ coverage(S)` (set union; do not double count).
- `newlyCoveredZones = after - E_cov`, not sum of site memberships.
- Raw access = sum `estimatedPopulation` across covered zone IDs.
- Weighted access = sum `estimatedPopulation * vulnerabilityWeight` across covered zone IDs.

### Objective and constraints

```text
maximize: incrementalWeightedReach(S)
          = SUM over zones newly covered relative to existing centers
              (population_estimate[z] * vulnerability_weight[z])
subject to:
          all s in S are eligible candidate sites and not unavailable
          SUM(costUnits[s] for s in S) <= budgetUnits
          |S| <= maxNewSites
          candidate count <= 12 in P0
```

### Exact solver

1. Validate scenario + overrides before doing any calculations.
2. Generate **every subset** of eligible candidates for `n <= 12` (at most 4,096 subsets). Include empty subset.
3. Reject subsets violating budget or max-new-sites cap.
4. Compute the **union** of existing coverage and selected-site coverage.
5. Compute incremental weighted reach, newly covered raw people, total cost and selected IDs.
6. Choose the best feasible subset with **deterministic** ordered tie-breaks:
   - larger **incrementalWeightedReach** (round only for comparisons at tolerance `1e-9`, never truncate displayed underlying values),
   - then larger **afterRawPeople**,
   - then **lower total cost**,
   - then **lexicographically smallest sorted list of site IDs**.
7. Return full result and no impossible IDs. If no feasible site, choose empty subset and show explanatory status.
8. **Performance gate:** 12 candidates × up to 20 zones should complete interactively in ordinary browsers; avoid redundant expensive calculations by precomputing covered-zone sets for each site.

### Matched naive baseline

To make the gain honest, define EXACTLY this baseline (not a strawman described as a professional standard):

```text
FIRST-ELIGIBLE BASELINE:
  sort eligible candidates by id ascending
  begin with empty selected list, same budget B and maxSites K
  visit each in order; if it fits BOTH remaining budget and count cap,
  add it, regardless of overlap or marginal population gain
  compute raw/weighted after using the SAME coverage function and same existing sites
```

The name in UI is **“First-eligible simple baseline (illustrative)”**. Do not claim this represents actual municipal practice. Since solver optimizes weighted gain, it need not always beat the baseline on **raw people**; clearly separate those two metrics. `percentage uplift` may use `(optimizedWeightedGain - baselineWeightedGain)/baselineWeightedGain` when baselineWeightedGain > 0; otherwise show “not comparable” (never Infinity). Prefer absolute numbers first. Never call weighted points “additional people.”

### Deterministic per-site explanation

Explain each selected site as **marginal new access**, iterating selected IDs in sorted order while starting from existing coverage. This sums to the total incremental weighted value only if overlaps are subtracted in later steps. Don't promise it equals each site's independently estimated standalone reach. Present a transparent short sentence such as:

> Candidate C adds Zone 3 and Zone 7 under the 180 m straight-line proxy. Selected along with A, it supports a modeled increase in coverage for previously underserved zones.

If a site adds no new reach under the chosen set, say so (it should rarely be chosen because lower cost wins ties).

---

## 8. Canonical benchmark fixture — ship and preserve exactly

Copy `fixtures/illustrative_district.json` from this handoff into `public/fixtures/illustrative_district.json` in the application repository. **Do not silently alter it.** This is a purpose-built fictional geometry/population dataset, not an imported Indian city dataset.

Important fields:

- Eight fictional demand zones (`Z1..Z8`), seven site points: two illustrative existing (`X1`,`X2`) + candidates `A`,`B`,`C`,`D`,`E`.
- Existing sites at `(0,0)` and `(750,250)`; candidate sites: `A=(100,190)`, `B=(250,150)`, `C=(500,150)`, `D=(750,0)`, `E=(380,130)` (all metres).
- Cost units: A/B/C/D each 1, E 2. All five candidates initially eligible.
- **Initial settings**: budget `2`, `maxNewSites=2`, `radiusMeters=180`.
- Each zone's `estimatedPopulation` and `vulnerabilityWeight` are in fixture JSON; the exact expected outputs below were verified independently by exhaustive enumeration.

### Mandatory golden results (verify via automated tests)

| Metric | Expected |
|---|---:|
| Existing covered zones | `Z1`, `Z8` |
| Existing modeled raw population | **780** |
| P0 solver selection with budget 2 / cap 2 / radius 180 m | **A + C** |
| Solver newly covered zones | `Z3`, `Z5`, `Z6`, `Z7` |
| Solver modeled total raw population after | **2,150** |
| Solver modeled incremental weighted reach | **2,241 points** |
| Simple baseline selected sites | **A + B** |
| Simple baseline modeled total raw population after | **1,750** |
| Simple baseline incremental weighted reach | **1,385 points** |
| Difference in modeled raw population after (optimizer – baseline) | **400** |
| Difference in incremental weighted reach | **856 points** |
| Recompute with budget 1 (otherwise unchanged): selected | **C** |
| Recompute with budget 1: total raw people after | **1,480** |

**CRITICAL:** These numbers apply ONLY to the exact untouched synthetic fixture and constraints above. Render numbers with persistent “Illustrative scenario / modelled coverage” labeling. Never present this as a benefit achieved by real facilities.

**Recommended input examples to demonstrate visible changes:** budget 2 → 1; mark Candidate C unavailable and rerun; vary radius 180 → 120, with results recalculated rather than hard-coded. The app must compute, not simply display these values from configuration.

### Standalone fallback: embedded canonical fixture

If an agent received **only this Markdown file** without the ZIP, create `public/fixtures/illustrative_district.json` from the complete JSON below. The ZIP also ships the same data as a separate file. Preserve all values exactly.

```json
{
  "id": "illustrative-district-v1",
  "name": "Illustrative District (fictional scenario)",
  "mode": "illustrative",
  "description": "Fully synthetic coordinates, residents, risk weights and station placements. Do not map these locations onto an actual city or present them as operating facilities.",
  "coordinateSystem": "local-meters",
  "dataAsOf": "2026-10-11",
  "radiusMeters": 180,
  "budgetUnits": 2,
  "maxNewSites": 2,
  "weatherLocation": {"label": "Nagpur regional weather (context only)", "latitude": 21.1458, "longitude": 79.0882},
  "zones": [
    {"id":"Z1","name":"Zone 1","x":0,"y":0,"estimatedPopulation":420,"vulnerabilityWeight":1.8,"provenance":"illustrative","vulnerabilityBasis":"Synthetic test weight"},
    {"id":"Z2","name":"Zone 2","x":250,"y":0,"estimatedPopulation":300,"vulnerabilityWeight":1.2,"provenance":"illustrative","vulnerabilityBasis":"Synthetic test weight"},
    {"id":"Z3","name":"Zone 3","x":500,"y":0,"estimatedPopulation":380,"vulnerabilityWeight":1.6,"provenance":"illustrative","vulnerabilityBasis":"Synthetic test weight"},
    {"id":"Z4","name":"Zone 4","x":750,"y":0,"estimatedPopulation":260,"vulnerabilityWeight":1.4,"provenance":"illustrative","vulnerabilityBasis":"Synthetic test weight"},
    {"id":"Z5","name":"Zone 5","x":0,"y":250,"estimatedPopulation":220,"vulnerabilityWeight":2,"provenance":"illustrative","vulnerabilityBasis":"Synthetic test weight"},
    {"id":"Z6","name":"Zone 6","x":250,"y":250,"estimatedPopulation":450,"vulnerabilityWeight":1.3,"provenance":"illustrative","vulnerabilityBasis":"Synthetic test weight"},
    {"id":"Z7","name":"Zone 7","x":500,"y":250,"estimatedPopulation":320,"vulnerabilityWeight":1.9,"provenance":"illustrative","vulnerabilityBasis":"Synthetic test weight"},
    {"id":"Z8","name":"Zone 8","x":750,"y":250,"estimatedPopulation":360,"vulnerabilityWeight":1.5,"provenance":"illustrative","vulnerabilityBasis":"Synthetic test weight"}
  ],
  "sites": [
    {"id":"X1","name":"Example Existing Station 1","x":0,"y":0,"kind":"existing","status":"illustrative_existing","eligible":false,"costUnits":0,"provenance":"illustrative","verificationNote":"Fictional existing facility for demonstration"},
    {"id":"X2","name":"Example Existing Station 2","x":750,"y":250,"kind":"existing","status":"illustrative_existing","eligible":false,"costUnits":0,"provenance":"illustrative","verificationNote":"Fictional existing facility for demonstration"},
    {"id":"A","name":"Candidate A","x":100,"y":190,"kind":"candidate","status":"illustrative_candidate","eligible":true,"costUnits":1,"provenance":"illustrative","verificationNote":"Synthetic candidate; availability not confirmed"},
    {"id":"B","name":"Candidate B","x":250,"y":150,"kind":"candidate","status":"illustrative_candidate","eligible":true,"costUnits":1,"provenance":"illustrative","verificationNote":"Synthetic candidate; availability not confirmed"},
    {"id":"C","name":"Candidate C","x":500,"y":150,"kind":"candidate","status":"illustrative_candidate","eligible":true,"costUnits":1,"provenance":"illustrative","verificationNote":"Synthetic candidate; availability not confirmed"},
    {"id":"D","name":"Candidate D","x":750,"y":0,"kind":"candidate","status":"illustrative_candidate","eligible":true,"costUnits":1,"provenance":"illustrative","verificationNote":"Synthetic candidate; availability not confirmed"},
    {"id":"E","name":"Candidate E","x":380,"y":130,"kind":"candidate","status":"illustrative_candidate","eligible":true,"costUnits":2,"provenance":"illustrative","verificationNote":"Synthetic candidate; availability not confirmed"}
  ],
  "sourceManifest": [
    {"label":"All demand, geometry and facilities","type":"illustrative","sourceUrl":null,"note":"Purpose-built synthetic fixture for algorithm verification; NOT actual population or cooling center data."},
    {"label":"Nagpur regional weather","type":"modelled","sourceUrl":"https://open-meteo.com/en/docs","note":"Optional weather context; does not create street-level heat risk or modify fixture scores."}
  ]
}
```

---

## 9. UX and visual design specification: polished, clear, credible

**Design goal:** A professional municipal operations console that a judge understands within 10–15 seconds. Responsive, accessible, fast and visually memorable without decorative complexity.

### Main screen layout (desktop)

```text
┌────────────────────────────────────────────────────────────────────────────┐
│ HeatReach  / Community Cooling Access Planner     [Method] [Sources]     │
│ ILLUSTRATIVE SCENARIO — fictional locations, modeled residents & weights  │
├────────────────────────────────────────────────────────────────────────────┤
│ [Existing Access: 780] [Recommended Access: 2150] [Added Reach: 1370]    │
│ [Weighted Gain: 2241 points]  [Budget used: 2 / 2]                       │
├─────────────────┬──────────────────────────────────┬───────────────────────┤
│ Controls        │ Schematic Zone Map               │ Recommended Plan      │
│ Budget [2]      │                                  │ A + C                 │
│ Site cap [2]    │  8 labeled demand zones          │ Why these sites?      │
│ Radius [180 m]  │  Existing vs candidate vs        │ Remaining unserved    │
│ Site toggles    │  recommended clear legend        │ zones, sources        │
│ [Optimize]      │                                  │                       │
├─────────────────┴──────────────────────────────────┴───────────────────────┤
│ Optimized vs matched simple baseline | raw people | weighted reach       │
│ Regional weather context (optional, clearly sourced) | limits & privacy │
└────────────────────────────────────────────────────────────────────────────┘
```

### Core interactions and acceptance

1. Opening app on a fresh machine shows a purposeful loading state then the fixture and an **unmissable** `ILLUSTRATIVE • not real cooling facilities` banner. No login.
2. Users can change **budgetUnits** (integer), **maxNewSites** (integer), **radiusMeters** (number/slider), and eligibility of each candidate in one panel.
3. Click **Optimize Coverage** to generate a result; optionally auto-recompute on changes, but keep an obvious primary action for the demo. No stale contradictory metrics.
4. Show how many **existing** zones are served; add chosen candidates to map using a shape and outline distinct from current locations.
5. A selected candidate is labeled **“Proposed—not operational”**; an illustrative existing site is labeled **“Fictional existing example.”** These distinctions must survive color-blind view and map legend.
6. Show both **raw modeled population within radius** and **weighted access points** with tooltips. Include both baseline and optimized bars with correct units and explanatory labels.
7. “Why these sites?” reveals eligibility, coverage radius assumption, selected budget usage, demand zones served and noncovered zones.
8. “Data & assumptions” panel lists every input provenance and uncertainty; reference source URLs and provide transparent method description.
9. Weather is supplementary, explicitly **regional forecast** (Nagpur example). If weather unavailable, show **weather unavailable / frozen demo context** with timestamp; do not change optimizer result silently or invent values.
10. Support a **Reset example** button and optionally small shareable URL query params only for nonpersonal controls. Do not serialize private contacts or geolocation.
11. On mobile, stack controls → visual → results; horizontal scrolling avoided; labels sufficiently readable. For map inaccessible users, all information appears in an equivalent HTML table.
12. No hard-coded “improved 50%” badges or claims of people saved. Display calculated scenario results only.

### Design language

- Modern light-neutral dashboard with deep navy or charcoal text, muted teal for **selected proposal**, amber for **unserved demand**, and neutral slate for existing. Avoid alarmist red everywhere.
- Use typography scale: product name, strong metric values, descriptive captions. Clear 12-column or three-pane responsive layout.
- Buttons have focus rings, hover and disabled/loading states; semantic headings and form labels. Use SVG icons locally, not copyright-restricted images.
- Keep map legend sticky/visible, with textual status labels. Weather source and attribution visible near any weather data. Data banner visible above stats and on exported summary.
- No animation necessary beyond tasteful transitions; no inaccessible reliance on motion.

---

## 10. Weather integration contract (P1, nonblocking)

**Verified vendor docs:** https://open-meteo.com/en/docs and https://open-meteo.com/en/terms.

For a **region-level contextual weather card**, GET:

```text
https://api.open-meteo.com/v1/forecast?latitude=21.1458&longitude=79.0882&current=temperature_2m,relative_humidity_2m,apparent_temperature&timezone=Asia%2FKolkata
```

This URL is an **illustrative construction from documented parameter names**; test the actual response, CORS, schema and available values at runtime. No API key needed for allowed noncommercial usage; do not embed paid keys in browser builds.

Implement `getWeatherContext(location, {signal})`:

- Return discriminated union `{status:'live', fetchedAt, sourceUrl, locationLabel, temperatureC, apparentTemperatureC, relativeHumidity}` OR `{status:'unavailable', reason, lastKnown?:...}`.
- Abort timeout (e.g., 6 s), finite numeric parsing, error UI, no unhandled promises.
- Cache success locally with timestamp and re-fetch interval e.g., 30 minutes; clear status `cached` if displayed after expiration or network failure.
- Never label archived data live; if using sample weather fixture mark **simulated weather context**.
- Use Open-Meteo attribution and terms; do not imply precise block-by-block variation.
- **Forecast must not influence optimization scores in P0**: it is context only. The input synthetic zone weights are not derived from weather. In later scientific version, documented local evidence could justify additional weighting.
- Avoid making unverified “heatstroke risk” thresholds or medical warnings. If showing generic temperature interpretation, cite a reputable source and state forecasts are not personal diagnosis.

**If weather integration endangers deadline or stability, omit the card rather than blocking planning.**

---

## 11. Real pilot input path and provenance requirements (optional, not a blocker)

**Only enable a `verified-pilot` scenario when documentation supports every geographic assertion.** The illustrative scenario alone must work fully.

Potential sources for later data-informed work:

| Need | Candidate source | Known limit / required verification |
|---|---|---|
| Gridded population estimates | https://hub.worldpop.org/project/categories?id=3 | WorldPop publishes modeled rasters; downloading, cropping, unit handling and license attribution are additional work. Not directly verified for chosen local wards. |
| Indian 2020 gridded dataset example | https://hub.worldpop.org/geodata/summary?id=49804 | Large GeoTIFF dataset; values are estimates and may be outdated. Do not say census-confirmed 2026 residents. |
| Indian climate resilience policy | https://www.pib.gov.in/PressReleasePage.aspx?PRID=2293936&lang=1&reg=1 | Policy context, not a cooling-center site registry or local coverage proof. |
| Candidate buildings | Local campus administration / local government or directly verified facility descriptions | Must confirm permission, suitable indoor cooling/shade, accessibility, capacity where available, and hours. A tagged OSM building is NOT sufficient proof of availability. |
| Street network routes | Licensed pedestrian network / route API | Not in P0; straight-line radius is an explicitly labeled proxy. |
| Regional temperature | Open-Meteo | Forecast resolution cannot establish street temperatures or individual exposure. |

### Data verification workflow

1. Choose **one** small area only if real data can be sourced in time.
2. For every zone, document source URL, source year/date, estimate method, geographic resolution and any vulnerability-weight basis.
3. For every operational station, document site name/address, verification method, contact/hours/source date. **If not confirmed open, do not list as open.**
4. For each proposed candidate, document site owner permission status, accessibility, capacity unknown/known, suitability and proof. Do not route residents there.
5. If facilities lack evidence, retain illustrative mode. Do **not** quietly scrape random addresses and claim they are cooling centers.
6. Do not show a real Indian city map with fabricated facility markers. Only show geographic Leaflet view when coordinates and place assertions are properly sourced. Respect OSM tile policy: https://operations.osmfoundation.org/policies/tiles/.

The planning tool is a **research/demo decision aid**, not a safety-certified municipal operational system. Do not publish a generated plan as an instruction to deploy facilities without field checks.

---

## 12. Security, privacy, safety and accessibility: acceptance gates

- Store no resident names, phone numbers, emergency contact details, precise live movement traces, medical conditions or anonymous persistent IDs in P0.
- No SMS, automated dispatch, or automatic calls to national emergency services. If a future voluntary SOS is included, make it a manual action with truthful labeling and no claim of emergency service integration.
- No battery/phone-temperature feature and no accelerometer “heatstroke detection”. These are unreliable proxies for physiology.
- No secret keys in Git, `.env` pushed, or exposed cloud credentials. Do not use AWS root credentials for deployment.
- Avoid unsafe content and HTML injection: render imported labels as plain text; validate JSON; never use `dangerouslySetInnerHTML` for data.
- License dependencies and datasets, proper OSM attribution if geographic map enabled, Open-Meteo attribution when weather card enabled. Check current licenses before committing.
- Responsive and keyboard navigable; semantically labeled controls, not color-only status distinctions, clear contrast, reduced motion preference.
- Graceful failures: invalid file, zero budget, no sites, weather unavailable, map visualization error, empty scenario, huge cost, zero population, all candidates excluded. All return useful UI, not silent blank page.
- Include persistent disclaimer: “Planning prototype. Estimates and straight-line access proxies are not verified travel times or medical safety guidance.”

---

## 13. Automated testing contract — agent cannot claim done without it

Use Vitest and the canonical fixture. Required tests:

1. **Fixture golden test:** budget 2, radius 180, cap 2 returns `['A','C']`; existing raw `780`, optimized raw `2150`, baseline raw `1750`, incremental weighted `2241`, baseline weighted `1385`.
2. **Budget=1:** returns `['C']`, afterRawPeople `1480`.
3. **Budget=0:** no new sites, optimized raw equals existing raw.
4. **No overlap double count:** site A and B both cover Z6, count Z6 exactly once.
5. **Eligibility override:** making C unavailable prevents C selection; never select an excluded site.
6. **Budget below cheapest site:** empty solution.
7. **Site-count cap:** maxNewSites=0 produces empty solution even with large budget.
8. **Idempotency:** repeated runs with same input yield exact same sites/metrics and sorted IDs.
9. **Monotonicity:** with all other inputs unchanged, increasing budget does not reduce *optimal incremental weighted reach* (not necessarily raw people); increasing radius does not reduce optimum weighted reach.
10. **No simulated weather dependence:** weather request fails, optimizer still works identically.
11. **Validation:** reject duplicate IDs, negative population, negative budget, NaN weight, missing fields, invalid status-kind pairing, nonpositive radius.
12. **Tiny fixture tie-break:** equal gains choose larger raw access, then cheaper, then lexicographic IDs.
13. **UI core:** budget/eligibility edit → result updates and selected site status appears; clear illustration banner remains visible.
14. **Baseline fairness:** both plans obey identical site count/cost/radius; baseline does not exceed budget.
15. **Source audit:** UI includes “Illustrative” for fixture and “Proposed—not operational” for candidates.
16. **Safety label check:** no claims of real heatstroke detection, verified walking times or lives saved.
17. **Empty/degenerate cases:** no eligible candidates, all zones already covered, zero-population zones, unusually large allowed radius.

### Required commands and evidence

```bash
npm install
npm run test
npm run build
npm run dev
```

Add scripts for `typecheck` and `lint` if feasible; run them before release. Capture test counts/output and build result in final delivery message. If headless screenshot/browser testing is possible, test at least desktop and mobile sizes and save evidence under `docs/screenshots/` or equivalent. Do not claim tests executed if environment blocked installation.

---

## 14. Development phases and milestone gates (execute in order)

**Today is 11 October 2026, the listed final event day. The closing HOUR is not confirmed publicly. Treat deadline risk as critical.** Do not estimate available time without captain verification. The following are gates, not promises about duration.

### G0 — check current repository and operating environment

- Inspect existing files, branch, package manager, Node/npm versions, uncommitted edits and event-time repository history.
- Protect existing user work. Do not overwrite unrelated source. Never delete untracked files without permission.
- Set up a lightweight React/Vite TypeScript project if empty. Keep dependencies minimal.
- Confirm whether the actual submission cutoff is known to human. If unknown, flag immediately, **continue local build**.
- Check whether AWS access exists. Do not block local development if it doesn't.

### G1 — deterministic core

- Create all `types/` and `engine/` files in their permanent places.
- Copy and validate fixture; run exhaustive enumeration and matched baseline.
- Tests must reproduce canonical selected sites and outputs **before** designing chart visuals.
- Add robust guards for invalid data and no feasible site.

**G1 PASS:** canonical fixture tests green, pure engine independent of React.

### G2 — complete planner UI

- Implement scenario inputs, recommendation, basic schematic SVG, metrics, baseline comparison and provenance banner.
- Controls operate; recalculate on deliberate action. No hard-coded calculations.
- Provide reset, clear legend, explanatory labels and all core results on same page.

**G2 PASS:** fresh user can change budget 2→1 and understand why site recommendation changes.

### G3 — polish, weather, accessibility

- Responsive 375px/1280px layouts, keyboard usability and clear styled components.
- Optional nonblocking Open-Meteo card with attribution and cached/unavailable UI.
- Fix scenario metadata/explanation behavior and add methodology drawer.

**G3 PASS:** P0 works while network offline and all figures have accurate provenance labels.

### G4 — AWS deployment early

- `npm run build` produces `dist/`. Test preview locally.
- If AWS authenticated, deploy through Amplify Hosting (manual or repo connection) and obtain real public URL.
- Test from a private browser, refresh, reload and on mobile; confirm build folder/caches correctly configured.
- If AWS not authenticated, ship deploy-ready static artifact and exact instructions; mark **AWS DEPLOYMENT NOT YET COMPLETE** (contest risk).

**G4 PASS:** publicly accessible functional AWS URL or clearly documented external blocker.

### G5 — submission proof

- Create complete README, methodology, data/provenance docs, limitations, demo script, AI and license credits, screenshot list and submission checklist.
- Draft demo showing **the functioning AWS-hosted UI** and real dynamic changes (not static comps).
- Human submits YouTube URL and form; verify links without authentication.

**G5 PASS:** all submission artifacts ready, external account-dependent actions explicitly marked.

**Kill switches:** if missing cutoff, AWS inaccessible, or time pressure: stop P1 weather/geographical maps/export. Ship core exact planner + fixture + AWS + video before anything else. No new ML, backend or mobile sensors.

---

## 15. Deployment to AWS Amplify Hosting — precise steps

Primary documentation: https://docs.aws.amazon.com/amplify/latest/userguide/manual-deploys.html ; https://docs.amplify.aws/gen1/javascript/deploy-and-host/frameworks/deploy-vite-site/ ; https://docs.aws.amazon.com/amplify/latest/userguide/redirects.html.

### Deployment option A: manual from local Vite build (fastest)

1. Run `npm run test` and `npm run build`; ensure `dist/index.html`, CSS, JS assets exist.
2. AWS Console → **Amplify** → **Hosting** → create/deploy app → choose **Deploy without Git** / manual deployment according to current UI.
3. Zip the **contents of `dist`**, not a parent folder that would make `index.html` sit one directory too deep. Upload that ZIP.
4. Deploy, record assigned Amplify HTTPS URL and deployment timestamp.
5. Open URL in incognito browser and verify all controls/optimization; optional weather failure must not break core.
6. If SPA history routes are added, configure correct 200 rewrites to `/index.html` per AWS docs. Prefer one-page navigation so rewrites aren't required.
7. Capture a short screen recording/screenshot from Amplify console **and** show browser URL in demo. No fake AWS banners.

### Deployment option B: Git-connected Amplify

- Connect the team GitHub repository and deployed branch if permitted; set build command `npm ci && npm run build` (or valid supported equivalent) and output directory `dist`.
- Only use build config supported by current Amplify docs. Example for static Vite:

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: dist
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
```

- Do not assume AWS credentials or team GitHub OAuth authorization exists. Stop before changes requiring explicit billing/payment approval.
- Monitor estimated hosting spend and follow account billing safety guidance; “free-tier available” is not a guarantee of zero cost for all existing accounts.

### Expected deliverables from deployment

- Actual deployment URL, or a precise step-by-step pending state if blocked.
- `docs/DEPLOY_AWS.md` with paths, commands, screenshots and troubleshooting.
- Proof in video that AWS hosts the final working application.

---

## 16. Git, reproducibility, originality and licensing

- Initialize a **new repository or a new hackathon-compliant project**. Don't misrepresent this spec or earlier conceptual research as event-time source code.
- Use small meaningful commits after genuine implementation milestones; don't rewrite git history to falsify creation dates.
- Keep `README.md` instructions correct for Windows/macOS/Linux where practicable.
- Include `LICENSE` that team approves; otherwise add a clear `LICENSING_PENDING_TEAM_CHOICE` note rather than falsely attributing ownership of third-party code.
- Add `.gitignore` for `node_modules`, `dist`, `.env*` (except `.env.example`), IDE artifacts, debug logs.
- Document all API providers, dependencies, map attribution, synthetic example authorship and third-party licenses. Credit AI coding tools in `docs/AI_AND_ATTRIBUTION.md` and hackathon write-up.
- Don't invent public repo, deployed URL, YouTube link, teammate names or submission confirmation; leave clearly named placeholders until genuinely filled.

---

## 17. Demo script — aim for 2:45–2:55

| Time | On-screen action | Judges should understand |
|---|---|---|
| 00:00–00:17 | Explain communities lack cooling access; limited budget means choosing sites matters | Human impact and planner persona |
| 00:17–00:38 | Open **live Amplify URL**. Show big “Illustrative scenario” label, existing sites and zones | Honest data, working AWS-hosted product |
| 00:38–01:05 | Budget 2, 180 m; click optimize, show A + C and clear site eligibility constraints | Real solver, immediate result |
| 01:05–01:36 | Explain before raw access **780**, optimized **2,150**, simple baseline **1,750** for synthetic fixture | Comparative measurable output (not actual lives saved) |
| 01:36–02:04 | Change budget to 1; recommendation recalculates to C and after coverage to 1,480 | Dynamic, feasible and reproducible |
| 02:04–02:25 | Toggle candidate C unavailable and discuss how planning adapts | Practical constraints, not static dashboard |
| 02:25–02:39 | Open methodology/source panel; explain straight-line proxy vs walking routes | Engineering honesty and scientific limitations |
| 02:39–02:49 | Show AWS Amplify console proof + live site | Prize eligibility visibly demonstrated |
| 02:49–02:55 | Close with future verification/municipal pilot and strong concise tagline | Credible impact without overclaiming |

**IMPORTANT:** actual recorded video must be under three minutes on YouTube, public/unlisted, working while logged out. Humans must record/upload; a coding agent may prepare script and screen captures, not pretend the video is published.

### Core pitch

> “HeatReach doesn't just warn a community that it's hot. It helps a resource-constrained planner choose where new temporary cooling points could offer the greatest additional access. Our working prototype uses transparent vulnerability-weighted optimization, tests candidate eligibility and budget constraints, and shows the change against a simple baseline. The demonstration is explicitly illustrative, so no fictional cooling station is represented as a live facility. The finished planner is hosted on AWS Amplify.”

---

## 18. Readiness, risk and planned fallbacks

| Risk | Impact | Mitigation |
|---|---|---|
| Exact hackathon closing time unavailable publicly | CRITICAL | Captain checks logged-in portal now; do not assume midnight |
| AWS console credentials unavailable | CRITICAL to qualifying demo | Request authorized teammate to deploy zipped `dist` ASAP; local-only app is not sufficient for planned AWS-hosted eligibility |
| Geographic cooling facility data not verified | HIGH | Use **explicit fictional fixture** and SVG schematic; do not deceive with actual city tiles |
| Population weight validity | HIGH | All synthetic weights labeled assumptions; optional real pilot only with cited sources |
| Weather API is down | LOW to core | Hide/error weather context; optimizer remains stable |
| Solver wrong/double counts | HIGH | Golden fixture and exhaustive enumeration tests before UX styling |
| Site availability changes | Medium | Candidate eligibility toggle; excluded sites never selected |
| Raw access baseline sometimes better | Medium demo messaging | Explain weighted vs raw objective; do not promise untrue metric superiority |
| Accessibility to actual centers unknown | HIGH | Radius = straight-line proxy; never claim walkable routing |
| Extra features consume time | CRITICAL | Freeze P0, use kill switches, ship AWS and demo first |
| Automated emergency alerts unreliable | HIGH safety | Exclude all medical/dispatch claims from MVP |
| Same-event competitor doing heat planning | Medium | Distinguish with auditable *neighbourhood facility placement*; show exact testable solver + provenance |

### What must be proven vs what stays hypothetical

- **Proven:** code selects best feasible subset for a synthetic scenario; tests reproduce calculations; app runs in browser; AWS deployment if completed.
- **Modeled:** number of estimated persons falling within an explicitly assumed straight-line radius; aggregate vulnerability-weighted coverage points.
- **Hypothetical:** whether a recommended building would be available, actual pedestrian reach, true neighborhood heat risk, medically meaningful outcomes, uptake by officials, lives saved.

---

## 19. Judge Q&A: do not make unsupported claims

**Q: What makes it different from a weather map?**  
A: A weather map shows conditions. HeatReach recommends a feasible new set of cooling locations under real planner constraints and shows exactly whom the plan may newly reach.

**Q: Is facility-location optimization new?**  
A: No. The contribution is a transparent, source-aware and usable small-area workflow with interactive constraints and before/after evaluation; we do not claim mathematical invention.

**Q: Is this AI?**  
A: The P0 uses exact combinatorial optimization, not machine learning. For this constrained placement problem an inspectable solver is more reliable than gratuitous AI. Never brand it an AI heatstroke detector.

**Q: Are these real cooling centers?**  
A: No. The canonical benchmark is fictional and visibly labeled; candidate sites are proposals, not operational services. A real pilot requires formal verification and appropriate permissions.

**Q: Does 2,150 mean that many residents really gained access?**  
A: No, that is synthetic modeled population within a straight-line-radius proxy. The system demonstrates how the allocation decision works, not achieved field impact.

**Q: Is this true walking distance?**  
A: No; only schematic Euclidean distance. Accessible pedestrian-network distances require a sourced route graph and site validation.

**Q: What about equity?**  
A: The model transparently weights aggregate zones in the objective and reports raw reach alongside weighted access, so users can see trade-offs and sensitivity. We don't infer individuals' health conditions.

**Q: Why does the forecast not adjust the neighborhood score?**  
A: A regional forecast does not distinguish block-specific exposure; we avoid false precision until better local inputs exist.

**Q: Where is AWS?**  
A: Amplify Hosting serves the working interactive app at the publicly verified URL shown in the demo.

**Q: Can this detect fainting / send an ambulance?**  
A: No, and it deliberately makes no unsupported safety claims. Medical detection and dispatch are excluded from this prototype.

---

## 20. Required documentation generated inside project

The coding agent must write these real files, not leave empty placeholders:

- `README.md`: purpose, 60-second explanation, accurate screenshots if captured, prerequisites, install/run/build/test, architecture, dataset disclaimer, AWS role, online URL **only if real**, references, credits, feature scope and limitations.
- `docs/METHODOLOGY.md`: equation, objective, constraint, covered-zone union, sample fixture, deterministic tie-break, baseline methodology and computation complexity.
- `docs/DATA_PROVENANCE.md`: provenance of every static input, synthetic vs verified vs modelled definitions, weather source and license, claim limitations.
- `docs/LIMITATIONS.md`: synthetic geometries, proxy distances, facility verification missing, individual risk unknowable, real impact unmeasured.
- `docs/DEMO_SCRIPT.md`: final under-three-minute demo storyboard and exact steps, scripts matched to actual implemented functionality.
- `docs/DEPLOY_AWS.md`: build and manual/Git deployment, AWS proof requirements, actual URL or honest pending marker.
- `docs/SUBMISSION_CHECKLIST.md`: repo, YouTube, write-up, AWS URL, deadline, member eligibility and confirmation receipts.
- `docs/AI_AND_ATTRIBUTION.md`: tool use disclosure, libraries, map provider/weather/data licenses, artwork rights, source citations.
- `LICENSE`: team-approved or a clearly documented choice outstanding (avoid false license assertions).

### Draft hackathon submission blurb (adapt once build exists)

**Problem:** During heatwaves, decision-makers may have insufficient cooling facilities and limited resources, yet cannot readily see which proposed temporary locations would increase estimated access for underserved communities most effectively.  
**Solution:** HeatReach is a responsive cooling-access planner that combines area-level illustrative/modelled demand with eligible candidate facilities and user-selected resource limits. Its exact, transparent solver generates a budget-feasible site selection, compares it with a simple baseline and explains coverage trade-offs.  
**AWS:** The working React web application is deployed with AWS Amplify Hosting [insert verified URL].  
**Integrity note:** Demonstrated location, population, and facility input values are synthetic unless explicitly verified; estimated straight-line access is not real-world health impact.  
**Tools/credits:** [list actual tools and dependencies used].

---

## 21. Autonomous agent operating instructions

1. **Read this entire spec and fixture before editing.** This file is the single source of truth. If another previous plan conflicts, prefer this newer, narrower P0; retain the core HeatReach idea.
2. **Inspect repository and operating environment.** If there is user code already present, adapt safely; do not remove work or assume a blank directory.
3. **Implement now.** Create final folders first; do not answer with an implementation plan only. Use conventional, maintainable TS and React; no gratuitous abstractions.
4. **Treat externally verified constraints as blockers only for their specific external tasks.** If AWS isn't connected, implement and test everything local, and produce exact human deployment steps. Do not forge output.
5. **Prioritize:** correctness > honest data/provenance > working UI > live AWS deployment > polish > optional features. Under time pressure, deployment and demo readiness rise above optional polish.
6. **Run and repair:** execute tests and production build after meaningful milestones. Inspect screenshot/browser output where available. Fix failures rather than reporting known broken features as complete.
7. **No hard-coded results:** expected metric figures are tests; UI must derive them from scenario & chosen constraints.
8. **No fake real-world claims or undeclared automation:** never claim the product saves lives, detects heatstroke or has actual cooling station inventory unless field verified.
9. **External credentials:** never ask for AWS access keys or passwords to be pasted in chat or committed. Use existing authorized local credentials/profile or guide user to console.
10. **Do not halt for discretionary questions:** use the defaults specified. Ask only if a truly blocking legal/account choice must be made and otherwise continue implementation.
11. **When finished, include an execution report with:**
    - Project file tree and key modules implemented
    - Exact local launch/test/build commands and their actual outcomes
    - Confirmation that fixture golden values match
    - AWS URL and deployment proof **if genuinely deployed**, otherwise `PENDING AUTHORIZED AWS ACCOUNT`
    - Screenshots/preview if tools allow
    - Known limitations and incomplete P1/P2 items
    - Human steps required for public GitHub, YouTube upload, portal submission and student verification
12. **Final stopping condition:** local app runs, optimizer is correct, tests pass, production build works, docs complete, deployment attempted/achieved if authorized, no safety/provenance violations, and the team can record the planned under-three-minute video without editing code.

---

## 22. Reference links with verification scope

These sources were reviewed for specification decisions on 11 October 2026; review again if deployment/API UI has changed.

1. Official event overview and **judging categories:** https://www.wemakedevs.org/aws/env
2. Official rules, eligibility, originality, AWS proof, repository, video and write-up: https://www.wemakedevs.org/aws/env/rules
3. Official schedule; exact closing **hour not yet published publicly** on last check: https://www.wemakedevs.org/aws/env/schedule
4. AWS Amplify manual static hosting: https://docs.aws.amazon.com/amplify/latest/userguide/manual-deploys.html
5. AWS Amplify Vite deploy and build output `dist`: https://docs.amplify.aws/gen1/javascript/deploy-and-host/frameworks/deploy-vite-site/
6. AWS SPA redirect rules: https://docs.aws.amazon.com/amplify/latest/userguide/redirects.html
7. Open-Meteo forecast weather parameters: https://open-meteo.com/en/docs
8. Open-Meteo free API usage / attribution terms: https://open-meteo.com/en/terms
9. WorldPop population-grid data categories: https://hub.worldpop.org/project/categories?id=3
10. Example India 2020 WorldPop grid: https://hub.worldpop.org/geodata/summary?id=49804
11. India government heatwave urban resilience press release: https://www.pib.gov.in/PressReleasePage.aspx?PRID=2293936&lang=1&reg=1
12. Research precedent on cooling center access/location across 81 cities: https://pmc.ncbi.nlm.nih.gov/articles/PMC10576472/
13. OpenStreetMap public tile usage and credit requirements: https://operations.osmfoundation.org/policies/tiles/

**What these sources do NOT establish:** that the team is eligible, that a given cooling station exists or is open, that a particular site can be used, that a population grid measures individual vulnerability, that the app has been deployed, that the exact submission cutoff is known, or that an invented site-selection approach is globally novel.

---

## 23. End-of-run acceptance matrix — REQUIRED

Before reporting success, evaluate and truthfully fill out:

| Test | PASS / FAIL / BLOCKED | Evidence |
|---|---|---|
| Repo created in intended architecture | | |
| Fixture loaded & clearly labeled synthetic | | |
| Exact optimizer reproducibly chooses A+C for benchmark | | |
| Golden metrics 780 / 2,150 / 1,750 / 2,241 / 1,385 reproduced | | |
| Budget 1 chooses C | | |
| Eligibility toggle changes site selection | | |
| No overlapping population double counting | | |
| Baseline uses same budget and radius | | |
| Map and table agree on selected/covered states | | |
| Provenance and limitations visible in app | | |
| React UI works at desktop and mobile size | | |
| All required tests executed successfully | | |
| Production `npm run build` succeeded | | |
| AWS Amplify HTTPS deployment verified | | |
| Repository public, accurate git history | | |
| Short YouTube demo uploaded and verified | | |
| Submission form completed before cutoff | | |
| All external source, library, AI tool credits recorded | | |

For any row that can't be completed without the team's authenticated accounts, write **BLOCKED — HUMAN ACTION REQUIRED**, with the exact next action. **Never fabricate a PASS.**

**END OF MASTER SPEC. Begin implementation now.**
