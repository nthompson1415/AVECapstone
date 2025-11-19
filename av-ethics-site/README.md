# Autonomous Vehicle Ethics Lab

Interactive site for the IST 477 capstone exploring whether autonomous vehicles should follow demographic-blind rules (German Ethics Commission) or adapt to richer, context-sensitive data. The site bundles every deliverable in one GitHub Pages–friendly React app:

- **Ethical Choice Analyzer** (`/analyzer`) — utilitarian, deontological, and virtue-ethics walkthrough of trolley-style crash dilemmas with optional controversial factors, extended legal/fault inputs, and network effects.
- **Personal Ethics Calibrator** (`/calibrator`) — slider-driven survey that lets viewers weight factors (age, health, occupation, etc.) and see how their own framework scores scenarios.
- **Findings, poster, and slide deck** — embedded HTML poster and presentation plus the full markdown report rendered with syntax highlighting.

## Project Structure

```
av-ethics-site/
├── public/
│   ├── poster.html                # Capstone poster
│   └── presentation.html          # Presentation 3 slide deck
├── src/
│   ├── components/
│   │   ├── EthicalChoiceAnalyzer.jsx
│   │   └── PersonalEthicsCalibrator.jsx
│   ├── content/preliminary_findings.md
│   ├── data/scenario_analysis_data.csv
│   ├── pages/                     # Routed views (home, findings, poster, etc.)
│   ├── App.jsx                    # Router + global nav
│   └── main.jsx                   # BrowserRouter + Tailwind entry point
└── vite.config.js                 # base:'./' for GitHub Pages
```

## Prerequisites

- Node.js 18+ (recommended 20.11+) and npm 9+

Install dependencies once:

```bash
cd av-ethics-site
npm install
```

## Local Development

```bash
npm run dev      # start Vite dev server (default http://localhost:5173)
```

## Production Build

```bash
npm run build    # outputs static assets to dist/
npm run preview  # serve dist/ locally for smoke testing
```

## GitHub Pages Deployment

1. **Confirm repository base**  
   The Vite config uses `base: './'`, which works for both user/organization sites (`username.github.io`) and project sites (`username.github.io/repo`). If you prefer the canonical `/repo-name/` style, update `vite.config.js` accordingly.

2. **Publish a production build to gh-pages**

```bash
npm run deploy
```

The script runs `npm run build` and pushes the contents of `dist/` to a `gh-pages` branch via [`gh-pages`](https://www.npmjs.com/package/gh-pages).

3. **Enable GitHub Pages**
   - In the GitHub repo, open **Settings → Pages**.
   - Set the source to **Deploy from branch** → `gh-pages` → `/ (root)`.
   - Save. Pages will publish in ~1 minute at `https://<username>.github.io/<repo>/`.

4. **Redeploying**  
   Re-run `npm run deploy` after each change. The `gh-pages` branch is regenerated automatically.

## Data + Content Sources

- `scenario_analysis_data.csv` — harm calculations for six canonical AV dilemmas across connectedness levels.
- `preliminary_findings.md` — narrative summary (rendered on `/findings` via `marked`).
- `poster.html` & `presentation.html` — static deliverables copied verbatim so they render without additional tooling.

## Troubleshooting

- **Blank iframe on GitHub Pages** — ensure `poster.html` and `presentation.html` exist in the repo root _before_ running `npm run deploy`. They live under `public/` so Vite copies them automatically.
- **Router 404s** — because we use `BrowserRouter` with `basename={import.meta.env.BASE_URL}`, hard refreshes work once Pages is configured to the `gh-pages` branch. If you serve the app from a subdirectory, keep `base: './'` or change both `vite.config.js` and the router `basename` to the same value.
