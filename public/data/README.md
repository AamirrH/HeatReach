# HeatReach geographic and public facility data

No real facility inventory is bundled. `verified-facilities.json` intentionally contains an empty array. Do not populate it with the synthetic benchmark, test fixtures, guessed buildings or unconfirmed sites. JSON validation cannot establish factual truth; a responsible publisher must review the evidence and obtain permission before publishing.

## Operator pilot import

In Community planner, expand Geographic pilot, upload a UTF-8 JSON file under 1 MB, inspect validation results and attest to source review before activating it. This is a session-only import. It never writes to the public directory or uploads the JSON to a server. Map tiles reveal the viewed region to OpenStreetMap only after the operator presses Load OpenStreetMap.

The JSON object has these required fields:

- `version`: 1
- `id`, `name`, `description`: nonempty strings
- `dataAsOf`: YYYY-MM-DD, not a future date
- `origin`: `{ "latitude": number, "longitude": number }`
- `controls`: `{ "budgetUnits": 2, "maxNewSites": 2, "radiusMeters": 180 }` (budget 0–20, integer site cap 0–12, radius 50–1000; integer budget required by the UI)
- `zones`: 1–20 records, described below
- `sites`: up to 32 records, of which at most 12 are candidates

All IDs must be globally unique. Latitude is between -85 and 85 and longitude between -180 and 180. Every point must lie within 5 km of `origin`, under the documented local projection. The engine uses an approximate local meter plane for coverage; Leaflet displays the source WGS84 coordinates. Neither is a walking route.

Every zone/site includes `evidence` with five required nonempty fields:

```json
{
  "sourceUrl": "https://YOUR-ACTUAL-SOURCE",
  "license": "Actual license or documented permission",
  "asOf": "YYYY-MM-DD",
  "resolution": "Actual spatial resolution / coordinate method",
  "note": "Population method, coordinate source, uncertainty and other relevant evidence"
}
```

The displayed placeholders are instructions, not an importable real dataset. Source links must use HTTPS and evidence dates cannot be in the future. Use publicly shareable organizational evidence, not resident medical records or private documents.

Each zone requires `id`, `name`, `latitude`, `longitude`, nonnegative `estimatedPopulation`, `vulnerabilityWeight` in 1–2, a nonempty `vulnerabilityBasis`, `provenance` (`modelled` or `verified`) and `evidence`. The weighting basis must explain the aggregate indicator and its source. `illustrative` data is rejected by this importer.

Each candidate requires `id`, `name`, `latitude`, `longitude`, `kind: "candidate"`, `status: "eligible_candidate"` or `"unavailable"`, `provenance: "modelled"` or `"verified"`, `eligible`, `permissionConfirmed`, strictly positive `costUnits`, `verificationNote`, `openingHours`, `accessibility`, `capacity` (nonnegative integer or null), `services` (nonempty string array), and `evidence`. An eligible candidate requires confirmed permission. Unknown hours/accessibility can explicitly say `Unknown`; capacity must be null if unknown. Candidates always remain proposals, regardless of permission.

Each existing site uses the public-facility fields below plus `costUnits: 0` and `eligible: false`. Expired, unavailable, non-public-access or unapproved existing facilities do not contribute to existing coverage. Expiry is reevaluated every 30 seconds and on returning to the window. The application labels imported evidence operator-supplied and does not certify it.

## Published public directory

The deployed source is `public/data/verified-facilities.json`, with this envelope:

```json
{
  "version": 1,
  "updatedAt": "ACTUAL-ISO-8601-TIMESTAMP-WITH-TIMEZONE",
  "publisher": "Responsible organization and public contact",
  "facilities": []
}
```

Each facility record requires:

- `id`, `name`, `latitude`, `longitude`, and `evidence` as above.
- `kind: "existing"`, `provenance: "verified"`, `status: "verified_open"` or `"unavailable"`.
- `publicAccess` and `permissionConfirmed`: booleans. Only true/true is publishable to visitors.
- `address`: complete publicly displayable location.
- `openingHours`: confirmed schedule including exceptions and relevant dates; never guessed.
- `timezone`: a valid IANA timezone, such as `Asia/Kolkata`.
- `publicContact`: official facility contact, not a private resident number.
- `accessibility`: verified access details or explicit unknown limitations.
- `services`: nonempty array documenting actual cooling/shade/water services.
- `capacity`: documented nonnegative integer or null. It is informational, not a capacity-allocation constraint or occupancy feed.
- `verification`: `checkedAt`, `validUntil` (ISO 8601 timestamps with timezone), `method`, `sourceUrl` (HTTPS evidence), `verifiedBy` (responsible organization/role).

Set a validity interval appropriate for local conditions, never longer than 30 days. That 30-day maximum is a software guard, not a claim that a facility remains reliable for 30 days. Temporary facilities may need same-day checks. Future-dated, expired, unavailable, private-access and unapproved records are withheld. The catalog is refreshed every minute and on focus; expiry is checked every 30 seconds. Invalid responses or request failures clear the displayed inventory. Update changed facilities to `unavailable` immediately and redeploy.

`verified_open` means verified operating according to the recorded schedule; the UI deliberately does not calculate or claim “open now”. Check the local hours and contact the operator before travel. Location links exist only for eligible public records. Proposed sites can never pass the catalog schema.

## Publication workflow

1. Collect actual facility and source evidence, documented permission, hours, accessibility and service details.
2. Have the responsible organization review rights, correctness, public access and the expiry interval.
3. Add reviewed records to the catalog (never copy `src/tests/fixtures/pilot.ts`).
4. Run `npm test`, `npm run build` and `npm run test:e2e`. These validate structure/behavior, not the truth of the source claims.
5. Commit, deploy and check the public view while signed out. Show verification sources and expiry; remove records immediately if conditions change.

Do not invent confirmations to bypass these checks. A directory with no verified entries is the correct state until real evidence is available.
