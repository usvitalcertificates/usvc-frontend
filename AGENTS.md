# Frontend contribution rules

This folder is the USVC Next.js App Router frontend.

- Keep server secrets out of browser code and environment variables available to client code.
- Send browser API requests through the `/api/backend` proxy only. Configure its upstream with `API_URL`.
- Stripe Elements is the only place card fields may be collected. Never build HTML fields for card number, CVV, or expiry.
- The application form must not send Social Security numbers to the API, analytics, logs, URLs, or browser storage.
- The API calculates pricing; browser totals are display-only and must match the API result at checkout.
- Preserve the USVC design tokens in `app/globals.css`: Times New Roman, Old Glory Navy `#3C3B6E`, Old Glory Red `#B22234`, white, and soft gray surfaces.
- Run `npm run build` before handoff.
- Format with `npm run format`, verify with `npm run format:check` and `npm run lint`.
- A pre-commit hook runs lint-staged, then `tsc --noEmit`. Hooks install via `npm install` (`prepare` script).
- ESLint covers JS/MJS configs; TS/TSX rules are blocked on typescript-eslint supporting TypeScript 7, so `tsc` is the TS gate.

See [README.md](README.md), [docs/DESIGN_SYSTEM.md](docs/DESIGN_SYSTEM.md), and [docs/CURRENT_STATUS.md](docs/CURRENT_STATUS.md).

- Plan and track work in [docs/TODO.md](docs/TODO.md); log locked choices in [docs/DECISIONS.md](docs/DECISIONS.md). After any code change, update `docs/TODO.md` + `docs/CURRENT_STATUS.md` in the same turn.

## Git workflow (locked)

- `main` = production. `develop` = staging. Never commit directly to either.
- Always create a feature branch from `develop` (`git checkout -b feat/<name> develop`) and raise the PR against `develop`.
- Merge `develop` → `main` only for production releases.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
