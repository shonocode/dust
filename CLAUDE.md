# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

D.U.S.T (Digital Undercover Surveillance Terminal) — a CRT-terminal-styled PWA that browses the FBI Wanted API (`https://api.fbi.gov/@wanted`). Built with React Router v8 (framework mode), React 19, Tailwind CSS v4, and vite-plugin-pwa.

## Commands

- `npm run dev` — dev server with HMR at http://localhost:5173
- `npm run build` — production build; SPA mode outputs static files to `build/client/` only (the server build is deleted because of `ssr: false`)
- `npm run start` — serve the static production build locally (`npx serve`). Do not switch it back to `react-router-serve`: there is no server build in SPA mode. The Dockerfile serves `build/client/` via nginx for the same reason.
- `npm run typecheck` — generates React Router route types (`react-router typegen`) then runs `tsc`. Run typegen/typecheck after adding or renaming routes, since route modules import generated types from `./+types/<route>`.
- `npm test` — Vitest (config in `vitest.config.ts`, deliberately separate from vite.config.ts so the react-router/PWA plugins don't load). `npm run test:watch` for watch mode; run a single file with `npx vitest run app/lib/format.test.ts`. Tests use jsdom (not happy-dom — DOMPurify needs it) and `createRoutesStub` from react-router for components that touch search params.

There is no linter configured.

## Architecture

- **SPA mode**: `react-router.config.ts` sets `ssr: false`. All data loading uses `clientLoader` (not `loader`) — fetches happen in the browser directly against the FBI API. Keep it that way unless deliberately enabling SSR.
- **Routing**: declared in [app/routes.ts](app/routes.ts) using `@react-router/dev/routes` config helpers (not file-convention routing). Route modules import generated types via `./+types/<route-basename>` relative to the route file. All routes are wrapped in the [app/crt.tsx](app/crt.tsx) layout, which renders the CRT visual effects (flicker, scan-lines, vignette) around an `<Outlet />`. New routes must be registered in `routes.ts`.
- **Routes**: `/` (landing), `/suspects` (paginated/filterable list), `/suspects/:uid` (detail), `/stats` (crime statistics). All loaders return `{ key: promise }` objects (deferred pattern) rendered through `<Suspense>` + `<Await>` so the page shell renders immediately. Do not `await` the fetch in the loader and do not return a bare promise from an async loader — async-function thenable flattening would silently make it blocking.
- **API layer**: all external calls live in [app/lib/fbi-api.ts](app/lib/fbi-api.ts) (FBI Wanted API) and [app/lib/cde-api.ts](app/lib/cde-api.ts) (FBI Crime Data Explorer), both on the shared `fetchJson` in [app/lib/http.ts](app/lib/http.ts); loaders never call `fetch` directly. Failures throw an `Error` whose message is shown to users via the `AwaitError` component (`useAsyncError`) — put user-facing text in the error message.
- **FBI Wanted API quirks** (undocumented, verified against the live API): list filters `poster_classification` (ten/missing/kidnapping/fraudster/information), `status` (na/captured), `sex` (lowercase male/female), `race`, `hair`, `eyes` all work and are whitelisted in `LIST_FILTER_KEYS`; page size is fixed at 20. Filter/tab/pagination state lives entirely in URL search params.
- **Crime Data Explorer**: needs a free api.data.gov key via `VITE_DATA_GOV_API_KEY` (see `.env.example`); falls back to `DEMO_KEY` (~10 req/hour — probing many endpoints in a row will hit 429 and return empty-looking data). Only the offense slugs listed in [app/routes/stats.tsx](app/routes/stats.tsx) are verified to work. The landing-page link to `/stats` only renders when the key is set (the route itself stays registered and reachable by URL) — setting the key in `.env` is all it takes to surface the page.
- **Sanitization**: `caution`/`remarks` are API-supplied HTML rendered via `dangerouslySetInnerHTML` — always pass through DOMPurify (`processHTML` in [app/lib/format.ts](app/lib/format.ts), alongside the range/height formatters).
- **Offline**: workbox `runtimeCaching` in vite.config.ts caches FBI API (NetworkFirst), suspect photos (CacheFirst), and CDE API (NetworkFirst). Legal footer (unofficial-app disclaimer) lives in the `crt.tsx` layout — keep it on all pages; FBI seals/branding must never be added (18 U.S.C. §§ 701, 709).
- **Filtering/pagination** is URL-driven: `LIST_FILTER_KEYS` in fbi-api.ts is the single authority on which params are forwarded to the FBI API. Components mutate the URL through `useUpdateSearchParams` ([app/lib/search-params.ts](app/lib/search-params.ts)); the filter form's inputs are deliberately uncontrolled so unsubmitted text survives pagination/tab navigation — its Clear button empties element values manually (`form.reset()` would revert to URL-derived defaultValues instead).
- **Types**: FBI API response shapes live in [app/types/fbi-wanted.ts](app/types/fbi-wanted.ts) (`FBISuspect`, `FBIImage`, `FBIFile`).
- **Styling**: Tailwind v4 (via `@tailwindcss/vite`, configured in CSS not a tailwind.config file) plus CSS modules for bespoke effects (e.g. `home.module.css` typewriter/link animations). Global theme in [app/app.css](app/app.css); the VT323 terminal font is loaded in `root.tsx`. CRT effects are pure CSS: `@utility crt-image` (phosphor-green photo tint) and `@utility crt-flicker` (screen flicker keyframes) in app.css — the flicker was deliberately moved off a JS `setInterval` that re-rendered the whole tree; keep it in CSS.
- **PWA**: configured in [vite.config.ts](vite.config.ts) (manifest, workbox precaching, auto-update); icons generated via `pwa-assets.config.ts`. PWA dev options are disabled — service worker behavior only appears in production builds. The manifest is wired up manually in `root.tsx` via `virtual:pwa-info`. vite-plugin-pwa does not know about React Router's `build/client` output dir — both the plugin's `outDir` and `pwaAssets.integration.outDir` are explicitly set to it in vite.config.ts; keep those in sync if the build directory changes.
- **Path alias**: `~/*` maps to `app/*` (tsconfig `paths` + Vite's native `resolve.tsconfigPaths: true` — the vite-tsconfig-paths plugin was removed as Vite 8 supports this natively).
