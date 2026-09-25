# Local frontend development

## 1. Configure API access

```bash
cp .env.local.example .env.local
```

Set:

```env
API_URL=http://localhost:4000
```

## 2. Run the app

```bash
npm install
npm run dev
```

Open the local URL printed by Next.js. The backend must be running for order creation, tracking, and Stripe checkout initialization.

## 3. Verify

```bash
npm run build
```

For a safe payment test, use Stripe test credentials only and confirm the API uses test keys.

## Staff portal local test

The backend runs with email disabled locally, so invitations return a manual setup link instead of sending email.

1. Seed one super-admin in the backend's Mongo database (`staff_users`: `email`, Argon2 `passwordHash`, `role: "ADMIN"`, `accountStatus: "active"`).
2. Open `http://localhost:3000/auth`: sign in, scan the QR pairing with an authenticator app, enter the 6-digit code.
3. Invite an agent from `/staff/admin`, open the setup link in an incognito window, and complete setup with a second authenticator entry.
4. The queue lists paid orders only; locally, submit applications through the public form and set `status` + `paymentStatus` to `PAID` directly in MongoDB to simulate completed checkout.
