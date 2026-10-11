import { lazy, Suspense, useEffect, useMemo, useState } from "react";
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
import { WeatherContext } from "./components/WeatherContext";
import { SensitivityPanel } from "./components/SensitivityPanel";
import { PlanExport } from "./components/PlanExport";
import { PilotImport } from "./components/PilotImport";
import { PublicFacilities } from "./components/PublicFacilities";
import { pilotToScenario, type GeographicPilot } from "./engine/geographic";
import { useClock } from "./hooks/useClock";
const GeographicMap = lazy(() => import("./components/GeographicMap"));
function Planner({
  initial,
  pilot,
}: {
  initial: Scenario;
  pilot: GeographicPilot | null;
}) {
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
          {pilot ? initial.name : "Illustrative district"}
          <span>
            {initial.zones.length} demand zones /{" "}
            {initial.sites.filter((s) => s.kind === "candidate").length}{" "}
            candidates
          </span>
        </div>
      </div>
      <SourceBanner scenario={p.scenario} />
      {p.result && <MetricsStrip result={p.result} scenario={p.scenario} />}
      <div className="workspace">
        <PlannerControls planner={p} />
        {p.result ? (
          <>
            {pilot ? (
              <Suspense fallback={<p>Loading geographic view…</p>}>
                <GeographicMap
                  pilot={pilot}
                  scenario={p.scenario}
                  result={p.result}
                />
              </Suspense>
            ) : (
              <ScenarioMap scenario={p.scenario} result={p.result} />
            )}
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
      {p.result && (
        <>
          <SensitivityPanel scenario={p.scenario} result={p.result} />
          <PlanExport scenario={p.scenario} result={p.result} />
        </>
      )}
      {p.scenario.weatherLocation && (
        <WeatherContext
          key={p.scenario.id}
          location={p.scenario.weatherLocation}
        />
      )}
      <EvidenceDrawer scenario={p.scenario} />
    </>
  );
}
export default function App() {
  const [scenario, setScenario] = useState<Scenario | null>(null),
    [error, setError] = useState("");
  const [view, setView] = useState<"planner" | "public">("planner");
  const [pilot, setPilot] = useState<GeographicPilot | null>(null);
  const [revision, setRevision] = useState(0);
  const now = useClock();
  const activeScenario = useMemo(
    () => (pilot ? pilotToScenario(pilot, now) : scenario),
    [pilot, scenario, now],
  );
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
        Skip to content
      </a>
      <Header
        onMethod={() => {
          setView("planner");
          requestAnimationFrame(() =>
            document.getElementById("method")?.scrollIntoView(),
          );
        }}
      />
      <nav className="mode-switch" aria-label="Choose audience">
        <button
          aria-pressed={view === "planner"}
          onClick={() => setView("planner")}
        >
          Community planner
        </button>
        <button
          aria-pressed={view === "public"}
          onClick={() => setView("public")}
        >
          Public facilities
        </button>
      </nav>
      <main id="main">
        {view === "public" && <PublicFacilities />}
        <div hidden={view !== "planner"}>
          <PilotImport
            imported={!!pilot}
            onImport={(p) => {
              setPilot(p);
              setRevision((r) => r + 1);
            }}
            onReset={() => {
              setPilot(null);
              setRevision((r) => r + 1);
            }}
          />
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
          ) : activeScenario ? (
            <Planner
              key={`${activeScenario.id}-${revision}`}
              initial={activeScenario}
              pilot={pilot}
            />
          ) : (
            <section className="panel loading" role="status">
              Loading the illustrative district…
            </section>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
