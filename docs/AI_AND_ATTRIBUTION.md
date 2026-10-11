# AI, sources and attribution

## Actual tool use

OpenAI Codex assisted with reading the user-provided handoff, implementing the engine and UI, writing tests/documentation, executing builds and browser tests, and committing/pushing milestone changes. A human team should review the result. No claim is made of unassisted authorship or independent field research. The Sites skill's local development/preview guidance was consulted; the user-required Vite/AWS architecture takes precedence and no Sites hosting was created.

The user-provided Word strategy dossier was read in full, including tables, using document extraction; its guidance and differences from the newer master specification are recorded in `DOSSIER_RECONCILIATION.md`. The original private handoff was not automatically published.

The user supplied a Google Stitch UI export, used as the visual reference for the redesign documented in `DESIGN.md`. Its demonstration scripts, fabricated content and hotlinked imagery were not shipped. No AI-generated raster imagery, stock images, externally hosted fonts or fake cloud screenshots are used. The logo and icons are native SVG/HTML. The default map is fixture-generated SVG; optional geographic maps use attributed OSM tiles. Screenshots were captured from the actual running local application with Playwright. Automated geographic tests use invented records with tile requests blocked; these are not field evidence.

## Dependencies

Direct dependency versions and transitive integrity hashes are fixed in `package-lock.json`. React/React DOM, Vite and its React plugin, Zod, Vitest, Testing Library packages, jsdom and the TypeScript type packages use MIT licenses. TypeScript and Playwright use Apache-2.0. Prettier uses MIT. Installed dependency license metadata and notices remain in each dependency package; generated build output retains relevant bundler notices. These licenses do not automatically assign a license to this project's original source or the supplied fixture.

Leaflet 1.9.4 uses BSD-2-Clause; Leaflet type definitions use MIT. React Leaflet 5.0.0 and its core package use **Hippocratic-2.1**, with additional MIT notices for older portions. These are the installed package licenses, not an assumption that every React library is MIT. Full runtime dependency notices are distributed in `public/THIRD_PARTY_NOTICES.txt` and linked in the application footer. Preserve them in deployment and when updating dependencies. The application uses self-hosted Space Grotesk and Public Sans through pinned Fontsource variable packages, both SIL Open Font License 1.1, with system fallbacks. Full font licenses ship in the runtime notices. AWS CLI is a local operator tool, not shipped in the frontend. Edge is used for automated browser QA, not redistributed.

## Input credit and external references

- Synthetic fixture and project handoff: provided by the user/team in `context/`. Preserve original values and confirm redistribution rights with the team. No municipal, census, medical or facility source is claimed.
- [Vite getting started](https://vite.dev/guide/): checked for supported Node runtime during implementation.
- [AWS Amplify manual deployment](https://docs.aws.amazon.com/amplify/latest/userguide/manual-deploys.html): checked for ZIP-content and static hosting instructions.
- [AWS Amplify redirects](https://docs.aws.amazon.com/amplify/latest/userguide/redirects.html): reference for future multi-route hosting.
- [Open-Meteo](https://open-meteo.com/en/docs): regional forecast API, fetched only on request. Data attribution: [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). The [API terms](https://open-meteo.com/en/terms) restrict the free service to noncommercial use; review an appropriate plan before commercial operation. Forecast source/fetch times, cached state and attribution are shown in the card. Browser requests share request metadata and the requested region with the provider.
- [OpenStreetMap contributors](https://www.openstreetmap.org/copyright): geographic base tiles and data attribution, with ODbL data terms. [Tile usage policy](https://operations.osmfoundation.org/policies/tiles/) applies to the standard public tile service. Maps are opt-in, retain attribution and browser caching/referrer behavior, and do not prefetch, bulk-download or implement offline tile storage. OSM is not the source of fixture population, weights or site verification.
- [Leaflet reference](https://leafletjs.com/reference.html): map integration documentation.
- [WHO heat and health](https://www.who.int/news-room/fact-sheets/detail/climate-change-heat-and-health): source for paraphrased general heat-safety information; no copied clinical protocol or diagnostic claim.
- [India Emergency Response Support System](https://112.gov.in/): source for the optional manual 112 contact link; no automated dispatch integration.
- Event sources supplied in the handoff: [overview](https://www.wemakedevs.org/aws/env), [rules](https://www.wemakedevs.org/aws/env/rules), [schedule](https://www.wemakedevs.org/aws/env/schedule). This build does not assert verified eligibility, deadline hour or submission acceptance.

No WorldPop raster or real facility/population dataset is bundled. Weather/OSM service availability does not verify pilot inputs or cooling-center operations. Their licenses do not confer rights to operator-supplied data.

## Licensing action

`LICENSE` records **LICENSING_PENDING_TEAM_CHOICE**. The team must choose a license for original code and confirm fixture redistribution before claiming an open-source grant. Third-party licenses remain applicable regardless of that choice.
