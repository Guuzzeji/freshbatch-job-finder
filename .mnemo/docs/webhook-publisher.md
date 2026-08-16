---
id: webhook-publisher
tags: ["backend"]
status: active
---
## Summary
Delivery service: producer/workers, SSRF, signature canonical form, schema.

## Key Decisions
# webhook-publisher

The webhook-publisher is our delivery service. It consumes job payloads from Redis, fans each batch out to every matching subscriber webhook stored in Postgres, and delivers signed HTTP POST requests to subscriber URLs.

It's the other half of the pipeline: repo-checker finds the jobs, this service gets them to people's inboxes (well, endpoints).

## How delivery works

The work is split between one producer thread and a pool of worker threads:

1. The producer LPOPs a batch (a JSON array of jobs) from `webhook:fanout:pending`.
2. It queries the `webhooks` table for active subscribers matching the job type. The filter keys off the first job in the batch: if it's FTE, `WHERE is_fte=TRUE`, otherwise `WHERE is_intern=TRUE`.
3. It builds the delivery package, which pairs the hook metadata with the payload, and LPUSHes it onto `webhook:deliver:pending`.
4. Each worker thread LMOVEs work onto its own per-worker queue, `webhook:process:w-{worker_id}`, then processes it:
   - SSRF check on the hook URL
   - HMAC-SHA256 signature
   - HTTP POST
   - Result logged to `webhooks_log`

Because the worker moves the item with LMOVE before processing, a batch in flight sits on the per-worker queue rather than vanishing, and each worker has its own queue so they don't fight over the same list.

## SSRF protection

Before sending anything, we resolve the hook URL's hostname to an IP and block private, loopback, and link-local addresses. Subscribers point this service at arbitrary URLs, so this check is not optional. Don't remove it.

## Signatures

Every delivery is signed so subscribers can verify it came from us:

- Algorithm: HMAC-SHA256, hex digest
- Secret: the subscriber's `sign_key` from the database
- Header: `webhook-signature`
- Body: `{"data": [job, ...]}`

The canonical form matters. We serialize the payload with jobs sorted by `url`, keys sorted alphabetically, compact separators (`","` and `":"`), and `ensure_ascii=False`. That last one is the classic trap: if your verifier escapes unicode and we don't (or vice versa), signatures won't match. Mismatched escaping is the number one cause of signature verification failures, so when in doubt, compare canonical bytes first.

Delivery uses a 3 second timeout, and only HTTP 200 counts as success.

## Runtime behavior

Run it with:

```bash
python main.py
```

Startup spawns `THREAD_COUNT` worker threads plus one producer thread. A supervisor loop checks every 2 seconds and restarts any thread that died, so a bad delivery doesn't quietly shrink the pool.

## Environment variables

| Variable | Default | Notes |
|----------|---------|-------|
| `THREAD_COUNT` | `5` | Number of worker threads. |
| `REDIS_URL` | `redis://localhost:6379` | Full Redis connection URL. |
| `POSTGRES_DSN_URL` | (required) | Postgres DSN. The service raises `RuntimeError` at startup if unset. |
| `BATCH_SIZE` | `100` | Cursor `itersize` for DB reads. |

## Database

The service reads subscribers and writes delivery logs. The schema lives in `scripts/create-tables.sql`.

`webhooks` table:

- `id`, `user_id` (UNIQUE), `hook_url`, `sign_key`
- `is_fte`, `is_intern`, `is_active`, `is_markdown`
- CHECK constraint: `is_fte OR is_intern` must hold. A subscriber has to want at least one job type.

`webhooks_log` table:

- `webhook_id`, `created_at`, `success`, `error_message`, `status_code`, `jobs_payload`, `is_test`

## Container

The image is `python:3.14` with `gcc` and `libpq-dev` installed via apt (needed to build the Postgres driver), and starts with:

```bash
CMD python /app/main.py
```
