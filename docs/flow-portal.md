# Flow portal (staff UI, `flow.*`)

Internal only. Served from the same Next.js project but host-separated: `flow.*` allows `/auth` + `/staff/*` (root `/` rewrites to queue); public host 404s them; previews/localhost/staging use paths. All responses carry `x-robots-tag: noindex, nofollow`. Own stylesheet `app/staff.css` (namespaced), Inter, blue palette. No GA/GTM/pixel on staff.

## Auth (`/auth`)

Invite-only. Member sets own 12+ char password via setup link, pairs TOTP (QR + 6-digit code; Google/Microsoft Authenticator compatible). Daily login = email + password + TOTP. Invite from `/staff/admin`; email-disabled envs show a manual setup link (local: incognito second authenticator). 30-min inactivity sign-out; lost device → ADMIN MFA reset (revokes sessions, audited); recovery codes still open.

## Views

- **Open Orders** (`/staff`, default): searchable/filterable paid queue, masked rows, certificate-type filter, numbered pagination, attention-first + FIFO sort. Claim is exclusive/atomic (409 if taken).
- **Detail** (`/staff/[id]`, owner-or-ADMIN): sticky dark order bar (identity + Copy Order ID, pills, Update-status anchor, Drop Ownership via `ConfirmModal`); tabs Summary / Application (owners-only) / Notes & History; stepper (Claimed → Processing → Submitted, Paid as precondition chip, exceptions as parked branch with latest-note excerpt); progressive note field (appears for exception statuses); completion-PDF panel (upload/replace, PDF-only 10MB, resilient copy); per-field `Reveal SSN` / `Reveal Card` with reason + 30s countdown + copy buttons + wipe on tab-hide/leave/logout.
- **My Work** (`/staff/my`), **Closed Orders** (`/staff/closed`), **Order Search** (`/staff/search`, order-number lookup), **CS inbox** (`/staff/cs` parked `TO_CS` + `/staff/cs/edit/[id]` full-form EDIT-only editor with prefill, dirty-aware, Mark GTG).
- **My Analytics** (`/staff/analytics`, all roles, token-scoped), **Settings** (`/staff/settings`, session/security, ADMIN change-password), **Admin** (`/staff/admin` staff management only: invite/roles/status/2FA + stat cards) with split **Staff Analytics** (`/staff/admin/staff-analytics` roster + per-user drilldown, search + role/status chips) and **Orders Analytics** (`/staff/admin/orders-analytics` index + per-order timeline). Legacy `/staff/admin/[id]` URLs redirect to nested routes.

## UI kit (`components/staff/`)

`StaffShell` navy sidebar (Open/My/Closed/Search/Admin/Settings, global lookup, role pill, sign-out; topbar <900px). `ui.tsx`: bands, stat cards, text status pills, sticky tables (cards <760px), numbered pagination, stepper, day-grouped timeline, toasts, skeletons, `ConfirmModal` for destructive actions. Icons `lucide-react` + text; sentence case; focus-visible, labels, reduced-motion respected. Filters/tabs/pagination live in component state (order detail URLs still deep-link).

## Local test

Seed ADMIN in backend `staff_users` (Argon2 hash, `role: ADMIN`, `active`); open `/auth`, pair TOTP; invite agent (incognito); submit public applications then set `status` + `paymentStatus` to `PAID` in Mongo to simulate checkout (queue lists paid only).
