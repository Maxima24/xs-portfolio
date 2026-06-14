# Faith "XS" Popoola — Portfolio

A single-page developer portfolio built with **Next.js 14 (App Router) + TypeScript + Tailwind CSS**, a **Three.js** hero scene (via `@react-three/fiber`, `drei`, and `postprocessing` Bloom), and **Framer Motion** scroll reveals. Dark neon aesthetic, mobile-first, accessible, SEO-ready.

## Quick start

```bash
pnpm install
pnpm dev
```

Open <http://localhost:3000>.

Other scripts:

```bash
pnpm build    # production build (type-checked) — the acceptance gate
pnpm start    # serve the production build
pnpm lint     # eslint
pnpm format   # prettier
```

> Using npm or yarn? `npm install && npm run dev` / `yarn && yarn dev` work too.

## Tech

- **Next.js 14 App Router**, TypeScript (strict), Tailwind CSS
- **Three.js** hero: distorted icosahedron + neon wireframe shell + particle field with **Bloom** postprocessing. Mouse-reactive, slow auto-rotation.
- **Framer Motion** for `whileInView` section reveals and hero stagger.
- All R3F canvases are loaded via `dynamic(() => ..., { ssr: false })` so SSR never touches WebGL.
- **`/resume`** renders the résumé PDF on-theme with **react-pdf (pdf.js)** — continuous scroll, neon page frames, zoom, responsive. It's also dynamically imported (`ssr: false`), so pdf.js loads only on `/resume`, never on the home page. The pdf.js worker is copied into `public/` automatically by `scripts/copy-pdf-worker.mjs` (runs on `predev`/`prebuild`), so it stays version-matched with no CDN.

## Graceful degradation

The hero detects **mobile / coarse-pointer** devices and **`prefers-reduced-motion`** (see [components/useClientEnv.ts](components/useClientEnv.ts)). When heavy WebGL isn't appropriate it renders a lightweight CSS neon gradient ([components/StaticHeroBackdrop.tsx](components/StaticHeroBackdrop.tsx)) instead. Pixel ratio is capped with `dpr={[1, 2]}` and the scene is wrapped in `<Suspense>`.

## Portfolio variants (tracks) → three deployments

One codebase produces three role-tailored portfolios — same projects, reframed per audience. The
portfolio served at `/` is chosen at build time by the **`PORTFOLIO_TRACK`** env var, so you deploy
the **same repo as three Vercel projects**, each a standalone website at its own root:

| `PORTFOLIO_TRACK` | Root `/` shows | Leads with |
| --- | --- | --- |
| (unset) or `general` | General SWE portfolio | Deepest systems first |
| `frontend` | Frontend portfolio | UI / mobile / real-time (Cargoland, PayAza, …) |
| `backend` | Backend portfolio | Services & distributed-systems (detector, …) |

There are no `/frontend` or `/backend` sub-routes — each deployment serves exactly one track at `/`
(plus the shared `/resume`), so nothing leaks the other tracks.

Each track's copy lives in one file under [data/tracks/](data/tracks/): [general.tsx](data/tracks/general.tsx), [frontend.tsx](data/tracks/frontend.tsx), [backend.tsx](data/tracks/backend.tsx) — each exports a `TrackContent` (hero role + value prop, featured-project selection/order/framing, tech-depth callouts, About bio + stack). Projects reuse the canonical base in [data/projects.ts](data/projects.ts) (`projectsById`) and override only the framing. Per-track SEO strings (titles/descriptions + OG role/tagline) are in [data/tracks/seo.ts](data/tracks/seo.ts); selection logic and the content lookup are in [data/tracks/index.ts](data/tracks/index.ts). The composition is shared in [components/Portfolio.tsx](components/Portfolio.tsx). The OG image ([app/opengraph-image.tsx](app/opengraph-image.tsx)) and `/resume` are shared and adapt to the active track.

### Deploying the three sites

1. Push this repo to GitHub once.
2. In Vercel, **import the same repo as three projects** (e.g. `portfolio-general`, `portfolio-frontend`, `portfolio-backend`). Vercel auto-detects Next.js — no build config needed.
3. In each project's **Settings → Environment Variables** (Production), set:
   - general: `PORTFOLIO_TRACK` = `general` (or leave unset)
   - frontend: `PORTFOLIO_TRACK` = `frontend`
   - backend: `PORTFOLIO_TRACK` = `backend`
   - optional per project once a domain is assigned: `NEXT_PUBLIC_SITE_URL` = `https://that-domain` (otherwise the Vercel production URL is used automatically for canonical/OG/sitemap).
4. Deploy each and assign its domain. A push to the repo rebuilds all three, each with its own track.

> Env vars are baked at build, so **redeploy** after changing `PORTFOLIO_TRACK`.

Run a specific track locally with: `PORTFOLIO_TRACK=frontend pnpm dev`.

## Editing content

All copy lives in typed arrays under [data/](data/) — no need to touch components:

- [data/site.ts](data/site.ts) — name, role, value prop, email, **social links** (replace the LinkedIn `#` placeholder with your real URL), resume path.
- [data/projects.ts](data/projects.ts) — Featured Products (SwiftHum, Anomaly Detection Engine, RenderLite, OWise, Semantic Search Engine, Cargoland, PayAza, QuickBite), ordered deepest-systems-first. Add `links` (`{ label, href, kind: 'live' | 'github' }`) to surface Live/GitHub buttons on a card.
- [data/hackathons.ts](data/hackathons.ts) — hackathon strip.
- [data/techDepth.ts](data/techDepth.ts) — architecture callouts.

## Images & resume — what to drop in

The site ships with generated neon-gradient **SVG placeholders** so it looks complete out of the box. Replace them with real assets when ready:

| Path | What it is | How to swap |
| --- | --- | --- |
| `public/projects/swifthum.svg` | SwiftHum cover (16:9) | Drop a real `.png`/`.jpg` and update the `image` field in [data/projects.ts](data/projects.ts) |
| `public/projects/detector.svg` | Anomaly Detection Engine cover | same as above |
| `public/projects/render-lite.svg` | RenderLite cover | same as above |
| `public/projects/owise.svg` | OWise cover | same as above |
| `public/projects/search-engine.svg` | Semantic Search Engine cover | same as above |
| `public/projects/cargoland.svg` | Cargoland cover | same as above |
| `public/projects/payaza.svg` | PayAza cover | same as above |
| `public/projects/quickbite.svg` | QuickBite cover | same as above |
| OG / Twitter image (1200×630 **PNG**) | Generated at request time by [app/opengraph-image.tsx](app/opengraph-image.tsx) (reused by `twitter-image.tsx`) — real PNG so LinkedIn/Slack/X previews render. Edit the JSX to change it; no file to drop. |
| Favicons (**PNG**) | Generated by [app/icon.tsx](app/icon.tsx) (64×64) and [app/apple-icon.tsx](app/apple-icon.tsx) (180×180). Edit the JSX to change them. |
| `public/resume.pdf` | Your résumé PDF | The nav/hero/footer "Resume" links open the in-site viewer at [`/resume`](app/resume/page.tsx), which embeds this PDF inline with Download + Open-in-new-tab. Replace the file to update your résumé — no code change. |

> The old `public/og-image.svg` and `public/favicon.svg` are no longer referenced (kept only as raster-free fallbacks). The `next/og` renderer (Satori) doesn't support `radial-gradient`, so the generated images use layered `linear-gradient`s.

## SEO

- Full metadata + Open Graph / Twitter cards in [app/layout.tsx](app/layout.tsx) (`theme-color #0a0a0f`).
- Real PNG `og:image` / `twitter:image` and favicons via the App-Router file conventions (above).
- JSON-LD `Person` structured data injected in [app/layout.tsx](app/layout.tsx) (`sameAs` auto-fills from your real social links).
- `sitemap.xml` and `robots.txt` generated by [app/sitemap.ts](app/sitemap.ts) / [app/robots.ts](app/robots.ts).
- `site.url` ([data/site.ts](data/site.ts)) resolves from env per deployment — no hardcoded domain to update. It uses `NEXT_PUBLIC_SITE_URL` if set, else the Vercel production URL, else `http://localhost:3000`.

## Deploy to Vercel

See **[Portfolio variants → three deployments](#portfolio-variants-tracks--three-deployments)** above for the full flow (one repo → three Vercel projects via `PORTFOLIO_TRACK`). The short version: push to GitHub, import the repo as a project at <https://vercel.com/new> (Next.js auto-detected, no config), set `PORTFOLIO_TRACK` in the project's env vars, and deploy. Repeat the import for each track you want as its own site.

## Accessibility

Semantic landmarks, image alt text, a neon `:focus-visible` ring, and full `prefers-reduced-motion` support (animations and the 3D scene are disabled/replaced).
