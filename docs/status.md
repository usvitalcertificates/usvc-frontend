# Frontend status + remaining work

Last updated: 2026-10-01. Phase 1 (public funnel) and Phase 2 (staff MVP) built.

## Implemented

- Public funnel: home (disclosure box homepage-only), certificates, state selector/landing, config-driven 4-type order form (11 sections, geo county/city, 9 CA counties blocked, 6 required consents, safe draft, verify → create → checkout), Stripe Elements checkout, session-verified confirmation, sanitized tracking timeline, API-backed contact, 29-item FAQ + JSON-LD, verbatim legal pages, Times/Navy/Red theme.
- Staff portal (`/auth`, `/staff/*`, host-split `middleware.ts`): TOTP auth + 30-min inactivity sign-out, Open/My/Closed/Search queues, tabbed order detail with stepper, `TO_CS`/`GTG` lane, CS inbox + full-form editor, completion-PDF panel, split ADMIN analytics (staff + orders), My Analytics for all roles.
- Analytics prod-only: GA4 + GTM + direct Google Ads verified-purchase event + OpenAI pixel (never on staff); browser events contain no PII. Backend always sends SHA-256 email hash for paid-order OpenAI conversions; backend sends the only GA4 `purchase`.
- SEO: sitemap/robots, Organization JSON-LD, canonical metadata, noindex customer/staff routes, 10-state birth-guide pilot.

Limits: display totals non-authoritative (backend recalculates). Per-state fee/rules port remains. Staff lists show masked rows.

## Remaining (Phase 3)

- [x] Orders Analytics charts dashboard (recharts: form-type donut, Top-states bar, form×state stacked bar, status funnel, revenue by form/state; default 30d)
- [ ] Confirmation: backend-verified receipt + print (`GET /orders/:id/confirmation`, needs backend endpoint)
- [ ] Receipt UI parity with backend email template (backend owns sending)
- [ ] Content: per-state fee/rules data port
- [ ] Gov-fee UI, sales/revenue charts, attendance port, Tasks system, Documents tab (backend designs open)
- [ ] Orders-over-time line, per-agent throughput/conversion, refund/failed tracking, CSV export
- [ ] SLA/age escalation for rush + stale unassigned orders
- [ ] Saved queue filters, CSV export, print-friendly order sheet
- [ ] Agency-payment confirmation display per order (needs backend field)
- [ ] Gate GA4/GTM script loading on non-staff pages like the OpenAI pixel — weigh GTM preview/debug impact first
- [ ] Dead OpenAI pixel page IDs: `knownPages` maps `/terms-of-use` and `/refund-policy`, which 404 — fix map or add redirects
