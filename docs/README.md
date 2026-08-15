# Documentation

Welcome to the docs for the webhook job tracker. This project watches job listing repositories, then pushes new listings to your subscribers over signed webhooks, so students hear about fresh openings the moment they appear.

These pages cover how the system fits together, how to run it, and how each service works. If you're new here, start with the architecture overview, then pick the service you care about.

Looking for the project overview and setup? Head back to the [root README](../README.md).

## Contents

| Doc | What's inside |
| --- | --- |
| [Architecture](architecture.md) | The moving parts, how data flows between them, and how signatures work. |
| [Development](development.md) | Day-to-day local development workflow. |
| [Frontend service](services/frontend.md) | The Next.js app: routes, env vars, and how to run it. |
| [Repo checker service](services/repo-checker.md) | The Python poller that finds new job postings. |
| [Webhook publisher service](services/webhook-publisher.md) | The producer and workers that deliver webhooks to subscribers. |
| [Tooling](services/tooling.md) | Shared scripts and helper utilities. |
| [Docker Compose deployment](deployment/docker-compose.md) | Running the stack with Compose. |
