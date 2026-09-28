# Frontend workflows (dev, build, deploy)

## Local dev

```bash
cp .env.local.example .env.local   # set API_URL=http://localhost:4000
npm install
npm run dev                        # backend must be running
npm run build                      # verify before handoff
```

Staff local test: seed ADMIN in backend `staff_users`, pair TOTP at `/auth`, invite agent via incognito link, flip test orders to `PAID/PAID` in Mongo (queue is paid-only; email-disabled envs return `setupToken` instead of sending).

## Env vars (names only — never commit values)

- `API_URL` — server-only Express upstream for the `/api/backend` proxy. Never expose to browsers.
- `ANALYTICS_ENABLED` — `true` only in production (enables GA4 + GTM + OpenAI pixel).
- `GA_MEASUREMENT_ID` (`G-GM4PWPHER1`), `OPENAI_ADS_PIXEL_ID`, `OPENAI_ADS_PIXEL_DEBUG` (temporary verification only).
- Never put Mongo/Stripe/JWT secrets in frontend env.

## Vercel deploy

Deploy `usvc-frontend/` to one Vercel project; attach apex + `www` + `flow.*` to the **same** project (no wildcard, no second project). Backend `FRONTEND_URL` must be the exact production origin. Previews use test keys; run `npm run build` first; GTM `GTM-KC8LVCXR` prod-only; backend sends the only `purchase`.

## Gates

`npm run format` → `npm run format:check` → `npm run lint` → `npm run build`. Pre-commit: lint-staged + `tsc --noEmit` (hooks via `prepare`).
