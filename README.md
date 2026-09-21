# USVC frontend

The USVC frontend is a Next.js App Router site for public vital-certificate ordering, tracking, and support. It uses Stripe Elements only on the checkout route and calls the Express API through `NEXT_PUBLIC_API_URL`.

## Current public pages

- Home, certificate types, state selector, FAQ, contact, tracking, and legal pages.
- State certificate chooser at `/state/[state]`.
- Full certificate application at `/state/[state]/order/[certificate]`.
- Backward-compatible application route at `/state/[state]/[certificate]`.
- Stripe checkout at `/checkout/[orderId]` and confirmation at `/order/confirmation/[orderId]`.

The order application currently has the reference-style ten-section UI and creates an API order before opening Stripe checkout. Order totals shown in the application are for guidance; the backend is authoritative.

## Requirements

- Node.js 24.x (LTS, as declared in `package.json`).
- A running USVC backend, normally at `http://localhost:4000`.

## Run locally

```bash
cp .env.local.example .env.local
npm install
npm run dev
```

Set `NEXT_PUBLIC_API_URL=http://localhost:4000` for local development, then open the URL printed by Next.js.

Documentation:

- [Local development](docs/LOCAL_DEVELOPMENT.md)
- [Deployment](docs/DEPLOYMENT.md)
- [Design system](docs/DESIGN_SYSTEM.md)
- [Architecture decisions](docs/DECISIONS.md)
- [Current status and security boundary](docs/CURRENT_STATUS.md)

# usvc-frontend
