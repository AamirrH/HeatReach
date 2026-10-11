import type { PlanResult, Scenario } from '../types/domain';
import { formatNumber as n } from '../data/provenance';
export function MetricsStrip({ result: r, scenario: s }: { result: PlanResult; scenario: Scenario }) {
  const items = [ ['Existing access', n(r.beforeRawPeople), `${r.beforeCoveredZoneIds.length} zones within radius`], ['Recommended access', n(r.afterRawPeople), 'Modelled people within radius'], ['Additional access', `+${n(r.newRawPeople)}`, 'Previously unserved modelled people'], ['Weighted gain', n(r.incrementalWeightedReach), 'Access points · not people'], ['Budget used', `${n(r.totalCostUnits)} / ${n(s.budgetUnits)}`, `${r.selectedSiteIds.length} of ${s.maxNewSites} allowed sites`] ];
  return <section className="metrics" aria-label="Modelled coverage metrics">{items.map(([label, value, detail], i) => <div className={`metric metric-${i}`} key={label}><span>{label}</span><strong>{value}</strong><small>{detail}</small></div>)}</section>;
}
