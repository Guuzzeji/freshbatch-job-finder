---
id: tos-page
tags: ["frontend"]
status: active
---
# Terms of Service Page + Footer

## Summary

Added a Terms of Service page at `/tos` and a global footer component to freshbatch. The TOS page is a static Server Component with 14 legal sections, each accompanied by a plain-language TL;DR summary. The footer is a Client Component that appears on all public pages and hides on all `/dashboard/*` routes via `usePathname()`.

The root layout mounts the Footer as a sibling to `{children}` (not wrapping it) to preserve RSC streaming benefits. The PublicNavbar received a new `"legal"` variant that renders a minimal navigation (home link only, subline "legal") for the TOS page.

## Files Changed

| File                              | Purpose                                                                            |
| --------------------------------- | ---------------------------------------------------------------------------------- |
| `app/app/tos/page.tsx`            | New TOS page — Server Component, 14 sections + TL;DR, metadata export              |
| `app/components/Footer.tsx`       | New footer — Client Component, pathname-based dashboard exclusion, single TOS link |
| `app/components/PublicNavbar.tsx` | Added `"legal"` variant to the `variant` prop type and conditional rendering       |
| `app/app/layout.tsx`              | Imported and mounted Footer as sibling to `{children}`                             |

## Key Decisions

- **URL path**: `/tos` (standalone route, not under `/docs` — the TOS is not documentation)
- **Footer visibility**: Hidden on `/dashboard/*` via `pathname?.startsWith('/dashboard')`. Uses mounted-state pattern (`useState` + `useEffect`) to prevent SSR hydration mismatch.
- **Navbar variant**: `"legal"` — renders subline "legal" (lowercase), home link to `/`, unchanged GitHub auth section.
- **Footer content**: Exactly one link — "Terms of Service" pointing to `/tos`. No Privacy Policy, no social links, no contact info.
- **TOS structure**: 14 numbered sections + appendices (Changes to Terms, Severability, Entire Agreement, Contact). Each section has a bold "TL;DR:" prefix with plain-language summary.
- **Jurisdiction**: California, USA.
- **Contact**: Twitter [@guuzzeji](https://twitter.com/guuzzeji).
- **Design**: Uses existing CSS custom properties (`--cream`, `--brown`, `--caramel`, `--border`, `--muted`, etc.) and Tailwind v4 classes — no new design tokens.
- **No automated tests**: QA is user-managed per the execution plan.
