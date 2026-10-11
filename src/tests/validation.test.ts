import { expect, it } from 'vitest';
import fixture from '../../public/fixtures/illustrative_district.json';
import { controlsSchema, parseScenario } from '../engine/validation';
it.each([
  (s: any) => { s.zones[1].id = s.zones[0].id; },
  (s: any) => { s.zones[0].estimatedPopulation = -1; },
  (s: any) => { s.budgetUnits = -1; },
  (s: any) => { s.zones[0].vulnerabilityWeight = NaN; },
  (s: any) => { delete s.zones[0].name; },
  (s: any) => { s.sites[0].status = 'illustrative_candidate'; },
  (s: any) => { s.radiusMeters = 0; },
  (s: any) => { s.sites[2].costUnits = 0; },
  (s: any) => { s.sites[0].x = Infinity; },
  (s: any) => { s.maxNewSites = 1.5; },
  (s: any) => { s.sourceManifest[0].sourceUrl = 'javascript:alert(1)'; },
  (s: any) => { s.sites.push(...Array.from({ length: 8 }, (_, i) => ({ ...s.sites[2], id: `extra${i}` }))); },
])('rejects malformed scenarios %#', mutate => { const s = structuredClone(fixture); mutate(s); expect(() => parseScenario(s)).toThrow(); });
it('rejects invalid UI bounds without silent substitution', () => { expect(controlsSchema.safeParse({ budgetUnits: 21, maxNewSites: 0, radiusMeters: 180 }).success).toBe(false); });
