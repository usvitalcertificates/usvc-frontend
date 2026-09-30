# Main website (public funnel)

Customer-facing only. Public host (apex/`www`), Times New Roman, Navy/Red tokens. No staff paths, no staff tokens.

## Funnel

`/` → `/find-your-state` or `/state/[state]` → `/state/[state]/order/[certificate]` (canonical; legacy `/state/[state]/[certificate]` kept) → `POST /orders` (create unpaid) → `/checkout/[orderId]` (Stripe Elements tabs) → `/order/confirmation/[orderId]` (verifies `session_id` with backend, prints paid receipt) → `/track-order` (customer-safe timeline: Payment Successful → Order Received → Order Processing → `Order Processed – Sent to the Government Agency`; exceptions show a neutral support message only).

## Order form (11 sections, config-driven)

`lib/form-config.ts` per cert type (BIRTH/DEATH/MARRIAGE/DIVORCE): subject/family fields, relationships, reasons, father-status conditional, CA-birth override (fields TBD — see code). Removed everywhere: name-history, alternate-spelling, requestor previous-last-name. Copies 1–20; Standard 5–7 days, Rush next-day; Section 9 review (`dl` rows) + master consent auto-checks 7 incl. payment authorization; address State = 52-state dropdown (APO/FPO, international region+country); shipping/billing name must match requestor (notice at each section); confirm-email paste-blocked.

Validation UX: server 422s scroll to first invalid input in form order, focus + `data-invalid`/`aria-invalid` red border + inline message; clears on edit (except `county`, which persists the blocked-county banner and gates submit). County/city from `lib/geo.ts` + `public/geo/`; 9 CA counties blocked (San Francisco, San Bernardino, Yolo, Riverside, Del Norte, Lake, Sutter, Kings, Santa Barbara).

## Checkout / tracking / support

- Checkout: reference-style (eyebrow, trust badges, all-inclusive notice, tabbed payment, authorize checkbox, Pay button, sticky summary). Flow: `verify-before-payment` (in the order form) → `createOrder` → `checkout-session` → Stripe confirm → `checkout-session/confirm` → receipt at `/order/confirmation/[orderId]?session_id=`.
- Track Order: timestamped customer-safe timeline only; never raw internal states, notes, or staff info.
- Contact: API-backed (`POST /contact-messages`), honeypot + `formStartedAt`, sending/success/failure states, content warning without blocking.
- Home/cert/state/FAQ/legal: reference-ported layouts; FAQ 29-item accordion + JSON-LD; legal verbatim with tricolor rules.

## Analytics (prod public-only)

`ANALYTICS_ENABLED=true` only in production. GA4 `G-GM4PWPHER1` + GTM `GTM-KC8LVCXR` (direct `gtag.js`; never double-tag Purchase in GTM). The direct Google Ads goal event `conversion_event_purchase_2` fires only on apex/`www` after the confirmation endpoint verifies payment; it uses the server-returned charged amount, USD, and public order number as its deduplication transaction ID. Ads/GTM must map it to the Purchase goal and must not also import GA4 `purchase` into that Ads goal. OpenAI Ads pixel (async, apex/`www` only, excludes `/auth`/`/staff`): `page_viewed`, `checkout_started`, verified `order_created` (pixel `order_created` reuses the server `openAiEventId` as `event_id` for dedup). Order create forwards pixel `__oppref/__obref` cookies for CAPI matching. Browser events never send PII. After verified payment, the backend may send a normalized SHA-256 email hash only when the customer separately opts in; it never sends raw email, other application fields, Stripe IDs, order IDs, or external customer IDs to OpenAI. Backend sends the only GA4 `purchase` event (after signed webhook). Debug via `OPENAI_ADS_PIXEL_DEBUG=true` temporarily, then disable.

## Limits / next

Public SEO: sitemap/robots, canonical metadata, public Organization JSON-LD, noindex customer/staff/non-production routes, and a 10-state official-source birth-guide pilot are maintained in `docs/seo-strategy.md`. Per-state fee/rules port and confirmation-receipt verification remain. Display totals non-authoritative by design.
