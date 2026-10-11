import { useEffect, useState } from "react";
import type { Scenario } from "./types/domain";
import { loadScenario } from "./data/scenarios";
import { errorMessage } from "./engine/validation";
import { usePlanner } from "./hooks/usePlanner";
import { Header } from "./components/Header";
import { SourceBanner } from "./components/SourceBanner";
import { MetricsStrip } from "./components/MetricsStrip";
import { PlannerControls } from "./components/PlannerControls";
import { ScenarioMap } from "./components/ScenarioMap";
import { RecommendationList } from "./components/RecommendationList";
import { ResultComparison } from "./components/ResultComparison";
import { EvidenceDrawer } from "./components/EvidenceDrawer";
import { Footer } from "./components/Footer";
function Planner({ initial }: { initial: Scenario }) {
  const p = usePlanner(initial);
  return (
    <>
      <div className="intro">
        <div>
          <span className="eyebrow">A LITTLE RELIEF. A BETTER REACH.</span>
          <h1>
            Find the gaps.
            <br className="mobile-break" /> Place the relief.
          </h1>
          <p>Choose where temporary cooling could reach more of a community.</p>
        </div>
        <div className="scenario-chip">
          <span className="status-dot" />
          Illustrative district<span>8 demand zones / 5 candidates</span>
        </div>
      </div>
      <SourceBanner />
      {p.result && <MetricsStrip result={p.result} scenario={p.scenario} />}
      <div className="workspace">
        <PlannerControls planner={p} />
        {p.result ? (
          <>
            <ScenarioMap scenario={p.scenario} result={p.result} />
            <RecommendationList scenario={p.scenario} result={p.result} />
          </>
        ) : (
          <section className="panel invalid-plan" role="status">
            <h2>Check your planning limits</h2>
            <p>
              Results are hidden until every input is valid. No stale plan is
              being displayed.
            </p>
          </section>
        )}
      </div>
      <div className="sr-only" aria-live="polite">
        {p.announcement}
      </div>
      {p.result && <ResultComparison result={p.result} />}
      <EvidenceDrawer scenario={p.scenario} />
    </>
  );
}
export default function App() {
  const [scenario, setScenario] = useState<Scenario | null>(null),
    [error, setError] = useState("");
  useEffect(() => {
    const controller = new AbortController();
    loadScenario(controller.signal)
      .then(setScenario)
      .catch((e) => {
        if (!controller.signal.aborted) setError(errorMessage(e));
      });
    return () => controller.abort();
  }, []);
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to planner
      </a>
      <Header />
      <main id="main">
        {error ? (
          <section className="panel load-error" role="alert">
            <h1>Scenario could not be loaded</h1>
            <p>{error}</p>
            <button
              className="primary-button"
              onClick={() => window.location.reload()}
            >
              Retry loading
            </button>
          </section>
        ) : scenario ? (
          <Planner initial={scenario} />
        ) : (
          <section className="panel loading" role="status">
            Loading the illustrative district…
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
