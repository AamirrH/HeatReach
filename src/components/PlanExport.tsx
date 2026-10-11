import { useState } from "react";
import type { Scenario, PlanResult } from "../types/domain";
import { downloadPlan } from "../services/exportPlan";
export function PlanExport({
  scenario,
  result,
}: {
  scenario: Scenario;
  result: PlanResult;
}) {
  const [message, setMessage] = useState("");
  return (
    <>
      <section className="print-summary">
        <h2>HeatReach planning summary</h2>
        <p>
          {scenario.name} · Dataset date {scenario.dataAsOf}
        </p>
        <p>
          Budget {scenario.budgetUnits} units · Maximum {scenario.maxNewSites}{" "}
          new sites · Straight-line radius {scenario.radiusMeters} m.
        </p>
        <p>
          Selected proposals: {result.selectedSiteIds.join(" + ") || "None"}.
          Proposed sites are not operational. Costs and coverage are planning
          assumptions.
        </p>
      </section>
      <div className="export-actions">
        <p>Save this plan with its inputs, source labels and limitations.</p>
        <button
          className="secondary-button"
          onClick={() => {
            try {
              downloadPlan(scenario, result);
              setMessage("CSV download requested.");
            } catch {
              setMessage(
                "Download unavailable in this browser. Use the print summary.",
              );
            }
          }}
        >
          Download plan CSV
        </button>
        <button className="secondary-button" onClick={() => window.print()}>
          Print summary
        </button>
        <span role="status">{message}</span>
      </div>
    </>
  );
}
