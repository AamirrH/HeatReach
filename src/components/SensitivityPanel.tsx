import { useMemo } from "react";
import type { Scenario, PlanResult } from "../types/domain";
import { sensitivity } from "../engine/sensitivity";
import { formatNumber as n } from "../data/provenance";
export function SensitivityPanel({
  scenario,
  result,
}: {
  scenario: Scenario;
  result: PlanResult;
}) {
  const analysis = useMemo(() => sensitivity(scenario), [scenario]);
  return (
    <details className="panel extension sensitivity">
      <summary>Fairness & sensitivity · inspect the trade-offs</summary>
      <p>
        Budget, cap and current exclusions stay fixed. These are alternative
        model assumptions, not estimates of individual risk.
      </p>
      <div className="table-scroll">
        <table>
          <caption>
            Radius sensitivity: existing coverage is recalculated at each
            radius.
          </caption>
          <thead>
            <tr>
              <th>Radius</th>
              <th>Sites</th>
              <th>Total people</th>
              <th>Additional weighted points</th>
            </tr>
          </thead>
          <tbody>
            {analysis.radii.map((row) => (
              <tr key={row.radiusMeters}>
                <th>
                  {row.radiusMeters} m
                  {row.radiusMeters === scenario.radiusMeters
                    ? " (current)"
                    : ""}
                </th>
                <td>{row.result.selectedSiteIds.join(" + ") || "None"}</td>
                <td>{n(row.result.afterRawPeople)}</td>
                <td>{n(row.result.incrementalWeightedReach)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>
        With every weight set to 1, the raw-reach objective selects{" "}
        <strong>
          {analysis.equalWeightResult.selectedSiteIds.join(" + ") ||
            "no new sites"}
        </strong>{" "}
        and reaches{" "}
        <strong>{n(analysis.equalWeightResult.afterRawPeople)}</strong> modelled
        people, compared with {n(result.afterRawPeople)} under the documented
        weights.
      </p>
      <p>
        Increasing radius can reduce additional gain because existing sites also
        reach more zones. Total weighted coverage cannot decrease. Weight
        changes can redistribute access; discuss the assumptions with affected
        communities.
      </p>
    </details>
  );
}
