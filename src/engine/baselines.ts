import type { CoolingSite, Scenario } from "../types/domain";
import { eligibleCandidates, evaluateCoverage } from "./coverage";
export function firstEligibleBaseline(s: Scenario) {
  const selected: CoolingSite[] = [];
  let cost = 0;
  for (const p of eligibleCandidates(s))
    if (
      selected.length < s.maxNewSites &&
      cost + p.costUnits <= s.budgetUnits
    ) {
      selected.push(p);
      cost += p.costUnits;
    }
  return evaluateCoverage(s, selected);
}
