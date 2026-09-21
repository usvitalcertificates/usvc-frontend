# Frontend deployment

Deploy `usvc-frontend/` to Vercel.

## Environment variable

| Variable              | Value                                           |
| --------------------- | ----------------------------------------------- |
| `NEXT_PUBLIC_API_URL` | The deployed HTTPS URL of the USVC Express API. |

Do not place MongoDB credentials, Stripe secret keys, Stripe webhook secrets, or JWT secrets in Vercel frontend variables. `NEXT_PUBLIC_*` values are exposed to every browser.

## Production checks

- Configure the backend CORS `FRONTEND_URL` to the exact Vercel production domain.
- Use Stripe production keys only in the backend production environment.
- Ensure preview deployments point to a test API/Stripe environment, never production payment credentials.
- Run `npm run build` before deployment.
