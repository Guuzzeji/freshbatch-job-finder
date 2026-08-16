# web-hook-job-tracker

Track job postings across GitHub and deliver them to subscribers in real time over signed webhooks.

You might know the production product as **Freshbatch**: sign in with GitHub, point us at an endpoint, and get pinged the moment a new internship or new-grad role drops. This repo is the whole system behind it, ready to run yourself.

## What it does

We watch job listing repositories (the SimplifyJobs org's new-grad and internship repos), pull new postings out of commit diffs, and fan them out to every subscriber webhook that matches the job type. Every delivery is HMAC-SHA256 signed, so subscribers can prove it came from us and wasn't tampered with in transit.

Three moving parts, one pipeline:

- **repo-checker** polls the repos and publishes job batches to Redis
- **webhook-publisher** picks them up, matches subscribers, and delivers signed HTTP POSTs
- **app** (Next.js) is where users sign in, manage their webhook settings, and watch deliveries land

For the full picture, see [the architecture docs](.mnemo/docs/architecture.md).

## Features

- Real-time delivery of new job listings over signed webhooks
- GitHub OAuth sign-in (Better Auth)
- Dashboard to manage webhook endpoints, job types, and test-fire deliveries
- Delivery log with full payload inspection
- HMAC-SHA256 signature verification, with [Python and TypeScript examples](.mnemo/docs/frontend.md)
- Built-in docs site with integration guides for Discord, FastAPI, Express, and n8n
- Deployable with [Docker Compose](.mnemo/docs/docker-compose.md) from a single compose file

## Tech stack

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, Better Auth, Kysely
- **Workers**: Python 3.14, PyDriller (git history analysis), Redis queues
- **Data**: PostgreSQL (two databases: auth + webhook), Redis (the queue glue)

## Repository structure

| Path | What it is |
| --- | --- |
| `app/` | Next.js frontend: dashboard, docs site, webhook management |
| `repo-checker/` | Python poller that finds new job postings |
| `webhook-publisher/` | Python producer + workers that deliver signed webhooks |
| `shared/` | Dependency-free Python package shared by the workers |
| `testing/` | Mock webhook receiver for local development |
| `scripts/` | Ops utilities: database bootstrap, schema |
| `docs/` | Memory + documentation (Mnemo): human-readable docs in `.mnemo/docs/`, audit log in `.mnemo/memory_log.jsonl` |

Each service has its own page under [.mnemo/docs/](.mnemo/docs/) if you want details.

## Quickstart

Full walkthrough in [.mnemo/docs/development.md](.mnemo/docs/development.md). The short version:

```bash
# 1. Start Postgres + Redis
docker compose -f dev.dep.docker-compose.yml up -d --build

# 2. Create the databases and tables (one-time; the dev stack's
#    create-db-service container only idles, so run the bootstrap yourself)
docker compose -f dev.dep.docker-compose.yml exec create-db-service python create-tables.py

# 3. Create env files (app/.env.local, webhook-publisher/.env, repo-checker/.env)
#    see .mnemo/docs/development.md for the exact contents

# 4. Run each service in its own terminal
cd app && npm install && npm run dev
cd webhook-publisher && ./local.install.sh && python main.py
cd repo-checker && ./local.install.sh && python main.py
```

Head to `http://localhost:3000`, sign in with GitHub, and fire a test webhook.

## Deploying

The repo ships a production compose file, `prod.docker-compose.yml`, that runs the whole stack on any host with Docker installed. The [Docker Compose guide](.mnemo/docs/docker-compose.md) covers the services, env vars, and the known gotchas.

## Documentation

The [docs](.mnemo/docs/) cover everything: architecture, local development, each service, and both deployment paths.

## Contributing

Found a bug, or want to add an integration? Open an issue or a pull request. If you're touching the code, the service docs under `.mnemo/docs/` are kept honest on purpose, so keep them in sync with what you change.