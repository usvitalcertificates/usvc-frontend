# Mobile performance baseline: October 21, 2026

Twelve successful Lighthouse navigation runs against the **live production website**: three per page, in round-robin order. This measures production at the recorded times; the technical cleanup in this PR was not deployed for these measurements. No performance optimization was implemented in this batch.

## Results

Each column is its own median across three runs, not a single representative run. Times are simulated lab measurements.

| Page                   | Score /100 (range) | FCP   | LCP   | Speed index | Blocking time (TBT) | Layout shift (CLS) |
| ---------------------- | ------------------ | ----- | ----- | ----------- | ------------------- | ------------------ |
| Homepage               | 71 (68–73)         | 0.95s | 7.76s | 3.08s       | 254ms               | 0.0000             |
| Nebraska hub           | 64 (63–70)         | 3.71s | 7.91s | 4.65s       | 179ms               | 0.0000             |
| California birth guide | 61 (60–67)         | 3.62s | 8.13s | 5.21s       | 292ms               | 0.0000             |
| California birth order | 70 (70–81)         | 0.96s | 6.89s | 3.07s       | 264ms               | 0.0000             |

The main concern is how late the largest visible content appears on mobile. Layout shift is near zero in these initial-load runs; that does not cover typing, dropdowns, validation or payment interactions. Results vary considerably between runs, especially the order page.

## Ranked follow-up work

1. **Reduce optional tracking work during the initial render.** Every page loads GTM/Google tags and Facebook scripts, with Clarity also visible in execution diagnostics. Lighthouse flags roughly 230–235 KiB of unused JavaScript per first run, largely from third-party scripts. Review tag duplication and loading triggers; test deferring optional tags until after the important content appears. Preserve required consent and conversion behavior, then rerun the same measurements. An initial-load unused-code finding does not prove a tag is unnecessary for later conversions.
2. **Profile the shared first-party JavaScript and hydration.** A shared approximately 73 KB transferred chunk is the largest attributed script-execution contributor on the homepage/order first runs (about 0.91s/1.04s total CPU time respectively). Identify its modules before changing them. Split or defer code that is unnecessary for the initial view, while preserving form and state-selector interactions. The script timing is diagnostic evidence, not proof that removing that time would improve LCP by the same amount.
3. **Optimize the homepage hero and critical CSS after the shared work.** The hero image is the homepage LCP element. Lighthouse estimates about 30 KiB of image savings in the first run and about 100ms FCP savings from the blocking stylesheet. Keep its existing high priority and early discovery; it already passes the discovery checks. Try a smaller mobile asset and remove unused public CSS only after visual checks. This is a smaller, homepage-specific opportunity.

These are ranked investigation/implementation candidates, not promised score gains. Text is the LCP element on the Nebraska, guide and order first runs, so optimizing the homepage image alone will not resolve the shared delay. No evidence here justifies changing government processing content, customer prices or service claims.

## Method and limitations

- Lighthouse **13.5.0**, Node **24.21.0**, isolated headless Chrome **155.0.0.0**; no extension/user login profile. Storage reset enabled. Default mobile viewport 412×823, device pixel ratio 1.75.
- Simulated throttling: 150ms network RTT, 1,638.4 Kbps throughput and 4× CPU slowdown. `performance` category only. Live production analytics left active, no blocked URLs or altered response headers.
- Three rounds in this order: homepage, Nebraska hub, California guide, California order. No form data entered, orders submitted or payments attempted. Navigation can produce ordinary analytics page views.
- All 12 runs have no Lighthouse runtime error and no run warnings; final displayed URLs match requested production URLs. Fetch timestamps, per-run metrics, configuration, diagnostics and raw JSON SHA-256 hashes are in [the compact evidence](performance/mobile-2026-10-21.json).
- **No new CrUX field dataset was obtained.** The earlier public PageSpeed API request hit quota. These scores do not certify real-user Core Web Vitals. Lab TBT is not field INP; no field INP value or field pass is claimed. Desktop was outside this mobile-only batch.
- Lab CPU/network conditions, remote routing, CDN state and live third parties affect results. This baseline is not a before/after comparison of the canonical fix.

## Raw reports and repeatability

All 12 HTML and 12 JSON reports, logs, the runner and summary are saved in `../audit-2026-10-21/mobile-lighthouse/` relative to the frontend checkout. Full reports are local audit artifacts, not bundled into the web app or committed to Git; the compact evidence above is committed for PR review.

To reproduce, install `lighthouse@13.5.0` in a temporary directory using Node 24 and repeat this command three times for each of the four URLs recorded in the evidence, with a unique output path per run:

```sh
node /path/to/temporary/node_modules/lighthouse/cli/index.js \
  https://usvitalcertificates.org/ \
  --only-categories=performance --form-factor=mobile \
  --throttling-method=simulate \
  --chrome-flags="--headless --disable-extensions" \
  --output=json --output=html --output-path=/path/to/report/home-1 \
  --no-enable-error-reporting
```

After any performance changes, rerun all four pages with the same settings and also verify mobile form interactions and analytics correctness. Keep real-user Search Console/CrUX findings in a separate section when available.
