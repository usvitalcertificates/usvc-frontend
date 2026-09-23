# Current frontend status

Last updated: 2026-09-23 (official USVC branding; two-fee model; staff fulfillment MVP: sidebar dashboard shell, /auth TOTP, KPIs + masked queue/my/closed/search, tabbed detail with stepper + reveal + copy, admin with invite modal + activity timeline, settings).

## Implemented

- Order form rebuilt from reference `form-config.ts` (ported to `lib/form-config.ts`): per-cert subject/family fields, relationships, reasons, father-status conditional, and CA-birth SSN+DOB override. The name-history and alternate-spelling questions (and their dependent inputs) have been removed from every certificate form and order payload. County/city dropdowns from `lib/geo.ts` + `public/geo/` datasets; working home→shipping/billing copy; live review blocks with Edit scroll; sessionStorage draft excluding SSN; verify-before-payment then create then checkout redirect.
- Section 9 matches reference exactly (dl rows: Certificate / Subject / Requestor & contact / Copies-fees with fee math); master consent auto-checks all 7 incl. payment authorization; address State is a 52-state dropdown (military APO/FPO, international region+country); conditional Other/previous-name/history fields for all 4 types. UI E2E passed 2026-09-21 (headless Chromium, all 4 types → checkout; Atlas rows + vault verified; fixed live address-copy sync + explicit radio values).
- UI E2E passed 2026-09-21 (headless Chromium, real form → `/checkout/[id]` for all 4 types; Atlas rows + vault verified). Fixed: live address-copy sync (billing/shipping required fields), explicit "same as" radio values.

- State detail page `/state/[state]` rebuilt to reference UI: breadcrumbs, Available Certificates header, 4 certificate cards ($125/copy + included-fees note), Start This Request + how-to links, instructions/eligibility panels, full disclosure, per-state metadata.
- FAQ page `/faq` rebuilt to reference UI: Support header, numbered 29-item accordion (first open, single-toggle) with answers verbatim from usvitalrecords.org/alabama/faq.html + markdown links/lists, FAQPage JSON-LD, Disclaimer box, Contact Support panel.
- Legal pages (`/privacy-policy`, `/terms-of-service`, `/accessibility`) rebuilt to reference UI: Legal header, last-updated line, verbatim sections with tricolor rules + hanging bullets, per-page SEO, disclosure box.

- Reference-style global header, navigation, footer, theme, public home page, certificate cards, state grid/search, trust section, FAQ callout, and legal/footer information.
- The official site palette is Old Glory Red `#B22234` and Old Glory Blue `#3C3B6E`. All action buttons use the official red with white text, interaction feedback retains the official colors, and Times New Roman is applied throughout the website and form controls.
- Certificates, Find Your State, Track Order, and Contact page layouts matching the reference structure.
- State landing pages and full application route: `/state/[state]/order/[certificate]`.
- Eleven application sections (Section 8 Credit Card Details with Visa/Mastercard logos, CVV label; copies 1–20; two-fee totals) with dynamic display total; card + SSN excluded from drafts; review shows a generic "Card provided (kept private)" placeholder, never digits. Review sync hardened against autofill (merge + input/blur listeners).
- Server-side validation failures scroll to the first invalid input in form order, focus it, and mark it with a red border (`data-invalid` + `aria-invalid`) plus an inline message next to the field; the highlight and message clear as the user edits (except `county`, which owns its error lifecycle so the temporarily-blocked-county message persists), and each error-summary message is a button that jumps to its field.
- Secure Checkout rebuilt to reference UI (order eyebrow, trust badges, all-inclusive notice, tabbed Stripe payment, authorize checkbox, Pay button, sticky summary); confirmation page verifies `session_id` with the backend and prints a paid receipt.
- API order creation before redirecting to Stripe checkout.
- Stripe Elements checkout route and API-backed order tracking route.
- Browser API calls now use the same-origin `/api/backend` proxy. Configure the Express upstream with server-only `API_URL`; no client-exposed environment variable is required.
- ESLint is pinned to the ESLint 9 compatibility line required by Next.js lint dependencies, avoiding Vercel peer-dependency warnings from ESLint 10.
- Birth certificate applications require a requestor SSN and subject suffix. Requestor middle name remains optional, and a female subject requires a maiden last name.
- Shipping and billing sections each begin with a requirement notice that the respective address name must match the requestor name.
- Standard Processing displays a 5–7 business-day estimate; Rush Processing displays a next-day estimate. The Section 6 “Order Tracking — Free” callout has been removed without changing the tracking page or API.
- Homepage hero image uses the committed PNG asset at `/assets/usvc-hero.png`.
- The requestor previous-last-name question and conditional field have been removed from every certificate form and order payload.
- Public phone-support references have been removed while the applicant contact phone field remains required. Selecting a temporarily unavailable California county shows a persistent inline error, clears the county/city selection, and disables all other form fields until an allowed county is selected.
- Contact Us is API-backed: it stores each inquiry through the backend, queues a support notification and customer receipt, shows sending/success/failure feedback, and warns (without blocking) likely SSN/card-number content.
- Track Order shows a customer-safe, timestamped progress timeline instead of raw internal states. It includes payment confirmation, received, processing, government-agency submission, and completed milestones, plus neutral support notices for payment/order exceptions.
- GA4 is production-only: public pages and core funnel actions are tracked in the browser, while a Purchase is sent only from the backend after a signed Stripe webhook confirms payment. No sensitive application or payment data is sent to GA4.
- GTM container `GTM-KC8LVCXR` loads from the shared root layout on every production page, alongside direct GA4 `gtag.js`; both GTM snippets are absent when `ANALYTICS_ENABLED=false`.

## Important current limits

- Per-state geography, address copying, review-field synchronization, and conditional fields are implemented from the reference; per-state fee/rules data port remains.
- Display totals remain non-authoritative; the backend always recalculates the charged amount.
- Application SSN and card input is sent to the API and encrypted (AES-256-GCM `confidentialData`) before storage; staff see `*********` until an audited reveal. Values never enter drafts, logs, or tracking; SSN masked at entry.
- Staff portal (`/auth`, `/staff/*`) is served from the same Next.js project with host-split middleware: `flow.*` allows staff paths only, the public host blocks them, previews/localhost use paths. Staff sessions use short-lived Bearer tokens in sessionStorage (never cookies/URLs); invitations send via the Resend outbox when the backend has email enabled, otherwise the admin UI shows a manual setup link.

## Required next work before production orders

- Per-state fee/rules data port, confirmation-receipt verification page, SEO (sitemap, JSON-LD, per-page metadata).
- Staff Phase 3 modules (gov-fee UI, sales/revenue, attendance, tasks, documents) per `docs/TODO.md`.
- Staging pass on `develop`, then pre-launch wipe + production seed + go-live.
