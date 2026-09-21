# Frontend TODO — public funnel first

Scope locked 2026-09-21: Phase 1 = public funnel to Lovable parity. Phase 2 = full staff suite (deferred, not started).

## Phase 1 (do first)

- [ ] Port reference data verbatim: states, certificates, government-fees, faq, legal, pricing, form-config, address → `lib/data/*`
- [ ] Order form upgrade: per-state rules, county/city validation, address same-as copy, sessionStorage draft (no SSN), Zod validation, honeypot, working review + Edit scroll
- [x] Checkout: Checkout Sessions embedded tabs (reference UI verbatim), summary sidebar, authorize + Pay flow, session-verified confirmation receipt — done 2026-09-21, real $238 test payment passed
- [ ] Confirmation: replace static page with `GET /orders/:id/confirmation` verification + print receipt
- [ ] Tracking: keep POST `/orders/tracking`, show sanitized timeline only
- [x] State detail page UI (`/state/[state]`) — done 2026-09-21, matches reference
- [x] Order form rebuild (config-driven 4 types, geo county/city dropdowns, per-cert fields/reasons/relationships, father conditional, working address copy, live review + Edit, SSN-safe draft, verify→create→checkout) — done 2026-09-21
- [x] Geo datasets (`public/geo/`, lazy per-state) — done 2026-09-21
- [ ] Content remaining: real contact submit, per-state fee/rules data port
- [x] Full FAQ accordion (29 items verbatim + JSON-LD) — done 2026-09-21
- [x] Real legal pages (privacy, terms, accessibility verbatim) — done 2026-09-21
- [ ] Content remaining: real contact submit, per-state fee/rules data port- [ ] SEO: `app/sitemap.ts`, JSON-LD Organization, metadata per state/cert page
- [ ] GA4: port ecommerce events, purchase fires only after paid confirmation
- [ ] Email display: receipt UI matches backend email template (backend owns sending)
- [ ] Proof: `npm run build` passes

## Phase 2 (deferred)

- [ ] Staff login + TOTP gate + inactivity signout
- [ ] Fulfillment queue/detail/notes/audit/status (API-backed)
- [ ] Admin gov-fee UI, sales/revenue charts
- [ ] Attendance: port only if needed (original was isolated preview-only)
- [ ] Do NOT port custody/vault/second-charge

## Doc rule

After any code change, update this file's checkboxes + `docs/CURRENT_STATUS.md` in the same turn.
