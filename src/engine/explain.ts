import type { Scenario } from '../types/domain';
import { compareIds, coverageContext, totals } from './coverage';
export function explainSelection(s: Scenario, ids: string[]) {
  const { bySite, before } = coverageContext(s);
  return [...ids].sort(compareIds).map(siteId => {
    const added = new Set([...bySite.get(siteId)!].filter(id => !before.has(id)));
    added.forEach(id => before.add(id));
    return { siteId, newZoneIds: [...added].sort(compareIds), marginalWeightedReach: totals(s, added).weighted };
  });
}
