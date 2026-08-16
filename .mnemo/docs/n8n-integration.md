---
id: n8n-integration
tags: ["frontend"]
status: active
---
# n8n Integration Docs Page

## Summary

Added a new documentation page at `/docs/integrations/n8n` that walks users through connecting Freshbatch webhooks to an n8n workflow. The guide is based on the existing `setupfordummies.md` instructions and follows the same layout and styling as the other integration examples (Discord Bot, FastAPI, Express).

The new page covers prerequisites, installing n8n, exposing n8n through ngrok, creating a Webhook node, connecting the webhook URL in Freshbatch Dashboard → Delivery Settings, and suggested next steps such as routing jobs to Google Sheets. It also includes a dedicated "append jobs to Google Sheets" section with a quick-start summary and a link to the official n8n Google Sheets node docs, plus a note about adding signature verification in production workflows.

## Files Changed

| File | Purpose |
| ---- | ------- |
| `app/app/docs/integrations/n8n/page.tsx` | New n8n integration guide — Server Component with step-by-step instructions and code blocks |
| `app/app/docs/integrations/page.tsx` | Added n8n card to the Integrations overview grid and updated metadata description |
| `app/components/DocsNav.tsx` | Added "n8n Workflow" link to the docs sidebar under Integrations |
| `ai-memory/notes.md` | Updated Public Docs Architecture list to include `/docs/integrations/n8n` |
| `ai-memory/feature/n8n-integration.md` | This feature summary |
| `ai-memory/changelog.md` | Updated with changelog entry |

## Key Decisions

- **URL path**: `/docs/integrations/n8n`, consistent with other integration examples.
- **Page structure**: Prerequisites → Install n8n → Expose with ngrok → Create webhook workflow → Connect Freshbatch → Next steps, matching the order in `setupfordummies.md`.
- **Styling**: Reused the existing docs card and dark code-block styling from the Discord integration page (CSS-variable shorthand utilities).
- **Signature verification**: Added a warning that the basic workflow skips signature verification and linked to `/docs/signature-verification` for production setups.
- **No external GitHub repository**: Unlike the Discord example, this page is a procedural guide rather than a code repository showcase.
- **No automated tests**: QA is user-managed per the execution plan.
