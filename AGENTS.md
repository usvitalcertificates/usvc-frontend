# Frontend contribution rules

This folder is the USVC Next.js App Router frontend.

- Keep server secrets out of browser code and out of `NEXT_PUBLIC_*` variables.
- Send API requests through `NEXT_PUBLIC_API_URL` only.
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

<!-- BEGIN:nextjs-agent-rules -->

# Next.js version note

This project uses the installed Next.js version declared in `package.json`. Read the relevant local Next.js documentation before adopting a new framework API, and keep generated Next.js rules compatible with the current version.

<!-- END:nextjs-agent-rules -->
