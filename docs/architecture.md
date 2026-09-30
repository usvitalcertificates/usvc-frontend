# usvc-frontend architecture

## Stack

Next.js 16 App Router, React 19, Node 24. Vercel deploy of `usvc-frontend/`. No backend logic here; all data via the `/api/backend` proxy.

## Route map (`app/`)

Public (apex/`www`):

- `page.tsx` — home (hero `/assets/usvc-hero.png`, cert cards, state grid, trust, FAQ callout).
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
