import type { Scenario } from "../types/domain";
export function SourceBanner({ scenario }: { scenario: Scenario }) {
  const illustrative = scenario.mode === "illustrative";
  return (
    <aside className="source-banner">
      <span className="source-icon" aria-hidden="true">
        i
      </span>
      <div>
        <strong>
          {illustrative ? "ILLUSTRATIVE SCENARIO" : "OPERATOR-SUPPLIED PILOT"}
        </strong>
        <span>
          {illustrative
            ? "Fictional locations, population & weights. Not real cooling facilities."
            : "Sourced data supplied by the operator; evidence is not independently verified by HeatReach. Proposals are not operational."}
        </span>
      </div>
      <span className="scenario-version">
        {illustrative ? "EXAMPLE 01" : "LOCAL IMPORT"}
      </span>
    </aside>
  );
}
