# Limitations

- This is a planning prototype over invented geometry and population. Its demonstrated improvement is a solver result, not a measured benefit to real residents.
- Each zone is a single aggregate point. A radius threshold treats all its residents together and ignores their distribution inside a zone.
- Straight-line distance ignores road crossings, barriers, walking networks, travel time, transport, disability access and terrain.
- Site suitability, capacity, staffing, opening hours, cooling performance, water access, permission and actual public availability are unknown. No candidate is an instruction to visit a cooling center.
- Weights are assumptions for testing, not validated vulnerability indices. Ethical and local stakeholder review is needed before using real weights.
- Optimizing weighted gain can trade raw population for greater weighted reach. The interface reports both rather than implying universal superiority on every metric.
- Exact enumeration is limited to 12 candidates and 20 zones. Larger problems require a new solver and validation strategy; inputs beyond the supported scope are rejected.
- No body-temperature sensing, heatstroke diagnosis, personal-risk predictions, emergency dispatch or medical guidance is implemented.
- Live weather, CSV export, geographic pilots and public verified centers are outside this P0 scope. Weather does not change the optimizer.
- There is no account, durable scenario storage, telemetry, resident information or geolocation. Edits are in-memory and reset on reload. No service worker is installed.
- Automatic hosting, public HTTPS validation and AWS proof remain pending a permitted non-root account session. Local functional success is not deployment success.
- Browser QA covers installed Edge at 1280×900 and 375×812, plus keyboard and no-external-network flows. It is not a full cross-browser or professional accessibility certification.
