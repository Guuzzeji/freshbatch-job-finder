# web-hook-job-tracker: Local Onboarding (Start to Finish)

This guide is for getting the full project running on your machine in simple steps.

What you will run locally:

- Next.js app (frontend + auth): http://localhost:3000
- Redis and Postgres (via Docker)
- `webhook-publisher` Python service
- `repo-checker` Python service

## 1) Install prerequisites

Install these first:

- Git: https://git-scm.com/downloads
- Docker Desktop: https://www.docker.com/products/docker-desktop/
- Node.js (recommend Node 20+): https://nodejs.org/
- Python 3.9+ (recommend 3.11): https://www.python.org/downloads/

Check they are installed:

```bash
git --version
docker --version
node --version
npm --version
python3 --version
pip3 --version
```

## 2) Clone and open the repo

```bash
git clone https://github.com/Guuzzeji/web-hook-job-tracker.git
cd web-hook-job-tracker
```

## 3) Set up GitHub OAuth (required for login)

The app uses GitHub sign-in. Create an OAuth app in GitHub:

> NOTE: Check the official GitHub docs for any updates: https://docs.github.com/en/developers/apps/building-oauth-apps/creating-an-oauth-app

- GitHub OAuth Apps page: https://github.com/settings/developers
- Direct "New OAuth App": https://github.com/settings/applications/new

Use these values:

- Application name: `web-hook-job-tracker-local` (or any name you like)
- Homepage URL: `http://localhost:3000`
- Authorization callback URL: `http://localhost:3000/api/auth/callback/github`

After creating it, copy:

- `Client ID`
- `Client Secret`

You will use them in `app/.env.local`.

## 4) Create environment files

Create 3 env files.

### `app/.env.local`

```env
# Generate once in terminal: openssl rand -base64 32
AUTH_SECRET=replace_me_with_a_random_secret

# Keep this too for compatibility with compose/prod naming
BETTER_AUTH_SECRET=replace_me_with_the_same_random_secret

GITHUB_CLIENT_ID=replace_with_github_client_id
GITHUB_CLIENT_SECRET=replace_with_github_client_secret
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

## 5) Start Docker dependencies (Redis + Postgres + DB bootstrap)

From repo root:

```bash
docker compose -f dev.dep.docker-compose.yml up -d --build
```

Check containers:

```bash
docker ps
```

You should see containers like:

- `redis`
- `db`
- `create-db-service` (this one may exit after setup, which is fine)

## 6) Install and run the Next.js app

Open Terminal A:

```bash
cd app
npm install
npm run dev
```

App should be available at:

- http://localhost:3000

## 7) Install and run webhook-publisher

Open Terminal B:

```bash
cd webhook-publisher
python3 -m venv .venv
source .venv/bin/activate
pip install --upgrade pip
./local.install.sh # Installs dependencies from requirements.txt and connects to shared python project utils
python main.py
```

## 8) Install and run repo-checker

Open Terminal C:

```bash
cd repo-checker
python3 -m venv .venv
source .venv/bin/activate
pip install --upgrade pip
./local.install.sh # Installs dependencies from requirements.txt and connects to shared python project utils
python main.py
```

## 9) Verify the full flow (end-to-end)

1. Open http://localhost:3000
2. Click "Sign In with GitHub"
3. After login, go to dashboard and save webhook settings
4. Use "Test fire webhook" to send a test event

For quick webhook endpoint testing, use one of these:

- Webhook.site: https://webhook.site/
- Pipedream RequestBin: https://pipedream.com/requestbin

Paste the generated URL into your dashboard webhook endpoint field, save, then send a test webhook.

## 10) Helpful commands

Stop local app/services:

- In each running terminal: `Ctrl + C`

Stop Docker dependencies:

```bash
docker compose -f dev.dep.docker-compose.yml down
```

Reset DB/Redis volumes (fresh start):

```bash
docker compose -f dev.dep.docker-compose.yml down -v
docker compose -f dev.dep.docker-compose.yml up -d --build
```

## 11) Common issues and fixes

- GitHub login fails with callback error:
  - Make sure callback URL in GitHub OAuth app is exactly:
    - `http://localhost:3000/api/auth/callback/github`

- App cannot connect to Postgres:
  - Make sure Docker `db` container is running: `docker ps`
  - Verify `DATABASE_AUTH_URL` and `DATABASE_WEBHOOK_URL` use port `5432`

- Python services fail with missing packages:
  - Activate the service venv first:
    - `source .venv/bin/activate`
  - Re-run `./local.install.sh`

- Port already in use:
  - Stop conflicting process or change the port used by that process.

## 12) Optional: useful docs

- Main project README: https://github.com/Guuzzeji/web-hook-job-tracker/blob/main/README.md
- Next.js docs: https://nextjs.org/docs
- Better Auth docs: https://www.better-auth.com/docs
- Redis docs: https://redis.io/docs/
- Postgres docs: https://www.postgresql.org/docs/

You now have the full stack running locally.
