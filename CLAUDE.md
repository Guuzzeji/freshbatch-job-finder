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

- `repo-checker/`: Python service and tools for scanning repositories, parsing changes, and verifying repository health. Includes scripts, a virtual environment, and example repositories under `repos/`.

- `webhook-publisher/`: Python producer and worker code responsible for publishing webhook events to subscribers; includes Docker/dev setup, SQL utilities under `sql/`, and worker scripts.

- `shared/`: Python shared package with common constants and interfaces used by multiple backend services and tools.

- `testing/`: Test helpers and utilities such as `mock_webhook.py` and scripts to run integration or local tests.

- Top-level scripts and config: files like `dev.docker-compose.yml`, `install.sh`, `package.json`, `pyproject.toml`, and `README.md` provide development setup, dependency management, and documentation.

Each folder is purpose-scoped: frontend UI lives in `app/`, background services and tooling live in `repo-checker/` and `webhook-publisher/`, reusable Python code lives in `shared/`, and test fixtures live in `testing/`. This separation keeps UI, workers, and libraries modular and easier to maintain.

## Agent Note

- **AI Agents:** When you make changes to this repository, please update `CLAUDE.md` so models and other agents have the correct, up-to-date context for the whole project.
