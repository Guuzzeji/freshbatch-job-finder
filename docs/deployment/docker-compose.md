# Self-Hosting with Docker Compose

The repo ships a production compose file, `prod.docker-compose.yml`, that runs the entire stack on a single host. This guide covers what it starts, what you need to configure, and a couple of known rough edges worth understanding before you deploy.

## What the stack contains

The compose file defines six services on a shared `app-network` bridge:

| Service | What it does |
|---|---|
| `redis` | Redis (alpine image), data in the `redis_data` volume |
| `db` | PostgreSQL 17 (alpine), data in `postgres_data`, healthchecked with `pg_isready` |
| `app` | The Next.js frontend, built from `./app`, published on port **3131** |
| `repo-checker` | Python worker that polls repositories |
| `webhook-publisher` | Python worker that delivers webhooks (`THREAD_COUNT=5`) |
| `create-db-service` | One-shot database bootstrap, starts only after `db` is healthy |

Postgres credentials come from `${POSTGRES_USER}` and `${POSTGRES_PASSWORD}` in your env file.

## Configure the environment

Create a `.env` file in the repo root with these values:

| Variable | Notes |
|---|---|
| `POSTGRES_USER` | Database user |
| `POSTGRES_PASSWORD` | Database password |
| `BETTER_AUTH_SECRET` | Generate with `openssl rand -base64 32` |
| `BETTER_AUTH_URL` | The public URL of the app, e.g. `https://app.example.com` |
| `GITHUB_CLIENT_ID` | From your GitHub OAuth app |
| `GITHUB_CLIENT_SECRET` | From your GitHub OAuth app |

You don't need to set `DATABASE_AUTH_URL`, `DATABASE_WEBHOOK_URL`, or `REDIS_URL` yourself. The compose file wires those directly using the internal hostnames `db` and `redis`.

The `app` service runs with `NODE_ENV=production` and receives its database, Redis, auth, and GitHub settings from the compose environment.

## Run it

```bash
docker compose -f prod.docker-compose.yml up -d --build
```

The app will be available at [http://localhost:3131](http://localhost:3131).

Note that unlike the dev compose file, the production file does **not** publish ports 5432 or 6379 to the host. Postgres and Redis are only reachable inside the Docker network, which is what you want.

## Known issues and fixes

Two things in the current compose file are worth knowing about. We'd rather document them honestly than have you discover them mid-deploy.

### repo-checker can't reach Redis as written

The `repo-checker` service in the compose file sets `REDIS_HOST` and `REDIS_PORT`, but the code only reads `REDIS_URL`. As a result, repo-checker can't connect to Redis inside the compose network.

**Fix:** add `REDIS_URL` to the repo-checker service's environment:

```yaml
repo-checker:
  environment:
    # ...existing entries...
    REDIS_URL: redis://redis:6379
```

### create-db-service appears to do nothing

The `create-db-service` image's `CMD` is `uptime.py`, an idle loop. The actual database bootstrap lives in `create-tables.py`, which is a one-shot script. So the container may look like it's running without doing anything, and the tables only get created if the bootstrap script actually runs.

**Recommendation:** run the bootstrap explicitly after the first `up` (exec into the container and run `create-tables.py`), or adjust the service command so `create-tables.py` runs on start. Check that the tables exist before pointing traffic at the app.

## Updating

Pull the latest code, then rebuild:

```bash
docker compose -f prod.docker-compose.yml up -d --build
```

Named volumes keep your Postgres and Redis data across rebuilds.
