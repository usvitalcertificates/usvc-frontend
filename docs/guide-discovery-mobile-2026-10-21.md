# Guide discovery and mobile loading: October 21, 2026

## Changes in this PR

- Ten matching state hubs gain a main-content navigation link to their existing birth-certificate guide, using the existing inventory. No guide prose, titles, H1s, claims or prices changed. No new URLs.
- Root Inter preloading is disabled. Public pages retain Times; staff styles load Inter on demand.
- The existing homepage hero uses quality 60; Next image quality allowlist is [60, 75]. Source image, layout, framing, overlay, responsive sizing and loading priority are unchanged. Other images keep their default quality.
- Tracking scripts, loading timing, events and payment code are unchanged. No caching or rendering architecture change.

## Verification

Node 24: production build, 14/14 unit tests, lint, TypeScript, formatting and HTTP SEO checks passed. All 268 sitemap pages retain 200/self-canonical/indexable output. The ten contextual links pass; states without guides have none. All 268 pages remain within two link hops. Invalid URL 404/noindex/no-canonical, VT/WY notices, private/staging noindex, robots, llms, social previews and legacy redirects pass.

At WebP width 750, the actual image optimizer returns **39,434 bytes at quality 75 and 33,446 at quality 60: 5,988 fewer bytes (15.2%)**. Same requested image width and content type. All twelve changed-build mobile runs transfer zero font bytes, versus 48,732 bytes per baseline run. Browser checks confirm Times on public pages and Inter on staff headings, state search → hub → new guide navigation, and order-form rendering. Homepage screenshots at 390/768/1440 widths were inspected; no horizontal overflow or visible compression artifacts observed. No form submissions, customer data or payments used.

## Controlled mobile before/after results

Three runs per page per build (24 total), with Lighthouse 13.5.0, Node 24.21.0, Chrome 155, default simulated mobile conditions. Independent medians per column:

| Page     | Score before → after | LCP before → after | TBT before → after | Font bytes before → after |
| -------- | -------------------- | ------------------ | ------------------ | ------------------------- |
| home     | 92 → 93              | 2.84s → 2.54s      | 202ms → 236ms      | 48732 → 0                 |
| nebraska | 94 → 96              | 2.47s → 2.17s      | 208ms → 192ms      | 48732 → 0                 |
| guide    | 93 → 94              | 2.46s → 2.16s      | 235ms → 266ms      | 48732 → 0                 |
| order    | 90 → 92              | 2.77s → 2.54s      | 290ms → 267ms      | 48732 → 0                 |

These are **controlled local-build measurements**, not production speed scores or real-user Core Web Vitals. Both phases use the same machine, local HTTP port, isolated profiles, default mobile throttling and active tracking scripts. Host resolution maps only the test apex hostname to localhost, allowing the existing production-host analytics gates to run. No production DNS or browser settings were changed. The server route/cache/CDN path differs from production, so these results do not replace the earlier live-site baseline or certify ranking/conversion gains. Third-party code and timing naturally vary. Homepage and guide median blocking time increased slightly in this small sample, so this report does not claim that every performance metric improved.

Run warnings: 0 of 24. All runs have no Lighthouse runtime error. Tracking requests are present in both phases; no conversion event was fabricated. No production optimization result is claimed before release.

[Committed compact evidence](performance/guide-mobile-2026-10-21.json) includes per-run metrics, warnings, settings and raw report hashes. All 24 HTML/JSON report pairs, logs, runner, GSC snapshots and visual screenshots are in the local audit folder `../audit-2026-10-21/guide-mobile/`, relative to this frontend checkout.

## Search Console live tests and release follow-up

**All ten live URL tests passed** in the USVC Search Console property on October 21 (21:44–21:51 India time). Google’s smartphone inspection tool successfully fetched each page, allowed crawling/indexing, reported the expected self-canonical, and exposed guide content in the tested HTML. This did not uncover a live fetch/indexing-permission blocker. Live availability does not mean the guides have been indexed. Indexing requests are deferred until the changed pages are released to production, consistent with the approved plan. The read-only MCP cannot submit indexing requests; the authorized Search Console UI can.

After production release: recheck deployed guides, request indexing once per eligible URL (record quota-limited requests separately), then inspect at release +7 and +14 days. No scheduled automation was created. Keep official-source verification dates unchanged; this PR does not re-review guide facts.

| Guide          | Live fetch | Crawl/index allowed | Tested guide content | Indexing request           |
| -------------- | ---------- | ------------------- | -------------------- | -------------------------- |
| california     | Successful | Yes                 | Present              | Pending production release |
| texas          | Successful | Yes                 | Present              | Pending production release |
| florida        | Successful | Yes                 | Present              | Pending production release |
| new-york       | Successful | Yes                 | Present              | Pending production release |
| pennsylvania   | Successful | Yes                 | Present              | Pending production release |
| illinois       | Successful | Yes                 | Present              | Pending production release |
| ohio           | Successful | Yes                 | Present              | Pending production release |
| georgia        | Successful | Yes                 | Present              | Pending production release |
| north-carolina | Successful | Yes                 | Present              | Pending production release |
| michigan       | Successful | Yes                 | Present              | Pending production release |

Raw live-test snapshots are retained locally under the audit folder’s `gsc/` directory; they are not committed because they include account/UI and generated tracking details. Current indexed-status observations remain separate from live availability. No indexing request was submitted before release.
