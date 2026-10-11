// AUTOMATED TEST DATA ONLY. These are invented records, never bundled in public/ or used as a real facility inventory.
export function testCatalog(now = Date.now()) {
  const checked = new Date(now - 3600000).toISOString(),
    expires = new Date(now + 3600000).toISOString();
  return {
    version: 1 as const,
    updatedAt: checked,
    publisher: "AUTOMATED TEST ONLY",
    facilities: [
      {
        id: "T1",
        name: "Test-only facility",
        latitude: 21,
        longitude: 79,
        kind: "existing" as const,
        provenance: "verified" as const,
        status: "verified_open" as const,
        publicAccess: true,
        permissionConfirmed: true,
        address: "Test address — not a destination",
        openingHours: "Test schedule",
        timezone: "Asia/Kolkata",
        publicContact: "Test operator",
        accessibility: "Test access",
        capacity: null,
        services: ["Test cooling"],
        evidence: {
          sourceUrl: "https://example.org/test",
          license: "Test-only data",
          asOf: checked.slice(0, 10),
          note: "Invented for automated testing",
          resolution: "Test point",
        },
        verification: {
          checkedAt: checked,
          validUntil: expires,
          method: "Mock verification for tests only",
          sourceUrl: "https://example.org/test",
          verifiedBy: "Test harness",
        },
      },
    ],
  };
}
export function testPilot(now = Date.now()) {
  const facility = testCatalog(now).facilities[0];
  return {
    version: 1 as const,
    id: "test-pilot",
    name: "AUTOMATED TEST PILOT",
    description: "Invented test data, not a real pilot",
    dataAsOf: new Date(now - 3600000).toISOString().slice(0, 10),
    origin: { latitude: 21, longitude: 79 },
    controls: { budgetUnits: 1, maxNewSites: 1, radiusMeters: 180 },
    zones: [
      {
        id: "TZ1",
        name: "Test zone",
        latitude: 21.005,
        longitude: 79,
        estimatedPopulation: 100,
        vulnerabilityWeight: 1.5,
        vulnerabilityBasis: "Test weight",
        provenance: "modelled" as const,
        evidence: facility.evidence,
      },
    ],
    sites: [
      { ...facility, costUnits: 0 as const, eligible: false as const },
      {
        id: "TA",
        name: "Test proposal",
        latitude: 21.005,
        longitude: 79,
        kind: "candidate" as const,
        status: "eligible_candidate" as const,
        provenance: "modelled" as const,
        eligible: true,
        permissionConfirmed: true,
        costUnits: 1,
        verificationNote: "Test permission, not real",
        openingHours: "Unknown",
        accessibility: "Unknown",
        capacity: null,
        services: ["Proposed cooling"],
        evidence: facility.evidence,
      },
    ],
  };
}
