import type { Scenario } from "../types/domain";
export function SiteEligibilityList({
  scenario,
  toggle,
}: {
  scenario: Scenario;
  toggle: (id: string) => void;
}) {
  return (
    <fieldset className="eligibility">
      <legend>Candidate availability</legend>
      <p>Include sites eligible for this plan.</p>
      {scenario.sites
        .filter((p) => p.kind === "candidate")
        .map((p) => (
          <label className="site-toggle" key={p.id}>
            <span className="candidate-letter">{p.id}</span>
            <span>
              {p.name}
              <small>
                {p.costUnits} {p.costUnits === 1 ? "unit" : "units"} ·{" "}
                {p.eligible && p.status !== "unavailable"
                  ? "Eligible"
                  : "Excluded"}
              </small>
            </span>
            <input
              type="checkbox"
              aria-label={`Include ${p.name}`}
              checked={p.eligible && p.status !== "unavailable"}
              disabled={p.status === "unavailable"}
              onChange={() => toggle(p.id)}
            />
          </label>
        ))}
    </fieldset>
  );
}
