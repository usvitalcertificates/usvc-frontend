# Flow portal (staff UI, `flow.*`)

Internal only. Served from the same Next.js project but host-separated: `flow.*` allows `/auth` + `/staff/*` (root `/` rewrites to queue); public host 404s them; localhost / `127.0.0.1` / `*.vercel.app` / `*.localtest` / staging allow all paths by path (`flow.localtest` rewrites `/` to queue). Staff-area responses (`/auth`, `/staff*`) carry `x-robots-tag: noindex, nofollow` (flow 404s and public passes do not). Own stylesheet `app/staff.css` (namespaced), Inter, blue palette. Analytics truth: GA4 + GTM scripts still load on staff pages in production, but the `page_view` event is skipped there and the OpenAI pixel never loads on staff.

## Auth (`/auth`)

Invite-only. Member sets own 8+ char password via setup link, pairs TOTP (QR + 6-digit code; Google/Microsoft Authenticator compatible). Daily login = email + password + TOTP. Invite from `/staff/admin`; email-disabled envs show a manual setup link (local: incognito second authenticator). 30-min inactivity sign-out; lost device → ADMIN MFA reset (revokes sessions, audited); recovery codes still open.

## Views

- **Open Orders** (`/staff`, default): searchable/filterable paid queue, masked rows, certificate-type filter, numbered pagination, attention-first + FIFO sort. Claim is exclusive/atomic (409 if taken).
- **Detail** (`/staff/[id]`, owner-or-ADMIN): sticky dark order bar (identity + Copy Order ID, pills, Update-status anchor, Drop Ownership via `ConfirmModal`); tabs Summary / Application (owners-only) / Notes & History; stepper (Claimed → Processing → Submitted, Paid as precondition chip, exceptions as parked branch with latest-note excerpt); progressive note field (appears for exception statuses); completion-PDF panel (upload/replace, PDF-only 10MB, resilient copy); controlled sensitive-data actions (handling policy TBD — see `fulfillment.md`).
- **My Work** (`/staff/my`), **Closed Orders** (`/staff/closed`), **Order Search** (`/staff/search`, order-number lookup), **CS inbox** (`/staff/cs` parked `TO_CS` + `/staff/cs/edit/[id]` full-form EDIT-only editor with prefill, dirty-aware, Mark GTG).
- **My Analytics** (`/staff/analytics`, all roles, token-scoped), **Settings** (`/staff/settings`, session/security, ADMIN change-password), **Admin** (`/staff/admin` staff management only: invite/roles/status/2FA + stat cards) with split **Staff Analytics** (`/staff/admin/staff-analytics` roster + per-user drilldown at `/staff/admin/staff-analytics/[id]`, shared `.staff-filters` bar) and **Orders Analytics** (`/staff/admin/orders-analytics`: paid-order charts dashboard — form-type donut, Top-states bar, form×state stacked bar, status funnel, revenue by form/state — with Today/7d/30d/3mo/6mo/1yr/All + custom presets, default 30d, via `GET /admin/orders-summary`). Legacy `/staff/admin/[id]` redirects to the staff-analytics drilldown; legacy `/staff/admin/activity/[id]` redirects to the Orders Analytics dashboard (per-order timelines removed).

## UI kit (`components/staff/`)

`StaffShell` navy sidebar (Open/My/Closed/Search/Admin/Settings, global lookup, role pill, sign-out; topbar <900px). `ui.tsx`: bands, stat cards, text status pills, sticky tables (card fallback <900px via `.staff-cards-fallback`), numbered pagination, stepper, day-grouped timeline, toasts, skeletons, `TimedActionModal` (claim countdown), `ConfirmModal` for destructive actions. Icons `lucide-react` + text; sentence case; focus-visible, labels, reduced-motion respected. Filters/tabs/pagination live in component state (order detail URLs still deep-link).

## Local test

Seed ADMIN in backend `staff_users` (Argon2 hash, `role: ADMIN`, `active`); open `/auth`, pair TOTP; invite agent (incognito); submit public applications then set `status` + `paymentStatus` to `PAID` in Mongo to simulate checkout (queue lists paid only).
