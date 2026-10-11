import { expect, it } from "vitest";
import fixture from "../../public/fixtures/illustrative_district.json";
import { parseScenario } from "../engine/validation";
import { optimize } from "../engine/optimize";
import { sensitivity } from "../engine/sensitivity";
import { csvCell, planCsv } from "../services/exportPlan";
it("exports actual calculations, constraints, provenance, candidate IDs and exclusions", () => {
  const s = parseScenario(fixture);
  s.sites.find((p) => p.id === "E")!.eligible = false;
  const csv = planCsv(s, optimize(s), new Date("2026-10-11T10:00:00Z"));
  for (const expected of [
    "ILLUSTRATIVE",
    "2150",
    "2241",
    "1750",
    "1385",
    "180",
    "A + C",
    "Excluded",
    "not verified travel times",
    '"A","Candidate A"',
    "Source",
  ])
    expect(csv).toContain(expected);
});
it("escapes CSV quotes and neutralizes spreadsheet formulas", () => {
  expect(csvCell('=HYPERLINK("bad")')).toBe('"\'=HYPERLINK(""bad"")"');
  expect(csvCell(" \t+SUM(1,2)")).toMatch(/^"'/);
  expect(csvCell('hello,"x"\n')).toBe('"hello,""x""\n"');
});
it("sensitivity recomputes the exact solver with unchanged constraints and no mutation", () => {
  const s = parseScenario(fixture),
    original = structuredClone(s),
    a = sensitivity(s);
  expect(a.radii.map((r) => r.radiusMeters)).toEqual([120, 180, 240]);
  a.radii.forEach((row) =>
    expect(row.result).toEqual(optimize(s, { radiusMeters: row.radiusMeters })),
  );
  expect(a.equalWeightResult.afterRawPeople).toBeGreaterThanOrEqual(
    optimize(s).afterRawPeople,
  );
  expect(s).toEqual(original);
});
