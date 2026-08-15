# repo-checker

The repo-checker is our polling service. It watches two GitHub repositories for new job listings, pulls the new entries out of commit diffs, and publishes them onto a Redis queue for the webhook-publisher to pick up.

It talks to Redis and GitHub. That's it. No Postgres connection, no web framework, just a loop.

## What it watches

Both tracked repos live under the SimplifyJobs org, and we watch a single file on the `dev` branch of each:

| Repo | Job type | Local clone dir | Watched file |
|------|----------|-----------------|--------------|
| `SimplifyJobs/New-Grad-Positions` | FTE | `SimplifyJobs-New-Grad-Positions` | `.github/scripts/listings.json` |
| `SimplifyJobs/Summer2026-Internships` | Intern | `SimplifyJobs-Summer2026-Internships` | `.github/scripts/listings.json` |

## How a tick works

Every tick, for each repo, the service:

1. Clones the repo on first run, or `git pull` on every run after.
2. Reads the last-processed commit date from the Redis key `{repo_name}:last_commit_date`. If nothing is there yet, the baseline is right now.
3. Uses PyDriller to walk commits newer than that date that touched the listings file.
4. Parses the added lines of each diff, looking for job JSON blocks.
5. If it found jobs, it LPUSHes them as a single JSON array batch onto `webhook:fanout:pending`.
6. Saves the new high-water mark: the newest commit's `author_date` plus 5 seconds, so we don't reprocess the same commit next tick.

Git commands are retried up to 3 times with backoff before giving up.

## Runtime behavior

Run it with:

```bash
python main.py
```

It's an infinite `while` loop. Ticks are non-overlapping: a `threading.Lock` skips a tick if the previous one is still running, so we never stack up two scans at once. Between repos within a tick, it sleeps briefly to be polite.

If the process hits repeated resource pressure (fork or thread exhaustion errors), it exits with code 1 on purpose. The container runtime sees the failure and restarts it fresh, which is usually all it needs.

## Environment variables

| Variable | Default | Notes |
|----------|---------|-------|
| `REDIS_URL` | `redis://localhost:6379` | Full Redis connection URL. |
| `REPO_CHECKER_INTERVAL_SECONDS` | `30` | Seconds between ticks. Minimum 5. |
| `REPO_CHECKER_INTER_REPO_DELAY_SECONDS` | `1.0` | Sleep between repos within a tick. |
| `REPO_CHECKER_FORCE_RECLONE_ON_STARTUP` | `true` | Deletes the local repo dirs and fresh-clones once at startup. |

### Deployment gotcha: set REDIS_URL

`prod.docker-compose.yml` sets `REDIS_HOST` and `REDIS_PORT` for this service, but the code only reads `REDIS_URL`. If you deploy without setting `REDIS_URL` explicitly (for example `redis://redis:6379`), the service silently falls back to `localhost` and fails to connect. Always set it.

## Container

The image is `python:3.14` with `git` installed via apt, and starts with:

```bash
CMD python /app/main.py
```

Repo clones live in `/app/repos/` inside the container. They're ephemeral: a redeploy wipes them, and the startup re-clone (see `REPO_CHECKER_FORCE_RECLONE_ON_STARTUP`) rebuilds them.
