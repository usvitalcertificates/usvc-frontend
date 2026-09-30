# Frontend status + remaining work

Last updated: 2026-09-29. Phase 1 (public funnel) and Phase 2 (staff MVP) are built; fulfillment plan split into `fulfillment.md` (frontend) + backend `docs/fulfillment.md`.

## Implemented (see `architecture.md`, `main-website.md`, `flow-portal.md`)

- Public funnel: home, certificates, state selector/landing, config-driven 4-type order form (11 sections, geo county/city, 9 CA counties blocked, safe draft, verify → create → checkout), Stripe Elements checkout, session-verified confirmation, sanitized tracking timeline, API-backed contact, 29-item FAQ + JSON-LD, verbatim legal pages, Times/Navy/Red theme.
- Staff portal (`/auth`, `/staff/*`, host-split `middleware.ts`): TOTP auth + 30-min inactivity sign-out, Open/My/Closed/Search queues, tabbed order detail with stepper, `TO_CS`/`GTG` lane, CS inbox + full-form editor, completion-PDF panel, split ADMIN analytics (staff + orders), My Analytics for all roles.
- Analytics prod-only: GA4 `G-GM4PWPHER1` + GTM `GTM-KC8LVCXR` (scripts load on all pages; `page_view` skipped on staff), direct Google Ads verified-purchase event `conversion_event_purchase_2` (public production only; value/currency/public transaction ID; Ads-team goal mapping required), and OpenAI Ads pixel (never loads on staff); browser events contain no PII. The backend sends a SHA-256 email hash only for opt-in, verified paid-order OpenAI conversions; backend sends the only GA4 `purchase`.

## Limits

- Display totals non-authoritative (backend recalculates). Per-state fee/rules port remains. Staff lists show masked rows.

## Remaining (Phase 3)

- [x] Orders Analytics charts dashboard (`feat/orders-charts`): per-order activity table + timeline removed; recharts dashboard (form-type donut, Top-states bar, form×state stacked bar, status funnel, revenue by form/state) over `GET /admin/orders-summary` (paid orders, Today/7d/30d/3mo/6mo/1yr/All + custom, default 30d)
- [ ] Confirmation: replace static page with backend-verified receipt + print (`GET /orders/:id/confirmation`, needs backend endpoint)
- [ ] Receipt UI parity with backend email template (backend owns sending)
- [ ] Content: per-state fee/rules data port
- [ ] SEO: `app/sitemap.ts`, JSON-LD Organization, metadata per state/cert page
- [ ] Gov-fee UI, sales/revenue charts, attendance port, Tasks system, Documents tab (backend designs open)

Chart roadmap (backend `$facet` returns all dimensions in one call — new charts are frontend-only):

- [ ] Orders-over-time line, per-agent throughput/conversion, refund/failed tracking, CSV export

Proposed — awaiting owner decision:

- [ ] SLA/age escalation for rush + stale unassigned orders
- [ ] Saved queue filters, CSV export, print-friendly order sheet
- [ ] Agency-payment confirmation display per order (needs backend field)
- [ ] Gate GA4/GTM script loading on non-staff pages like the OpenAI pixel (today scripts load everywhere in prod; only `page_view` is suppressed on staff) — weigh GTM preview/debug impact first
- [ ] Dead OpenAI pixel page IDs: `knownPages` maps `/terms-of-use` and `/refund-policy`, which 404 (only `privacy-policy`, `terms-of-service`, `accessibility` exist) — fix map or add redirects

## Doc rule

After any code change, update this file's checkboxes + the matching `docs/` topic file in the same turn.
