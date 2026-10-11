import { expect, it } from 'vitest';
import fixture from '../../public/fixtures/illustrative_district.json';
import { parseScenario } from '../engine/validation';
import { optimize } from '../engine/optimize';
import type { Scenario } from '../types/domain';
const scenario = () => parseScenario(fixture);
it.each([{ budgetUnits: 0 }, { budgetUnits: 0.5 }, { maxNewSites: 0 }])('handles empty feasible selection %j', overrides => { const r = optimize(scenario(), overrides); expect(r.selectedSiteIds).toEqual([]); expect(r.afterRawPeople).toBe(r.beforeRawPeople); });
it('excludes ineligible and unavailable sites independently', () => {
  for (const field of ['eligible', 'status']) { const s = scenario(), c = s.sites.find(p => p.id === 'C')!; if (field === 'eligible') c.eligible = false; else c.status = 'unavailable'; expect(optimize(s).selectedSiteIds).not.toContain('C'); }
});
it('is deterministic and does not mutate input', () => { const s = scenario(), copy = structuredClone(s); expect(optimize(s)).toEqual(optimize(s)); expect(s).toEqual(copy); });
it('budget increases cannot reduce optimal weighted gain', () => { let last = 0; for (let b = 0; b <= 8; b++) { const r = optimize(scenario(), { budgetUnits: b }); expect(r.incrementalWeightedReach).toBeGreaterThanOrEqual(last); last = r.incrementalWeightedReach; } });
it('radius increases cannot reduce optimal total weighted coverage', () => { let last = 0; for (const radiusMeters of [50, 120, 180, 250, 500, 1000]) { const r = optimize(scenario(), { radiusMeters }); expect(r.afterWeightedReach).toBeGreaterThanOrEqual(last); last = r.afterWeightedReach; } });
it('additional reach may decrease as existing coverage grows with radius', () => { expect(optimize(scenario(), { radiusMeters: 1000 }).incrementalWeightedReach).toBe(0); expect(optimize(scenario()).incrementalWeightedReach).toBe(2241); });
it.each(['no candidates', 'all covered', 'zero population', 'empty zones'])('handles %s', kind => {
  const s = scenario();
  if (kind === 'no candidates') s.sites.forEach(p => p.eligible = false);
  if (kind === 'all covered') s.radiusMeters = 1000;
  if (kind === 'zero population') s.zones.forEach(z => z.estimatedPopulation = 0);
  if (kind === 'empty zones') s.zones = [];
  const r = optimize(s); expect(r.selectedSiteIds).toEqual([]); expect(r.incrementalWeightedReach).toBe(0);
});
function tiny(): Scenario {
  const s = scenario(); s.sites = s.sites.filter(p => ['A', 'B'].includes(p.id)); s.radiusMeters = 50; s.budgetUnits = 2; s.maxNewSites = 1;
  s.zones = s.zones.slice(0, 2).map((z, i) => ({ ...z, x: i * 500, y: 0, estimatedPopulation: 100, vulnerabilityWeight: 1 }));
  s.sites = s.sites.map((p, i) => ({ ...p, x: i * 500, y: 0 })); return s;
}
it('breaks equal weighted gains by greater raw access', () => { const s = tiny(); s.zones[0].estimatedPopulation = 50; s.zones[0].vulnerabilityWeight = 2; expect(optimize(s).selectedSiteIds).toEqual(['B']); });
it('breaks equal access by lower cost', () => { const s = tiny(); s.sites[0].costUnits = 2; expect(optimize(s).selectedSiteIds).toEqual(['B']); });
it('breaks final ties lexicographically, independent of input order', () => { const s = tiny(); s.sites.reverse(); expect(optimize(s).selectedSiteIds).toEqual(['A']); });
it('finishes 12 candidates and 20 zones within an interactive bound', () => {
  const s = scenario();
  for (let i = 0; i < 7; i++) s.sites.push({ ...s.sites[2], id: `P${i}`, x: i * 100 });
  for (let i = 0; i < 12; i++) s.zones.push({ ...s.zones[0], id: `Q${i}`, x: i * 80 });
  s.budgetUnits = 20; s.maxNewSites = 12;
  const start = performance.now(); const r = optimize(s); expect(r.totalCostUnits).toBeLessThanOrEqual(20); expect(performance.now() - start).toBeLessThan(1500);
});
