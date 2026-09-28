# USVC frontend

Next.js App Router site for public vital-certificate ordering, tracking, and support, plus the internal staff portal (`flow.*`). Calls the Express API through a server-side `/api/backend` proxy.

## Run locally

```bash
cp .env.local.example .env.local # set API_URL=http://localhost:4000
npm install
npm run dev
```

Requires Node.js 24 and a running USVC backend.

## AI agents

All AI documentation lives in the sibling private repo `../usvc-ai-context/` — see `usvc-frontend/AGENTS.md` there.
