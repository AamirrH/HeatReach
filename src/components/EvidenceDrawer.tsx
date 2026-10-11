import type { Scenario } from "../types/domain";
export function EvidenceDrawer({ scenario: s }: { scenario: Scenario }) {
  return (
    <section id="method" className="panel evidence">
      <span className="eyebrow">TRANSPARENT BY DESIGN</span>
      <h2>Data & assumptions</h2>
      <div className="evidence-grid">
        <details open>
          <summary>How the recommendation works</summary>
          <p>
            We enumerate every eligible candidate subset, reject plans above the
            budget or site limit, then maximize the sum of population ×
            vulnerability weight for newly reached zones.
          </p>
          <p>
            Existing coverage is held fixed for each run. Overlapping sites
            never double-count a zone. Ties favor greater raw coverage, then
            lower cost, then alphabetical site IDs.
          </p>
          <p>
            <strong>Weight range: 1–2.</strong> These are documented synthetic
            test assumptions, not measured individual vulnerability. Change the
            radius or exclusions to explore sensitivity.
          </p>
        </details>
        <details open>
          <summary>Sources & provenance</summary>
          <p>
            Fixture date: {s.dataAsOf}. All eight zones and seven site points
            are fictional. Coordinates are local meters, not latitude/longitude.
          </p>
          {s.sourceManifest
            .filter((item) => item.type === "illustrative")
            .map((item) => (
              <p key={item.label}>
                <strong>
                  {item.label} · {item.type}
                </strong>
                <br />
                {item.note}
              </p>
            ))}
          <a href="/fixtures/illustrative_district.json" download>
            Download the exact scenario JSON ↗
          </a>
          <p>
            <strong>Illustrative</strong> means invented for demonstration.{" "}
            <strong>Modelled</strong> means an estimate or calculation.{" "}
            <strong>Verified</strong> requires documented external evidence; no
            facilities in this example are verified.
          </p>
        </details>
        <details>
          <summary>Limits, privacy & future verification</summary>
          <p>
            A circular distance proxy ignores road barriers, capacity, opening
            hours, accessibility and uptake. It does not establish actual
            cooling access or health outcomes.
          </p>
          <p>
            Before a real pilot: source and license population inputs, justify
            aggregate weights, verify facility permission and operations, and
            validate pedestrian routes.
          </p>
          <p>
            No accounts, geolocation, tracking, medical information or resident
            identifiers. Planning controls stay in memory. Regional weather is
            omitted from this MVP and never affects the solver.
          </p>
        </details>
      </div>
    </section>
  );
}
