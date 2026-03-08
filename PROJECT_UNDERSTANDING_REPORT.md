# AirWaterMonitor Project Understanding & Iteration Report

## 1) Project understanding

### Product goal
AirWaterMonitor is a Next.js data dashboard that combines:
- Air quality (OpenAQ PM2.5)
- Drinking water safety coverage (World Bank indicator SH.H2O.SMDW.ZS)

It presents global map visualizations, rankings, and blog insights, then deploys on Vercel from GitHub.

### Tech stack
- Framework: Next.js App Router
- Language: TypeScript
- UI: React + Tailwind CSS
- Mapping: react-simple-maps + TopoJSON in `public/world-110m.json`

### Key structure
- Routes: `app/page.tsx`, `app/air-quality/page.tsx`, `app/water-quality/page.tsx`, `app/blog/page.tsx`, `app/privacy/page.tsx`
- Map UI: `components/WorldMap.tsx`
- Rankings: `components/RankingPanel.tsx`
- Data adapters: `lib/airQuality.ts`, `lib/waterQuality.ts`, `lib/countries.ts`

### Runtime behavior
- Server components fetch and aggregate source data.
- `WorldMap` receives country-level arrays (`iso3`, `value`, `name`) and renders choropleth fill.
- Clicking a country opens side-by-side detail panel for selected metrics.

## 2) Bug diagnosis: map looked "not displayed"

### Observed symptom
Map outlines rendered, but almost all countries were in fallback color, so users perceived map data as missing.

### Root cause
`WorldMap` was matching data only by `geo.properties.ISO_A3`. The bundled `public/world-110m.json` country geometry uses `name` and numeric ids (world-atlas style), not `ISO_A3`. Result: almost no datum matching, so the map looked empty.

## 3) Fix implemented

### File changed
- `components/WorldMap.tsx`

### Core changes
1. Added robust geometry ISO resolver (`ISO_A3`, `ADM0_A3`, `WB_A3`, `SU_A3`, `BRK_A3`).
2. Added normalized country-name fallback matching when ISO code is absent.
3. Added alias normalization for common naming differences (for example, `United States of America` -> `United States`).
4. Updated no-data fill color to a clearer neutral shade so loaded vs unloaded areas are easier to distinguish.
5. Ensured click selection uses resolved ISO key when available.

## 4) Iteration log (10 versions)

### V1
- Cloned repository and inspected project layout and route structure.

### V2
- Ran dependency install and production build to verify baseline runtime.

### V3
- Reproduced the issue on `/air-quality` and confirmed map render was visually near-empty.

### V4
- Inspected `WorldMap` lookup logic and identified strict `ISO_A3` dependency.

### V5
- Inspected `public/world-110m.json` schema and confirmed it lacks `ISO_A3` for countries.

### V6
- Implemented multi-field ISO resolver to support multiple TopoJSON property conventions.

### V7
- Implemented normalized name-based fallback matching to support world-atlas `name` fields.

### V8
- Added country alias normalization for frequent naming mismatches across datasets.

### V9
- Improved fallback/no-data visual contrast and stabilized selection key behavior.

### V10
- Re-validated with lint + browser screenshot: map now shows data-colored countries correctly.

## 5) Validation results

- `npm run lint`: pass
- Visual validation on `/air-quality`: colored countries now render correctly (data no longer appears missing).

## 6) Deployment flow

This repository is connected to GitHub + Vercel. After pushing commit(s), Vercel auto-deploy is triggered by default project integration.

## 7) Suggested next hardening steps

1. Add a small unit test for country matching normalization logic.
2. Consider switching to a topology source with stable ISO3 properties to reduce fallback complexity.
3. Add a "matched countries count" debug metric in development mode for faster diagnostics.

## 8) Map interaction enhancement (second 10-version iteration)

### Goal
Improve map usability after the data-match bug fix by making interaction clearer and faster for users.

### V1
- Re-reviewed `WorldMap` interaction flow and identified lack of hover feedback.

### V2
- Added interaction model: hover = quick preview, click = persistent detail pin.

### V3
- Introduced `HoverPreview` state structure to carry country/data snapshot.

### V4
- Added `onMouseEnter` preview updates on each geography region.

### V5
- Added `onMouseLeave` reset behavior to avoid stale tooltip state.

### V6
- Added compact hover info card showing country name, metric value, and ISO when available.

### V7
- Added "Live data coverage" indicator to surface how many countries currently have data.

### V8
- Added concise interaction hint text so users immediately know how to use map gestures.

### V9
- Validated that hover preview works for both data and no-data countries without errors.

### V10
- Final polish pass on visual hierarchy and messaging consistency with existing dashboard style.
