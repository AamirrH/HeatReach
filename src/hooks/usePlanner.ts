import { useMemo, useState } from 'react';
import type { PlanningControls, Scenario } from '../types/domain';
import { controlsSchema } from '../engine/validation';
import { optimize } from '../engine/optimize';
export function usePlanner(initial: Scenario) {
  const defaults = { budgetUnits: String(initial.budgetUnits), radiusMeters: String(initial.radiusMeters), maxNewSites: String(initial.maxNewSites) };
  const [draft, setDraft] = useState(defaults);
  const [excluded, setExcluded] = useState<string[]>([]);
  const [announcement, setAnnouncement] = useState('');
  const parsed = controlsSchema.safeParse(Object.fromEntries(Object.entries(draft).map(([k, v]) => [k, v.trim() === '' ? NaN : Number(v)])));
  const errors = parsed.success ? [] : parsed.error.issues.map(i => `${String(i.path[0])}: ${i.message}`);
  if (parsed.success && !Number.isInteger(parsed.data.budgetUnits)) errors.push('Budget must be a whole number of illustrative units.');
  const valid = parsed.success && errors.length === 0;
  const scenario = useMemo(() => ({ ...initial, ...(parsed.success ? parsed.data : {}), sites: initial.sites.map(p => ({ ...p, eligible: p.eligible && !excluded.includes(p.id) })) }), [initial, draft.budgetUnits, draft.maxNewSites, draft.radiusMeters, excluded]);
  const result = useMemo(() => valid ? optimize(scenario) : null, [scenario, valid]);
  return { draft, errors, scenario, result, announcement,
    change: (key: keyof PlanningControls, value: string) => { setDraft(d => ({ ...d, [key]: value })); setAnnouncement(''); },
    toggle: (id: string) => { setExcluded(ids => ids.includes(id) ? ids.filter(x => x !== id) : [...ids, id]); setAnnouncement(''); },
    reset: () => { setDraft(defaults); setExcluded([]); setAnnouncement('Example reset to budget 2, radius 180 meters and all eligible candidates.'); },
    run: () => setAnnouncement(result ? `Plan recalculated. Selected ${result.selectedSiteIds.join(' and ') || 'no new sites'}. Modelled access: ${result.afterRawPeople}.` : 'Correct the planning inputs to calculate coverage.'),
  };
}
