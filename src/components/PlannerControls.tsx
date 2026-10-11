import type { usePlanner } from "../hooks/usePlanner";
import { SiteEligibilityList } from "./SiteEligibilityList";
export function PlannerControls({
  planner: p,
}: {
  planner: ReturnType<typeof usePlanner>;
}) {
  return (
    <section className="panel controls" aria-labelledby="controls-title">
      <div className="section-heading">
        <span className="eyebrow">01 / DEFINE</span>
        <button className="text-button" onClick={p.reset}>
          {p.scenario.mode === "illustrative" ? "Reset example" : "Reset pilot"}
        </button>
      </div>
      <h2 id="controls-title">Your planning limits</h2>
      <p className="muted">Explore what a limited budget can reach.</p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          p.run();
        }}
      >
        <label className="control-label" htmlFor="budget">
          Planning budget{" "}
          <span>
            {p.scenario.mode === "illustrative"
              ? "illustrative units"
              : "planning units"}
          </span>
        </label>
        <input
          id="budget"
          type="number"
          min="0"
          max="20"
          step="1"
          value={p.draft.budgetUnits}
          onChange={(e) => p.change("budgetUnits", e.target.value)}
        />
        <label className="control-label" htmlFor="cap">
          Maximum new sites <span>0–12</span>
        </label>
        <input
          id="cap"
          type="number"
          min="0"
          max="12"
          step="1"
          value={p.draft.maxNewSites}
          onChange={(e) => p.change("maxNewSites", e.target.value)}
        />
        <label className="control-label" htmlFor="radius">
          Coverage radius <span>meters</span>
        </label>
        <input
          id="radius"
          type="number"
          min="50"
          max="1000"
          step="any"
          value={p.draft.radiusMeters}
          onChange={(e) => p.change("radiusMeters", e.target.value)}
        />
        <input
          className="radius-slider"
          aria-label="Coverage radius slider"
          type="range"
          min="50"
          max="1000"
          step="10"
          value={Number(p.draft.radiusMeters) || 50}
          onChange={(e) => p.change("radiusMeters", e.target.value)}
        />
        <small className="input-help">Straight-line proxy · 50–1,000 m</small>
        <SiteEligibilityList scenario={p.scenario} toggle={p.toggle} />
        {p.errors.length > 0 && (
          <div role="alert" className="input-error">
            Enter a whole budget from 0–20, a whole site cap from 0–12, and
            radius from 50–1,000 m.
          </div>
        )}
        <button type="submit" className="primary-button" disabled={!p.result}>
          Optimize Coverage <span aria-hidden="true">↗</span>
        </button>
        <small className="input-help centered">
          Exact solver · results update as you edit
        </small>
      </form>
    </section>
  );
}
