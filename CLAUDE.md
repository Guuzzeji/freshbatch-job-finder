# Project Overview

This project is a web hook job tracker designed to monitor and manage web hook events efficiently to allow students to track different job listings by being sent real-time notifications (via webhooks).

# Features

- Real-time notifications for new job listings
- Efficient monitoring and management of web hook events
- User-friendly interface for tracking job applications

# Technologies Used

- Bun
- Next.js
- PostgreSQL (via Docker)
- Redis (via Docker)
- Python

## Folder Structure

- `app/`: Next.js frontend application (Bun-compatible). Contains the Next.js `app` directory, page routes, components, styles, and client-side UI for dashboards, docs, and pages.
  - `app/app/`: App routes and pages including `dashboard`, `docs`, and utility pages.
  - `components/`: Reusable React components used across the frontend (cards, sidebar, toasts, etc.).
  - `lib/`: Frontend helper libraries (webhook helpers, mock data).
- `lib/db/`: Server-only Kysely database client/types for webhook persistence (`webhook-db.ts`, `webhook-types.ts`) using `DATABASE_WEBHOOK_URL`.
  - `public/`: Static assets served by the frontend (images, icons).

- `repo-checker/`: Python service and tools for scanning repositories, parsing changes, and verifying repository health. Includes scripts, a virtual environment, Dockerfile/dev compose config, and example repositories under `repos/`.

- `webhook-publisher/`: Python producer and worker code responsible for publishing webhook events to subscribers; includes Dockerfile/dev compose setup, SQL utilities under `db-queries/`, and worker scripts.

- `shared/`: Python shared package with common constants and interfaces used by multiple backend services and tools.

- `testing/`: Test helpers and utilities such as `mock_webhook.py` and scripts to run integration or local tests.

- Top-level scripts and config: files like `dev.dep.docker-compose.yml` (shared dev stack for app containers + Redis + Postgres), `install.sh`, `package.json`, `pyproject.toml`, and `README.md` provide development setup, dependency management, and documentation.

- Compose networking convention: start dependency services with root `dev.dep.docker-compose.yml` (creates shared network `web-hook-job-tracker-dev-shared` with `redis` and `db`), then start either `repo-checker/dev.docker-compose.yml` or `webhook-publisher/dev.docker-compose.yml` to connect app containers onto that same external network for focused development.

## Dev Docker Workflow (for AI handoff)

- Root dependency stack (`dev.dep.docker-compose.yml`) is **dependency-only** and runs shared services:
  - `redis` (host: `redis`, port `6379`)
  - `db` (Postgres host: `db`, port `5432`)
  - Postgres init SQL is mounted from: `./webhook-publisher/db-queries/dev_init.sql` → `/docker-entrypoint-initdb.d/init.sql`
  - Shared network name: `web-hook-job-tracker-dev-shared`

- Service-level stacks build app images from local Dockerfiles and attach to the shared external network:
  - `repo-checker/dev.docker-compose.yml` builds `repo-checker/Dockerfile`
  - `webhook-publisher/dev.docker-compose.yml` builds `webhook-publisher/Dockerfile`

- Service connectivity expectations inside Docker network:
  - Redis hostname: `redis`
  - Postgres hostname: `db`
  - `webhook-publisher` DSN: `postgresql://myUser:mySecretPassword@db:5432/myDb`

- Recommended startup flow:
  1. Start shared deps once from repo root:
     - `docker compose -f dev.dep.docker-compose.yml up -d`
  2. Start only the app you are actively developing:
     - `docker compose -f repo-checker/dev.docker-compose.yml up --build`
     - or `docker compose -f webhook-publisher/dev.docker-compose.yml up --build`
  3. Stop app stack when done, keep deps running if still needed.

- Important: do **not** duplicate Redis/Postgres services inside per-service `dev.docker-compose.yml` files; those files should only run app containers and connect to `web-hook-job-tracker-dev-shared`.

Each folder is purpose-scoped: frontend UI lives in `app/`, background services and tooling live in `repo-checker/` and `webhook-publisher/`, reusable Python code lives in `shared/`, and test fixtures live in `testing/`. This separation keeps UI, workers, and libraries modular and easier to maintain.

## Webhook Persistence (DB-backed, SSR + Server Actions)

- **One webhook per user** — enforced by `UNIQUE (user_id)` on the `webhooks` table and a `CHECK (is_fte OR is_intern)` constraint. Never allow multiple rows per user.
- **Two separate Postgres databases:** `auth_db` (Better Auth) and `webhook_db` (webhook data). No cross-DB foreign keys — user identity is enforced in the app layer via Better Auth session.
- **Env vars:**
  - `DATABASE_AUTH_URL=postgresql://myUser:mySecretPassword@localhost:5432/auth_db`
  - `DATABASE_WEBHOOK_URL=postgresql://myUser:mySecretPassword@localhost:5432/webhook_db`
  - `REDIS_URL=redis://localhost:6379` — used by the Next.js app (`app/lib/redis.ts`) to connect to Redis for test webhook enqueueing via `webhook:fanout:pending`. Must point to the same Redis instance used by the Python services.
- **Kysely client:** `app/lib/db/webhook-db.ts` — singleton `Kysely<WebhookDatabase>` using `DATABASE_WEBHOOK_URL`. Import as `import { webhookDb } from "@/lib/db/webhook-db"`. Marked `server-only` — never import in client components.
- **Types:** `app/lib/db/webhook-types.ts` — `WebhookRow`, `NewWebhookRow`, `WebhookRowUpdate`, `WebhookDatabase`.
- **Server Actions** (`app/app/dashboard/actions.ts`):
  - `getWebhookSettingsForCurrentUser()` — reads the authed user's webhook row (returns `WebhookRow | null`)
  - `saveWebhookSettingsAction(input: unknown)` — validates payload, upserts row, calls `revalidatePath("/dashboard")`
  - `getWebhookLogsForCurrentUser(onlyTests?: boolean)` — returns latest 20 `webhooks_log` rows for the user; pass `true` to filter `is_test = true` only
  - `sendTestWebhookAction()` — enqueues a test `JobInformation` payload to `webhook:fanout:pending` via node-redis; returns `{ ok: boolean; code?: string; message?: string }`
  - All functions call `auth.api.getSession({ headers: await headers() })` — never trust user_id from client
- **SSR pattern:** `app/app/dashboard/page.tsx` is an `async` server component that calls `getWebhookSettingsForCurrentUser()` and passes `initialWebhook` to `<HookCard>`.
- **Client pattern:** `HookCard.tsx` accepts `initialWebhook: WebhookRow | null`, initializes state from it, calls `saveWebhookSettingsAction` inside `startTransition`, then `router.refresh()` to re-sync server state. No `localStorage` anywhere.
- **Schema file:** `db-queries/create_all.sql` — edit table definitions directly (no ALTER TABLE). Reboot Docker with `docker compose -f dev.dep.docker-compose.yml down -v && up -d` to apply schema changes.
- **Validator:** `app/lib/webhook.ts` exports `isValidWebhookSettingsPayload` (used server-side) and `isValidWebhookEndpoint` (used client-side).

## Agent Note

- **AI Agents:** When you make changes to this repository, please update `CLAUDE.md` so models and other agents have the correct, up-to-date context for the whole project.
