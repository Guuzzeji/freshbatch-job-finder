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

## Agent Note

- **AI Agents:** When you make changes to this repository, please update `CLAUDE.md` so models and other agents have the correct, up-to-date context for the whole project.
