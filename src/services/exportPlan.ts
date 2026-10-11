import type { PlanResult, Scenario } from "../types/domain";
import { planningDisclaimer } from "../data/provenance";
export function csvCell(value: string | number) {
  const text = String(value);
  // Neutralize formula injection in spreadsheet applications, including leading whitespace.
  return `"${(/^[\s]*[=+@-]/.test(text) ? "'" + text : text).replaceAll('"', '""')}"`;
}
export function planCsv(s: Scenario, r: PlanResult, now = new Date()) {
  const rows: (string | number)[][] = [
    [
      "HeatReach plan",
      s.mode === "illustrative"
        ? "ILLUSTRATIVE — fictional population and facilities"
        : "OPERATOR-SUPPLIED PILOT — evidence requires independent review",
    ],
    ["Scenario", s.name],
    ["Description", s.description],
    ["Generated at (UTC)", now.toISOString()],
    ["Dataset date", s.dataAsOf],
    ["Limitations", planningDisclaimer],
    ["Budget units", s.budgetUnits],
    ["Site cap", s.maxNewSites],
    ["Straight-line radius (m)", s.radiusMeters],
    [
      "Selected proposals — not operational",
      r.selectedSiteIds.join(" + ") || "None",
    ],
    ["Cost units", r.totalCostUnits],
    ["Existing modelled people", r.beforeRawPeople],
    ["Total modelled people", r.afterRawPeople],
    ["Additional modelled people", r.newRawPeople],
    [
      "Additional weighted access points (not people)",
      r.incrementalWeightedReach,
    ],
    ["Baseline method", "First-eligible simple baseline (illustrative)"],
    ["Baseline sites", r.baseline.selectedSiteIds.join(" + ") || "None"],
    ["Baseline modelled people", r.baseline.afterRawPeople],
    ["Baseline weighted gain", r.baseline.incrementalWeightedReach],
    ["Still-unserved zones", r.stillUncoveredZoneIds.join(", ") || "None"],
    [],
    [
      "Candidate ID",
      "Candidate name",
      "Eligibility",
      "Cost units",
      "Selected",
      "Marginal new zones",
      "Marginal weighted points",
    ],
    ...s.sites
      .filter((p) => p.kind === "candidate")
      .map((p) => {
        const e = r.explanations.find((x) => x.siteId === p.id);
        return [
          p.id,
          p.name,
          p.eligible && p.status !== "unavailable" ? "Eligible" : "Excluded",
          p.costUnits,
          e ? "Proposed—not operational" : "Not selected",
          e?.newZoneIds.join(", ") || "",
          e?.marginalWeightedReach ?? 0,
        ];
      }),
    [],
    [
      "Zone",
      "Estimated people",
      "Weight",
      "Weight basis",
      "Coverage",
      "Provenance",
    ],
    ...s.zones.map((z) => [
      z.id,
      z.estimatedPopulation,
      z.vulnerabilityWeight,
      z.vulnerabilityBasis,
      r.beforeCoveredZoneIds.includes(z.id)
        ? "Existing access"
        : r.newlyCoveredZoneIds.includes(z.id)
          ? "New access"
          : "Unserved",
      z.provenance,
    ]),
    [],
    ["Site ID", "Kind", "Status", "Verification note"],
    ...s.sites.map((p) => [p.id, p.kind, p.status, p.verificationNote]),
    [],
    ["Source", "Provenance", "URL", "Note"],
    ...s.sourceManifest.map((source) => [
      source.label,
      source.type,
      source.sourceUrl ?? "",
      source.note,
    ]),
  ];
  return "\uFEFF" + rows.map((row) => row.map(csvCell).join(",")).join("\r\n");
}
export function downloadPlan(s: Scenario, r: PlanResult) {
  const url = URL.createObjectURL(
    new Blob([planCsv(s, r)], { type: "text/csv;charset=utf-8" }),
  );
  const a = document.createElement("a");
  a.href = url;
  a.download = `heatreach-${s.mode}-plan.csv`;
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
