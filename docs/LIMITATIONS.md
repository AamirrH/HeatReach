# Limitations

- The default benchmark is invented geometry and population. Its improvement is a solver result, not a measured benefit to residents. No real geographic pilot or verified facility inventory was supplied.
- Each zone is one aggregate point. A radius threshold treats all its residents together and ignores their distribution inside the zone.
- Straight-line distance ignores crossings, barriers, walking networks, travel time, transport and terrain. Geographic imports use an approximate local projection limited to 5 km from their origin; no route calculation is provided.
- Site capacity, hours, services and accessibility are informational fields. Capacity is not an optimization constraint. Permission and verification metadata require operator review; a valid JSON file cannot prove the facts it contains.
- Public records require current verification and permission, and expire automatically. Listed hours are not interpreted as an automated “open now” guarantee. A facility can change conditions before its next check. Contact the operator before travel.
- Candidates never appear as public destinations. The shipped public catalog is empty; geographic import does not publish records.
- Weights are assumptions, not validated vulnerability indices. Real weighting requires local evidence and stakeholder review. Equal-weight/radius comparisons expose sensitivity, not a fairness guarantee.
- Maximizing weighted gain can trade raw population for greater weighted reach. Both are reported.
- Exact enumeration supports at most 12 candidates and 20 zones. Larger problems are rejected and require a different solver/validation strategy.
- Regional weather is a model forecast, not a local sensor or health-risk measurement. It never affects optimization. The in-memory cache is reused for 30 minutes; failed refreshes may show explicitly cached context up to 24 hours old. Missing/expired data is unavailable, never invented.
- WHO-linked general safety information and a manual 112 link do not diagnose illness or perform emergency dispatch. There are no sensors, automatic calls or SMS.
- No accounts, durable scenario storage, telemetry, resident information or automatic geolocation are used. Edits/imports reset on reload. No service worker is installed. Manual weather/map loading shares request metadata and requested region/tile area with the respective providers; their terms apply.
- Open-Meteo's free endpoint is for noncommercial use under its terms. Review the provider plan before commercial operation. OSM public tiles have usage restrictions and no guaranteed availability. Tables/cards remain usable without tiles.
- AWS deployment and public HTTPS verification remain pending an authorized non-root account. Local functional success is not deployment success.
- Browser QA covers installed Edge at desktop and mobile viewport sizes, keyboard navigation, print layout and network failures. It is not full cross-browser or professional accessibility certification.
