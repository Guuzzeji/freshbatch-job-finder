# Open-Source README + Docs Folder

## Summary

Prepared the repo for open-source release. Rewrote the root `README.md` (was a bare setup stub, 69 lines) into a polished overview: product pitch (Freshbatch), features, tech stack, repo structure table, quickstart, and deploy links, with personality and links into the new `docs/` folder. Created a `docs/` directory with 8 pages covering architecture, local development, each service, and the Docker Compose deployment path. An initial Coolify deployment guide was written then removed at the user's request (Coolify is not part of the open-source story); deployment docs now cover Docker Compose only.

All docs were written from verified code facts (explore agents read the actual services). Two real issues surfaced during fact-gathering and are documented honestly in the deployment docs rather than hidden.

## Files Changed

| File | Purpose |
| --- | --- |
| `README.md` | Rewritten: overview, features, stack, structure, quickstart, deploy links |
| `docs/README.md` | Docs index + table of contents |
| `docs/architecture.md` | System overview, ASCII data-flow diagram, payload shape, signature scheme |
| `docs/development.md` | Full local setup: OAuth, env files, dev compose, per-service run, troubleshooting |
| `docs/services/frontend.md` | Next.js app: stack, routes, env vars, dev/build, Docker port 3131 |
| `docs/services/repo-checker.md` | Poller: tracked repos, tick flow, env vars, REDIS_URL gotcha |
| `docs/services/webhook-publisher.md` | Delivery: producer/workers, SSRF, signature canonical form, schema |
| `docs/services/tooling.md` | shared/ package, testing/ mock receiver, scripts/ ops utilities |
| `docs/deployment/docker-compose.md` | prod compose walkthrough + known issues |

## Known Issues Documented (not fixed — out of scope)

- **`prod.docker-compose.yml` repo-checker Redis bug**: sets `REDIS_HOST`/`REDIS_PORT` but `repo-checker` code reads only `REDIS_URL`; as written repo-checker cannot reach Redis in the compose stack. Fix documented in both deployment docs: add `REDIS_URL: redis://redis:6379`.
- **`scripts/Dockerfile` CMD runs `uptime.py`** (idle loop), not `create-tables.py`. The compose `create-db-service` builds this image, so table bootstrap is not auto-run on container start. Docs recommend running the bootstrap explicitly.

## Style Decisions

- Warm developer-to-developer tone, first-person "we", no corporate jargon, no em dashes, no emojis.
- Docs are skimmable: short sections, env var tables, code blocks.
- `docs/deployment/docker-compose.md` documents both known compose issues honestly (repo-checker `REDIS_URL` mismatch, `create-db-service` idle CMD) with fixes.
- Coolify references removed everywhere at user request: `docs/deployment/coolify.md` deleted, README/docs index/tooling stripped of Coolify mentions. `scripts/repo-checker-auto-restart.py` (Coolify API deploy trigger) still exists in code but is no longer documented — user's production may still use it.
- `scripts/move-db/` does not exist in this worktree (CLAUDE.md reference is stale) — intentionally not documented.