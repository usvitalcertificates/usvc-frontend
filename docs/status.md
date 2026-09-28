# Frontend status + remaining work

Last updated: 2026-09-25. Phase 1 (public funnel) and Phase 2 (staff MVP) are built; fulfillment plan split into `fulfillment.md` (frontend) + backend `docs/fulfillment.md`.

## Implemented (see `architecture.md`, `main-website.md`, `flow-portal.md`)

- Public funnel: home, certificates, state selector/landing, config-driven 4-type order form (11 sections, geo county/city, 9 CA counties blocked, sensitive-safe draft, verify → create → checkout), Stripe Elements checkout, session-verified confirmation, sanitized tracking timeline, API-backed contact, 29-item FAQ + JSON-LD, verbatim legal pages, Times/Navy/Red theme.
- Staff portal (`/auth`, `/staff/*`, host-split `middleware.ts`): TOTP auth + 30-min inactivity sign-out, Open/My/Closed/Search queues, tabbed order detail with stepper, controlled sensitive-data actions (policy TBD — see `fulfillment.md`), `TO_CS`/`GTG` lane, CS inbox + full-form editor, completion-PDF panel, split ADMIN analytics (staff + orders), My Analytics for all roles.
- Analytics prod-only: GA4 `G-GM4PWPHER1` + GTM `GTM-KC8LVCXR` (scripts load on all pages; `page_view` skipped on staff) + OpenAI Ads pixel (never loads on staff); no PII in events; backend sends the only `purchase`.

## Limits

- Display totals non-authoritative (backend recalculates). Per-state fee/rules port remains. Sensitive order fields are masked in staff lists; access policy TBD — see `fulfillment.md`.

## Remaining (Phase 3)

- [ ] Confirmation: replace static page with backend-verified receipt + print (`GET /orders/:id/confirmation`, needs backend endpoint)
- [ ] Receipt UI parity with backend email template (backend owns sending)
- [ ] Content: per-state fee/rules data port
- [ ] SEO: `app/sitemap.ts`, JSON-LD Organization, metadata per state/cert page
- [ ] Gov-fee UI, sales/revenue charts, attendance port, Tasks system, Documents tab (backend designs open)

Proposed — awaiting owner decision:

- [ ] SLA/age escalation for rush + stale unassigned orders
- [ ] Saved queue filters, CSV export, print-friendly order sheet
- [ ] Agency-payment confirmation display per order (needs backend field)
- [ ] Gate GA4/GTM script loading on non-staff pages like the OpenAI pixel (today scripts load everywhere in prod; only `page_view` is suppressed on staff) — weigh GTM preview/debug impact first
- [ ] Dead OpenAI pixel page IDs: `knownPages` maps `/terms-of-use` and `/refund-policy`, which 404 (only `privacy-policy`, `terms-of-service`, `accessibility` exist) — fix map or add redirects

## Doc rule

After any code change, update this file's checkboxes + the matching `docs/` topic file in the same turn.

> Scrub note 2026-09-28: SSN/card storage, encryption, reveal, and PCI-risk discussion removed from all docs pending owner decision (see `fulfillment.md` TBD pointer). Do not re-add until the decision lands.
