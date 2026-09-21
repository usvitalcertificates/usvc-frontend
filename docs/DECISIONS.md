# Frontend decisions

## Next.js App Router

Next.js is used for SEO-friendly public pages, server-rendered metadata, and Vercel deployment.

## Reference UI

The Lovable export in the workspace is a behavioral and visual reference only. The Next.js implementation selectively ports its routes, wording, assets, Times New Roman typography, Old Glory color theme, spacing, cards, disclosure panels, and application layout.

## API and payment boundary

The frontend calls the Express API using `NEXT_PUBLIC_API_URL`. It creates an order through the API, then initializes Stripe Elements from a PaymentIntent endpoint. The frontend must never make itself the source of truth for totals or payment status.

## Sensitive fields

The application form includes a masked Social Security Number field only to match the current reference UI. The field is intentionally excluded from the outgoing order request and must never enter local storage, telemetry, logs, MongoDB, or Stripe.

## Locked 2026-09-21: scope and boundaries

- Scope: Phase 1 = public funnel first. Phase 2 = full staff suite (deferred). See `docs/TODO.md`.
- Payments: keep PaymentIntent + Stripe Elements (already built). Do not switch to Checkout Sessions — same UX, extra session-reuse complexity.
- DB/Auth: backend stays Express + Mongo + JWT (no Supabase rewrite). Frontend stays API-driven via `NEXT_PUBLIC_API_URL`.
- Do not port custody/vault/second-charge. Do not over-engineer: no extra plan/roadmap docs beyond `TODO.md`, `CURRENT_STATUS.md`, `DECISIONS.md`.
