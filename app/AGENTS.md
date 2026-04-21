<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

# Frontend — Next.js (Bun-compatible) overview

This file documents the frontend app so contributors and AI agents understand the purpose, layout, developer workflow, and conventions used by the `app/` frontend.

## Purpose

- Hosts the user-facing UI: dashboards, docs, pages used to view and manage webhook job events.
- Built with Next.js (App Router) and React; tuned to run in a Bun-compatible environment where possible.

## Quick start (developer)

1. Install dependencies using your preferred package manager (project contains a `pnpm-lock.yaml` so `pnpm` is recommended):

```bash
pnpm install
# or npm install / bun install
```

2. Run the dev server:

```bash
pnpm dev
# or npm run dev / bun run dev
```

3. Build for production:

```bash
pnpm build
pnpm start
```

4. Linting:

```bash
pnpm run lint
```

## Project scripts (see `package.json`)

- `dev`: start Next.js in development mode (`next dev`).
- `build`: compile the app for production (`next build`).
- `start`: run the production server (`next start`).
- `lint`: run `eslint`.

## Important files & folders

- `app/` — Next.js App Router source. Routes, layouts, and pages live here.
  - `app/app/`: top-level app routes used by the site (dashboard, docs, test pages).
  - `app/dashboard/`: dashboard pages and child routes (`log/`, `test/`).
- `components/` — Reusable React components (cards, sidebar, toasts, navigation, etc.). Use these for UI composition instead of duplicating markup.
- `lib/` — Frontend helper libraries (mock data, webhook helpers, small utilities shared across pages/components).
- `public/` — Static assets served at the root path (images, icons, favicons).
- `globals.css` and other CSS files — global styles; Tailwind/PostCSS is configured in project-level config files.
- `next.config.ts` and `tsconfig.json` — Next and TypeScript configuration.
- `package.json` and `pnpm-lock.yaml` — dependency manifest and lockfile.

## Conventions & patterns

- App Router: prefer colocated `layout.tsx` and `page.tsx` files for routing and shared UI scaffolding. Use server components by default, mark client-only components with the `'use client'` directive.
- Styling: Tailwind + PostCSS (project devDependencies include Tailwind). Keep utility classes in components or extract shared classes to component-level CSS modules when needed.
- TypeScript: the app is typed; add types in `@types/*` or local `types/` as required. Keep `tsconfig.json` consistent with the repo root.
- Components: small, focused, and composable. Prefer props for configuration and avoid global mutable state inside components. Use React context sparingly for app-level concerns like auth or theme.

## Data fetching & server interactions

- Use Next.js server actions or server components for fetching data where possible (reduces client bundle size). For interactive features, use client components and fetch/call API routes.
- Backend services (Postgres, Redis, webhook workers) are run via dev compose files. The frontend expects backend APIs to be reachable during local development if you run the shared dev stack.

## Environment & runtime notes

- The repo mentions Bun compatibility; however, standard `next` scripts are used. You can run the app with Node or Bun depending on your environment. If targeting Bun, validate any Node-specific packages or native modules.
- Keep `.env` variables scoped to the frontend in a `.env.local` file and never commit secrets.

## Testing & quality

- Linting is configured via `eslint` and `eslint-config-next`. Run `pnpm run lint` regularly.
- Add component/unit tests alongside components or in a `__tests__` folder if tests are introduced. The project currently doesn't include a testing framework by default; choose `vitest` / `jest` / `testing-library` if adding tests.

## Deployment

- Build the app using `pnpm build` and serve with `pnpm start` behind a production web server or platform (Vercel, Fly, Railway). Verify environment variables and any platform-specific Next.js options.

## Helpful tips for contributors

- Search for UI entry points in `app/` and `components/` when adding features.
- Keep UI state localized. If you need cross-app state, document the pattern and add a small context/provider under `lib/` or `components/`.
- When adding new dependencies, update `CLAUDE.md` and any dev/compose docs if those dependencies require runtime services.

## Where to look next

- Main app entry and layouts: `app/app/layout.tsx` and `app/layout.tsx`.
- Shared UI building blocks: `components/`.
- Frontend helpers and mocks: `lib/`.

---

If you want, I can expand this with file-level links to the main files (layouts, key components) or add a small contributor checklist for making UI changes.
