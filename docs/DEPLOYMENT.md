# Frontend deployment

Deploy `usvc-frontend/` to Vercel.

## Environment variable

| Variable  | Value                                                                                           |
| --------- | ----------------------------------------------------------------------------------------------- |
| `API_URL` | The deployed HTTPS URL of the USVC Express API. This is read only by the server-side API proxy. |

Do not place MongoDB credentials, Stripe secret keys, Stripe webhook secrets, or JWT secrets in frontend environment variables. `API_URL` is used only on the server and is not exposed to browsers.

## Production checks

- Configure the backend CORS `FRONTEND_URL` to the exact Vercel production domain.
- Use Stripe production keys only in the backend production environment.
- Ensure preview deployments point to a test API/Stripe environment, never production payment credentials.
- Run `npm run build` before deployment.
