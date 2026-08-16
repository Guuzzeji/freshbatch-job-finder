# Project Overview

This project is a webhook job tracker that monitors and manages webhook events so students receive real-time notifications about new job listings.

# Features

- Real-time notifications for new job listings
- Efficient monitoring and management of webhook events
- User-friendly interface for tracking job applications

# Technologies Used

- Bun
- Next.js
- PostgreSQL (via Docker)
- Redis (via Docker)
- Python

## Agent Notes

- **AI Memory (Mnemo):** This repo uses **Mnemo**, a Git-native memory server. Before starting any task, call `semantic_search` with relevant terms and act on what you find. After a meaningful outcome (decision, non-obvious fix, changed design, gotcha), record it with `append_memory`. Memory lives inside the repo: `.mnemo/memory_log.jsonl` (source of truth) + `.mnemo/docs/` (markdown projection) — committed and reviewed in PRs like code. Binary artifacts (`index.db`, `index.db-shm`, `index.db-wal`, `models/`, the `mnemo` binary) are gitignored — never commit them. **Mnemo is also the human docs home**: architecture, development, service, and deployment docs live in `.mnemo/docs/` (browseable markdown) — keep them in sync with code changes.
- **Mnemo rules:** Never hand-edit `.mnemo/memory_log.jsonl` or `.mnemo/docs/*` with file tools — write only through the MCP tools (`semantic_search`, `get_memory`, `list_memories`, `append_memory`, `reindex`). Never invent tags: use only `taxonomy.allowed_categories` from `.memory_config.yaml`. Mark obsolete memory `status: deprecated` via `append_memory` instead of deleting. If memory tools are unavailable, proceed and note it in your report.
- **Git ignore guardrail:** Keep the repo-root ignore rule as `/lib/`, not `lib/`. A bare `lib/` pattern will also ignore `app/lib/`, which contains real frontend source files that must remain committable.
- **Code Writing**: Write the least amount of code possible, as a senior software engineer would. Don't try to reinvent the wheel; use the existing codebase to your advantage.

## Folder Structure

- `app/`: Next.js frontend application (Bun-compatible). Contains the Next.js `app` directory, page routes, components, styles, and client-side UI for dashboards, docs, and pages.
  - `app/app/`: App routes and pages including `dashboard`, `docs`, and utility pages.
  - `components/`: Reusable React components used across the frontend (cards, sidebar, toasts, etc.).
  - `lib/`: Frontend helper libraries (webhook helpers, mock data).
  - `public/`: Static assets served by the frontend (images, icons).
- `lib/db/`: Server-only Kysely database client/types for webhook persistence (`webhook-db.ts`, `webhook-types.ts`) using `DATABASE_WEBHOOK_URL`.

- `repo-checker/`: Python service and tools for scanning repositories, parsing changes, and verifying repository health. Includes scripts, a virtual environment, Dockerfile/dev compose config, and example repositories under `repos/`.

- `webhook-publisher/`: Python producer and worker code responsible for publishing webhook events to subscribers; includes Dockerfile/dev compose setup, SQL utilities under `db-queries/`, and worker scripts.

- `shared/`: Python shared package with common constants and interfaces used by multiple backend services and tools.
  - `src/shared/postgres.py`: shared Postgres DSN parser (`parse_postgres_url`) used by `webhook-publisher` and `scripts/create-db-service`.

- `testing/`: Test helpers and utilities such as `mock_webhook.py` and scripts to run integration or local tests.

- Top-level scripts and config: files like `dev.dep.docker-compose.yml` (shared dev stack for app containers + Redis + Postgres), `install.sh`, `package.json`, `pyproject.toml`, and `README.md` provide development setup, dependency management, and documentation.
- `scripts/move-db/main.py`: database-to-database Postgres migration utility that copies full schema and data from a source DB to a target DB via `pg_dump` + `pg_restore`, with optional table row-count parity validation after restore.

- Compose networking convention: start dependency services with root `dev.dep.docker-compose.yml` (creates shared network `web-hook-job-tracker-dev-shared` with `redis` and `db`), then build app containers from `repo-checker/Dockerfile` or `webhook-publisher/Dockerfile` to connect onto that same external network for focused development.

- **AI Memory:** `.memory_config.yaml` + `.mnemo/` hold project memory via the Mnemo MCP server (registered in `opencode.json`). `.mnemo/memory_log.jsonl` is the append-only log, `.mnemo/docs/` the markdown docs; both are committed. `.mnemo/index.db`, `.mnemo/models/`, and the `.mnemo/mnemo` binary are gitignored and rebuilt on demand.
