# Release rights review — 11 October 2026

Status: **LICENSING RESOLVED for the reviewed release**, based on the team's provenance and contributor confirmations, applicable provider terms and the repository evidence below. No specific material rights conflict was identified. This assessment does not guarantee copyright protection, uniqueness or absence of all possible third-party claims.

## Confirmed provenance and authorization

The team confirmed that ChatGPT generated the master specification specifically for HeatReach and that the illustrative fixture originated in it. Google Stitch generated the UI specifically for HeatReach, which was then adapted into the application. All contributors approved public publication and MIT licensing of their authorized original contributions, using **HeatReach Contributors**, 2026. These declarations supersede the earlier uncertainty about supplied fixture/design provenance; they are not inferences from Git authorship.

## Applicable output terms

[OpenAI Terms of Use](https://openai.com/policies/row-terms-of-use/) (effective 1 January 2026, reviewed 11 October): between OpenAI and the user, applicable law permitting, the user owns output and receives any OpenAI rights in it. Users must have rights to inputs. Outputs need not be unique; the assignment excludes others' output and third-party output. These terms support distribution of the project-generated specification/fixture without establishing copyright in every generated element.

Google's [service-specific list](https://policies.google.com/terms/service-specific?hl=en) expressly lists Stitch under [Google Terms of Service](https://policies.google.com/terms) and the [Generative AI Prohibited Use Policy](https://policies.google.com/terms/generative-ai/use-policy), reviewed 11 October 2026. Google does not claim ownership of original generated content. Input rights and third-party intellectual property remain the user's responsibility. No restriction preventing publication of this project's generated/adapted design was identified; the prohibited-use policy remains applicable.

Permission to distribute output is distinct from statutory copyright protection. AI generation does not clear copied material, establish exclusivity or authorize relicensing third-party works. MIT grants only rights the team holds and may license; it creates no copyright in otherwise unprotectable material.

## Fixture evidence

Both canonical fixture copies originate in commit 5d948c770d27d32b11a969195a8622445afe3d6e. The master specification's “Standalone fallback: embedded canonical fixture” contains the same JSON. Metadata describes purpose-built synthetic algorithm-test data: fictional populations, weights, facilities, costs and schematic geometry. The fixture remains unchanged. Together with the team's ChatGPT provenance confirmation, this documents its publication source rather than asserting external data collection.

No WorldPop, census, municipal population or actual facility dataset is bundled. The public facility catalog is empty; geographic test records are invented. Open-Meteo supplies optional forecast context, not illustrative values. Dataset publication is cleared on this evidence; any team-held rights fall within the limited MIT grant.

## Design evidence

Commit 1991b3e97576ee21fcb600906e0d7460647e73a2 adapted the Stitch reference into React/CSS, inline SVG icons and licensed Fontsource fonts. DESIGN.md identifies the supplied export. The team now confirms generation specifically for this project. The original export/prompts are not tracked, so this review does not claim independent inspection of every generation input.

Tracked source/assets/history show CSS, SVG/HTML artwork, licensed fonts and application screenshots. No incorporated third-party reference design, uploaded reference artwork, stock photograph or external dataset requiring additional permission was identified. Stitch demonstration scripts and hotlinked imagery were not shipped. Publication of the adapted design is cleared based on the affirmative project provenance declaration, contributor authorization, applicable terms and repository inspection. No hypothetical missing input is treated as a specific conflict; newly introduced third-party inputs require their own review.

## Distribution boundaries

Root LICENSE and public/HEATREACH_LICENSE.txt carry the same limited MIT grant. Full third-party notices remain unchanged in public/THIRD_PARTY_NOTICES.txt and ship with the build.

React Leaflet/core retain **Hippocratic-2.1**, including human-rights use conditions, arbitration and specified indemnity provisions, plus older MIT notices. Leaflet is BSD-2-Clause; React/React DOM/scheduler/Zod are MIT; fonts are OFL-1.1. Build dependencies also include MPL-2.0, Apache-2.0, ISC, BSD and MIT-0. Lightning CSS is a build tool, not a redistributed tool binary in the website. Open-Meteo attribution/noncommercial free-API terms and OpenStreetMap attribution/data/tile conditions remain applicable. See [full attribution](AI_AND_ATTRIBUTION.md). The combined distribution is not solely MIT-licensed.

No incompatible redistribution requirement was identified for this static prototype with these conditions preserved. The repository was already public; this review did not change visibility. No specific rights issue requiring replacement, history rewriting or additional owner permission remains. AWS deployment and hackathon submission remain separate operational actions, not completed by this review.
