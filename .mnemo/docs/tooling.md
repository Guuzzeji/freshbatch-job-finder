---
id: tooling
tags: ["devops"]
status: active
---
## Summary
shared/ package, testing/ mock receiver, scripts/ ops utilities.

## Key Decisions
# Tooling

A few supporting folders keep the main services small: a shared Python package, a mock receiver for local testing, and a grab bag of ops scripts. None of them are services you'd run in production on their own, but you'll touch all of them while developing.

## shared/

`shared/` is a small, dependency-free Python package (v0.1.0) with the bits both services need:

- `constant.py`: Redis queue names (`webhook:fanout:pending`, `webhook:deliver:pending`, `webhook:process:w-`)
- `postgres.py`: `parse_postgres_url`, a DSN parser
- `interface.py`: the `JobInformation` and `HookerInformation` models, with JSON serialization

### How we share code

We vendor the package into each service rather than publishing it anywhere. `build-shared.sh` copies `shared/` into `webhook-publisher/shared`, `repo-checker/shared`, and `scripts/shared`. Each service's install script then installs that local copy: `pip install ./shared` in prod, `pip install -e ./shared` for local development.

Yes, vendoring means copies. It also means every deployment is self-contained: build a service image and it carries its own snapshot of the shared code, no private package registry, no version drift between what's deployed and what's on PyPI. For a project this size, boring beats elegant.

Each service ships two install scripts for this: `local.install.sh` (editable installs for dev) and `prod.install.sh` (plain installs for prod).

## testing/

`testing/` holds a mock webhook receiver for local development. It's a FastAPI app with three endpoints:

- `POST /webhook`: validates the `webhook-signature` header as HMAC-SHA256 against the hardcoded secret `whsec_localdev1234567890abcdefghijklmnop`, returns 401 on mismatch
- `POST /webhook/no-verify`: same receiver, skips the signature check
- `GET /health`: health check

Run it with either:

```bash
uvicorn testing.mock_webhook:app --reload --port 8000
```

or:

```bash
testing/run.sh
```

Point a subscriber's `hook_url` at it and you can watch real deliveries land while you hack on the publisher.

## scripts/

Ops utilities, run by hand when you need them:

- `create-tables.py`: creates the `webhook_db` and `auth_db` databases if they're missing, then applies `create-tables.sql`. Requires `POSTGRES_DSN_URL`.
- `create-tables.sql`: the schema for `webhooks` and `webhooks_log`, including partial indexes.
- `uptime.py`: an idle loop that just keeps a container alive.

One honest note about `scripts/Dockerfile`: it's a `python:3.14` image whose CMD runs `uptime.py`, so the built container just idles. It does not auto-run `create-tables.py` on start. Table setup is a manual, one-off step; run `create-tables.py` yourself against the target database.
