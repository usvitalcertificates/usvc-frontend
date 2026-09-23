# Frontend decisions

## Next.js App Router

Next.js is used for SEO-friendly public pages, server-rendered metadata, and Vercel deployment.

## Reference UI

The Lovable export in the workspace is a behavioral and visual reference only. The Next.js implementation selectively ports its routes, wording, assets, Times New Roman typography, Old Glory color theme, spacing, cards, disclosure panels, and application layout.

## API and payment boundary

The frontend calls the Express API through a server-side `/api/backend` proxy configured by `API_URL`. It creates an order through the API, then initializes Stripe Elements from a PaymentIntent endpoint. The frontend must never make itself the source of truth for totals or payment status.

## Sensitive fields

The application form includes a masked Social Security Number field and Section 8
card fields. Values are sent to the API, encrypted (AES-256-GCM
`confidentialData`) before storage, and must never enter local storage,
telemetry, logs, MongoDB plaintext, or Stripe. Review shows a generic
placeholder, never digits; staff see `*********` until an audited reveal.

## Staff portal hosting and sessions (locked 2026-09-23)

Single Next.js project with host-split `middleware.ts`: `flow.*` serves only
`/auth` + `/staff/*` (root `/` rewrites to the queue) while the public host
404s staff paths; staff responses carry `x-robots-tag: noindex, nofollow` and
the root layout swaps the public header/footer for the `StaffShell` sidebar
via the `x-staff-area` request header. Localhost and `*.vercel.app` previews allow all
paths for development. Staff JWTs live in sessionStorage and are attached by
`lib/staff-client.ts` through the same-origin `/api/backend` proxy (which
forwards `authorization`); 401s trigger one refresh attempt, then redirect to
`/auth`. No staff secret ever touches cookies, URLs, or analytics (GA already
skips `/staff` page views and only runs on public production hosts).

## Staff dashboard design (locked 2026-09-23)

Sidebar shell (`StaffShell`: navy sidebar with Open Orders / My Work / Closed
Orders / Order Search / Administration (admin) / Settings, top strip with global
order-number lookup, role pill, sign-out) adapted from the MILES reference
information architecture but rebuilt in USVC tokens (Times, navy/red, soft gray,
white cards, 6–8px radius) — not a visual clone. Shared kit in
`components/staff/ui.tsx` (bands, stat cards, status pills, sticky tables with
card fallback under 760px, numbered pagination, stepper, day-grouped timeline,
toasts, skeletons) plus a `/* Staff dashboard */` CSS section. Detail uses tabs
(Summary / Application owners-only / Notes & History); Documents tab and Tasks
system are deferred to Phase 3. Notes warn (without blocking) on SSN/card-like
content.

## Locked 2026-09-21: scope and boundaries (refreshed 2026-09-23)

- Scope: Phase 1 (public funnel) and Phase 2 (staff MVP) are built. See `docs/TODO.md` Phase 3 for the remaining backlog.
- Payments: Stripe Checkout Sessions (`ui_mode: elements`, embedded tabs) — one charge path only.
- DB/Auth: backend stays Express + Mongo + JWT (no Supabase rewrite). Frontend stays API-driven via the private `API_URL` proxy configuration.
- Do not port custody/vault/second-charge. Do not over-engineer: no extra plan/roadmap docs beyond `TODO.md`, `CURRENT_STATUS.md`, `DECISIONS.md`.
