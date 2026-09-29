# Fulfillment — frontend part (extracted from FULFILLMENT_CENTER_PLAN.md)

> Source: former global `FULFILLMENT_CENTER_PLAN.md` (deleted after split). Backend part → `usvc-backend` repo `docs/fulfillment.md`. Shared milestones/roles → `shared-glossary.md`.

## Portal location (frontend)

- Host at `https://flow.usvitalcertificates.org`; login route `/auth` within that subdomain.
- Single Next.js project with host-split middleware (fits Vercel Hobby plan), not a separate deployment. `flow.*` serves only `/auth` + `/staff/*`; public host blocks staff paths. Backend authorization on every request is the real guard.

## Order detail (staff)

- Lists show masked placeholders; the detail page shows masked values with copy buttons.

## Staff experience

- **Queue:** searchable/filterable paid-order queue; unassigned claimable; agents see their own work. Certificate-type filter, numbered pagination, attention-first + FIFO.
- **Order detail:** customer/application info, workflow controls, internal notes, safe payment summary.
- **My work:** claimed orders, current status, age, exception indicators.
- **Super-admin dashboard:** all orders, per-agent workload/progress, reassignment/release, staff management, audit review.

## Phase record (frontend)

- Phase 1: no form change (already masks entry, excludes drafts, review shows generic placeholder). Staff order access tested via authenticated API calls only.
- Phase 2 (built 2026-09-23): invite-only TOTP auth UI, masked queue + atomic claim + filter + pagination, My Work / Closed / Search views, tabbed detail (Summary/Application/Notes & History) with stepper, exception statuses with note rule, invitation setup flow, USVC-token sidebar dashboard (adapted MILES IA, not a clone), super-admin roster + workload + day-grouped timeline, settings page. Two bugs fixed (notes 500 on array-less docs; audit-wipe via projection+save → atomic updates).
- Phase 3 (frontend runway): confirmation-receipt endpoint + UI, receipt parity, SEO, outbox failure visibility, saved filters + CSV export + print-friendly order sheet, deferred modules (gov-fee UI, sales/revenue, attendance, Tasks, Documents tab / Document Center, Test Orders), proposed (agency-payment confirmation field, read-only gov-fee reference, `Need Customer Information` outreach procedure — tracker neutral today, nothing contacts customer — SLA/age escalation).
