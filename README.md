# D.U.S.T

**Digital Undercover Surveillance Terminal** — a CRT-terminal-styled PWA for
browsing the public [FBI Wanted API](https://www.fbi.gov/wanted/api).

Green phosphor, scan-lines, screen flicker — and real, live data on wanted
fugitives, missing persons, and the Ten Most Wanted.

> **Unofficial app.** Not affiliated with, approved, or endorsed by the FBI.
> All individuals are presumed innocent until proven guilty.

## Features

- **Suspect browser** — paginated, searchable list of FBI Wanted records
- **Category tabs** — Ten Most Wanted / Missing / Kidnapping / Fraudsters / Seeking Info
- **Filters** — name, field office, sex, race, hair, eyes, capture status
- **Detail records** — biometrics, rewards, aliases, cautions, official wanted-poster PDFs, links to the official FBI record
- **Crime statistics** — monthly state-vs-national offense rates as an ASCII bar chart (FBI Crime Data Explorer API)
- **Installable PWA** — offline support for previously viewed records and photos

## Stack

React Router v8 (framework mode, SPA) · React 19 · Tailwind CSS v4 · vite-plugin-pwa · Vitest

## Getting started

```bash
npm install
npm run dev        # http://localhost:5173
```

Other commands:

```bash
npm test           # unit/component tests (Vitest)
npm run typecheck  # route typegen + tsc
npm run build      # production build → build/client/
npm run start      # serve the production build locally
```

### Crime stats API key (optional)

The `/stats` page uses the FBI Crime Data Explorer API via
[api.data.gov](https://api.data.gov/signup/), which requires a free API key.
Without one it falls back to the shared `DEMO_KEY` (~10 requests/hour) and the
landing-page link to the stats page is hidden.

```bash
cp .env.example .env
# set VITE_DATA_GOV_API_KEY=your-key
```

Note: this is a client-side SPA, so the key is visible in the shipped bundle.
api.data.gov keys are free and per-user; treat it accordingly.

## Deployment

The build is fully static (`build/client/`) — deploy it to any static host
(GitHub Pages, Cloudflare Pages, Netlify, …) with SPA fallback rewrites to
`index.html`.

Or use the included nginx-based Docker image:

```bash
docker build -t dust .
# optionally: --build-arg VITE_DATA_GOV_API_KEY=your-key
docker run -p 8080:80 dust
```

## Data sources & legal

- [FBI Wanted API](https://www.fbi.gov/wanted/api) — no key required. US
  government works are public domain; some photos may carry third-party
  copyright.
- [FBI Crime Data Explorer](https://cde.ucr.cjis.gov/) via api.data.gov.
- Record HTML (cautions/remarks) is sanitized with DOMPurify before rendering.
- Per 18 U.S.C. §§ 701 & 709, this project must not use FBI seals or present
  itself as FBI-approved — hence the disclaimer in the footer. Keep it.

## License

[MIT](LICENSE)
