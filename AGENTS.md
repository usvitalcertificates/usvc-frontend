# Frontend contribution rules

Next.js 16 App Router (public site + `flow.*` staff portal, one project). Node 24. Vercel deploy of `usvc-frontend/`.

Read: `docs/architecture.md`, then `docs/status.md`.

Hard rules:

- Browser → same-origin `/api/backend` proxy only (upstream server-only `API_URL`). No direct backend URLs, no secrets in client code.
- Checkout uses Stripe Elements. Never build raw payment inputs.
- Never send form input to analytics, logs, URLs, or browser storage. Drafts persist only non-sensitive values.
- Backend totals are authoritative; browser totals are display-only. Call `verify-before-payment` before `createOrder`.
- Public: Times stack, Navy `#3C3B6E` / Red `#B22234`. Staff: own `staff.css` + Inter. Never cross tokens. Status pills always have text.
- Analytics prod-only (`ANALYTICS_ENABLED=true`); `page_view` skipped on staff, OpenAI pixel never loads on staff. Browser events never send PII.
- Never log/return plaintext customer PII or secrets. Public responses return whitelisted metadata + customer-safe timeline only.

Gates: `npm run format`, `npm run format:check`, `npm run lint`, `npm run build`. Pre-commit: lint-staged + `tsc --noEmit`.

Git: `main` = production, `develop` = staging. Never commit to either. `feat/<name>` from `develop` → PR to `develop`. `develop` → `main` only for releases.

After any code change, update `docs/status.md` in the same turn.
