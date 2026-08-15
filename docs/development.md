# Local Development Setup

This guide walks you through running the whole stack on your machine: the Next.js frontend, the webhook-publisher worker, and the repo-checker worker, backed by Postgres and Redis in Docker. By the end you'll have a working local setup where you can sign in with GitHub and fire test webhooks end to end.

## 1. Prerequisites

Install these first:

- **Git**
- **Docker** (Docker Desktop on macOS or Windows)
- **Node.js 20 or newer**
- **Python 3.9 or newer**

That's everything. Postgres and Redis run in containers, so you don't need to install them locally.

## 2. Clone the repo

```bash
git clone <repo-url> web-hook-job-tracker
cd web-hook-job-tracker
```

## 3. Set up GitHub OAuth

Login uses GitHub OAuth, so you'll need to register an OAuth app before anything else works.

1. Go to [github.com/settings/developers](https://github.com/settings/developers) and create a new OAuth App.
2. Set **Homepage URL** to `http://localhost:3000`.
3. Set **Authorization callback URL** to `http://localhost:3000/api/auth/callback/github`.
4. Save, then copy the **Client ID** and generate a **Client Secret**. Keep both handy for the next step.

The callback URL has to match exactly. A trailing slash or a typo here is the most common cause of login failures.

## 4. Create the environment files

There are three env files to create: one for the frontend, one for each Python worker.

### `app/.env.local`

Generate a secret with `openssl rand -base64 32` and use it for both `AUTH_SECRET` and `BETTER_AUTH_SECRET` (the duplicate keeps compose and production setups compatible).

```env
AUTH_SECRET=<output of openssl rand -base64 32>
BETTER_AUTH_SECRET=<same value as AUTH_SECRET>
GITHUB_CLIENT_ID=<from GitHub>
GITHUB_CLIENT_SECRET=<from GitHub>
BETTER_AUTH_URL=http://localhost:3000
DATABASE_AUTH_URL=postgresql://myUser:mySecretPassword@localhost:5432/auth_db
DATABASE_WEBHOOK_URL=postgresql://myUser:mySecretPassword@localhost:5432/webhook_db
REDIS_URL=redis://localhost:6379
```

### `webhook-publisher/.env`

```env
THREAD_COUNT=5
REDIS_URL=redis://localhost:6379
POSTGRES_DSN_URL=postgresql://myUser:mySecretPassword@localhost:5432/webhook_db
BATCH_SIZE=100
```

### `repo-checker/.env`

```env
REDIS_URL=redis://localhost:6379
REPO_CHECKER_INTERVAL_SECONDS=30
REPO_CHECKER_INTER_REPO_DELAY_SECONDS=1.0
REPO_CHECKER_FORCE_RECLONE_ON_STARTUP=true
```

The Postgres credentials (`myUser` / `mySecretPassword`) match what the dev compose file creates, so leave them as-is for local work.

## 5. Start the dependencies

From the repo root:

```bash
docker compose -f dev.dep.docker-compose.yml up -d --build
```

This brings up:

- **Redis** on port 6379
- **Postgres** on port 5432 (user `myUser`, password `mySecretPassword`)

Check that everything is running:

```bash
docker ps
```

Then bootstrap the databases. The dev stack includes a `create-db-service` container, but its image just idles (its `CMD` is an uptime loop), so the actual setup is a one-shot manual step. Run it once:

```bash
docker compose -f dev.dep.docker-compose.yml exec create-db-service python create-tables.py
```

This creates `webhook_db` and `auth_db`, then applies the schema (`webhooks` and `webhooks_log` tables). If you skip it, the dashboard will fail when it tries to read webhook data.

## 6. Run the services

Each service runs in its own terminal.

**Frontend:**

```bash
cd app
npm install
npm run dev
```

The app is now at [http://localhost:3000](http://localhost:3000).

**webhook-publisher:**

```bash
cd webhook-publisher
python3 -m venv .venv
source .venv/bin/activate
./local.install.sh
python main.py
```

**repo-checker:**

```bash
cd repo-checker
python3 -m venv .venv
source .venv/bin/activate
./local.install.sh
python main.py
```

## 7. Verify the whole flow

1. Open [http://localhost:3000](http://localhost:3000) and sign in with GitHub.
2. On the dashboard, save your webhook settings.
3. Fire a test webhook to a request inspector like [webhook.site](https://webhook.site) and confirm it arrives.

If the test webhook lands, everything is wired up correctly.

## 8. Troubleshooting

**GitHub login fails with a callback error.**
The callback URL in your GitHub OAuth app must be exactly `http://localhost:3000/api/auth/callback/github`. Check for typos and trailing slashes.

**Postgres connection refused.**
Run `docker ps` and confirm the Postgres container is up and port 5432 is mapped. If it isn't, restart the dev stack with `docker compose -f dev.dep.docker-compose.yml up -d --build`.

**Python workers fail with missing packages.**
Make sure the virtualenv is activated (`source .venv/bin/activate`), then re-run `./local.install.sh` inside the service directory.

**Port already in use.**
Something else is bound to 3000, 5432, or 6379. Stop the conflicting process or container, then try again.

## 9. Teardown

Stop each service with `Ctrl+C` in its terminal, then shut down the dependencies:

```bash
docker compose -f dev.dep.docker-compose.yml down
```

To also wipe the database and Redis data (a full reset), add `-v`:

```bash
docker compose -f dev.dep.docker-compose.yml down -v
```
