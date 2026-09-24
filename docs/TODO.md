# Frontend TODO

Scope: Phase 1 (public funnel) and Phase 2 (staff MVP) are built; PR `feat/fulfillment-mvp` → `develop` is open. Phase 3 below is the remaining + proposed backlog.

## Phase 1 (do first)

- [ ] Port reference data verbatim: states, certificates, government-fees, faq, legal, pricing, form-config, address → `lib/data/*`
- [ ] Order form upgrade: per-state rules, county/city validation, address same-as copy, sessionStorage draft (no SSN), Zod validation, working review + Edit scroll
- [x] Checkout: Checkout Sessions embedded tabs (reference UI verbatim), summary sidebar, authorize + Pay flow, session-verified confirmation receipt — done 2026-09-21, real $238 test payment passed
- [ ] Confirmation (→ Phase 3): replace static page with `GET /orders/:id/confirmation` verification + print receipt
- [x] Tracking: sanitized, customer-friendly progress timeline backed by `POST /orders/tracking` — done 2026-09-22
- [x] State detail page UI (`/state/[state]`) — done 2026-09-21, matches reference
- [x] Order form rebuild (config-driven 4 types, geo county/city dropdowns, per-cert fields/reasons/relationships, father conditional, working address copy, live review + Edit, SSN-safe draft, verify→create→checkout) — done 2026-09-21
- [x] Geo datasets (`public/geo/`, lazy per-state) — done 2026-09-21
- [x] Contact Us is API-backed (stores inquiry, queues support + receipt emails) — done 2026-09-21; per-state fee/rules data port remains below
- [x] Full FAQ accordion (29 items verbatim + JSON-LD) — done 2026-09-21
- [x] Private frontend API configuration: browser requests use `/api/backend`; the upstream is configured with server-only `API_URL` — done 2026-09-21
- [x] Vercel dependency cleanup: ESLint 9 is aligned with the Next.js lint-plugin peer range — done 2026-09-21
- [x] Birth-form field requirements: required SSN and suffix; optional requestor middle name; female maiden-name rule — done 2026-09-21
- [x] Removed name-history and alternate-spelling questions from every certificate form and order payload — done 2026-09-21
- [x] Added shipping and billing address-name requirement notices — done 2026-09-21
- [x] Updated processing-time copy (standard 5–7 business days; rush next day) and removed the order-tracking callout — done 2026-09-21
- [x] Updated the homepage hero reference for the PNG replacement asset — done 2026-09-21
- [x] Removed the requestor previous-last-name question and field from every certificate form and order payload — done 2026-09-21
- [x] Removed public phone support and temporarily blocked nine California counties before order creation or payment — done 2026-09-22
- [x] Real legal pages (privacy, terms, accessibility verbatim) — done 2026-09-21
- [ ] Content remaining: per-state fee/rules data port
- [ ] SEO: `app/sitemap.ts`, JSON-LD Organization, metadata per state/cert page
- [x] GA4: production-only public funnel events plus server-verified Purchase delivery — done 2026-09-22
- [x] GTM: install `GTM-KC8LVCXR` in the shared root layout on production pages alongside direct GA4 — done 2026-09-23
- [ ] Email display (→ Phase 3): receipt UI matches backend email template (backend owns sending)
- [x] Review shows a generic card placeholder ("Card provided (kept private)"), never digits; Section 11 + checkout copy state encrypted storage — done 2026-09-23
- [x] Server-validation errors scroll to + focus + red-highlight the exact input, clear as the user fixes them, and the error summary links jump to each field — done 2026-09-23
- [x] Every invalid field shows its message inline next to the input (subject/family/address/email/reason/card/signature/consents) — done 2026-09-23
- [x] Inline error messages styled prominent (red, bold, tinted box) so hint-text CSS can't mute them — done 2026-09-23
- [x] Blocked-California-county message no longer wiped by clear-on-fix (`county` owns its error lifecycle) — done 2026-09-23
- [x] Tracking example matches the sequential plate order-number format (`USCA-BT-20260922-00A001`) — done 2026-09-23
- [x] Tracking shows 4 milestones ending at Submitted-to-Agency, dates only (no times), header unchanged — done 2026-09-23
- [x] Review renamed to "Review To Submit" with a Parent/Family block (Edit → §4) plus Home and requestor-DOB rows so every entered detail is reviewable — done 2026-09-23
- [x] Live input masks: SSN auto-hyphens + 9-digit cap + plausibility hint, card grouping + inline Visa/MC mark + MM/YY + 3-digit CVV — done 2026-09-23
- [x] Country-code phone picker (`react-international-phone`, US default + US pinned, searchable, E.164 value) replacing the USA-only mask — done 2026-09-23
- [x] Blocked-county alert rebuilt on dedicated state (banner names the county, unlocks on allowed pick; fixes permanent form lock) + SSN shown visibly with auto-dashes — done 2026-09-23
- [x] Confirm-email blocks paste/drop with live mismatch hint; checkout shows "Locked. Private. Protected." badge and a single rush-aware fee line (left two-payments block removed) — done 2026-09-23
- [x] Blocked counties stay selectable with a state-derived red banner; section locks removed (fixes permanent lockout) and the payment button + submit are gated instead — done 2026-09-23
- [x] `state_code` on select_state/select_certificate/order_started/begin_checkout/add_payment_info; mount-event queue so select_certificate is never dropped — done 2026-09-23
- [x] Proof: `npm run build` passes — green 2026-09-23 (19 routes)

## Phase 2 (staff MVP — built 2026-09-23 on `feat/fulfillment-mvp`)

- [x] Middleware host split (`middleware.ts`): `flow.*` serves `/auth` + `/staff/*` only (root rewrites to queue, staff area gets `noindex` + internal chrome); main host 404s staff paths; localhost/previews allow all by path
- [x] Staff login + TOTP enroll (QR)/verify + invite-setup (`/auth?setup=`) + 30-min inactivity signout + session token store (`lib/staff-client.ts`, proxy forwards `authorization` + PATCH/PUT/DELETE)
- [x] Fulfillment queue/detail/notes/audit/status (`/staff`, `/staff/[id]`): masked rows, claim, per-field reveal with reason + 30-sec auto-mask + copy buttons, exception statuses with note, release
- [x] Admin dashboard (`/staff/admin`): invite modal (emailed-confirmation or manual setup link) + re-send, roster with avatars/pills, disable/revoke/MFA-reset, stat cards, filterable day-grouped activity timeline
- [x] Sidebar shell (`StaffShell`: Open/My Work/Closed/Search/Admin/Settings, global order lookup, role pill) + dashboard kit (bands, stat cards, pills, sticky tables, numbered pagination, stepper, timeline, toasts, skeletons) in USVC tokens
- [x] MILES deltas: global lookup (`/staff/search`), Closed Orders view, Order Search page, Settings page (session info + security controls), certificate-type filter, numbered pagination, success toasts, day-grouped history, owner dropdown with Drop Ownership + admin reassign, products card with fees, notes sensitive-content warning, tabs (Summary / Application owners-only / Notes & History)
- [x] Summary redesign 2026-09-23: action-only sticky strip (status pills + Update-status anchor + Drop Ownership; single dark identity + Copy Order ID in the band), progressive note disclosure (note field only for exceptions), Order Summary as copy-free definition list grouped Order/Requestor/Fulfillment
- [x] Sidebar + detail polish 2026-09-23: brand hierarchy (USVC / Fulfillment Center / user chip with avatar + role pill), white active-link indicator bar, action-only sticky strip with single dark identity + Copy, ownership avatar card with role caption, products as right-aligned line items with emphasized total
- [x] Unified sticky order command bar 2026-09-23: band + strip merged into one dark sticky bar (identity, pills, Update status, Drop Ownership); translucent pills + light outline button on dark
- [x] Application tab tables 2026-09-23: striped-table sections (Requestor, Subject, Family, each address) with human labels, per-section Copy-all, two-state Copy (green Copied + recopy icon)
- [x] Reveal redesign 2026-09-23: red Reveal buttons, always-visible trust notices, credit-card visual (brand label, grouped number, per-part number/expiry/CVC copy), copy controls lead row text
- [x] Reveal v2 2026-09-23: SSN titled Social Security Number (SSN), card visual with chip + brand pill + footer row, rhythm-spaced reveal forms
- [x] Notes & History 2026-09-23: latest-10 paging with Show more/less + counts, day-grouped history preserved, category-colored dots, relative timestamps, note bubble cards
- [x] Shared activity module 2026-09-23: `components/staff/activity.tsx` (human labels incl. staff actions, dot categories incl. access/security, relTime) used by order history + admin feed; admin activity paged (20 + more) with human filter options
- [x] Branded sign-in 2026-09-23: centered card with USVC Flow brandmark + "Processing today for brighter tomorrows" slogan, stepper line removed
- [x] Staff auth slogan removed 2026-09-24: deleted `staff-auth-slogan` line from `/auth` (brandmark + eyebrow + H1 kept)
- [x] Staging host access 2026-09-23: `staging.*` allows staff paths by path (verified 200 + noindex on staging pattern, 404 preserved on www/flow patterns)
- [x] Roster polish 2026-09-23: avatar + name/pill flex row with gap, truncated email with hover title, two-line Last-activity date + time badge
- [x] Agent stepper + focused queues 2026-09-23: Claimed → Processing → Submitted stepper with Paid precondition chip, per-step captions, parked-note excerpt, submitted timestamp; My Work shows open claimed only with attention-first order + quick-filter chips + guided empty state; Closed Orders drops irrelevant filters
- [x] Queue correctness pass 2026-09-23: nav link-color specificity fix (button text visible), Order status / Certificate type terminology with customer-consistent options, chips-only My Work (`hideStatus`), dropdown↔chip mutual exclusion, Take Ownership / Open Order actions; 10-case backend matrix + render sweep green
- [x] Queue table + search polish 2026-09-23: date-time without age captions, green Open Order with icon, search split into form + results panels with count, query chip, match highlight, tailored empty states
- [x] Submit-time cell + form fixes 2026-09-23: two-line date + time-badge cell; form reset scoped so filter panels keep padding (`form.staff-filters` wins fairly)
- [x] Closed celebration 2026-09-23: green tick on Submitted, centered bold-green closed panel with timestamp
- [x] Error-proof client + stepper language 2026-09-23: `staffData` safe body reader (text fallback, no SyntaxError on any staff page), Took Ownership step, muted-done / ticked-current / blue Up-next stepper states

## Phase 3 (remaining + proposed backlog)

- [ ] Confirmation: replace static page with `GET /orders/:id/confirmation` verification + print receipt (needs backend endpoint)
- [ ] Email display: receipt UI matches backend email template (backend owns sending)
- [ ] Content: per-state fee/rules data port
- [ ] SEO: `app/sitemap.ts`, JSON-LD Organization, metadata per state/cert page
- [ ] Gov-fee UI, sales/revenue charts, attendance port
- [ ] Tasks system, Documents tab (backend designs still open)

Proposed — awaiting owner decision:

- [ ] SLA/age escalation surfacing for rush + stale unassigned orders
- [ ] Saved queue filters, CSV export for accounting, print-friendly order sheet
- [ ] Agency-payment confirmation display per order (needs backend field)

## Doc rule

After any code change, update this file's checkboxes + `docs/CURRENT_STATUS.md` in the same turn.
