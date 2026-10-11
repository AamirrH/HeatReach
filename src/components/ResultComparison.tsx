import type { PlanResult } from "../types/domain";
import { formatNumber as n } from "../data/provenance";
export function ResultComparison({ result: r }: { result: PlanResult }) {
  const maxRaw = Math.max(r.afterRawPeople, r.baseline.afterRawPeople, 1),
    maxWeighted = Math.max(
      r.incrementalWeightedReach,
      r.baseline.incrementalWeightedReach,
      1,
    );
  return (
    <section className="panel comparison" aria-labelledby="comparison-title">
      <div>
        <span className="eyebrow">04 / PLAN ANALYSIS</span>
        <h2 id="comparison-title">Compare the outcomes.</h2>
        <p>Same radius. Same budget. Same eligible sites.</p>
        <small>
          First-eligible simple baseline (illustrative) selects in alphabetic ID
          order when cost and site limits allow. It is not a claim about
          municipal practice.
        </small>
        <div className="comparison-delta">
          <span>Difference from the simple baseline</span>
          <div>
            <strong>
              {r.afterRawPeople >= r.baseline.afterRawPeople ? "+" : ""}
              {n(r.afterRawPeople - r.baseline.afterRawPeople)}
            </strong>
            <small>modelled people within radius</small>
          </div>
          <div>
            <strong>
              {r.incrementalWeightedReach >= r.baseline.incrementalWeightedReach
                ? "+"
                : ""}
              {n(
                r.incrementalWeightedReach -
                  r.baseline.incrementalWeightedReach,
              )}
            </strong>
            <small>additional weighted points</small>
          </div>
        </div>
      </div>
      <div className="comparison-charts">
        {[
          [
            "Total modelled people within radius",
            r.afterRawPeople,
            r.baseline.afterRawPeople,
            maxRaw,
          ],
          [
            "Additional weighted access points",
            r.incrementalWeightedReach,
            r.baseline.incrementalWeightedReach,
            maxWeighted,
          ],
        ].map(([label, exact, baseline, max]) => (
          <div className="chart" key={label}>
            <h3>{label}</h3>
            {[
              ["Optimized", exact, r.selectedSiteIds],
              ["First-eligible", baseline, r.baseline.selectedSiteIds],
            ].map(([name, value, ids]) => (
              <div
                className={`bar-row ${name === "Optimized" ? "optimal" : ""}`}
                key={String(name)}
              >
                <div>
                  <span>
                    {String(name)}{" "}
                    <small>({(ids as string[]).join(" + ") || "none"})</small>
                  </span>
                  <strong>{n(value as number)}</strong>
                </div>
                <div className="bar-track">
                  <div
                    style={{ width: `${(100 * Number(value)) / Number(max)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        ))}
        <p className="comparison-note">
          The solver maximizes weighted points. A better weighted plan does not
          always reach more raw people than the baseline.
        </p>
      </div>
    </section>
  );
}
