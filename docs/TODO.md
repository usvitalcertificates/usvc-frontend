# Frontend TODO — public funnel first

Scope locked 2026-09-21: Phase 1 = public funnel to Lovable parity. Phase 2 = full staff suite (deferred, not started).

## Phase 1 (do first)

- [ ] Port reference data verbatim: states, certificates, government-fees, faq, legal, pricing, form-config, address → `lib/data/*`
- [ ] Order form upgrade: per-state rules, county/city validation, address same-as copy, sessionStorage draft (no SSN), Zod validation, working review + Edit scroll
- [x] Checkout: Checkout Sessions embedded tabs (reference UI verbatim), summary sidebar, authorize + Pay flow, session-verified confirmation receipt — done 2026-09-21, real $238 test payment passed
- [ ] Confirmation: replace static page with `GET /orders/:id/confirmation` verification + print receipt
- [x] Tracking: sanitized, customer-friendly progress timeline backed by `POST /orders/tracking` — done 2026-09-22
- [x] State detail page UI (`/state/[state]`) — done 2026-09-21, matches reference
- [x] Order form rebuild (config-driven 4 types, geo county/city dropdowns, per-cert fields/reasons/relationships, father conditional, working address copy, live review + Edit, SSN-safe draft, verify→create→checkout) — done 2026-09-21
- [x] Geo datasets (`public/geo/`, lazy per-state) — done 2026-09-21
- [ ] Content remaining: real contact submit, per-state fee/rules data port
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
- [ ] Content remaining: real contact submit, per-state fee/rules data port- [ ] SEO: `app/sitemap.ts`, JSON-LD Organization, metadata per state/cert page
- [x] GA4: production-only public funnel events plus server-verified Purchase delivery — done 2026-09-22
- [ ] Email display: receipt UI matches backend email template (backend owns sending)
- [x] Review shows a generic card placeholder ("Card provided (kept private)"), never digits; Section 11 + checkout copy state encrypted storage — done 2026-09-23
- [x] Server-validation errors scroll to + focus + red-highlight the exact input, clear as the user fixes them, and the error summary links jump to each field — done 2026-09-23
- [x] Every invalid field shows its message inline next to the input (subject/family/address/email/reason/card/signature/consents) — done 2026-09-23
- [x] Inline error messages styled prominent (red, bold, tinted box) so hint-text CSS can't mute them — done 2026-09-23
- [x] Blocked-California-county message no longer wiped by clear-on-fix (`county` owns its error lifecycle) — done 2026-09-23
- [ ] Proof: `npm run build` passes

## Phase 2 (deferred)

- [ ] Staff login + TOTP gate + inactivity signout
- [ ] Fulfillment queue/detail/notes/audit/status (API-backed)
- [ ] Admin gov-fee UI, sales/revenue charts
- [ ] Attendance: port only if needed (original was isolated preview-only)
- [ ] Do NOT port custody/vault/second-charge

## Doc rule

After any code change, update this file's checkboxes + `docs/CURRENT_STATUS.md` in the same turn.
