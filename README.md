# SmartSkin Africa — AI-Powered Skin Analysis

A web application that guides a user through a skin-type assessment — gender and age, a
questionnaire, a facial photo — and returns a skin-type classification with tailored skincare
recommendations and a paid, shareable report.

Built for the Ghanaian market. Live at **[smartskinafrica.com](https://smartskinafrica.com)**.

---

## ⚠️ Read this first: how the analysis actually works

The name says "AI-Powered", but **the image analysis currently running in this repo is not a
machine-learning model.** It is a deterministic heuristic that runs entirely in the user's browser.

[`src/client-skin-analysis.ts`](src/client-skin-analysis.ts) draws the uploaded photo to a 256×256
`<canvas>`, reads the raw pixel data, and computes five statistics:

| Feature | How it is derived |
| --- | --- |
| `avgBrightness` | Mean luminance across sampled pixels |
| `rednessLevel` | Share of pixels where the red channel dominates green/blue |
| `oilinessLevel` | Share of high-luminance specular pixels |
| `textureVariance` | Local variance between neighbouring pixels |
| `colorUniformity` | Inverse spread of pixel colour values |

Those five numbers are then run through hand-tuned thresholds in `determineSkinType()` to pick one
of `dry` / `oily` / `combination` / `normal` / `sensitive`. If anything throws, it falls back to a
questionnaire-derived guess, and if that fails too, to a hardcoded "normal" result.

**Consequences you should be aware of:**

- Results are sensitive to lighting, white balance, and camera hardware, not just skin.
- The reported "confidence" percentage is computed from the same heuristics — it is not a model
  probability and should not be read as one.
- The console logs in that file (`SWAPPED MARKERS`, `NON-OVERLAPPING`) are leftovers from manually
  tuning thresholds so skin types stopped overlapping. They are debugging aids, not documentation.

The original design called a third-party ML service (Orbo). That integration still exists in
[`src/api.ts`](src/api.ts) but the entry points are stubbed — `getSessionId()` returns a
locally-generated `client-<timestamp>-<random>` string instead of registering a real session, and
`detectSkinType()` delegates to the local heuristic. The methods marked `🔧 MOCK` are the stubs;
the Orbo `fetch` calls further down the file are the dormant real path.

If you are picking this project up: decide deliberately whether you are shipping the heuristic or
restoring the Orbo integration. Do not assume the ML path is live.

---

## Architecture

The repo contains **two build targets that share one `src/` directory**.

### 1. Marketing site + analyzer (Next.js) — the live product

Next.js 15 App Router, statically exported (`output: 'export'`) to `./build`. This is what
`smartskinafrica.com` serves.

```
src/app/                    Next.js routes (static pages)
  page.tsx                  Home
  about-us/                 About
  contact-us/               Contact form → payment backend
  features/                 Feature list (content from src/data/features.json)
  privacy-policy/           Privacy policy
  terms-and-conditions/     Terms
  layout.tsx                Root layout, Navbar, Orbo Smart Capture SDK <script>
```

The analyzer itself is **not** a route. It lives in [`src/App.tsx`](src/App.tsx) and is mounted
inside a fullscreen dialog on the home page:

```
app/page.tsx → components/TryNow/ → TryNow/FullscreenDialog.tsx
             → components/OrboSkinAnalyzer.tsx → src/App.tsx  (the flow)
```

### 2. Standalone embeddable widget (Vite) — currently not buildable

`index.html` + [`src/main.tsx`](src/main.tsx) mount the same `App.tsx` into a bare
`<div id="orbo-cc-skin-analyzer-container">`, bundled by Vite with `vite-plugin-singlefile` into a
single JS file. `button.liquid` and `script.liquid` are the Shopify theme snippets that inject that
bundle into a store page and open it in a modal.

**This target is broken:** `vite.config.ts` was deleted in commit `071c048` when the project moved
to Next.js, but the `dev` / `build` / `preview` scripts and the Vite dependencies were left in
`package.json`. To restore it:

```bash
git show 5043bb8:vite.config.ts > vite.config.ts
```

Then re-add `viteSingleFile()` to the plugin list. Otherwise, treat `npm run dev`, `npm run build`,
and `npm run preview` as dead scripts and use the `next:*` scripts instead.

---

## The analyzer flow

`src/App.tsx` is a state machine driven by a single `view` string held in
[`src/context.tsx`](src/context.tsx). There is no router inside the analyzer.

```
Gender ──► Age ──► KnowSkinType
                        │
        ┌───────────────┴───────────────┐
        │ user knows their skin type    │ user does not
        ▼                               ▼
     SkinType                     CaptureUpload
        │                               │
        │                               ▼
        │                          PicCapture ──► AnalyzingAI ──► AIResults
        │                                                             │
        └────────────────────────┬────────────────────────────────────┘
                                 ▼
                              Details          (name, email, WhatsApp number, consent)
                                 │
                                 ▼  Paystack payment
                            Recommendation     (scores + product recommendations)
```

| View | Source |
| --- | --- |
| `Gender`, `Age`, `KnowSkinType`, `SkinType`, `CaptureUpload` | [`src/skin-pages/questionnaire/`](src/skin-pages/questionnaire/) |
| `PicCapture`, `AnalyzingAI`, `AIResults` | [`src/skin-pages/pic-capture/`](src/skin-pages/pic-capture/) |
| `Details` | [`src/skin-pages/details/`](src/skin-pages/details/) |
| `Recommendation` | [`src/skin-pages/recommendation/`](src/skin-pages/recommendation/) |
| `HomePage` | [`src/skin-pages/homePage/`](src/skin-pages/homePage/) |

Photo capture uses Orbo's **Smart Capture SDK**, loaded from a CDN `<script>` tag in
`src/app/layout.tsx` and typed as `window.OrboSmartCapture`. It handles face framing and quality
checks before handing back an image blob. Users can also upload a file directly.

Payment runs through **Paystack** via `@paystack/inline-js`, brokered by a separate backend at
`payment.smartskinafrica.com` ([`src/payment-api.ts`](src/payment-api.ts)):

1. `getPaymentData()` → fetches the public Paystack key and the current price
2. `initiatePayment()` → creates the transaction, returns an access code
3. Paystack inline popup collects card details (card data never touches this app)
4. `verifyPayment()` → server-side confirmation before the report is released

The finished report is delivered to the WhatsApp number collected on the `Details` screen.

---

## Tech stack

| Concern | Choice |
| --- | --- |
| Framework | Next.js 15.5 (App Router, static export) |
| UI | React 18, MUI 6 (`@mui/material`, `@mui/lab`, `@mui/icons-material`), Emotion |
| Forms | React Hook Form + Yup, `libphonenumber-js` for phone validation |
| Payments | Paystack (`@paystack/inline-js`) |
| Image capture | Orbo Smart Capture SDK (CDN) |
| Language | TypeScript 5.5 |
| Legacy bundler | Vite 6 (widget target, see above) |
| Lint | ESLint 9 + typescript-eslint |

---

## Getting started

### Prerequisites

- Node.js **22.x** (developed on v22.22.0)
- npm **10.x**

### Install

```bash
git clone https://github.com/KobbyKobby1/AI-Powered-SmartSkin-Analysis
cd AI-Powered-SmartSkin-Analysis
npm install
```

### Configure environment

```bash
cp .env.example .env.local
```

Fill in the values (see the table below), then:

### Run

```bash
npm run next:dev      # dev server at http://localhost:3000
npm run next:build    # static export into ./build
npm run start         # serve ./build at http://localhost:9900
npm run lint          # eslint
```

---

## Environment variables

All configuration is read from `.env.local` via [`src/env.ts`](src/env.ts), which **throws a clear
error at startup if a variable is missing** rather than failing later with an opaque 401.

| Variable | Purpose | Example |
| --- | --- | --- |
| `NEXT_PUBLIC_ORBO_BASE_URL` | Orbo skin-analysis API root | `https://api.ghanaskinanalysis.orbo.tech/api` |
| `NEXT_PUBLIC_ORBO_CLIENT_KEY` | Orbo client key | `ORBO…` |
| `NEXT_PUBLIC_PAYMENT_BASE_URL` | SmartSkin payment backend | `https://payment.smartskinafrica.com/payment` |
| `NEXT_PUBLIC_PAYMENT_API_KEY` | Payment backend API key | UUID |

Dev vs. production is now a matter of changing `.env.local` — **not** commenting and uncommenting
lines in `src/api.ts`, which is how this repo used to do it.

> **Security note.** `NEXT_PUBLIC_*` values are inlined into the static bundle at build time and are
> readable by anyone who opens devtools. They are public identifiers, not secrets. Anything that must
> stay secret has to live behind the payment backend. Because these keys were previously hardcoded in
> `src/api.ts` and `src/payment-api.ts` and committed to a public repository, **they remain in git
> history and should be rotated** — see [Security](#security) below.

---

## Project structure

```
.
├── src/
│   ├── app/                      Next.js App Router routes + layout
│   ├── components/               Shared UI
│   │   ├── Navbar/               Nav, sign-in and register dialogs
│   │   ├── TryNow/               CTA + fullscreen analyzer dialog
│   │   ├── Snackbar/             Toast notifications + hook
│   │   ├── OrboSkinAnalyzer.tsx  Wrapper that mounts App.tsx
│   │   ├── OTP.tsx               One-time-password input
│   │   └── EaseOfUse|FAQ|Footer|HowItWorks|PreciseSkin|Provide/
│   ├── skin-pages/               The analyzer's screens (see flow above)
│   ├── api.ts                    Orbo API client + mocked detection entry points
│   ├── client-skin-analysis.ts   Browser-side heuristic analysis engine
│   ├── payment-api.ts            Paystack backend client + contact form
│   ├── context.tsx               ViewProvider — analyzer state (view, session, results)
│   ├── env.ts                    Environment variable reader with fail-fast validation
│   ├── styles.ts                 Shared MUI style objects
│   ├── App.tsx                   Analyzer state machine
│   ├── main.tsx                  Vite entry point (widget target)
│   └── data/features.json        Content for /features
├── public/                       Static assets, favicon, Orbo smart-capture assets
├── index.html                    Vite entry HTML (widget target)
├── button.liquid                 Shopify: trigger button snippet
├── script.liquid                 Shopify: modal + bundle loader snippet
├── next.config.mjs               Static export config, distDir = ./build
└── .env.example                  Environment template
```

---

## Deployment

`npm run next:build` produces a fully static site in `./build` — no Node server required. Deploy the
contents of that directory to any static host (Netlify, Vercel, S3 + CloudFront, Nginx).

Because environment variables are inlined at build time, **a config change requires a rebuild**, not
just a restart.

---

## Security

Three credentials were committed to this public repository in plaintext before the environment
variable refactor:

- Orbo dev client key (`src/api.ts`)
- Orbo production client key (`src/api.ts`, commented out)
- Payment backend API key (`src/payment-api.ts`)

They have been removed from the working tree, but **they are still present in git history and must be
treated as exposed.** Recommended actions:

1. Ask Orbo to rotate both client keys.
2. Rotate the payment backend API key and confirm the backend rejects the old one.
3. Confirm with Orbo what their client key actually authorises. Because it is sent as a query
   parameter from the browser (`?clientkey=…`), it is inherently public — but if it is billed per
   call or gates anything beyond identification, that is a problem independent of this repo.

Rewriting history to purge the keys is possible (`git filter-repo`) but does not help once a repo has
been public — rotation is the real fix.

---

## Known issues and cleanup backlog

- **Vite widget target is unbuildable** — `vite.config.ts` is missing. See [Architecture](#architecture).
- **Large amount of dead code in `src/api.ts`** — `callExistingApiForDetection`,
  `analyzeSkinTypeFromScores`, `calculateConfidenceFromScores`, `buildAnalysisFromScores`, and
  `generateRecommendationsForDetectedType` are all unreferenced (the compiler flags them as unused).
  They are the remains of the real Orbo path. Either restore or delete them.
- **`noUnusedLocals` violations** — the codebase does not currently pass a clean `tsc --noEmit` on
  `tsconfig.app.json`. `next build` succeeds because it type-checks with different settings.
- **ESLint config error** — `eslint.config.js` mixes the flat-config `extends: ['next']` string with
  `tseslint.config()`, which does not support it. `next build` prints a warning; `npm run lint` is
  affected.
- **Very large components** — `questionnaire/index.tsx` (1461 lines), `recommendation/index.tsx`
  (1083), `details/index.tsx` (916). Each contains several screens' worth of markup.
- **Unmerged branch** — `backup-recent-work` exists on the remote and has never been merged. Review
  and either merge or delete it.
- **Lockfile ambiguity** — Next.js warns about a stray `package-lock.json` in the user's home
  directory shadowing this project's. Harmless here, but it makes the build pick the wrong workspace
  root. Set `outputFileTracingRoot` in `next.config.mjs` to silence it.

---

## License

Proprietary — © SmartSkin Africa. All rights reserved.
