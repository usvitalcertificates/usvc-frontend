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
