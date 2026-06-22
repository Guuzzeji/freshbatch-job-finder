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

- **AI Agents:** When you make changes to this repository, update `CLAUDE.md` if the change is global and always needs to be read by all models and agents. Otherwise, update `ai-memory/notes.md` for project-level notes and review it as well for additional info.
- **Git ignore guardrail:** Keep the repo-root ignore rule as `/lib/`, not `lib/`. A bare `lib/` pattern will also ignore `app/lib/`, which contains real frontend source files that must remain committable.
- **AI Memory:** For any new feature or bug fix, create a README-style summary in `ai-memory/feature/` or `ai-memory/bug-fix/`. Name the file after the feature or bug fix. Include a summary of what was done and which files changed. Other AI agents use these files to stay structured and informed. Don't link any docs unless it is important. Follow `tos-page.md` as an example.
- **AI ChangeLog:** Always update `ai-memory/changelog.md` with a summary of changes, the date they were made, and a link to the related feature or bug-fix markdown file.
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

- Compose networking convention: start dependency services with root `dev.dep.docker-compose.yml` (creates shared network `web-hook-job-tracker-dev-shared` with `redis` and `db`), then start either `repo-checker/dev.docker-compose.yml` or `webhook-publisher/dev.docker-compose.yml` to connect app containers onto that same external network for focused development.

- **AI Memory folder:** The `ai-memory/` directory abstracts and tracks changes made by AI. Use `ai-memory/notes.md` for project-level notes, `ai-memory/feature/` and `ai-memory/bug-fix/` for per-change summaries, and `ai-memory/changelog.md` as the dated master log. This keeps context portable across different AI models and systems used by different developers.
