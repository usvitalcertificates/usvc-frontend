# Frontend deployment

Deploy `usvc-frontend/` to Vercel.

## Environment variable

| Variable                 | Value                                                                                                                                   |
| ------------------------ | --------------------------------------------------------------------------------------------------------------------------------------- |
| `API_URL`                | The deployed HTTPS URL of the USVC Express API. This is read only by the server-side API proxy.                                         |
| `ANALYTICS_ENABLED`      | Set to `true` only for production; leave `false` for preview/local environments. Enables GA4, GTM, and the configured OpenAI Ads pixel. |
| `GA_MEASUREMENT_ID`      | Production GA4 web stream ID, `G-GM4PWPHER1`.                                                                                           |
| `OPENAI_ADS_PIXEL_ID`    | OpenAI Ads Measurement Pixel ID, `McpBUYjV4QNwgwxG6Saq1z`.                                                                              |
| `OPENAI_ADS_PIXEL_DEBUG` | Optional. Keep `false` in production; set `true` only during a controlled browser verification.                                         |

Do not place MongoDB credentials, Stripe secret keys, Stripe webhook secrets, or JWT secrets in frontend environment variables. `API_URL` is used only on the server and is not exposed to browsers.

The root layout installs GTM container `GTM-KC8LVCXR` on every production page. Direct GA4 `gtag.js` continues to send browser page and funnel events. Do not publish a second GA4 tag in GTM for the same stream and events, or they can be counted twice. The backend remains the only sender of paid `purchase` events.

The OpenAI Ads pixel loads asynchronously only on the apex/`www` public production hosts when analytics are enabled; it is excluded from `/auth` and `/staff`. It sends normalized `page_viewed`, `checkout_started`, and verified-payment `order_created` events. Dynamic order URLs, customer/application fields, card data, and Stripe identifiers are never sent. To verify a deployment, temporarily enable `OPENAI_ADS_PIXEL_DEBUG`, complete a test checkout, inspect the browser console and OpenAI Ads Manager, then disable debug again.

## Staff portal (same project, host-split)

Attach `flow.usvitalcertificates.org` to the **same** Vercel project (plus the existing apex/`www` domains). No separate project, no wildcard:

- `flow.*` serves only `/auth` + `/staff/*` (root `/` rewrites to the queue); all other paths 404 there. The public host 404s `/auth` and `/staff/*`. Staff responses carry `x-robots-tag: noindex, nofollow`.
- Localhost, `*.vercel.app` previews, and `staging.usvitalcertificates.org` allow all paths, so staff work is tested by path (`/staff`, `/auth`) without the subdomain.
- No extra frontend env vars are needed for staff; the backend origin of invitation links is the backend's `STAFF_PORTAL_URL`.

## Production checks

- Configure the backend CORS `FRONTEND_URL` to the exact Vercel production domain.
- Use Stripe production keys only in the backend production environment.
- Ensure preview deployments point to a test API/Stripe environment, never production payment credentials.
- Run `npm run build` before deployment.
