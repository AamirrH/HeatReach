import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Circle,
  Popup,
  useMap,
} from "react-leaflet";
import type { LatLngBoundsExpression } from "leaflet";
import "leaflet/dist/leaflet.css";
import type { GeographicPilot, PublicFacility } from "../engine/geographic";
import type { PlanResult, Scenario } from "../types/domain";
function FitBounds({ points }: { points: [number, number][] }) {
  const map = useMap();
  const bounds = JSON.stringify(points);
  useEffect(() => {
    const coordinates = JSON.parse(bounds) as [number, number][];
    if (coordinates.length)
      map.fitBounds(coordinates as LatLngBoundsExpression, {
        padding: [35, 35],
        maxZoom: 16,
        animate: false,
      });
  }, [map, bounds]);
  return null;
}
export default function GeographicMap({
  pilot,
  scenario,
  result,
  facilities = [],
}: {
  pilot?: GeographicPilot;
  scenario?: Scenario;
  result?: PlanResult;
  facilities?: PublicFacility[];
}) {
  const [enabled, setEnabled] = useState(false),
    [tileError, setTileError] = useState(false);
  const sites = pilot?.sites ?? facilities;
  const points = [...(pilot?.zones ?? []), ...sites].map(
    (p) => [p.latitude, p.longitude] as [number, number],
  );
  if (!points.length) return null;
  return (
    <section className="panel geo-panel">
      <h2>{pilot ? "Geographic planning map" : "Verified facility map"}</h2>
      <p>
        {pilot
          ? "Operator-supplied geography. Circles show a straight-line proxy, not walking routes. ◆ Proposals are not operational."
          : "Only current, public-access facility records appear. Check listed hours and contact the operator before travel."}
      </p>
      {!enabled ? (
        <button className="secondary-button" onClick={() => setEnabled(true)}>
          Load OpenStreetMap
        </button>
      ) : (
        <>
          <MapContainer
            className="geo-map"
            center={points[0]}
            zoom={13}
            // Expiring records can unmount the map during a zoom transition.
            zoomAnimation={false}
            scrollWheelZoom={false}
          >
            <FitBounds points={points} />
            <TileLayer
              url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              eventHandlers={{ tileerror: () => setTileError(true) }}
            />
            {pilot?.zones.map((z) => (
              <CircleMarker
                key={z.id}
                center={[z.latitude, z.longitude]}
                radius={9}
                pathOptions={{
                  color: result?.afterCoveredZoneIds.includes(z.id)
                    ? "#136958"
                    : "#966020",
                }}
              >
                <Popup>
                  <strong>{z.name}</strong>
                  <p>
                    {z.estimatedPopulation} estimated people · weight{" "}
                    {z.vulnerabilityWeight}
                  </p>
                  <p>
                    {result?.afterCoveredZoneIds.includes(z.id)
                      ? "Within radius"
                      : "Unserved"}
                  </p>
                  <a
                    href={z.evidence.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Population and geometry source
                  </a>
                </Popup>
              </CircleMarker>
            ))}
            {sites.map((s) => {
              const selected = result?.selectedSiteIds.includes(s.id);
              const activeExisting =
                s.kind === "existing" &&
                (!scenario ||
                  scenario.sites.find((x) => x.id === s.id)?.status ===
                    "verified_open");
              return (
                <CircleMarker
                  key={s.id}
                  center={[s.latitude, s.longitude]}
                  radius={selected ? 12 : 7}
                  pathOptions={{
                    color: selected
                      ? "#136958"
                      : activeExisting
                        ? "#173b37"
                        : "#7a7464",
                    dashArray: s.kind === "candidate" ? "3 3" : undefined,
                  }}
                >
                  <Popup>
                    <strong>{s.name}</strong>
                    <p>
                      {s.kind === "candidate"
                        ? selected
                          ? "Selected proposal—not operational"
                          : "Candidate—not operational"
                        : activeExisting
                          ? "Verified operating facility; check hours"
                          : "Unavailable or verification expired"}
                    </p>
                    <a
                      href={s.evidence.sourceUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Site evidence
                    </a>
                  </Popup>
                  {scenario && (selected || activeExisting) && (
                    <Circle
                      center={[s.latitude, s.longitude]}
                      radius={scenario.radiusMeters}
                      pathOptions={{
                        color: "#136958",
                        fillOpacity: 0.06,
                        weight: 1,
                      }}
                    />
                  )}
                </CircleMarker>
              );
            })}
          </MapContainer>
          {tileError && (
            <p role="status" className="warning">
              Map tiles unavailable. The facility/zone tables remain usable.
            </p>
          )}
        </>
      )}
      <small>
        Loading the map contacts OpenStreetMap and reveals the viewed area and
        your IP to its tile service. No geolocation, tile prefetching or offline
        tile downloads.{" "}
        <a
          href="https://www.openstreetmap.org/fixthemap"
          target="_blank"
          rel="noreferrer"
        >
          Report a map issue
        </a>
        .
      </small>
      {pilot && (
        <div className="table-scroll">
          <table>
            <caption>Imported pilot geography and coverage</caption>
            <thead>
              <tr>
                <th>Zone / site</th>
                <th>Coordinates</th>
                <th>State</th>
                <th>Source / license</th>
              </tr>
            </thead>
            <tbody>
              {pilot.zones.map((z) => (
                <tr key={z.id}>
                  <th>{z.name}</th>
                  <td>
                    {z.latitude}, {z.longitude}
                  </td>
                  <td>
                    {z.estimatedPopulation} estimated people ·{" "}
                    {result?.afterCoveredZoneIds.includes(z.id)
                      ? "Within radius"
                      : "Unserved"}
                  </td>
                  <td>
                    <a href={z.evidence.sourceUrl}>{z.evidence.license}</a>
                  </td>
                </tr>
              ))}
              {pilot.sites.map((s) => (
                <tr key={s.id}>
                  <th>{s.name}</th>
                  <td>
                    {s.latitude}, {s.longitude}
                  </td>
                  <td>
                    {s.kind === "candidate"
                      ? result?.selectedSiteIds.includes(s.id)
                        ? "Selected proposal—not operational"
                        : "Candidate—not operational"
                      : scenario?.sites.find((x) => x.id === s.id)?.status ===
                          "verified_open"
                        ? "Verified existing"
                        : "Unavailable / expired"}
                  </td>
                  <td>
                    <a href={s.evidence.sourceUrl}>{s.evidence.license}</a>
                    <details>
                      <summary>Hours, services & access</summary>
                      <p>
                        Hours: {s.openingHours}. Capacity:{" "}
                        {s.capacity ?? "Unknown"} (not allocated by the
                        optimizer). Accessibility: {s.accessibility}. Services:{" "}
                        {s.services.join(", ")}. Source date: {s.evidence.asOf};
                        resolution: {s.evidence.resolution}.
                      </p>
                    </details>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
