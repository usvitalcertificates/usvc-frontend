# Current frontend status

Last updated: 2026-09-21 (11-section form: card details added, copies 1–5).

## Implemented

- Order form rebuilt from reference `form-config.ts` (ported to `lib/form-config.ts`): per-cert subject/family fields, relationships, reasons, father-status conditional, name-history questions, CA-birth SSN+DOB override. County/city dropdowns from `lib/geo.ts` + `public/geo/` datasets; working home→shipping/billing copy; live review blocks with Edit scroll; sessionStorage draft excluding SSN/honeypot; honeypot + timing; verify-before-payment then create then checkout redirect.
- Section 9 matches reference exactly (dl rows: Certificate / Subject / Requestor & contact / Copies-fees with fee math); master consent auto-checks all 7 incl. payment authorization; address State is a 52-state dropdown (military APO/FPO, international region+country); conditional Other/previous-name/history fields for all 4 types. UI E2E passed 2026-09-21 (headless Chromium, all 4 types → checkout; Atlas rows + vault verified; fixed live address-copy sync + explicit radio values).
- UI E2E passed 2026-09-21 (headless Chromium, real form → `/checkout/[id]` for all 4 types; Atlas rows + vault verified). Fixed: live address-copy sync (billing/shipping required fields), explicit "same as" radio values.

- State detail page `/state/[state]` rebuilt to reference UI: breadcrumbs, Available Certificates header, 4 certificate cards ($125/copy + included-fees note), Start This Request + how-to links, instructions/eligibility panels, full disclosure, per-state metadata.
- FAQ page `/faq` rebuilt to reference UI: Support header, numbered 29-item accordion (first open, single-toggle) with verbatim answers + markdown links/lists, FAQPage JSON-LD, Disclaimer box, Contact Support panel.
- Legal pages (`/privacy-policy`, `/terms-of-service`, `/accessibility`) rebuilt to reference UI: Legal header, last-updated line, verbatim sections with tricolor rules + hanging bullets, per-page SEO, disclosure box.

- Reference-style global header, navigation, footer, theme, public home page, certificate cards, state grid/search, trust section, FAQ callout, and legal/footer information.
- Certificates, Find Your State, Track Order, and Contact page layouts matching the reference structure.
- State landing pages and full application route: `/state/[state]/order/[certificate]`.
- Eleven application sections (Section 8 Credit Card Details added; copies capped 1–5) with dynamic display total; card + SSN excluded from drafts; review shows card last-4 only.
- Secure Checkout rebuilt to reference UI (order eyebrow, trust badges, all-inclusive notice, tabbed Stripe payment, authorize checkbox, Pay button, sticky summary); confirmation page verifies `session_id` with the backend and prints a paid receipt.
- API order creation before redirecting to Stripe checkout.
- Stripe Elements checkout route and API-backed order tracking route.

## Important current limits

- Per-state geography, address copying, review-field synchronization, and conditional fields are implemented from the reference; per-state fee/rules data port remains.
- Display totals remain non-authoritative; the backend always recalculates the charged amount.
- Application SSN input is sent to the API and stored as plaintext on the order per owner requirement (never in drafts, logs, or tracking; masked at entry).
- Staff/admin/fulfillment UI remains a future module.

## Required next work before production orders

- Complete server-side application validation and state/certificate-specific rule configuration.
- Implement API-backed order confirmation, email notifications, staff workflows, audit views, MFA, and role permissions.
- Add end-to-end tests for application completion, Stripe test payment, webhook retry, and public tracking.
