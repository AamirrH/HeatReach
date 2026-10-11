# AI, sources and attribution

## Actual tool use

OpenAI Codex assisted with reading the user-provided handoff, implementing the engine and UI, writing tests/documentation, executing builds and browser tests, and committing/pushing milestone changes. A human team should review the result. No claim is made of unassisted authorship or independent field research. The Sites skill's local development/preview guidance was consulted; the user-required Vite/AWS architecture takes precedence and no Sites hosting was created.

No AI-generated imagery, stock images, copied third-party artwork, externally hosted fonts, maps, or fake cloud screenshots are used. The logo is a simple original HTML/CSS treatment, and the map is generated from fixture data by SVG. Screenshots were captured from the actual running local application with Playwright.

## Dependencies

Direct dependency versions and transitive integrity hashes are fixed in `package-lock.json`. React/React DOM, Vite and its React plugin, Zod, Vitest, Testing Library packages, jsdom and the TypeScript type packages use MIT licenses. TypeScript and Playwright use Apache-2.0. Prettier uses MIT. Installed dependency license metadata and notices remain in each dependency package; generated build output retains relevant bundler notices. These licenses do not automatically assign a license to this project's original source or the supplied fixture.

The application uses system fonts and browser primitives. AWS CLI is a local operator tool, not shipped in the frontend. Edge is used for automated browser QA, not redistributed.

## Input credit and external references

- Synthetic fixture and project handoff: provided by the user/team in `context/`. Preserve original values and confirm redistribution rights with the team. No municipal, census, medical or facility source is claimed.
- [Vite getting started](https://vite.dev/guide/): checked for supported Node runtime during implementation.
- [AWS Amplify manual deployment](https://docs.aws.amazon.com/amplify/latest/userguide/manual-deploys.html): checked for ZIP-content and static hosting instructions.
- [AWS Amplify redirects](https://docs.aws.amazon.com/amplify/latest/userguide/redirects.html): reference for future multi-route hosting.
- [Open-Meteo](https://open-meteo.com/en/docs): retained in original fixture metadata only; no weather API integration or data redistribution in this release.
- Event sources supplied in the handoff: [overview](https://www.wemakedevs.org/aws/env), [rules](https://www.wemakedevs.org/aws/env/rules), [schedule](https://www.wemakedevs.org/aws/env/schedule). This build does not assert verified eligibility, deadline hour or submission acceptance.

No WorldPop raster, OpenStreetMap tiles or external geospatial dataset is used. Do not credit those providers as contributors to modelled fixture results.

## Licensing action

`LICENSE` records **LICENSING_PENDING_TEAM_CHOICE**. The team must choose a license for original code and confirm fixture redistribution before claiming an open-source grant. Third-party licenses remain applicable regardless of that choice.
