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
- [x] Staff roles 2026-09-24: raw DB role labels (`ADMIN`/`FULFILLMENT`/`CS`) in shell/settings/roster; admin invite role picker (default `FULFILLMENT`) + roster role select; Products pricing card gated to `ADMIN`/`CS`; new `/staff/cs` corrections inbox with EDIT-only form correction + resume to `IN_REVIEW`
- [x] To-CS status 2026-09-24: `On Hold`/`Need Info` removed, single `To CS` park status (required internal note); Open Orders filter drops `Submitted to Govt Agency`, chips are All / To CS / Rush, KPI shows To CS; detail workflow + stepper + CS inbox follow `TO_CS`
- [x] GTG status 2026-09-24: `TO_CS → GTG` (CS/ADMIN only, note optional) → `GTG → IN_REVIEW`; red `TO_CS` blocker banner (submit locked), green `GTG` ready banner; queue adds GTG filter/chip/KPI; detail Move-to is role-aware; correction panel shows flagged note + Mark GTG
- [x] Confirm modals 2026-09-24: shared `ConfirmModal` replaces all `window.confirm` (Drop Ownership, admin revoke/2-step/disable/enable/role change); To-CS/GTG flows already used styled modals
- [x] Claim toasts 2026-09-24: `Toast` accepts an action link — Take Ownership toasts offer Open order / Open editor without leaving the list
- [x] Claim popup 2026-09-24: pastel-green `TimedActionModal` (10s countdown + progress, Open Order / Skip now) replaces claim toasts in queues and CS inbox; non-blocking by design
- [x] Others-orders guard 2026-09-24: fulfillment sees a disabled Open Order button (with owner tooltip) on colleagues' rows instead of a dead-end link; CS audit access fixed at the API so CS never hits the 403
- [x] Strict ownership UI 2026-09-24: CS follows fulfillment Open rules (own/unassigned only, ADMIN opens all); CS inbox uses assignedToMe with owner chip for colleagues' rows
- [x] Dedicated CS editor 2026-09-24: `/staff/cs/edit/[id]` full-form workspace (prefilled sections, required badges, inline errors, dirty-aware sticky bar, flagged-note callout, notes rail, locked recap, SSN/card re-entry encrypted, Mark GTG → inbox); inbox opens here; embedded quick-edit panel removed from `staff/[id]` (deep link to editor instead)
- [x] Ownership loop UI 2026-09-24: Open Orders shows all orders with role-aware actions (others' orders show owner chip, no dead-end Open link); CS inbox Take Ownership buttons; editor requires ownership (Take-ownership CTA otherwise, ADMIN bypasses); Mark GTG behind a confirm modal stating status + ownership drop
- [x] CS editor note section 2026-09-24: correction note moved out of SSN/card into its own Section 9 with standalone Save Note (posts without touching form edits); sticky Save corrections / Mark GTG row unchanged
- [x] To-CS send flow 2026-09-24: multiline note box + Send-To-CS confirm modal (ownership-drop warning + note preview) redirecting to Open Orders; RUSH pill moved from red to amber pastel everywhere (red reserved for To CS)
- [x] Staging host access 2026-09-23: `staging.*` allows staff paths by path (verified 200 + noindex on staging pattern, 404 preserved on www/flow patterns)
- [x] Roster polish 2026-09-23: avatar + name/pill flex row with gap, truncated email with hover title, two-line Last-activity date + time badge
- [x] Agent stepper + focused queues 2026-09-23: Claimed → Processing → Submitted stepper with Paid precondition chip, per-step captions, parked-note excerpt, submitted timestamp; My Work shows open claimed only with attention-first order + quick-filter chips + guided empty state; Closed Orders drops irrelevant filters
- [x] Queue correctness pass 2026-09-23: nav link-color specificity fix (button text visible), Order status / Certificate type terminology with customer-consistent options, chips-only My Work (`hideStatus`), dropdown↔chip mutual exclusion, Take Ownership / Open Order actions; 10-case backend matrix + render sweep green
- [x] Queue table + search polish 2026-09-23: date-time without age captions, green Open Order with icon, search split into form + results panels with count, query chip, match highlight, tailored empty states
- [x] Submit-time cell + form fixes 2026-09-23: two-line date + time-badge cell; form reset scoped so filter panels keep padding (`form.staff-filters` wins fairly)
- [x] Closed celebration 2026-09-23: green tick on Submitted, centered bold-green closed panel with timestamp
- [x] Error-proof client + stepper language 2026-09-23: `staffData` safe body reader (text fallback, no SyntaxError on any staff page), Took Ownership step, muted-done / ticked-current / blue Up-next stepper states
- [x] CS inbox refresh 2026-09-24: full-width Open Orders queue treatment, mobile card fallback, red correction-needed callout, and audit-derived sent-to-CS date; fixed To-CS status column removed
- [x] CS inbox Open Orders parity 2026-09-25: correction note moved into its own pastel-red column (no nested box inside the order cell), KPI stat cards, quick-filter chips, time badges on the sent-to-CS cell, and numbered pagination so the queue renders flush like Open Orders
- [x] Administration analytics 2026-09-25: modern pastel roster cards, separate role column, compact security controls, and ADMIN-only staff detail pages with 30-day KPI defaults, date/workflow filters, and paginated audit-derived form history
- [x] Administration follow-up 2026-09-25: compact full-width roster without active-order column, separate role/assignment columns, protected self row, icon security actions, KPI-aligned staff filters, and order-by-order activity explorer
- [x] Staff self analytics 2026-09-25: Analytics sidebar item for every role with the shared KPI, date, workflow, and form-history dashboard scoped to the signed-in user
- [x] Admin analytics split 2026-09-25 (`feat/admin-analytics-split`): ADMIN sidebar drops generic Analytics for dedicated Staff Analytics (`/staff/admin/staff-analytics` roster + per-user drill-down) and Orders Analytics (`/staff/admin/orders-analytics` order index + timeline); non-ADMIN sidebar item renamed My Analytics; Administration slimmed to staff management (no View details, no Orders Activity tab); legacy detail URLs redirect to new nested routes
- [x] Admin full-width UI + roster filters 2026-09-25: staff content area fills the viewport (1240px cap removed), admin stats use a 3-column grid, Staff Analytics roster gets a dedicated 5-column grid with search + role + status filters and empty state; toolbar stacks full-width on small screens
- [x] Roster filter bar aligned to queue pattern 2026-09-25: Staff Analytics chips replaced with the shared `.staff-filters` bar (search + Role/Status selects + Clear), removing the one-off chip styling that clashed with read-only table pills
- [x] Analytics detail Today default + single-row toolbar 2026-09-25: Today preset first and default (admin detail + My Analytics share it), presets + workflow chips + From/To merged into one center-aligned wrapping toolbar row with Range/Show captions
- [x] Toolbar reverted to two rows 2026-09-25: per feedback, presets + From/To stay on row 1 and workflow chips on row 2 (single-row felt crowded); Today preset/default and center alignment kept
- [x] Orders Analytics header/footer cleanup 2026-09-25: removed the duplicated "Open an order…" copy (PageBand carries it now), header is a single balanced row with live count left + search/Clear right, pagination moved below the panel like the detail pages
- [x] Corrections inbox polish 2026-09-25: 4 KPI cards use a dedicated 4-column grid (no dead 5th column), Rush KPI uses the global `rushOnly` total instead of page-1 rows, Unassigned owner renders as a gray pill, band subtitle copy fixed
- [x] Row-level order-number copy icons 2026-09-25: new compact `CopyIconButton` (28px, transient green check) sits left of every order number in queues (Open/My/Closed), Order Search, CS inbox, and both Analytics tables; Administration roster gets a results count plus Enrolled/Not-enrolled pills
- [x] Copies subline removed from staff rows 2026-09-25: "1 copy / N copies" no longer renders under order numbers in queues and CS inbox (customer checkout/form copy untouched)
- [x] Move-to destination buttons 2026-09-25: order-detail status dropdown replaced with tone-coded cards (blue resume, green submit/GTG, red To CS) with hint captions; select-then-confirm flow, notes, and modals unchanged, confirm button names its target
- [x] To-CS substatus 2026-09-25: optional "Substatus" select below the To-CS note (26 MILES values, no 2nd/3rd Contact; note stays compulsory), sent with the park, previewed in the confirm modal, shown in the locked banner and history entries; needs backend `feat/admin-analytics-split` (enum + storage + audit)
- [x] Substatus in CS surfaces 2026-09-25: CS inbox correction-note cell shows a red substatus pill above the flagged note; order-detail Notes tab and CS-editor Recent notes show a "Fulfillment flagged: {substatus}" callout while parked (queue API now returns `substatus`)
- [x] CS editor header number 2026-09-25: order number renders big white next to its copy button in the band subtitle (eyebrow shortened to "CS correction" to avoid duplication)
- [x] CS editor header + notes clarity 2026-09-25: band redesigned as grid (big "Order #…" + copy left, To CS/RUSH badges right, cert/owner meta on its own row); flagged panel shows the latest note plus a separate Substatus line; Recent notes split into Latest note card vs Previous notes with a properly labeled Substatus line (detail Notes tab label fixed the same way)
- [x] CS editor header wording 2026-09-25: "Order #" white and same size as the number, Owner right-aligned under the badges, both flagged-note spots labeled "Fulfillment flagged Notes:"
- [x] Notes & Document Upload 2026-09-25 (`feat/order-document-upload`): tab renamed from Notes & History; Completion document panel (dashed PDF picker, file card with Download/Replace/Delete, 10 MB PDF-only errors); SUBMITTED requires completion note + PDF for non-ADMIN with inline hint (ADMIN bypasses); proxy forwards `content-disposition` for filenames; FormData-safe auth fetch
- [x] Compact Open Orders header 2026-09-24: on-demand order lookup, condensed page band, and five one-row semantic pastel KPI mini-cards (two columns on tablet, one on narrow mobile) move queue rows above the fold
- [x] Order Search polish 2026-09-24: wider order-number column, county context, fixed-width actions, and role-aware unavailable/open-queue actions prevent overflow and dead-end links
- [x] Order-detail header compactness 2026-09-24: shorter back link, command bar, and tabs; status/Rush pills now share the identity block instead of consuming a dedicated header row
- [x] Order-header hierarchy 2026-09-24: access notice moves below right-side commands, order number is larger, and shared staff page bands place the internal-access label beside the title on desktop

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
