# usvc-frontend architecture

## Stack

Next.js 16 App Router, React 19, Node 24. Vercel deploy of `usvc-frontend/`. No backend logic here; all data via the `/api/backend` proxy.

## Route map (`app/`)

Public (apex/`www`):

- `page.tsx` — home (stacked centered White House hero with choice bar, 3-step timeline, full-width state panel with A–Z selector + popular chips, Data Protections, FAQ preview, assurance strip). `Important disclosure` box renders on homepage only.
- `certificates/`, `find-your-state/`, `state/[state]/` (4 certificate cards with guided-support introduction and bullets; pricing remains in the FAQ), `state/[state]/order/[certificate]/` (canonical 11-section form) + legacy `state/[state]/[certificate]/` (308 to the `/order/` URL).
- `checkout/[orderId]/` (+ `stripe-checkout-form.tsx`, embedded Checkout Sessions tabs), `order/confirmation/[orderId]/` (verifies `session_id` with backend).
- `track-order/` (customer-safe timeline), `contact/` (API-backed, honeypot), `faq/` (+ `faq-accordion.tsx`, `faq-data.ts`, 29 items, JSON-LD), `[legal]/` (exact slugs `privacy-policy`, `terms-of-service`, `accessibility` via `legal-data.ts`).

Internal (`flow.*` only):

- `auth/` — staff login / TOTP enroll (`?setup=`) / invite setup.
- `staff/page.tsx` — Open Orders queue (default); `staff/[id]/` — detail (Summary / Application / Notes & History tabs); `staff/my/` — My Work; `staff/closed/` — Closed Orders; `staff/search/` — order-number lookup; `staff/cs/` + `staff/cs/edit/[id]/` — CS corrections inbox + full-form editor; `staff/analytics/` — self analytics; `staff/settings/` — session/security; `staff/admin/` — staff management only; `staff/admin/staff-analytics/` (+ `[id]/` per-user drilldown) + `staff/admin/orders-analytics/` (+ `[id]/` per-order timeline) — split ADMIN analytics. Legacy `staff/admin/[id]/` and `staff/admin/activity/[id]/` redirect to the nested routes.

Shared: `layout.tsx` (swaps public header/footer for `StaffShell` via `x-staff-area`; GA4 + GTM scripts load in production on all pages, OpenAI pixel only when not staff-area), `robots.ts`/`sitemap.ts` (public crawl inventory), `guides/[state]/birth-certificate` plus `guides/[state]/[certificate]` (52 official-resource guides across 13 states), `api/backend/[...path]/route.ts` (proxy), `analytics.tsx` (skips `page_view` on `/staff*` and queues the direct Ads verified-purchase event), `google-ads-analytics-data.ts` (safe Ads conversion payload), `openai-analytics.tsx` (staff-gated), and `openai-analytics-data.ts` (page/event map + test).

## Host-split middleware (`middleware.ts`)

- Helpers: `isFlowHost` (`flow.*`, exact `flow.localtest`), `isLocalOrPreview` (localhost, `127.0.0.1`, `*.vercel.app`, `*.localtest`), `isStagingHost` (`staging.*` incl. exact `staging.usvitalcertificates.org`). Canonical host: exact `www.usvitalcertificates.org` 308-redirects to apex (untouched: local/preview/staging/flow).
- `flow.*`: `/` rewrites to `/staff` (+ `x-staff-area:1`, noindex); allowed = `STAFF_PATHS` (`/auth`, `/staff`, `/api`) + `/_next*` + `/assets*` + `/favicon.ico`, else 404.
- Public host: 404s `/auth,/staff*`; `PUBLIC_FUNNEL` (checkout, track-order, order, state, contact, faq) and everything else passes.
- Local/preview/staging: allow all paths by path. `x-robots-tag: noindex, nofollow` is set only on staff-area responses (`/auth`, `/staff*`). Matcher excludes `_next/static|_next/image|favicon.ico`.

## `lib/` and `components/staff/`

- `lib/api.ts` — public POST client (`createOrder`, `verifyOrderBeforePayment`, `trackOrder`, `submitContactMessage`); checkout/confirmation pages also use direct `fetch` (e.g. `GET summary`, `POST checkout-session`).
- `lib/staff-client.ts` — `"use client"`: sessionStorage Bearer tokens (`usvc-staff-access/refresh`), `staffFetch` (attaches `authorization`, FormData-safe, single 401→refresh→`/auth`), `staffData` (text-fallback body reader — the no-bare-`.json()` rule applies inside this module).
- `lib/staff-auth-hook.ts` — `useRequireStaffAuth`, 30-min `useInactivitySignout`.
- `lib/form-config.ts` — per-cert (BIRTH/DEATH/MARRIAGE/DIVORCE) fields, relationships, reasons, father-status conditional, CA-birth override; `PROCESSING_OPTIONS`, `STATE_FORM_OVERRIDES`.
- `lib/states.ts` — shared 52-jurisdiction inventory (50 states, DC, Puerto Rico) for state hubs/address dropdowns, plus APO/FPO + international; `lib/geo.ts` + `public/geo/` lazy county/city datasets; `lib/county-availability.ts` — 9 blocked CA counties gate submit (not lock form).
- `components/staff/`: `StaffShell.tsx` (264px navy sidebar → topbar <900px), `ui.tsx` (bands, stat cards, text pills, sticky tables with card fallback <900px, pagination, stepper, timeline, toasts, skeletons, `TimedActionModal`, `ConfirmModal` — never `window.confirm`), `QueueView.tsx`, `activity.tsx`, `CopyButton.tsx` (incl. 28px row-level `CopyIconButton`).

## Design tokens

- Public (`app/globals.css`): Navy `#3C3B6E`, Red `#B22234` (ALL buttons incl. secondary), white, soft gray `#F5F5F7`, border `#E5E4E9`, muted text `#68676D`. Times New Roman everywhere incl. form controls; Stripe Elements mirrors it. 1280px container, navy/red/navy rule, white 6–8px cards, navy-focus inputs (48px track/contact, 40px application fields), red inline errors.
- Staff (`app/staff.css`, strictly namespaced): bg `#F7F9FC`, ink `#0B2545`, primary `#1D4ED8`/dark `#1E40AF`, tint `#E4EBFB`, muted `#8DA9C4`/border `#DCE4EF`, success `#16A34A`, danger `#DC2626`. Inter, 15px base, tabular numerals.

## Funnel + order form

`/` → `/find-your-state` or `/state/[state]` → `/state/[state]/order/[certificate]` (canonical; legacy `/state/[state]/[certificate]` 308-redirects) → `POST /orders` (create unpaid) → `/checkout/[orderId]` (Stripe Elements tabs) → `/order/confirmation/[orderId]` (verifies `session_id` with backend, prints paid receipt) → `/track-order` (customer-safe timeline: Payment Successful → Order Received → Order Processing → `Order Processed – Sent to the Government Agency`; exceptions show a neutral support message only).

Order form (11 sections, config-driven): copies 1–9; Standard 5–7 days, Rush next-day; Section 9 review + master consent auto-checks 6 required incl. payment authorization; address State = 52-state dropdown (APO/FPO, international region+country); shipping/billing name must match requestor; confirm-email paste-blocked. Server 422s scroll to first invalid input, focus + `data-invalid` red highlight + inline message + clickable error summary (`county` owns its lifecycle for the blocked-county banner). County/city from `lib/geo.ts` + `public/geo/`; 9 CA counties blocked (San Francisco, San Bernardino, Yolo, Riverside, Del Norte, Lake, Sutter, Kings, Santa Barbara).

Checkout: `verify-before-payment` → `createOrder` → `checkout-session` → Stripe confirm → `checkout-session/confirm` → receipt at `/order/confirmation/[orderId]?session_id=`.

## Staff portal essentials

Invite-only (member sets 8+ char password via setup link, pairs TOTP). Daily login = email + password + TOTP. 30-min inactivity sign-out; lost device → ADMIN MFA reset (revokes sessions, audited). Queue: searchable/filterable paid-only, masked rows, claim exclusive/atomic (409 if taken). Detail owner-or-ADMIN with stepper (Claimed → Processing → Submitted) and a tab-driven flow: Summary starts processing, Application handles the optional `TO_CS`/`GTG` lane and hands off, and Notes & Document Upload owns final submission. `ConfirmModal` for destructive actions (never `window.confirm`); lucide icons always paired with text; tables fall back to cards <900px.

## Deploy + env (names only — never commit values)

Local: `cp .env.local.example .env.local` (`API_URL=http://localhost:4000`), `npm install`, `npm run dev` (backend must run). Vercel: deploy `usvc-frontend/` to one project; attach apex + `www` + `flow.*` to the same project. `API_URL` server-only, never exposed to browsers. `ANALYTICS_ENABLED=true` only in production. `GTM-KC8LVCXR` hardcoded in `layout.tsx`. Never put Mongo/Stripe/JWT secrets in frontend env.

Analytics (prod public-only): GTM container only (Google Tag + UET; page_view automatic, no manual push) + `Purchase` dataLayer event (server amount, USD, public order number as dedup ID; fires GA4 Purchase + UET tags) + OpenAI pixel (`page_viewed`, `checkout_started`, verified `order_created` reusing server `openAiEventId`). `__oppref/__obref` cookies forwarded for CAPI matching. Browser events never send PII. Backend sends the only GA4 `purchase` (after signed webhook) and always sends a SHA-256 email hash for paid-order OpenAI conversions.

SEO: sitemap/robots generated by Next.js; canonical metadata; Organization JSON-LD (stable `@id`, legal name, contact, address, social profiles); noindex staff/customer/non-production routes. 13-state official-source guide library (birth/death/marriage/divorce) (`/guides/{state}/birth-certificate`): link the public agency resource, original summary, source-checked date; no state fee/eligibility/timing claim unless sourced. `/about` and `/editorial` document the operator, service limits, source standards and corrections. The XML sitemap prioritizes 50 state hubs, 52 guides, `/guides`, and static pages; transactional order pages are `noindex, follow`, linked from hubs, and omitted from the sitemap.

Public previews use `socialMetadata` in `lib/seo.ts` on each public template because nested metadata is replaced, not deeply merged. It supplies the existing `/opengraph-image` PNG, explicit Twitter cards, image alt/dimensions, site identity and page-specific URLs; guides use article type. `/llms.txt` is a static-generated text/Markdown directory from the public guide inventory, not an authorization policy or ranking requirement. Keep it out of the 113-page XML sitemap. `npm run test:seo` checks rendered production HTTP output locally after a build. Audit implementation and remaining issues are tracked in `docs/seo-audit-tracker.md`.

## Security invariants

Proxy streams body with `duplex:half`, forwards `content-type` + `authorization` only, `no-store`, 502 JSON on failure. Form never sends input values to analytics/logs/URLs/storage; review shows generic placeholder, never digits. Staff reads go only through authorized endpoints. Fails closed on missing env.

## Shared facts (both repos)

Hosts: local `:3000` + `:4000`; preview `*.vercel.app`; staging `staging.*`; prod apex + `www` / `flow.*` / Render API. Order milestones: Payment Successful → Order Received → Order Processing → Order Processed (Submitted to Govt Agency); exception state `TO_CS` shows neutral message only. Staff flow: `PAID → IN_REVIEW → SUBMITTED` + `IN_REVIEW → TO_CS` (note required, 26-value substatus) → `TO_CS → GTG` → `GTG → IN_REVIEW`. ADMIN may rewind an accidental move with a required reason from the order detail page. Roles: ADMIN (all), FULFILLMENT (own orders), CS (own + correction + `GTG` + pricing). Order numbers `US<ST>-<BT|DT|MG|DV>-<YYYYMMDD>-<DDLDDD>`, opaque everywhere. Pricing server-authoritative cents: copies × $149 + $12 rush; agency/shipping fees charged later, never in total.

## Contact recovery and payment verification

ADMIN/CS-only routes: `/staff/unpaid-orders` (POST search body, filters, pagination), `/staff/unpaid-orders/[id]` (minimal customer contact and append-only outreach history), `/staff/payments` (live Stripe history and exact reference lookup), and `/staff/payments/[reference]` (current payment, Flow comparison, attempts/refunds). `DashboardAccess` gates first render; backend repeats role/active/revocation checks and audits read access. Components cancel superseded requests, keep search/note values in memory, clear provider data on failed reads, and use only the existing same-origin proxy. Payment views have no mutation controls. New `staff-dashboard-*` styles stay inside staff.css; tables become labelled cards on mobile. Deep order-history scans are bounded by the backend and expose explicit continuation; Stripe has no fabricated global totals.

## Secure application resume

`/resume` is a dynamic private public-site route: recovery links arrive in a fragment, are immediately removed from the visible URL, and are exchanged through body-only same-origin requests. Customers explicitly request an email code before listing or reading saved applications. The backend issues the scoped HttpOnly cookie; only recovery proxy requests forward it. Recovery pages omit analytics, set no-referrer/no-store/noindex, and store no credentials or prefilled application data in browser storage.

The existing OrderForm accepts a verified recovery context and whitelisted initial values without using its normal browser draft. Recovery edits and retries use revision-checked backend endpoints; SSNs/cards are never fetched. Normal card declines stay on the existing filled form, while uncertain results use submission-key status checks. ADMIN/CS link controls live on the existing unpaid-order follow-up detail page.

## Descriptive recovery aliases

Middleware rewrites `/resume-*` to `/resume` while retaining the browser URL and applying the same private recovery headers/root-layout tracking exclusion. Analytics helpers also exclude the aliases. Path labels carry no authorization; the existing backend grant and verified cookie determine accessible orders. Invalid labels use the same safe recovery screen.

404 metadata: the homepage owns its canonical in `app/page.tsx`; the root layout supplies no canonical fallback. Unknown state hubs and legal documents return no page metadata before `notFound()`. Other valid public templates keep explicit self-canonicals. HTTP regressions cover both crawler and browser user agents and require 404 + noindex + no canonical, alongside all 268 sitemap URLs. State hubs read `lib/states.ts` directly; unit tests compare that inventory with the order allowlist and supported sitemap jurisdictions, including VT/WY exclusions. Mobile production lab evidence is recorded in `docs/mobile-performance-2026-10-21.md`; it is separate from local SEO checks and CrUX field measurements.

Guide discovery/mobile delivery: state hubs render one contextual guide navigation link only when the state is present in `BIRTH_GUIDE_SOURCES`. Root Inter retains its staff CSS variable but uses `preload: false` to avoid public-page font downloads. The homepage hero keeps its source/layout/priority and requests image quality 60; the image optimizer allows [60, 75], preserving default quality for other images. Production HTTP verification checks guide links, public font preloads, two-hop reachability for all 268 sitemap pages and actual hero-byte savings. See `docs/guide-discovery-mobile-2026-10-21.md` for live-test evidence and controlled local measurements.

## Guide library and clean type checking

`app/guides/guide-page.tsx` renders the existing guide layout for all four record types. Birth content stays in its original state modules. `record-guide-data.ts` contains reviewed state/record facts and official URLs; `record-guide-content.ts` builds the 39 additional articles with record-specific preparation and document distinctions. New guides link to support for service confirmation; official request paths are explicit, including direct county/court requests. `lib/guide-inventory.ts` drives the 52 sitemap and llms.txt entries. Sources are dated independently of the birth guides. The directory and state hubs link all four types, and sibling links connect them.

`npm run typecheck` runs `next typegen && tsc --noEmit`. Use it on clean checkouts, in CI and in pre-commit: RouteContext is a generated global and is unavailable before type generation. Running the type generator does not start a server or require the backend.
