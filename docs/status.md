# Frontend status + remaining work

Last updated: 2026-10-02. Phase 1 (public funnel) and Phase 2 (staff MVP) built.

## Implemented

- Public funnel: home (disclosure box homepage-only), certificates, state selector/landing, config-driven 4-type order form (11 sections, geo county/city, 9 CA counties blocked, 6 required consents, safe draft, verify → create → checkout), Stripe Elements checkout, session-verified confirmation, sanitized tracking timeline, API-backed contact, 29-item FAQ + JSON-LD, verbatim legal pages, Times/Navy/Red theme.
- Staff portal (`/auth`, `/staff/*`, host-split `middleware.ts`): TOTP auth + 30-min inactivity sign-out, Open/My/Closed/Search queues, tabbed order detail with stepper, `TO_CS`/`GTG` lane, CS inbox + full-form editor, completion-PDF panel, split ADMIN analytics (staff + orders), My Analytics for all roles.
- Analytics prod-only: GA4 + GTM + direct Google Ads verified-purchase event + OpenAI pixel (never on staff); browser events contain no PII. Backend always sends SHA-256 email hash for paid-order OpenAI conversions; backend sends the only GA4 `purchase`.
- SEO: sitemap/robots, Organization JSON-LD, canonical metadata, noindex customer/staff routes, 10-state birth-guide pilot.
- SEO meta 25-150 pass (2026-10-02): all rendered titles/descriptions kept strictly 25-150 chars; `lib/seo.ts` adds `assertSeoLength` guard used by state/order/guide templates; added missing canonical + OG + Twitter to certificates/find-your-state/order/legal/FAQ/contact; homepage + state descriptions tightened to avoid SERP truncation.
- PageSpeed phase 1 (2026-10-02): PNG→WebP (`usvc-hero` 1.9MB→117KB, `usvc-logo` 1.1MB→48KB, `usvc-logo-light` 135KB→50KB; PNGs deleted); hero LCP `fetchPriority=high` + responsive `sizes`; `staff.css` moved from root layout to `staff/` + `auth/` layouts (homepage ships one 31KB CSS chunk, staff chunk loads only on staff routes). Inter `--font-flow` stays on root `<html>` so the whole staff tree (incl. StaffShell chrome) is in scope — font files download only when used, so public pages pay nothing. GTM/gtag untouched — phase 2.
- Straight-through payment (2026-10-02): single card entry on the application form; `createOrder` charges synchronously (`paid` in response) and routes paid orders straight to confirmation (direct arrival resolves via order summary; `session_id` path kept). Browser mints a single-use Stripe token (`tok_`) at submit so the backend prefers the token path (needs dashboard tokenization surface); raw-PAN Stripe APIs are the automatic fallback (needs test-mode raw API access). Declines stay on the form with card fields cleared (never persisted — draft-excluded) and error pinned to card section. `verify-before-payment` sends no card data (PAN travels once, in `POST /orders` only). `/checkout` is now a redirect to confirmation; Stripe Elements + deps removed; `begin_checkout`/`add_payment_info`/OpenAI `checkout_started` moved to form submit. Requires backend: synchronous charge in `POST /orders` returning `{paid, publicNumber, amountCents}`.
- Birth USVR parity (fields only, own UI kept): exact 18-item reason + 11-item relationship lists; subject middleName/maiden always required, gender Male/Female, still-living Yes/No; father status Known/Unknown with Father+Unknown hint; requestor suffix, required DOB, SSN no-ITIN note; alternate phone; 90-day event note + USVR-style red-label Year of Birth Restriction notice (shared BIRTH_MIN_YEAR); matching City/County of Birth notice above Reason; soft maiden-name cross-check warnings in the verify step; section rhythm fixed via fieldset top margin; all form headings/labels title-cased via CSS (inputs, hints, errors excluded); form info/warning copy unified at 14px muted-italic with red-italic labels; birth Maiden Last Name hidden for Male subjects, compulsory for Female; Death USVR parity (7-item reasons, 9-item relationships, required requestor DOB, required middle name + Male/Female gender, optional Race, facility moved to Subject section with Section 4 hidden when empty, 2010–today notice only); Marriage USVR parity (required requestor DOB, per-spouse Gender + required Maiden names, Spouse 1/2 big headings with Spouse 2 merged into section 3, original reason and relationship lists kept, marriage restriction notices); Divorce USVR parity (required requestor DOB and Date of Divorce, per-spouse Gender + required Maiden names, Spouse 1/2 big headings with Spouse 2 merged into section 3, original lists kept, divorce restriction notices); sections numbered dynamically from visible blocks with key-based scroll anchors (no numbering gaps). Pricing/delivery/copies model unchanged.
- Checkout polish: green Pay button theme (dark-green hover, pointer cursor); white summary card with explicit Standard (Included) / Rush row and hint-styled disclosure.

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
