---
id: move-frontend-dockerfile
tags: ["devops"]
status: active
---
# Move Frontend Dockerfile into `app/`

## Summary

- Moved the frontend Dockerfile from repo-root `frontend.dockerfile` to `app/Dockerfile`.
- Updated `prod.docker-compose.yml` so the `app` service builds with `context: ./app` and `dockerfile: Dockerfile`.
- Adjusted `app/Dockerfile` COPY paths so they work with the new build context.
- Added `.env.local` and `.git` to `app/.dockerignore` to keep secrets and the git history out of the image.
- Updated `CLAUDE.md` and `ai-memory/notes.md` to remove references to non-existent `repo-checker/dev.docker-compose.yml`, `webhook-publisher/dev.docker-compose.yml`, and `create-db.dockerfile`, and pointed them at the current Dockerfiles (`repo-checker/Dockerfile`, `webhook-publisher/Dockerfile`, `scripts/Dockerfile`).

## Key Decisions

Keeping the Dockerfile inside `app/` lets the compose build context stay scoped to the frontend directory, makes COPY paths simpler, and keeps frontend build concerns alongside the frontend code. Removing the stale dev compose references prevents new agents from trying to run files that no longer exist.

## Files touched

- `app/Dockerfile` (moved from `frontend.dockerfile`)
- `app/.dockerignore`
- `prod.docker-compose.yml`
- `CLAUDE.md`
- `ai-memory/notes.md`
- `ai-memory/changelog.md`
- `ai-memory/refactor/move-frontend-dockerfile.md` (this file)
