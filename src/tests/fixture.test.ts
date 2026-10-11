import { describe, expect, it } from "vitest";
import fixture from "../../public/fixtures/illustrative_district.json";
import { parseScenario } from "../engine/validation";
import { optimize } from "../engine/optimize";
describe("canonical fixture", () => {
  it("reproduces every golden result", () => {
    const r = optimize(parseScenario(fixture));
    expect(r.selectedSiteIds).toEqual(["A", "C"]);
    expect(r.beforeCoveredZoneIds).toEqual(["Z1", "Z8"]);
    expect(r.newlyCoveredZoneIds).toEqual(["Z3", "Z5", "Z6", "Z7"]);
    expect(r.beforeRawPeople).toBe(780);
    expect(r.afterRawPeople).toBe(2150);
    expect(r.incrementalWeightedReach).toBe(2241);
    expect(r.baseline.selectedSiteIds).toEqual(["A", "B"]);
    expect(r.baseline.afterRawPeople).toBe(1750);
    expect(r.baseline.incrementalWeightedReach).toBe(1385);
    expect(r.afterRawPeople - r.baseline.afterRawPeople).toBe(400);
    expect(
      r.incrementalWeightedReach - r.baseline.incrementalWeightedReach,
    ).toBe(856);
    expect(
      r.explanations.reduce((sum, e) => sum + e.marginalWeightedReach, 0),
    ).toBe(2241);
  });
  it("budget one chooses C", () => {
    const r = optimize(parseScenario(fixture), { budgetUnits: 1 });
    expect(r.selectedSiteIds).toEqual(["C"]);
    expect(r.afterRawPeople).toBe(1480);
  });
});
