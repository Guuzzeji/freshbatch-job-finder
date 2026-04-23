# web-hook-job-tracker

This project tracks job repositories and publishes updates via webhooks.

## Development Environment

To run the project locally, start the dependencies via Docker and run each service natively.

### 1. Start Dependencies

Start PostgreSQL and Redis:

```sh
docker-compose -f dev.dep.docker-compose.yml up -d
```

### 2. Environment Variables

Create the following `.env` files in their respective directories.

**app/.env.local**

```env
AUTH_SECRET=your_generated_secret # Generate with: openssl rand -base64 32
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
BETTER_AUTH_URL=http://localhost:3000
DATABASE_AUTH_URL=postgresql://myUser:mySecretPassword@localhost:5432/auth_db
DATABASE_WEBHOOK_URL=postgresql://myUser:mySecretPassword@localhost:5432/webhook_db
REDIS_URL=redis://localhost:6379
```

**webhook-publisher/.env**

```env
THREAD_COUNT=5
REDIS_HOST=localhost
REDIS_PORT=6379
POSTGRES_DSN_URL=postgresql://myUser:mySecretPassword@localhost:5432/webhook_db
```

**repo-checker/.env**

```env
REDIS_HOST=localhost
REDIS_PORT=6379
```

### 3. Run Services

Start each component in a separate terminal:

- **Frontend:** `cd app && npm install && npm run dev`
- **Webhook Publisher:** `cd webhook-publisher && ./local.install.sh && python main.py`
- **Repo Checker:** `cd repo-checker && ./local.install.sh && python main.py`

## Production Environment

In production, the entire stack (frontend, worker, checker, and dependencies) is containerized.

### 1. Environment Variables

Create a root `.env` file or pass the environment variables securely to the production environment. Ensure database and Redis hostnames match the production setup or Docker service names.

### 2. Start Stack

Build and run all services using the production compose file:

```sh
docker-compose -f prod.docker-compose.yml up -d --build
```
