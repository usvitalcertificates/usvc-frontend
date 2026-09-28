# Fulfillment — frontend part (extracted from FULFILLMENT_CENTER_PLAN.md)

> Source: former global `FULFILLMENT_CENTER_PLAN.md` (deleted after split). Backend part → `usvc-backend` repo `docs/fulfillment.md`. Shared milestones/roles/crypto → `shared-glossary.md`.

## Portal location (frontend)

- Host at `https://flow.usvitalcertificates.org`; login route `/auth` within that subdomain.
- Single Next.js project with host-split middleware (fits Vercel Hobby plan), not a separate deployment. `flow.*` serves only `/auth` + `/staff/*`; public host blocks staff paths. Backend authorization on every request is the real guard.

## Reveal UI (staff detail page)

- Masked by default: SSN and card show `*********` with a Reveal button. No last-4/brand before reveal. Two separate buttons per order (`Reveal SSN`, `Reveal Card`; no reveal-all). Click requires a reason (`Govt submission` / `Verification` / `Other + text`).
- Render full value with 30-second countdown bar, then auto-mask + wipe from memory (`null`). Tab-hide, route-leave, or logout wipes immediately. No sessionStorage/localStorage/analytics/clipboard persistence beyond explicit user copy while visible. Copy buttons allowed while visible.

## Staff experience

- **Queue:** searchable/filterable paid-order queue; unassigned claimable; agents see their own work. Certificate-type filter, numbered pagination, attention-first + FIFO.
- **Order detail:** customer/application info, workflow controls, internal notes, safe payment summary, controlled sensitive-data actions (see above).
- **My work:** claimed orders, current status, age, exception indicators.
- **Super-admin dashboard:** all orders, per-agent workload/progress, reassignment/release, staff management, audit review.

## Phase record (frontend)

- Phase 1: no form change (already masks entry, excludes drafts, review shows generic placeholder). Reveal tested via authenticated API calls only; no staff reveal UI in this phase.
- Phase 2 (built 2026-09-23): invite-only TOTP auth UI, masked queue + atomic claim + filter + pagination, My Work / Closed / Search views, tabbed detail (Summary/Application/Notes & History) with stepper, per-field reveal + reason + 30s auto-mask + copy + sensitive-content warning, exception statuses with note rule, invitation setup flow, USVC-token sidebar dashboard (adapted MILES IA, not a clone), super-admin roster + workload + day-grouped timeline, settings page. Two bugs fixed (notes 500 on array-less docs; audit-wipe via projection+save → atomic updates).
- Phase 3 (frontend runway): confirmation-receipt endpoint + UI, receipt parity, SEO, outbox failure visibility, saved filters + CSV export + print-friendly order sheet, deferred modules (gov-fee UI, sales/revenue, attendance, Tasks, Documents tab / Document Center, Test Orders), proposed (agency-payment confirmation field, read-only gov-fee reference, `Need Customer Information` outreach procedure — tracker neutral today, nothing contacts customer — SLA/age escalation).
