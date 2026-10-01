# USVC frontend

Next.js App Router site for public vital-certificate ordering, tracking, and support, plus the internal staff portal (`flow.*`). Calls the Express API through a server-side `/api/backend` proxy. Node 24.

```bash
cp .env.local.example .env.local # set API_URL=http://localhost:4000
npm install
npm run dev
```

Agents: read `AGENTS.md`, then `docs/architecture.md`, then `docs/status.md`.
