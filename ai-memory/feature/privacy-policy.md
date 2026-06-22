# Privacy Policy Page + Integration

## Summary

Added a Privacy Policy page at `/privacy` to freshbatch, following the same structure as the existing Terms of Service page. The page is a static Server Component with 12 legal sections, each accompanied by a plain-language TL;DR summary. The footer now links to both Terms of Service and Privacy Policy. The Terms of Service Section 6 now links to the Privacy Policy. The PublicNavbar `"legal"` variant now shows cross-links between `/tos` and `/privacy`. Both `/tos` and `/privacy` are included in the sitemap.

## Files Changed

| File                                  | Purpose                                                                          |
| ------------------------------------- | -------------------------------------------------------------------------------- |
| `app/app/privacy/page.tsx`            | New Privacy Policy page — Server Component, 12 sections + TL;DR, metadata export |
| `app/components/Footer.tsx`           | Added Privacy Policy link alongside Terms of Service link                        |
| `app/app/tos/page.tsx`                | Section 6 now links to `/privacy`                                                |
| `app/components/PublicNavbar.tsx`     | `"legal"` variant now shows cross-links between TOS and Privacy pages            |
| `app/app/sitemap.ts`                  | Added `/tos` and `/privacy` entries                                              |
| `ai-memory/feature/privacy-policy.md` | This feature summary                                                             |
| `ai-memory/changelog.md`              | Updated with changelog entry                                                     |

## Decisions

- **URL path**: `/privacy` (standalone route, matching `/tos` pattern)
- **Page structure**: 12 numbered sections + appendices-style final Contact section. Each section has a bold "TL;DR:" prefix with plain-language summary.
- **Data collection disclosure**: GitHub profile (name, email, avatar), webhook URL, job-type preferences, delivery logs.
- **Regulations covered**: GDPR (EU/EEA users) and CCPA (California users).
- **Third-party services**: GitHub OAuth, Google Analytics (planned), self-hosted PostgreSQL/Redis infrastructure.
- **Cookies**: Better Auth session cookie + functional cookies.
- **Data retention**: 30 days post-account deletion, matching Terms of Service.
- **Jurisdiction**: California, USA (matching Terms of Service).
- **Contact**: Twitter/X [@guuzzeji](https://x.com/Guuzzeji).
- **Design**: Uses existing CSS custom properties and Tailwind v4 classes — no new design tokens.
- **Footer link ordering**: Terms of Service first, Privacy Policy second.
- **Sitemap**: Both `/tos` and `/privacy` added with `changeFrequency: "monthly"` and `priority: 0.3`.
- **No automated tests**: QA is user-managed per the execution plan.
