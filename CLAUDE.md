# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A "wishlist for Santa" teaching project with two independent halves:

- **`api/`** — a Go REST API, **built by training participants**. It does not
  exist yet. Do not scaffold it unless explicitly asked; it is intentionally
  left empty.
- **`front/`** — a React + Vite + TypeScript + TailwindCSS v4 SPA (managed with
  **pnpm**) that consumes the API. This is the part maintained here.

The contract between the two lives in [`front/API.md`](front/API.md) — the
front is written against it, the API must implement it. **When you change an
API call or a payload/response shape in `front/src/api/`, update `front/API.md`
to match.**

## Commands

Run from the repo root via the `Makefile` (`make help` lists every target):

```bash
make front-install   # cd front && pnpm install
make front-dev       # vite dev server, http://localhost:5173
make front-build     # tsc -b && vite build  → front/dist
make front-lint      # tsc --noEmit (type-check only — there is no ESLint)
make run             # docker compose up --build (api + front together)
make docker-build    # build santa/api:latest and santa/front:latest
```

There is **no test suite and no linter** beyond the TypeScript compiler.
"Lint" == type-check. Always run `make front-build` (or `pnpm build`) to verify
a change — `tsconfig.json` is strict (`noUnusedLocals`, `noUnusedParameters`),
so unused imports/vars fail the build.

## Front architecture

- **API layer (`src/api/`)** — the only place that talks to the network.
  `client.ts` is a single `apiFetch<T>()` wrapper that owns the base URL
  (`VITE_API_URL`), JWT injection (`auth: true` opt-in), and error handling
  (throws `HttpError`). Per-domain modules (`auth.ts`, `toys.ts`,
  `wishlist.ts`) wrap it; `types.ts` mirrors the API models. Add new endpoints
  here, never call `fetch` directly from components.
- **Auth (`src/context/AuthContext.tsx`)** — holds the current user and drives
  `isAuthenticated`. The JWT and user are persisted in `localStorage`
  (`santa_token` / `santa_user`); `client.ts` reads the token back. Use
  `useAuth()` in components; wrap protected routes in `<ProtectedRoute>` (see
  `App.tsx`), which redirects to `/login` preserving the intended location.
- **Routing (`src/App.tsx`)** — flat route table under a shared `<Layout>`
  (navbar + `<Outlet>`). `/wishlist` is the only auth-gated route.
- **Styling** — Tailwind v4 via the `@tailwindcss/vite` plugin (no
  `tailwind.config.js`, no PostCSS). Theme colors (`santa-red`, `santa-green`,
  `santa-cream`) and shared component classes (`.input`, `.btn-primary`,
  `.btn-secondary`) are defined in `src/index.css` using `@theme` / `@layer
  components`. Reuse those classes rather than re-deriving form/button styles.

## Important gotchas

- `VITE_API_URL` is **inlined at build time** by Vite — it is a build arg in
  `front/Dockerfile`, not a runtime env var. Rebuild the image to change the
  API URL (`make docker-build-front VITE_API_URL=...`).
- The API must enable **CORS** for `http://localhost:5173` in dev.
- `docker-compose.yml` and `make docker-build-api` assume an `api/Dockerfile`
  that the participants will provide; they will fail until `api/` exists.
