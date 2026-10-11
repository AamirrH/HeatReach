# HeatReach interface design

The 11 October 2026 redesign adapts the user-supplied `stitch_heatreach_resilience_planner_ui.zip`. Its two mobile HTML/screenshots and Cartographic Climate Matrix design guide establish the visual reference. Desktop, tablet and public-directory layouts extend that reference to the existing application.

## Implemented visual system

- Warm ivory canvas, white panels, charcoal text, terracotta selection/optimization accents and slate-blue controls and data surfaces. Sage is reserved for existing-access map markers. No gradients.
- Square panel and control geometry, thin structural borders, geometric headings and tabular metrics.
- Space Grotesk and Public Sans variable fonts served from the application's own assets. Fontsource packages are pinned, and complete SIL OFL notices ship in `public/THIRD_PARTY_NOTICES.txt`.
- Native SVG icons replace the export's remote icon fonts and hotlinked logo. No Tailwind CDN, Google Fonts requests or exported demonstration scripts are loaded.
- Desktop header navigation becomes a fixed, labelled bottom navigation bar on mobile. Page padding keeps the footer above it. Zooming remains enabled.
- Collapsible planning controls and explicit schematic-map/accessible-table buttons. Desktop metrics precede the three-column workspace; mobile metrics follow the map and precede explanations.
- Comparison callouts derive raw and weighted differences from the actual solver result. Geographic import, weather, CSV/print and verified-facility views share the new visual system.

## Data and behavior retained

The Stitch export is a visual reference, not a replacement for domain logic or source data. It contained invented site names, marginal gains, sensitivity results, a NOAA weather card, simulated state toggles, and unsupported claims about protection, walkability and vulnerability indicators. These were not imported. The canonical fixture, exact solver, first-eligible baseline, actual weather service, provenance requirements and public verification rules remain in force.

The exported HTML's disabled browser zoom, unsupported accessibility certification badge, account avatar and inactive settings controls were also omitted. Existing keyboard focus, semantic controls, reduced-motion support, network failure states and print behavior remain available. The import panel stays expanded after pilot activation so returning to the illustrative scenario remains discoverable.

## Verification

67 domain/React tests and 8 Edge browser workflows pass. Browser checks cover 1280px desktop, 820px tablet and 375px mobile, with additional visual inspection at 1440px and 390px. They exercise the real optimization, collapse/expand, map/table switching, audience navigation, geographic import/reset, verification expiry, weather failure, export and print. No horizontal page overflow was detected at the tested widths.

Current previews: [desktop](screenshots/stitch-planner-desktop.png), [mobile](screenshots/stitch-planner-mobile.png), [public directory](screenshots/public-empty-1280.png). Full-page planner evidence is saved at `planner-1280.png`, `planner-820.png` and `planner-375.png` in the same directory. Local screenshots do not establish AWS deployment.

## Publication provenance

On 11 October 2026 the team confirmed that Google Stitch generated this design specifically for HeatReach. The adapted application design is cleared for publication as documented in [the rights review](RIGHTS_REVIEW.md). MIT applies only to authorized team-held rights; licensed fonts/libraries remain under their own terms, and no copyright protection or third-party clearance is inferred from AI generation alone.
