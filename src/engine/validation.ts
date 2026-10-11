import { z } from 'zod';
import type { Scenario } from '../types/domain';
const number = z.number().finite();
const text = z.string().trim().min(1);
const provenance = z.enum(['illustrative', 'modelled', 'verified']);
const point = { id: text, name: text, x: number, y: number, provenance };
export const controlsSchema = z.object({ budgetUnits: number.min(0).max(20), maxNewSites: number.int().min(0).max(12), radiusMeters: number.min(50).max(1000) });
const site = z.object({ ...point, kind: z.enum(['existing', 'candidate']), status: z.enum(['illustrative_existing', 'illustrative_candidate', 'verified_open', 'eligible_candidate', 'unavailable']), eligible: z.boolean(), costUnits: number.nonnegative(), verificationNote: text }).superRefine((s, ctx) => {
  const allowed = s.kind === 'existing' ? ['illustrative_existing', 'verified_open', 'unavailable'] : ['illustrative_candidate', 'eligible_candidate', 'unavailable'];
  if (!allowed.includes(s.status)) ctx.addIssue({ code: 'custom', message: 'Status does not match site kind', path: ['status'] });
  if (s.kind === 'candidate' && s.costUnits <= 0) ctx.addIssue({ code: 'custom', message: 'Candidate cost must be positive', path: ['costUnits'] });
});
export const scenarioSchema = z.object({
  id: text, name: text, mode: z.enum(['illustrative', 'verified-pilot']), description: text, coordinateSystem: z.literal('local-meters'), dataAsOf: z.iso.date(),
  radiusMeters: number.positive(), budgetUnits: number.nonnegative(), maxNewSites: number.int().min(0).max(12),
  zones: z.array(z.object({ ...point, estimatedPopulation: number.nonnegative(), vulnerabilityWeight: number.min(1).max(2), vulnerabilityBasis: text })).max(20),
  sites: z.array(site),
  weatherLocation: z.object({ label: text, latitude: number.min(-90).max(90), longitude: number.min(-180).max(180) }).optional(),
  sourceManifest: z.array(z.object({ label: text, type: provenance, sourceUrl: z.url().refine(url => /^https?:\/\//.test(url), 'Only HTTP(S) source links allowed').nullable(), note: text })).min(1),
}).superRefine((s, ctx) => {
  const ids = [...s.zones, ...s.sites].map(p => p.id);
  if (new Set(ids).size !== ids.length) ctx.addIssue({ code: 'custom', message: 'Zone and site IDs must be globally unique' });
  if (s.sites.filter(p => p.kind === 'candidate').length > 12) ctx.addIssue({ code: 'custom', message: 'Exact planner supports at most 12 candidates' });
  if (!Number.isFinite(s.zones.reduce((sum, p) => sum + p.estimatedPopulation * p.vulnerabilityWeight, 0))) ctx.addIssue({ code: 'custom', message: 'Population totals overflow' });
  for (const p of s.sites) {
    if (s.mode === 'illustrative' && ['verified_open', 'eligible_candidate'].includes(p.status)) ctx.addIssue({ code: 'custom', message: 'Illustrative scenario cannot assert verified facilities' });
    if (s.mode === 'verified-pilot' && p.status.startsWith('illustrative')) ctx.addIssue({ code: 'custom', message: 'Verified pilot cannot contain illustrative facilities' });
    if (p.status === 'verified_open' && p.provenance !== 'verified') ctx.addIssue({ code: 'custom', message: 'Open facilities require verified provenance' });
  }
});
export function parseScenario(input: unknown): Scenario { return scenarioSchema.parse(input); }
export function errorMessage(error: unknown): string {
  return error instanceof z.ZodError ? error.issues.map(i => `${i.path.join('.') || 'Scenario'}: ${i.message}`).join('; ') : error instanceof Error ? error.message : 'Unable to load scenario';
}
