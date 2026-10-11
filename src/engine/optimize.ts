import type { CoverageMetrics, PlanResult, PlanningControls, Scenario } from '../types/domain';
import { parseScenario } from './validation';
import { compareIds, coverageContext, eligibleCandidates, evaluateCoverage } from './coverage';
import { EPSILON } from './geometry';
import { firstEligibleBaseline } from './baselines';
import { explainSelection } from './explain';
function lexicographic(a: string[], b: string[]): number {
  for (let i = 0; i < Math.min(a.length, b.length); i++) { const cmp = compareIds(a[i], b[i]); if (cmp) return cmp; }
  return a.length - b.length;
}
function better(a: CoverageMetrics, b: CoverageMetrics) {
  const weighted = a.incrementalWeightedReach - b.incrementalWeightedReach;
  if (Math.abs(weighted) > EPSILON) return weighted > 0;
  if (a.afterRawPeople !== b.afterRawPeople) return a.afterRawPeople > b.afterRawPeople;
  if (a.totalCostUnits !== b.totalCostUnits) return a.totalCostUnits < b.totalCostUnits;
  return lexicographic(a.selectedSiteIds, b.selectedSiteIds) < 0;
}
export function optimize(input: Scenario, overrides: Partial<PlanningControls> = {}): PlanResult {
  const s = parseScenario({ ...input, ...overrides });
  const candidates = eligibleCandidates(s), context = coverageContext(s);
  let best = evaluateCoverage(s, [], context);
  for (let mask = 1; mask < 2 ** candidates.length; mask++) {
    const selected = candidates.filter((_, i) => (mask & (1 << i)) !== 0);
    if (selected.length > s.maxNewSites || selected.reduce((sum, p) => sum + p.costUnits, 0) > s.budgetUnits) continue;
    const plan = evaluateCoverage(s, selected, context);
    if (better(plan, best)) best = plan;
  }
  const warnings = ['Straight-line radius is an access proxy, not a verified walking route.'];
  if (!best.selectedSiteIds.length) warnings.push('No additional weighted access is feasible under the current budget, site cap, radius and availability.');
  if (!s.zones.length) warnings.push('This scenario has no demand zones.');
  return { ...best, baseline: firstEligibleBaseline(s), explanations: explainSelection(s, best.selectedSiteIds), warnings };
}
