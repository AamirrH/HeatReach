import { expect, it } from "vitest";
import fixture from "../../public/fixtures/illustrative_district.json";
import { parseScenario } from "../engine/validation";
import { optimize } from "../engine/optimize";
import { evaluateCoverage } from "../engine/coverage";
it("counts overlapping Z6 only once", () => {
  const s = parseScenario(fixture),
    r = evaluateCoverage(
      s,
      s.sites.filter((p) => ["A", "B"].includes(p.id)),
    );
  expect(r.afterRawPeople).toBe(1750);
  expect(r.afterCoveredZoneIds.filter((id) => id === "Z6")).toHaveLength(1);
});
it("baseline respects the same availability, budget, cap and radius", () => {
  for (const budgetUnits of [0, 0.5, 1, 2, 5])
    for (const maxNewSites of [0, 1, 2, 5])
      for (const radiusMeters of [50, 180, 1000]) {
        const s = parseScenario(fixture);
        s.sites.find((p) => p.id === "B")!.eligible = false;
        Object.assign(s, { budgetUnits, maxNewSites, radiusMeters });
        const r = optimize(s),
          b = r.baseline;
        expect(b.totalCostUnits).toBeLessThanOrEqual(budgetUnits);
        expect(b.selectedSiteIds.length).toBeLessThanOrEqual(maxNewSites);
        expect(b.selectedSiteIds).not.toContain("B");
        expect(b).toEqual(
          evaluateCoverage(
            s,
            s.sites.filter((p) => b.selectedSiteIds.includes(p.id)),
          ),
        );
        expect(r.incrementalWeightedReach).toBeGreaterThanOrEqual(
          b.incrementalWeightedReach - 1e-9,
        );
      }
});
