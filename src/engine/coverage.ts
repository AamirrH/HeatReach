import type { CoolingSite, CoverageMetrics, Scenario } from "../types/domain";
import { withinRadius } from "./geometry";
export const compareIds = (a: string, b: string) =>
  a < b ? -1 : a > b ? 1 : 0;
export const eligibleCandidates = (s: Scenario) =>
  s.sites
    .filter(
      (p) => p.kind === "candidate" && p.eligible && p.status !== "unavailable",
    )
    .sort((a, b) => compareIds(a.id, b.id));
export const existingSites = (s: Scenario) =>
  s.sites.filter(
    (p) =>
      p.kind === "existing" &&
      p.status ===
        (s.mode === "illustrative" ? "illustrative_existing" : "verified_open"),
  );
export const siteCoverage = (s: Scenario, p: CoolingSite) =>
  new Set(
    s.zones.filter((z) => withinRadius(z, p, s.radiusMeters)).map((z) => z.id),
  );
export function coverageContext(s: Scenario) {
  const bySite = new Map(s.sites.map((p) => [p.id, siteCoverage(s, p)]));
  const before = new Set(
    existingSites(s).flatMap((p) => [...bySite.get(p.id)!]),
  );
  return { bySite, before };
}
export function totals(s: Scenario, ids: Set<string>) {
  return s.zones.reduce(
    (a, z) =>
      ids.has(z.id)
        ? {
            raw: a.raw + z.estimatedPopulation,
            weighted:
              a.weighted + z.estimatedPopulation * z.vulnerabilityWeight,
          }
        : a,
    { raw: 0, weighted: 0 },
  );
}
export function evaluateCoverage(
  s: Scenario,
  selected: CoolingSite[],
  context = coverageContext(s),
): CoverageMetrics {
  const after = new Set(context.before);
  selected.forEach((p) =>
    context.bySite.get(p.id)?.forEach((id) => after.add(id)),
  );
  const added = new Set([...after].filter((id) => !context.before.has(id)));
  const beforeTotals = totals(s, context.before),
    afterTotals = totals(s, after),
    newTotals = totals(s, added);
  return {
    selectedSiteIds: selected.map((p) => p.id).sort(compareIds),
    beforeCoveredZoneIds: [...context.before].sort(compareIds),
    afterCoveredZoneIds: [...after].sort(compareIds),
    newlyCoveredZoneIds: [...added].sort(compareIds),
    stillUncoveredZoneIds: s.zones
      .filter((z) => !after.has(z.id))
      .map((z) => z.id)
      .sort(compareIds),
    beforeRawPeople: beforeTotals.raw,
    afterRawPeople: afterTotals.raw,
    newRawPeople: newTotals.raw,
    beforeWeightedReach: beforeTotals.weighted,
    afterWeightedReach: afterTotals.weighted,
    incrementalWeightedReach: newTotals.weighted,
    totalCostUnits: selected.reduce((sum, p) => sum + p.costUnits, 0),
  };
}
