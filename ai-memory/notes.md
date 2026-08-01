## Dev Docker Workflow (for AI handoff)

- Root dependency stack (`dev.dep.docker-compose.yml`) is **dependency-only** and runs shared services:
  - `redis` (host: `redis`, port `6379`)
  - `db` (Postgres host: `db`, port `5432`)
  - Postgres init SQL is mounted from: `./webhook-publisher/db-queries/dev_init.sql` → `/docker-entrypoint-initdb.d/init.sql`
  - Shared network name: `web-hook-job-tracker-dev-shared`

- Service-level stacks build app images from local Dockerfiles and attach to the shared external network:
  - `repo-checker/Dockerfile` builds the repo-checker image
  - `webhook-publisher/Dockerfile` builds the webhook-publisher image
  - `scripts/Dockerfile` mirrors install-script flow and runs `scripts/create-db-service/prod.install.sh`

- Service connectivity expectations inside Docker network:
  - Redis hostname: `redis`
  - Postgres hostname: `db`
  - `webhook-publisher` DSN: `postgresql://myUser:mySecretPassword@db:5432/myDb`
  - `create-db-service` DSN: `postgres://myUser:mySecretPassword@db:5432/webhook_db` (consumed as `POSTGRES_DSN_URL`)

- Recommended startup flow:
  1. Start shared deps once from repo root:
     - `docker compose -f dev.dep.docker-compose.yml up -d`
  2. Build only the app you are actively developing:
     - `docker build -f repo-checker/Dockerfile repo-checker/`
     - or `docker build -f webhook-publisher/Dockerfile webhook-publisher/`
  3. Stop app stack when done, keep deps running if still needed.

- Important: do **not** duplicate Redis/Postgres services inside per-service Dockerfiles; those images should only run app containers and connect to `web-hook-job-tracker-dev-shared`.

Each folder is purpose-scoped: frontend UI lives in `app/`, background services and tooling live in `repo-checker/` and `webhook-publisher/`, reusable Python code lives in `shared/`, and test fixtures live in `testing/`. This separation keeps UI, workers, and libraries modular and easier to maintain.

## Webhook Persistence (DB-backed, SSR + Server Actions)

- **One webhook per user** — enforced by `UNIQUE (user_id)` on the `webhooks` table and a `CHECK (is_fte OR is_intern)` constraint. Never allow multiple rows per user.
- **Two separate Postgres databases:** `auth_db` (Better Auth) and `webhook_db` (webhook data). No cross-DB foreign keys — user identity is enforced in the app layer via Better Auth session.
- **Env vars:**
  - `DATABASE_AUTH_URL=postgresql://myUser:mySecretPassword@localhost:5432/auth_db`
  - `DATABASE_WEBHOOK_URL=postgresql://myUser:mySecretPassword@localhost:5432/webhook_db`
  - `REDIS_URL=redis://localhost:6379` — shared by the Next.js app, `repo-checker`, and `webhook-publisher` for Redis connectivity (including username/password URLs such as `redis://default:password@localhost:6379`). Used by the app (`app/lib/redis.ts`) for test webhook enqueueing via `webhook:fanout:pending` and must point to the same Redis instance as the Python services.
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
- **Dashboard settings MVP scope:** `HookCard.tsx` exposes only MVP-enabled toggles (`deliveries active`, `internships`, `new grad roles`), removes unsupported `remote only`, keeps a single explicit `save settings` persistence action, keeps `test fire webhook` as separate navigation, and links to `/docs` for setup guidance.
- **Delivery log item behavior:** `app/components/LogItem.tsx` titles each row with the log date and total payload job count, previews the first job (`company_name` + `title`), keeps status-code chips unchanged, and renders the full `jobs_payload` in a collapsed "view payload" disclosure.
- **Schema file:** `db-queries/create_all.sql` — edit table definitions directly (no ALTER TABLE). Reboot Docker with `docker compose -f dev.dep.docker-compose.yml down -v && up -d` to apply schema changes.
- **Validator:** `app/lib/webhook.ts` exports `isValidWebhookSettingsPayload` (used server-side) and `isValidWebhookEndpoint` (used client-side).

## Frontend Motion Guardrails (Public UI)

- Global subtle motion tokens/utilities live in `app/app/globals.css`:
  - duration/easing tokens: `--motion-duration-{xs,sm,md,lg}`, `--motion-ease-standard`, `--motion-ease-entrance`
  - utility classes: `.motion-transition-subtle`, `.motion-hover-lift`, `.motion-enter-pop`, `.motion-enter-fade`, `.motion-enter-rise`, `.motion-pulse-soft`, `.motion-ticker`
- Reduced-motion behavior (`@media (prefers-reduced-motion: reduce)`) now disables non-essential motion utilities while preserving existing cookie background guardrails (`.cookie-layer` transition/animation off).
- Public pages/components should prefer these motion utility classes over ad-hoc `animate-[...]`/`transition` strings when adding subtle micro-interactions.

## Home Page Onboarding Flow (Public)

- `app/app/page.tsx` no longer exposes editable webhook endpoint input or any homepage `localStorage` endpoint persistence flow.
- Hero onboarding uses a single auth-aware CTA path aligned with `PublicNavbar` behavior:
  - signed-in users route to `/dashboard`
  - signed-out users trigger `authClient.signIn.social({ provider: "github", callbackURL: "/dashboard" })`
- Homepage messaging now frames dashboard as the place to configure webhook delivery, reducing confusing pre-auth setup on public home.

## Public Docs Architecture

- Public docs are now a 14 page site under `app/app/docs/`, not a single long `/docs` page.
- `app/app/docs/page.tsx` redirects `/docs` to `/docs/quickstart`.
- `app/app/docs/layout.tsx` wraps every docs route with `PublicNavbar` and `DocsLayout`.
- `app/components/DocsLayout.tsx` provides the shared docs shell, with a desktop sidebar and a mobile drawer menu.
- `app/components/DocsNav.tsx` is the shared sidebar navigation source of truth. It uses exact pathname matching for active states, including the section overview links.
- The docs information architecture is grouped into:
  - Quickstart, `/docs/quickstart`
  - Introduction, `/docs/introduction`
  - Getting Started pages, `/docs/getting-started/dashboard`, `/docs/getting-started/test-fire`, `/docs/getting-started/delivery-log`
  - Payload Reference, `/docs/payload-reference`
  - Signature Verification pages, `/docs/signature-verification`, `/docs/signature-verification/python`, `/docs/signature-verification/typescript`
  - Integrations pages, `/docs/integrations`, `/docs/integrations/discord`, `/docs/integrations/fastapi`, `/docs/integrations/express`, `/docs/integrations/n8n`
- `app/app/docs/integrations/discord/page.tsx` showcases the Freshbatch Discord notification bot example and links to `https://github.com/Guuzzeji/freshbatch-discord-notification-bot`.
- `app/app/docs/integrations/express/page.tsx` documents explicit `body-parser` installation and `app.use(bodyParser.json())` middleware setup in the TypeScript example.
- \*\*Signature verification guidance now lives in the dedicated Signature Verification routes and should stay aligned with `webhook-publisher/src/worker.py` and `testing/mock_webhook.py`:
  - algorithm: HMAC-SHA256
  - input for signing: canonical JSON of `body.data`
  - canonicalization: sort jobs by `url`, sort object keys, compact JSON separators `(",", ":")`, UTF-8 bytes
  - **CRITICAL: Python must use `ensure_ascii=False` in json.dumps()** — do NOT allow escaping of Unicode characters (em dashes, accents) as `\uXXXX` sequences. Mismatched ASCII encoding is the most common signature verification failure.
- AI-friendly companion file lives at `app/public/llm.txt` with concise setup and signature verification instructions.

## Open Graph Metadata (Public Pages)

- Root defaults for public social previews live in `app/app/layout.tsx` (`openGraph` + `twitter`).
- Docs-specific social preview metadata lives in `app/app/docs/layout.tsx`.
- Shared placeholder image path is `app/public/og-image.png` (expected social dimension: 1200x630).
- To replace the placeholder, overwrite `app/public/og-image.png` with branded artwork at the same path.
- If docs should use a different image later, add `app/public/og-docs.png` and update docs layout image refs to `/og-docs.png`.

## Repo-Checker Runtime Guardrails

- `repo-checker/main.py` runs checks in a non-overlapping schedule tick. If a previous run is still active, the next tick is skipped.
- Avoid spawning unbounded background threads in scheduler jobs; run repo checks in-process per tick to prevent thread/process exhaustion.
- `repo-checker/src/repos/SimplifyJobs.py` and `repo-checker/src/repos/SimplifySummer2026.py` pin PyDriller `Repository(..., num_workers=1)` to cap internal threadpool usage.
- `repo-checker/src/repo_change_parser.py` wraps git commands with bounded retry/backoff for transient `Resource temporarily unavailable` failures.
- `repo-checker/src/repo_change_parser.py` adds process-pressure cooldown (`REPO_CHECKER_RESOURCE_BACKOFF_SECONDS`, default `90`) after repeated fork/thread exhaustion errors so git sync does not hot-loop while the host is process-starved.
- `repo-checker/src/repo_change_parser.py` uses full `git clone` (no shallow `--depth`) and only allows parsing to start after clone/pull success.
- `repo-checker/src/repo_change_parser.py` supports one-time startup recovery via `REPO_CHECKER_FORCE_RECLONE_ON_STARTUP` (default `true`): existing local repo dirs are force-deleted and cloned fresh before parsing.
- `repo-checker/main.py` schedules checks with configurable cadence (`REPO_CHECKER_INTERVAL_SECONDS`, default `30`, min `5`) and optional spacing between repo runs (`REPO_CHECKER_INTER_REPO_DELAY_SECONDS`, default `1.0`) to reduce bursty process creation.
- `repo-checker/main.py` now returns a boolean from `pull_jobs()` and breaks the main loop immediately when a repo signals resource-pressure reboot, instead of sleeping for another interval before exiting with status `1`.

## Move-DB Script Notes

- Script path: `scripts/move-db/main.py`
- Purpose: one-to-one copy from old Postgres DB to new Postgres DB (schema + data) using `pg_dump --format=custom` and `pg_restore --clean --if-exists --single-transaction`.
- Preferred env vars:
  - `SOURCE_DATABASE_URL` (aliases: `OLD_PROD_DATABASE_URL`, `PROD_DATABASE_URL`)
  - `TARGET_DATABASE_URL` (alias: `NEW_PROD_DATABASE_URL`)
- Safety/verification:
  - validates source and target table sets match
  - validates per-table row counts after restore (unless `--skip-validation`)
  - warns to pause writes to source DB during migration for strict parity
