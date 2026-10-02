# usvc-frontend architecture

## Stack

Next.js 16 App Router, React 19, Node 24. Vercel deploy of `usvc-frontend/`. No backend logic here; all data via the `/api/backend` proxy.

## Route map (`app/`)

Public (apex/`www`):

- `page.tsx` — home (hero `/assets/usvc-hero.webp`, cert cards, state grid, trust, FAQ callout). `Important disclosure` box renders on homepage only.
- `certificates/`, `find-your-state/`, `state/[state]/` (4 cert cards, $149/copy note), `state/[state]/order/[certificate]/` (canonical 11-section form) + legacy `state/[state]/[certificate]/`.
- `checkout/[orderId]/` (+ `stripe-checkout-form.tsx`, embedded Checkout Sessions tabs), `order/confirmation/[orderId]/` (verifies `session_id` with backend).
- `track-order/` (customer-safe timeline), `contact/` (API-backed, honeypot), `faq/` (+ `faq-accordion.tsx`, `faq-data.ts`, 29 items, JSON-LD), `[legal]/` (exact slugs `privacy-policy`, `terms-of-service`, `accessibility` via `legal-data.ts`).

Internal (`flow.*` only):

- `auth/` — staff login / TOTP enroll (`?setup=`) / invite setup.
- `staff/page.tsx` — Open Orders queue (default); `staff/[id]/` — detail (Summary / Application / Notes & History tabs); `staff/my/` — My Work; `staff/closed/` — Closed Orders; `staff/search/` — order-number lookup; `staff/cs/` + `staff/cs/edit/[id]/` — CS corrections inbox + full-form editor; `staff/analytics/` — self analytics; `staff/settings/` — session/security; `staff/admin/` — staff management only; `staff/admin/staff-analytics/` (+ `[id]/` per-user drilldown) + `staff/admin/orders-analytics/` (+ `[id]/` per-order timeline) — split ADMIN analytics. Legacy `staff/admin/[id]/` and `staff/admin/activity/[id]/` redirect to the nested routes.

Shared: `layout.tsx` (swaps public header/footer for `StaffShell` via `x-staff-area`; GA4 + GTM scripts load in production on all pages, OpenAI pixel only when not staff-area), `robots.ts`/`sitemap.ts` (public crawl inventory), `guides/[state]/birth-certificate` (official-source pilot guides), `api/backend/[...path]/route.ts` (proxy), `analytics.tsx` (skips `page_view` on `/staff*` and queues the direct Ads verified-purchase event), `google-ads-analytics-data.ts` (safe Ads conversion payload), `openai-analytics.tsx` (staff-gated), and `openai-analytics-data.ts` (page/event map + test).

## Host-split middleware (`middleware.ts`)

- Helpers: `isFlowHost` (`flow.*`, exact `flow.localtest`), `isLocalOrPreview` (localhost, `127.0.0.1`, `*.vercel.app`, `*.localtest`), `isStagingHost` (`staging.*` incl. exact `staging.usvitalcertificates.org`).
- `flow.*`: `/` rewrites to `/staff` (+ `x-staff-area:1`, noindex); allowed = `STAFF_PATHS` (`/auth`, `/staff`, `/api`) + `/_next*` + `/assets*` + `/favicon.ico`, else 404.
- Public host: 404s `/auth,/staff*`; `PUBLIC_FUNNEL` (checkout, track-order, order, state, contact, faq) and everything else passes.
- Local/preview/staging: allow all paths by path. `x-robots-tag: noindex, nofollow` is set only on staff-area responses (`/auth`, `/staff*`). Matcher excludes `_next/static|_next/image|favicon.ico`.

## `lib/` and `components/staff/`

- `lib/api.ts` — public POST client (`createOrder`, `verifyOrderBeforePayment`, `trackOrder`, `submitContactMessage`); checkout/confirmation pages also use direct `fetch` (e.g. `GET summary`, `POST checkout-session`).
- `lib/staff-client.ts` — `"use client"`: sessionStorage Bearer tokens (`usvc-staff-access/refresh`), `staffFetch` (attaches `authorization`, FormData-safe, single 401→refresh→`/auth`), `staffData` (text-fallback body reader — the no-bare-`.json()` rule applies inside this module).
- `lib/staff-auth-hook.ts` — `useRequireStaffAuth`, 30-min `useInactivitySignout`.
- `lib/form-config.ts` — per-cert (BIRTH/DEATH/MARRIAGE/DIVORCE) fields, relationships, reasons, father-status conditional, CA-birth override; `PROCESSING_OPTIONS`, `STATE_FORM_OVERRIDES`.
- `lib/states.ts` — 50 states + APO/FPO + international; `lib/geo.ts` + `public/geo/` lazy county/city datasets; `lib/county-availability.ts` — 9 blocked CA counties gate submit (not lock form).
- `components/staff/`: `StaffShell.tsx` (264px navy sidebar → topbar <900px), `ui.tsx` (bands, stat cards, text pills, sticky tables with card fallback <900px, pagination, stepper, timeline, toasts, skeletons, `TimedActionModal`, `ConfirmModal` — never `window.confirm`), `QueueView.tsx`, `activity.tsx`, `CopyButton.tsx` (incl. 28px row-level `CopyIconButton`).

## Design tokens

- Public (`app/globals.css`): Navy `#3C3B6E`, Red `#B22234` (ALL buttons incl. secondary), white, soft gray `#F5F5F7`, border `#E5E4E9`, muted text `#68676D`. Times New Roman everywhere incl. form controls; Stripe Elements mirrors it. 1280px container, navy/red/navy rule, white 6–8px cards, navy-focus inputs (48px track/contact, 40px application fields), red inline errors.
- Staff (`app/staff.css`, strictly namespaced): bg `#F7F9FC`, ink `#0B2545`, primary `#1D4ED8`/dark `#1E40AF`, tint `#E4EBFB`, muted `#8DA9C4`/border `#DCE4EF`, success `#16A34A`, danger `#DC2626`. Inter, 15px base, tabular numerals.

## Funnel + order form

`/` → `/find-your-state` or `/state/[state]` → `/state/[state]/order/[certificate]` (canonical; legacy `/state/[state]/[certificate]` kept) → `POST /orders` (create unpaid) → `/checkout/[orderId]` (Stripe Elements tabs) → `/order/confirmation/[orderId]` (verifies `session_id` with backend, prints paid receipt) → `/track-order` (customer-safe timeline: Payment Successful → Order Received → Order Processing → `Order Processed – Sent to the Government Agency`; exceptions show a neutral support message only).

Order form (11 sections, config-driven): copies 1–20; Standard 5–7 days, Rush next-day; Section 9 review + master consent auto-checks 6 required incl. payment authorization; address State = 52-state dropdown (APO/FPO, international region+country); shipping/billing name must match requestor; confirm-email paste-blocked. Server 422s scroll to first invalid input, focus + `data-invalid` red highlight + inline message + clickable error summary (`county` owns its lifecycle for the blocked-county banner). County/city from `lib/geo.ts` + `public/geo/`; 9 CA counties blocked (San Francisco, San Bernardino, Yolo, Riverside, Del Norte, Lake, Sutter, Kings, Santa Barbara).

Checkout: `verify-before-payment` → `createOrder` → `checkout-session` → Stripe confirm → `checkout-session/confirm` → receipt at `/order/confirmation/[orderId]?session_id=`.

## Staff portal essentials

Invite-only (member sets 8+ char password via setup link, pairs TOTP). Daily login = email + password + TOTP. 30-min inactivity sign-out; lost device → ADMIN MFA reset (revokes sessions, audited). Queue: searchable/filterable paid-only, masked rows, claim exclusive/atomic (409 if taken). Detail owner-or-ADMIN with stepper (Claimed → Processing → Submitted) and `TO_CS`/`GTG` lane. `ConfirmModal` for destructive actions (never `window.confirm`); lucide icons always paired with text; tables fall back to cards <900px.

## Deploy + env (names only — never commit values)

Local: `cp .env.local.example .env.local` (`API_URL=http://localhost:4000`), `npm install`, `npm run dev` (backend must run). Vercel: deploy `usvc-frontend/` to one project; attach apex + `www` + `flow.*` to the same project. `API_URL` server-only, never exposed to browsers. `ANALYTICS_ENABLED=true` only in production. `GTM-KC8LVCXR` hardcoded in `layout.tsx`. Never put Mongo/Stripe/JWT secrets in frontend env.

Analytics (prod public-only): GA4 + GTM + direct Google Ads `conversion_event_purchase_2` (server amount, USD, public order number as dedup ID) + OpenAI pixel (`page_viewed`, `checkout_started`, verified `order_created` reusing server `openAiEventId`). `__oppref/__obref` cookies forwarded for CAPI matching. Browser events never send PII. Backend sends the only GA4 `purchase` (after signed webhook) and always sends a SHA-256 email hash for paid-order OpenAI conversions.

SEO: sitemap/robots generated by Next.js; canonical metadata; Organization JSON-LD (name/URL/logo/support email only); noindex staff/customer/non-production routes. 10-state official-source birth-guide pilot (`/guides/{state}/birth-certificate`): link the public agency resource, original summary, source-checked date; no state fee/eligibility/timing claim unless sourced.

## Security invariants

Proxy streams body with `duplex:half`, forwards `content-type` + `authorization` only, `no-store`, 502 JSON on failure. Form never sends input values to analytics/logs/URLs/storage; review shows generic placeholder, never digits. Staff reads go only through authorized endpoints. Fails closed on missing env.

## Shared facts (both repos)

Hosts: local `:3000` + `:4000`; preview `*.vercel.app`; staging `staging.*`; prod apex + `www` / `flow.*` / Render API. Order milestones: Payment Successful → Order Received → Order Processing → Order Processed (Submitted to Govt Agency); exception state `TO_CS` shows neutral message only. Staff flow: `PAID → IN_REVIEW → SUBMITTED` + `IN_REVIEW → TO_CS` (note required, 26-value substatus) → `TO_CS → GTG` → `GTG → IN_REVIEW`. Roles: ADMIN (all), FULFILLMENT (own orders), CS (own + correction + `GTG` + pricing). Order numbers `US<ST>-<BT|DT|MG|DV>-<YYYYMMDD>-<DDLDDD>`, opaque everywhere. Pricing server-authoritative cents: copies × $149 + $45 rush; agency/shipping fees charged later, never in total.
