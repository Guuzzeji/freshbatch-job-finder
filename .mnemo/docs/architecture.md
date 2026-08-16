---
id: architecture
tags: ["architecture"]
status: active
---
## Summary
System overview: data flow, payload shape, HMAC-SHA256 signature scheme.

## Key Decisions
# Architecture

This page walks through the whole system: what each piece does, how data moves between them, and how webhook signatures keep deliveries trustworthy.

## The moving parts

Three app components, one shared package, and two infrastructure services:

- **Frontend**: a Next.js app where users sign in, manage their webhook subscriptions, and watch deliveries. It's the face of the project.
- **repo-checker**: a Python service that polls job listing repositories on GitHub and hands new postings off to the rest of the system.
- **webhook-publisher**: a Python service with a producer and workers. The producer fans each batch of jobs out to every active subscriber, and the workers make the actual HTTP calls.
- **shared**: a Python package with constants and interfaces used by both backend services, so they agree on things like queue names and payload shapes.
- **Redis**: the glue between repo-checker and webhook-publisher (details below).
- **Two Postgres databases**: one for accounts, one for webhook data (details below).

## Data flow

```
+--------------+   polls    +--------+
| repo-checker | ---------> | GitHub |
+--------------+            +--------+
      |
      |  job batches
      v
+------------------------------+
| Redis                        |
| queue: webhook:fanout:pending|
+------------------------------+
      |
      v
+------------------------------+        reads active subscribers
| webhook-publisher            | --------------------------------+
|  producer (fanout)           |                                 |
+------------------------------+                                 v
      |                                               +--------------------+
      |  one delivery task per subscriber             | webhook_db         |
      v                                               |  - webhooks        |
+------------------------------+                      |  - webhooks_log    |
| webhook-publisher            |                      +--------------------+
|  workers                     |  signed HTTP POST             ^
+------------------------------+ ------------------> subscriber URLs
      |                                                        |
      +------------------- log each delivery ------------------+
```

In words:

1. repo-checker polls GitHub repos for new job listings.
2. When it finds some, it publishes job batches onto the Redis queue `webhook:fanout:pending`.
3. The webhook-publisher producer picks up each batch and fans it out: it looks up the active subscribers in the `webhooks` table (in `webhook_db`) and creates a delivery for each one.
4. Workers deliver those deliveries as signed HTTP POSTs to the subscriber URLs.
5. Every delivery attempt is logged to the `webhooks_log` table, which is what powers the delivery log you see in the dashboard.

## Two databases, on purpose

We keep two separate Postgres databases:

- **auth_db** holds login and account data for Better Auth, which handles GitHub OAuth sign-in on the frontend.
- **webhook_db** holds everything webhook related: subscriber registrations (the `webhooks` table) and the delivery history (the `webhooks_log` table).

Splitting them keeps account credentials away from delivery data, and lets each side evolve on its own schedule.

## Why Redis sits in the middle

Redis is the shared glue. repo-checker and webhook-publisher never talk to each other directly; they only talk to Redis. The checker pushes batches onto `webhook:fanout:pending` and can go back to polling, while the publisher consumes that queue at its own pace. If the publisher is slow or restarts, work waits in the queue instead of getting lost.

## The job payload

Each job in a batch carries these fields:

| Field | Meaning |
| --- | --- |
| `is_test` | Whether this is a test job rather than a real posting. |
| `is_fte` | Full-time role. |
| `is_intern` | Internship. |
| `company_name` | The hiring company. |
| `title` | Job title. |
| `date_posted` | When the job was posted. |
| `url` | Link to the posting. Also used as the dedupe/sort key. |
| `source` | Where the listing came from. |
| `degrees` | Degree requirements for the role. |
| `sponsorship` | Visa sponsorship information. |
| `locations` | Where the job is based. |
| `category` | The job's category. |

## Signature verification

Every delivery is signed so subscribers can prove it came from us. The scheme:

1. Build a canonical JSON body: jobs sorted by `url`, object keys sorted, compact separators, and `ensure_ascii=False` so unicode characters are sent as-is rather than escaped.
2. Compute HMAC-SHA256 over that canonical JSON using the subscriber's `sign_key`.
3. Send the result in the `webhook-signature` header.

The subscriber repeats the same steps on their end with their copy of the `sign_key` and compares. If the digests match, the body is authentic and untampered. The canonicalization rules matter: any difference in key order, whitespace, or unicode escaping produces a different digest, which is why we pin them down exactly.
