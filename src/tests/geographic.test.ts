import { expect, it } from "vitest";
import {
  catalogSchema,
  parsePilot,
  pilotToScenario,
  project,
  publicFacilities,
  verificationCurrent,
} from "../engine/geographic";
import { optimize } from "../engine/optimize";
import { testCatalog, testPilot } from "./fixtures/pilot";
import catalog from "../../public/data/verified-facilities.json";
const now = Date.parse("2026-10-11T10:00:00Z");
it("ships no invented public facility records", () => {
  expect(catalogSchema.parse(catalog).facilities).toEqual([]);
});
it("projects a sourced compact pilot into the existing solver without changing objective", () => {
  const p = parsePilot(testPilot(now), now);
  const s = pilotToScenario(p, now);
  const r = optimize(s);
  expect(r.selectedSiteIds).toEqual(["TA"]);
  expect(r.afterRawPeople).toBe(100);
  expect(r.incrementalWeightedReach).toBe(150);
  expect(project(p.origin, p.origin)).toEqual({ x: 0, y: 0 });
});
it("removes expired existing coverage on recomputation", () => {
  const input = testPilot(now);
  input.zones[0].latitude = 21;
  const p = parsePilot(input, now);
  expect(optimize(pilotToScenario(p, now)).beforeRawPeople).toBe(100);
  expect(optimize(pilotToScenario(p, now + 7200000)).beforeRawPeople).toBe(0);
});
it.each([
  "missing-license",
  "fictional",
  "no-permission",
  "too-far",
  "bad-url",
  "duplicate",
  "future-date",
])("rejects unsafe pilot: %s", (kind) => {
  const p = testPilot(now);
  if (kind === "missing-license") p.zones[0].evidence.license = "";
  if (kind === "fictional")
    Object.assign(p.zones[0], { provenance: "illustrative" });
  if (kind === "no-permission") p.sites[1].permissionConfirmed = false;
  if (kind === "too-far") p.zones[0].latitude = 30;
  if (kind === "bad-url") p.zones[0].evidence.sourceUrl = "javascript:alert(1)";
  if (kind === "duplicate") p.zones[0].id = p.sites[0].id;
  if (kind === "future-date") p.dataAsOf = "2099-01-01";
  expect(() => parsePilot(p, now)).toThrow();
});
it("public directory includes only current, public-access, permitted operational facilities", () => {
  const c = catalogSchema.parse(testCatalog(now)),
    base = c.facilities[0];
  c.facilities.push(
    { ...base, id: "closed", status: "unavailable" },
    { ...base, id: "private", publicAccess: false },
    { ...base, id: "unapproved", permissionConfirmed: false },
    {
      ...base,
      id: "future-evidence",
      evidence: { ...base.evidence, asOf: "2099-01-01" },
    },
    {
      ...base,
      id: "expired",
      verification: {
        ...base.verification,
        checkedAt: new Date(now - 86400000).toISOString(),
        validUntil: new Date(now - 1).toISOString(),
      },
    },
    {
      ...base,
      id: "future",
      verification: {
        ...base.verification,
        checkedAt: new Date(now + 1).toISOString(),
      },
    },
  );
  expect(publicFacilities(c, now).map((f) => f.id)).toEqual(["T1"]);
  expect(publicFacilities(c, now + 7200000)).toEqual([]);
  expect(
    verificationCurrent(
      base.verification,
      Date.parse(base.verification.validUntil),
    ),
  ).toBe(false);
});
it("rejects proposals, malformed hours, duplicate IDs and overlong verification periods in public catalog", () => {
  const c = testCatalog(now);
  expect(
    catalogSchema.safeParse({
      ...c,
      facilities: [{ ...c.facilities[0], kind: "candidate" }],
    }).success,
  ).toBe(false);
  expect(
    catalogSchema.safeParse({
      ...c,
      facilities: [{ ...c.facilities[0], openingHours: "" }],
    }).success,
  ).toBe(false);
  expect(
    catalogSchema.safeParse({
      ...c,
      facilities: [...c.facilities, ...c.facilities],
    }).success,
  ).toBe(false);
  c.facilities[0].verification.validUntil = "2099-01-01T00:00:00Z";
  expect(catalogSchema.safeParse(c).success).toBe(false);
});
