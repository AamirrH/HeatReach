# HeatReach methodology

## Geometry and coverage

The fixture uses a fictional local plane in meters. Distance is `Math.hypot(zone.x - site.x, zone.y - site.y)`. A zone is reached when distance is at most `radius + 1e-9`. Each demand zone is an aggregate point, so its entire estimated population enters or leaves the proxy together. No street network or travel time is inferred.

Existing coverage is the union of active existing-site coverage sets. In illustrative mode only `illustrative_existing` sites qualify; in verified-pilot mode only `verified_open` sites qualify. Unavailable facilities are excluded. The shipped application enables only the illustrative fixture; parsing support is not a verified-pilot launch.

For selected candidates S, after-coverage = existing union coverage(S). Newly covered = after minus existing. Raw reach sums estimated population once per covered zone. Weighted reach sums population × documented vulnerability weight once per covered zone. Weighted points are not people.

## Objective and feasibility

Maximize `sum(population[z] * weight[z])` over newly covered zones. Only eligible candidates that are not unavailable may be selected. Total cost must not exceed budget, and candidate count must not exceed the site cap. The empty subset is feasible. Costs must be strictly positive for candidates. Budget comparison is strict; the geometric and objective epsilon never authorize overspending.

The engine validates input and precomputes per-site coverage sets, then enumerates every eligible candidate subset (at most 4,096 for 12 candidates). Domain input permits finite nonnegative fractional budgets for testable generality. The shipped demo UI accepts integer budgets 0–20, integer site caps 0–12 and radius 50–1,000 m. Invalid controls show an error and hide calculated results, rather than substituting data silently.

Tie order: greater additional weighted reach (differences within 1e-9 considered equal), greater total raw coverage, lower cost, then lexicographically smaller sorted site-ID list. Comparison uses code-unit ID order, independent of browser locale. Arrays are sorted, the solver never mutates the scenario, and results are deterministic. Only display formatting rounds to two decimals.

Approximate complexity is `O(2^n * (n*z + z))`, with `O(n*z)` precomputed membership storage, for n candidates and z zones. Runtime validation caps n at 12 and z at 20. A test exercises this maximum under a 1.5-second bound on the execution machine; it is not a universal device performance guarantee.

## Baseline and explanations

“First-eligible simple baseline (illustrative)” scans eligible candidates in ascending ID order and adds each if both remaining budget and site-count cap permit, regardless of overlap or benefit. It uses exactly the same scenario, existing coverage, radius and coverage evaluator as the optimizer. It is a simple comparator, not a model of professional municipal decisions.

For explanations, iterate selected IDs in ascending order, beginning with existing coverage. Each site's marginal new zones exclude all already counted zones. Marginal weighted gains therefore sum to total additional weighted reach. This is an order-dependent accounting explanation, not causal attribution.

## Canonical calculation

Existing sites X1 and X2 cover Z1 and Z8: 420 + 360 = 780 raw; weighted 756 + 540 = 1,296.

At radius 180 and budget/cap 2, A adds Z5 and Z6: raw 220 + 450 = 670, weighted 440 + 585 = 1,025. C adds Z3 and Z7: raw 380 + 320 = 700, weighted 608 + 608 = 1,216. Total after = 780 + 670 + 700 = 2,150. Additional weighted = 1,025 + 1,216 = 2,241. Z2 and Z4 remain outside reach.

The A+B baseline adds Z2, Z5 and Z6, counting shared Z6 once: raw total 1,750; weighted gain 360 + 440 + 585 = 1,385. Optimizer differences: 400 raw and 856 weighted points. At budget 1, C yields raw total 1,480. These are synthetic calculations, not field impact.

## Correction to the requested monotonicity test

Increasing budget cannot reduce optimal additional weighted reach because the feasible set only grows. Increasing radius cannot reduce optimal **total** weighted coverage. However, additional gain is measured relative to existing facilities whose own coverage also grows. Consequently, additional gain can decrease as radius increases: this fixture has gain 2,241 at 180 m but 0 at 1,000 m, where existing facilities already cover all zones. Tests assert the mathematically correct properties and this counterexample. Raw population also need not dominate the baseline when the objective is weighted reach.
