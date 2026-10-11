import { useState } from "react";
import { parsePilot, type GeographicPilot } from "../engine/geographic";
import { errorMessage } from "../engine/validation";
export function PilotImport({
  onImport,
  onReset,
  imported,
}: {
  onImport: (pilot: GeographicPilot) => void;
  onReset: () => void;
  imported: boolean;
}) {
  const [error, setError] = useState(""),
    [accepted, setAccepted] = useState(false),
    [pending, setPending] = useState<GeographicPilot | null>(null);
  return (
    <details className="panel extension pilot-import">
      <summary>Geographic pilot · load documented local data</summary>
      <p>
        Requires sourced population and coordinates, data licenses, weighting
        basis, site permissions and dated facility verification. The software
        validates the file; it does not independently verify those claims.
        Imported files remain in this browser session and do not publish to the
        public directory.
      </p>
      <label className="upload-label">
        Pilot JSON (maximum 1 MB)
        <input
          type="file"
          accept=".json,application/json"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            setPending(null);
            setAccepted(false);
            setError("");
            if (!file) return;
            try {
              if (file.size > 1_000_000) throw new Error("File exceeds 1 MB.");
              const parsed = parsePilot(JSON.parse(await file.text()));
              setPending(parsed);
            } catch (err) {
              setError(errorMessage(err));
            }
            e.target.value = "";
          }}
        />
      </label>
      {pending && (
        <>
          <p>
            Ready: {pending.name} · {pending.zones.length} demand zones ·{" "}
            {pending.sites.length} sites.
          </p>
          <label className="attestation">
            <input
              type="checkbox"
              checked={accepted}
              onChange={(e) => setAccepted(e.target.checked)}
            />
            I have checked the source evidence, license rights and site
            permissions. These are actual locations, not fictional demo data.
          </label>
          <button
            className="secondary-button"
            disabled={!accepted}
            onClick={() => {
              if (pending && accepted) {
                onImport(pending);
                setPending(null);
              }
            }}
          >
            Use documented pilot
          </button>
        </>
      )}
      {error && (
        <p className="input-error" role="alert">
          {error}
        </p>
      )}
      {imported && (
        <button className="secondary-button" onClick={onReset}>
          Return to illustrative scenario
        </button>
      )}
      <p>
        File contracts and publication checks:{" "}
        <a href="/data/README.md" target="_blank" rel="noreferrer">
          pilot data guide
        </a>
        . No real pilot dataset is bundled.
      </p>
    </details>
  );
}
