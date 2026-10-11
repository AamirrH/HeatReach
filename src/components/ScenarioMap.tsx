import { useState } from "react";
import type { PlanResult, Scenario } from "../types/domain";
import { existingSites, siteCoverage } from "../engine/coverage";
import { formatNumber as n } from "../data/provenance";
export function ScenarioMap({
  scenario: s,
  result: r,
}: {
  scenario: Scenario;
  result: PlanResult;
}) {
  const [radii, setRadii] = useState(true);
  const active = [
    ...existingSites(s),
    ...s.sites.filter((p) => r.selectedSiteIds.includes(p.id)),
  ];
  const coverage = new Map(s.sites.map((p) => [p.id, siteCoverage(s, p)]));
  const state = (id: string) =>
    r.beforeCoveredZoneIds.includes(id)
      ? "existing"
      : r.newlyCoveredZoneIds.includes(id)
        ? "new"
        : "unserved";
  const stateLabel = (id: string) =>
    ({ existing: "Existing access", new: "New access", unserved: "Unserved" })[
      state(id)
    ];
  return (
    <section className="panel map-panel" aria-labelledby="map-title">
      <div className="map-heading">
        <div>
          <span className="eyebrow">02 / EXPLORE</span>
          <h2 id="map-title">A district, reconnected.</h2>
        </div>
        <span className="schematic-tag">SCHEMATIC MAP</span>
      </div>
      <div className="map-subhead">
        <span>Local meters · fictional geometry</span>
        <label>
          <input
            type="checkbox"
            checked={radii}
            onChange={(e) => setRadii(e.target.checked)}
          />{" "}
          Show radius
        </label>
      </div>
      <div className="map-canvas">
        <svg
          viewBox="-135 -130 1020 530"
          role="img"
          aria-labelledby="map-svg-title"
          aria-describedby="map-svg-desc"
        >
          <title id="map-svg-title">Illustrative district coverage map</title>
          <desc id="map-svg-desc">
            Selected sites: {r.selectedSiteIds.join(", ") || "none"}. Covered
            zones: {r.afterCoveredZoneIds.join(", ") || "none"}. Full zone and
            site information is in the tables below.
          </desc>
          <defs>
            <pattern
              id="grid"
              width="50"
              height="50"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 50 0 L 0 0 0 50"
                fill="none"
                stroke="#cedbd4"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect x="-135" y="-130" width="1020" height="530" fill="url(#grid)" />
          {radii &&
            active.map((p) => (
              <circle
                key={`radius-${p.id}`}
                cx={p.x}
                cy={250 - p.y}
                r={s.radiusMeters}
                className={`coverage-radius ${p.kind === "existing" ? "old-radius" : ""}`}
              />
            ))}
          {s.zones.map((z) => (
            <g key={z.id} className={`zone zone-${state(z.id)}`}>
              <title>
                {z.name}: {n(z.estimatedPopulation)} illustrative people; weight{" "}
                {z.vulnerabilityWeight}; {stateLabel(z.id)}
              </title>
              <circle
                cx={z.x}
                cy={250 - z.y}
                r={19 + Math.sqrt(z.estimatedPopulation) / 3}
              />
              <text
                x={z.x}
                y={250 - z.y - 47}
                textAnchor="middle"
                className="zone-label"
              >
                {z.id} · {n(z.estimatedPopulation)}
              </text>
              <text
                x={z.x}
                y={250 - z.y + 60}
                textAnchor="middle"
                className="zone-status"
              >
                {stateLabel(z.id)}
              </text>
            </g>
          ))}
          {s.sites.map((p) => {
            const selected = r.selectedSiteIds.includes(p.id),
              existing = p.kind === "existing",
              excluded =
                !existing && (!p.eligible || p.status === "unavailable");
            return (
              <g
                key={p.id}
                transform={`translate(${p.x},${250 - p.y})`}
                className={`site-marker ${selected ? "selected" : existing ? "existing" : excluded ? "excluded" : "candidate"}`}
              >
                <title>
                  {p.name}:{" "}
                  {existing
                    ? "Fictional existing example"
                    : selected
                      ? "Selected proposal—not operational"
                      : excluded
                        ? "Excluded candidate"
                        : "Eligible candidate—not operational"}
                </title>
                {selected && <circle r="26" className="selected-halo" />}
                {existing ? (
                  <rect x="-15" y="-15" width="30" height="30" rx="5" />
                ) : (
                  <path d="M 0 -21 L 21 0 L 0 21 L -21 0 Z" />
                )}
                <text textAnchor="middle" dy="5">
                  {p.id}
                </text>
              </g>
            );
          })}
          <g transform="translate(-95,365)" className="scale">
            <path d="M0 -5 V0 H100 V-5" />
            <text x="50" y="20" textAnchor="middle">
              100 m
            </text>
          </g>
        </svg>
      </div>
      <div className="map-legend">
        <span>
          <i className="legend-existing">■</i> Existing example
        </span>
        <span>
          <i className="legend-selected">◆</i> Selected proposal
        </span>
        <span>
          <i className="legend-candidate">◇</i> Candidate
        </span>
        <span>
          <i className="legend-unserved">○</i> Unserved zone
        </span>
      </div>
      <div className="map-note">
        <strong>
          {r.newlyCoveredZoneIds.length} zones gain modelled access.
        </strong>{" "}
        Radius coverage counts each zone once, including overlaps.
      </div>
      <details className="data-table">
        <summary>
          Explore zone & site data <span>Accessible table ↗</span>
        </summary>
        <div className="table-scroll">
          <table>
            <caption>
              Illustrative demand zones; local coordinates in meters
            </caption>
            <thead>
              <tr>
                <th>Zone</th>
                <th>x, y</th>
                <th>People</th>
                <th>Weight</th>
                <th>Access</th>
                <th>Reached by</th>
              </tr>
            </thead>
            <tbody>
              {s.zones.map((z) => (
                <tr key={z.id} data-zone-id={z.id}>
                  <th>{z.id}</th>
                  <td>
                    {z.x}, {z.y}
                  </td>
                  <td>{n(z.estimatedPopulation)}</td>
                  <td title={z.vulnerabilityBasis}>{z.vulnerabilityWeight}</td>
                  <td>{stateLabel(z.id)}</td>
                  <td>
                    {active
                      .filter((p) => coverage.get(p.id)!.has(z.id))
                      .map((p) => p.id)
                      .join(", ") || "None"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <table>
            <caption>Illustrative sites; proposals are not operational</caption>
            <thead>
              <tr>
                <th>Site</th>
                <th>x, y</th>
                <th>Cost</th>
                <th>Plan status</th>
              </tr>
            </thead>
            <tbody>
              {s.sites.map((p) => (
                <tr key={p.id}>
                  <th>{p.id}</th>
                  <td>
                    {p.x}, {p.y}
                  </td>
                  <td>{p.costUnits}</td>
                  <td>
                    {p.kind === "existing"
                      ? "Fictional existing example"
                      : r.selectedSiteIds.includes(p.id)
                        ? "Selected proposal"
                        : !p.eligible || p.status === "unavailable"
                          ? "Excluded"
                          : "Eligible, not selected"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </section>
  );
}
