---
id: frontend
tags: ["frontend"]
status: active
---
## Summary
Next.js app: stack, routes, env vars, dev/build, Docker port 3131.

## Key Decisions
# Frontend service

The frontend is a Next.js app where users sign in with GitHub, register webhook endpoints, fire test deliveries, and watch their delivery log. It lives in `app/` and talks to Postgres and Redis directly.

## Stack

- **Next.js 16.2.4** with the App Router
- **React 19.2.4**
- **TypeScript**
- **Tailwind CSS v4**
- **Better Auth 1.6.5** for GitHub OAuth login
- **Kysely 0.28.16** as the typed SQL query builder
- **pg** for the Postgres connection underneath
- **node-redis** for talking to Redis

Kysely is wired up as a server-only singleton, `webhookDb`, in `app/lib/db/webhook-db.ts`. It reads its connection string from `DATABASE_WEBHOOK_URL`.

## Key routes

| Route | What it does |
| --- | --- |
| `/` | Home page with an auth-aware hero section. |
| `/dashboard` | Webhook delivery settings (the HookCard), the delivery log, and a test-fire button. |
| `/docs` | A 14-page docs site covering quickstart, introduction, getting-started, the payload reference, signature verification (with Python and TypeScript examples), and integrations for Discord, FastAPI, Express, and n8n. |

## Environment variables

| Variable | Purpose |
| --- | --- |
| `AUTH_SECRET` | Secret for auth session signing. |
| `BETTER_AUTH_SECRET` | Compat alias for `AUTH_SECRET`. |
| `GITHUB_CLIENT_ID` | GitHub OAuth app client ID. |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth app client secret. |
| `BETTER_AUTH_URL` | Base URL Better Auth uses for callbacks. |
| `DATABASE_AUTH_URL` | Postgres connection string for the auth database. |
| `DATABASE_WEBHOOK_URL` | Postgres connection string for the webhook database. |
| `REDIS_URL` | Redis connection string. |

Generate `AUTH_SECRET` with:

```bash
openssl rand -base64 32
```

## Local development

```bash
pnpm install
pnpm dev
```

The app comes up at `localhost:3000`. We use pnpm and commit `pnpm-lock.yaml` as the lockfile, but npm and bun work too if that's what you have.

## Production build

```bash
pnpm build
pnpm start
```

In Docker, the `Dockerfile` builds Next's standalone output and runs it with `node server.js`. The container listens on `PORT 3131` with `HOSTNAME 0.0.0.0`, and the Docker Compose setup maps `3131:3131`, so the app answers on port 3131 both inside and outside the container.

## Where to next

- [Architecture overview](../architecture.md) for how the frontend fits into the whole system.
- [Back to docs index](../README.md)
