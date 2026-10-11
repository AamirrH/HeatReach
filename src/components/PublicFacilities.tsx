import { lazy, Suspense, useEffect, useState } from "react";
import {
  catalogSchema,
  publicFacilities,
  type FacilityCatalog,
} from "../engine/geographic";
import { PublicSafety } from "./PublicSafety";
import { useClock } from "../hooks/useClock";
import { errorMessage } from "../engine/validation";
const GeographicMap = lazy(() => import("./GeographicMap"));
export function PublicFacilities() {
  const [catalog, setCatalog] = useState<FacilityCatalog | null>(null),
    [error, setError] = useState(""),
    [search, setSearch] = useState("");
  const now = useClock();
  useEffect(() => {
    const controller = new AbortController();
    let currentRequest: AbortController | null = null;
    async function refresh() {
      currentRequest?.abort();
      const request = new AbortController();
      currentRequest = request;
      const timeout = setTimeout(() => request.abort(), 6000);
      try {
        const response = await fetch("/data/verified-facilities.json", {
          signal: request.signal,
          cache: "no-store",
        });
        if (!response.ok)
          throw new Error(`Directory unavailable (HTTP ${response.status}).`);
        const data = catalogSchema.parse(await response.json());
        if (!controller.signal.aborted && !request.signal.aborted) {
          setCatalog(data);
          setError("");
        }
      } catch (e) {
        if (!controller.signal.aborted && currentRequest === request) {
          setCatalog(null);
          setError(
            request.signal.aborted
              ? "Directory request timed out."
              : errorMessage(e),
          );
        }
      } finally {
        clearTimeout(timeout);
      }
    }
    void refresh();
    const timer = setInterval(refresh, 60000);
    const focus = () => {
      void refresh();
    };
    window.addEventListener("focus", focus);
    return () => {
      controller.abort();
      currentRequest?.abort();
      clearInterval(timer);
      window.removeEventListener("focus", focus);
    };
  }, []);
  const all = catalog ? publicFacilities(catalog, now) : [];
  const facilities = all.filter((f) =>
    `${f.name} ${f.address} ${f.services.join(" ")}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );
  return (
    <section className="public-directory">
      <div className="intro">
        <div>
          <span className="eyebrow">PUBLIC FACILITY DIRECTORY</span>
          <h1>Verified places. Clear sources.</h1>
          <p>
            This view contains only publisher-reviewed, current facility
            records. It never includes planning candidates or fictional example
            sites.
          </p>
        </div>
      </div>
      <aside className="source-banner">
        Verification records are not a live occupancy or opening-status feed.
        Check the listed local hours and contact the operator before travel.
      </aside>
      {error ? (
        <p role="alert" className="panel extension">
          {error} No stale directory is shown. Try returning to this view later.
        </p>
      ) : !catalog ? (
        <p role="status">Loading verified facility directory…</p>
      ) : (
        <>
          {all.length === 0 ? (
            <section className="panel extension empty-directory">
              <h2>No currently verified public facilities</h2>
              <p>
                No eligible facility records are available in this release.
                Closed, private-access, future-dated or expired records are
                withheld. The illustrative planner cannot be used to locate a
                real cooling center.
              </p>
            </section>
          ) : (
            <>
              <label className="directory-search">
                Search facilities, address or service
                <input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </label>
              <p role="status">
                {facilities.length} of {all.length} current records
              </p>
              <div className="facility-grid">
                {facilities.map((f) => (
                  <article className="panel facility-card" key={f.id}>
                    <span className="eyebrow">VERIFIED OPERATING FACILITY</span>
                    <h2>{f.name}</h2>
                    <p>{f.address}</p>
                    <dl>
                      <dt>Hours ({f.timezone})</dt>
                      <dd>{f.openingHours}</dd>
                      <dt>Contact</dt>
                      <dd>{f.publicContact}</dd>
                      <dt>Services</dt>
                      <dd>{f.services.join(", ")}</dd>
                      <dt>Accessibility</dt>
                      <dd>{f.accessibility}</dd>
                      <dt>Capacity</dt>
                      <dd>
                        {f.capacity === null
                          ? "Not documented"
                          : `${f.capacity} (not live availability)`}
                      </dd>
                    </dl>
                    <p>
                      Checked{" "}
                      {new Date(f.verification.checkedAt).toLocaleString(
                        "en-IN",
                        { timeZone: f.timezone },
                      )}
                      ; expires{" "}
                      {new Date(f.verification.validUntil).toLocaleString(
                        "en-IN",
                        { timeZone: f.timezone },
                      )}{" "}
                      ({f.timezone}).
                    </p>
                    <p>
                      {f.verification.method} · {f.verification.verifiedBy}
                    </p>
                    <a
                      href={f.verification.sourceUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Verification evidence ↗
                    </a>
                    <p>
                      <a
                        href={f.evidence.sourceUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Data source
                      </a>{" "}
                      · {f.evidence.license}
                    </p>
                    <a
                      href={`https://www.openstreetmap.org/?mlat=${f.latitude}&mlon=${f.longitude}#map=17/${f.latitude}/${f.longitude}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      View facility location ↗
                    </a>
                  </article>
                ))}
              </div>
              {facilities.length > 0 && (
                <Suspense fallback={<p>Loading map controls…</p>}>
                  <GeographicMap facilities={facilities} />
                </Suspense>
              )}
            </>
          )}
          <p className="directory-meta">
            Publisher: {catalog.publisher} · Catalog updated{" "}
            {new Date(catalog.updatedAt).toLocaleString("en-IN", {
              timeZone: "Asia/Kolkata",
            })}{" "}
            IST. Evidence expiry is checked every 30 seconds and on focus; the
            catalog is refreshed every minute.
          </p>
        </>
      )}
      <PublicSafety />
    </section>
  );
}
