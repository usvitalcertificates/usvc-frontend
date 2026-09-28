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

Start with `AGENTS.md`, then `docs/` (`architecture.md`, `coding-rules.md`, `shared-overview.md`, `shared-glossary.md`, `shared-security.md`, plus `main-website.md` or `flow-portal.md`, `workflows.md`, `fulfillment.md`, `status.md`).
