# Frontend contribution rules

This folder is the USVC Next.js App Router frontend (public site + `flow.*` staff portal, one project).

## Read order for AI agents

1. `docs/shared-overview.md`, `docs/shared-glossary.md`, `docs/shared-security.md`.
2. This file, then `docs/architecture.md`, then `docs/coding-rules.md`.
3. Task-specific: public funnel → `docs/main-website.md`; staff UI → `docs/flow-portal.md` + `docs/fulfillment.md`; deploys/env → `docs/workflows.md`; status/backlog → `docs/status.md`.

## Main site vs Flow portal

- **Main website** (public host): ordering funnel, tracking, support, legal. Times New Roman, Navy `#3C3B6E` / Red `#B22234`. See `docs/main-website.md`.
- **Flow portal** (internal, `flow.*`): `/auth` + `/staff/*` only. Own stylesheet `app/staff.css`, Inter, blue palette. See `docs/flow-portal.md`.
- Never use flow tokens on public pages or public tokens in staff chrome. Analytics scripts load in production on all pages (`page_view` skipped on staff); OpenAI pixel never loads on staff.

## Hard rules (full list in `docs/coding-rules.md`)

- Browser API calls go through the same-origin `/api/backend` proxy only. Upstream is server-only `API_URL`. No client secrets.
- Checkout uses Stripe Elements. Never build raw payment inputs.
- Never send form input to analytics, logs, URLs, or browser storage. Drafts persist only non-sensitive values.
- Backend totals are authoritative; browser totals are display-only.
- Gates before handoff: `npm run format`, `npm run format:check`, `npm run lint`, `npm run build`. Pre-commit runs lint-staged + `tsc --noEmit`.

## Git workflow (locked)

- `main` = production. `develop` = staging. Never commit directly to either.
- Always create a feature branch from `develop` (`git checkout -b feat/<name> develop`) and raise the PR against `develop`.
- Merge `develop` → `main` only for production releases.
- After any code change, update `docs/status.md` + the matching `docs/` topic file in the same turn.
