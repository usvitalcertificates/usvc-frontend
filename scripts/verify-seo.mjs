/* global Response */
import assert from "node:assert/strict";
import { Buffer } from "node:buffer";
import console from "node:console";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { request as httpRequest } from "node:http";
import { createServer } from "node:net";
import process from "node:process";
import { setTimeout, clearTimeout } from "node:timers";
import { setTimeout as delay } from "node:timers/promises";
import { fileURLToPath, URL } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const portReservation = createServer();
portReservation.listen(0, "127.0.0.1");
await once(portReservation, "listening");
const port = portReservation.address().port;
await new Promise((resolve) => portReservation.close(resolve));
const base = `http://127.0.0.1:${port}`;
const site = "https://usvitalcertificates.org";
const child = spawn(
  process.execPath,
  ["node_modules/next/dist/bin/next", "start", "--hostname", "127.0.0.1", "--port", String(port)],
  {
    cwd: root,
    env: { ...process.env, ANALYTICS_ENABLED: "false" },
    stdio: ["ignore", "pipe", "pipe"],
  },
);
let logs = "";
child.stdout.on("data", (data) => (logs += data));
child.stderr.on("data", (data) => (logs += data));
// Explicit Host headers exercise apex/staging/flow middleware on localhost.
// Native fetch can replace Host, so use node:http for this regression suite.
const request = (path, extra = {}) =>
  new Promise((resolve, reject) => {
    const req = httpRequest(
      new URL(path, base),
      {
        headers: {
          Host: "usvitalcertificates.org",
          "User-Agent": "facebookexternalhit/1.1",
          ...extra.headers,
        },
      },
      (incoming) => {
        const chunks = [];
        incoming.on("data", (chunk) => chunks.push(chunk));
        incoming.on("error", reject);
        incoming.on("end", () =>
          resolve(
            new Response(Buffer.concat(chunks), {
              status: incoming.statusCode,
              headers: incoming.headers,
            }),
          ),
        );
      },
    );
    req.setTimeout(15000, () => req.destroy(new Error(`Request timed out: ${path}`)));
    req.on("error", reject);
    req.end();
  });
const decode = (value) =>
  value.replaceAll("&amp;", "&").replaceAll("&quot;", '"').replaceAll("&#x27;", "'");
function tagValues(html, attribute, key) {
  return [...html.matchAll(/<meta\s+[^>]*>/g)].flatMap(([tag]) => {
    const attrs = Object.fromEntries(
      [...tag.matchAll(/([\w:-]+)="([^"]*)"/g)].map(([, name, value]) => [name, decode(value)]),
    );
    return attrs[attribute] === key ? [attrs.content] : [];
  });
}
function singleMeta(html, attribute, key) {
  const values = tagValues(html, attribute, key);
  assert.equal(values.length, 1, `${key}: expected one tag, got ${values.length}`);
  assert(values[0], `${key} is empty`);
  return values[0];
}
function assertNoEmDash(text, label) {
  for (const marker of ["—", "&mdash;", "&#8212;", "&#x2014;", "\\u2014"]) {
    assert(!text.includes(marker), `${label}: contains em dash (${marker})`);
  }
}

async function assertNotFound(path, headers = {}) {
  const response = await request(path, { headers });
  assert.equal(response.status, 404, path);
  const html = await response.text();
  assert(
    tagValues(html, "name", "robots").some((value) => value.includes("noindex")),
    `${path}: missing noindex`,
  );
  assert(!/<link\b[^>]*rel="canonical"/.test(html), `${path}: unexpected canonical`);
  assert(!html.includes("<form"), path);
  assert(!html.includes('"@type":"HowTo"'), path);
}

try {
  let ready = false;
  for (let attempt = 0; attempt < 100; attempt++) {
    if (child.exitCode !== null) throw new Error(`Production server exited: ${logs}`);
    try {
      if ((await request("/robots.txt")).status === 200) {
        ready = true;
        break;
      }
    } catch {
      // The local server may not have bound its port yet.
    }
    await delay(100);
  }
  assert(ready, `Production server did not start. Run npm run build first. ${logs}`);

  const sitemapResponse = await request("/sitemap.xml");
  assert.equal(sitemapResponse.status, 200);
  assert.match(sitemapResponse.headers.get("content-type"), /xml/);
  const xml = await sitemapResponse.text();
  const urls = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(([, url]) => decode(url));
  assert.equal(urls.length, 141);
  assert.equal(new Set(urls).size, 141);
  assert(urls.every((url) => new URL(url).origin === site));
  assert(urls.includes(`${site}/guides`));
  assert(
    !urls.some((url) =>
      /\/(?:resume|staff|auth|track-order|api|llms\.txt)(?:\/|$)/.test(new URL(url).pathname),
    ),
  );
  assert(!urls.some((url) => /\/state\/(?:vermont|wyoming)(?:\/|$)/.test(url)));
  assert(
    !urls.some((url) => /\/state\/[^/]+\/(?:birth|death|marriage|divorce)-certificate$/.test(url)),
  );
  assert(
    !urls.some((url) => /\/state\/[^/]+\/order\//.test(new URL(url).pathname)),
    "Order pages stay out of the sitemap",
  );
  const imagePaths = new Set();
  const renderedPages = new Map();
  let cursor = 0;
  await Promise.all(
    Array.from({ length: 6 }, async () => {
      while (cursor < urls.length) {
        const url = urls[cursor++];
        const response = await request(new URL(url).pathname);
        assert.equal(response.status, 200, url);
        const html = await response.text();
        renderedPages.set(url, html);
        assertNoEmDash(html, url);
        assert(!/<link\b[^>]*as="font"/.test(html), `${url}: public font preload`);
        const canonical = [...html.matchAll(/<link\b[^>]*rel="canonical"[^>]*href="([^"]+)"/g)];
        assert.deepEqual(
          canonical.map((m) => decode(m[1])),
          [url],
          url,
        );
        assert.equal(singleMeta(html, "property", "og:url"), url, url);
        assert.equal(
          singleMeta(html, "property", "og:type"),
          url.includes("/guides/") ? "article" : "website",
          url,
        );
        assert.equal(singleMeta(html, "property", "og:site_name"), "US Vital Certificates");
        assert.equal(singleMeta(html, "property", "og:locale"), "en_US");
        for (const key of ["og:title", "og:description", "og:image:alt"])
          singleMeta(html, "property", key);
        assert.equal(singleMeta(html, "property", "og:image:width"), "1200");
        assert.equal(singleMeta(html, "property", "og:image:height"), "630");
        assert.equal(singleMeta(html, "property", "og:image:type"), "image/png");
        for (const key of ["twitter:title", "twitter:description", "twitter:image:alt"])
          singleMeta(html, "name", key);
        assert.equal(singleMeta(html, "name", "twitter:card"), "summary_large_image");
        for (const [attribute, key] of [
          ["property", "og:image"],
          ["name", "twitter:image"],
        ]) {
          const image = new URL(singleMeta(html, attribute, key));
          assert.equal(image.origin, site);
          assert.equal(image.pathname, "/opengraph-image");
          imagePaths.add(image.pathname + image.search);
        }
        assert(!tagValues(html, "name", "robots").some((v) => v.includes("noindex")), url);
        assert(!response.headers.get("x-robots-tag")?.includes("noindex"), url);
      }
    }),
  );
  const expectedTitles = new Map([
    ["/", "Birth, Death, Marriage & Divorce Certificates | USVC"],
    ["/faq", "Vital Certificate FAQs: Fees, Requests & Tracking | USVC"],
    ["/find-your-state", "Vital Records by State: Find Your Certificate | USVC"],
    ["/state/florida", "Florida Birth, Death, Marriage & Divorce Records | USVC"],
  ]);
  for (const [path, expectedTitle] of expectedTitles) {
    const html = renderedPages.get(path === "/" ? site : site + path);
    assert.equal(decode(html.match(/<title>(.*?)<\/title>/)?.[1] || ""), expectedTitle);
    const description = singleMeta(html, "name", "description");
    assert.ok(description.length >= 25 && description.length <= 150, path);
    assert.equal(singleMeta(html, "property", "og:description"), description);
    assert.equal(singleMeta(html, "name", "twitter:description"), description);
    assert.equal((html.match(/<h1\b/g) || []).length, 1, path);
  }
  const guideStates = urls.flatMap((url) => {
    const match = new URL(url).pathname.match(/^\/guides\/([^/]+)\/birth-certificate$/);
    return match ? [match[1]] : [];
  });
  assert.equal(guideStates.length, 20);
  const guideIndexUrl = `${site}/guides`;
  const guideIndex = renderedPages.get(guideIndexUrl);
  assert(guideIndex, "Guide directory must be in the sitemap");
  const guideIndexMain = guideIndex.match(/<main\b[^>]*>([\s\S]*?)<\/main>/)?.[1] || "";
  assert.equal(
    (
      guideIndexMain.match(
        /href="\/guides\/[^"/]+\/(?:birth|death|marriage|divorce)-certificate"/g,
      ) || []
    ).length,
    80,
    "Guide directory must link all 80 guides",
  );
  for (const type of ["birth", "death", "marriage", "divorce"]) {
    assert(guideIndexMain.includes(`id="${type}-guides"`), `${type}: missing footer destination`);
    const footer = renderedPages.get(site).match(/<footer\b[\s\S]*?<\/footer>/)?.[0] || "";
    assert(footer.includes(`href="/guides#${type}-guides"`), `${type}: missing footer link`);
  }
  for (const url of urls.filter((url) => /^\/state\/[^/]+$/.test(new URL(url).pathname))) {
    const state = new URL(url).pathname.split("/").at(-1);
    const html = renderedPages.get(url);
    const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/)?.[1] || "";
    const guideLinks = [
      ...main.matchAll(
        /<a\b[^>]*href="\/guides\/[^"/]+\/(?:birth|death|marriage|divorce)-certificate"[^>]*>[\s\S]*?<\/a>/g,
      ),
    ];
    assert.equal(guideLinks.length, guideStates.includes(state) ? 4 : 0, url);
    if (guideLinks.length) {
      assert(guideLinks[0][0].includes(`href="/guides/${state}/birth-certificate"`), url);
      const gridIndex = main.indexOf('class="certificate-type-grid"');
      assert(gridIndex > -1, `${url}: missing certificate grid`);
      assert(
        main.indexOf(guideLinks[0][0]) < gridIndex,
        `${url}: guide link must appear above the certificate grid`,
      );
    }
  }

  for (const url of urls.filter((url) => /\/guides\/[^/]+\//.test(new URL(url).pathname))) {
    const html = renderedPages.get(url);
    const [, , state, certificate] = new URL(url).pathname.split("/");
    const type = certificate.replace("-certificate", "");
    assert(html.includes(`${type} certificate guide`), url);
    assert(html.includes("Official sources"), url);
    for (const sibling of ["birth", "death", "marriage", "divorce"].filter(
      (value) => value !== type,
    ))
      assert(html.includes(`href="/guides/${state}/${sibling}-certificate"`), url);
    if (type !== "birth") {
      assert(html.includes("10/27/2026"), url);
      assert(!html.includes("Source unavailable"), url);
    }
  }

  const graph = new Map(
    [...renderedPages].map(([url, html]) => [
      url,
      [...html.matchAll(/<a\b[^>]*href="([^"]+)"/g)].map((m) => {
        const target = new URL(decode(m[1]), url);
        target.hash = "";
        return target.href.replace(/\/$/, "");
      }),
    ]),
  );
  const distance = new Map([[site, 0]]);
  const queue = [site];
  for (let i = 0; i < queue.length; i++) {
    const from = queue[i];
    for (const target of graph.get(from) || []) {
      if (graph.has(target) && !distance.has(target)) {
        distance.set(target, distance.get(from) + 1);
        queue.push(target);
      }
    }
  }
  assert.equal(
    distance.size,
    urls.length,
    "All sitemap pages must be linked from the homepage graph",
  );
  assert(Math.max(...distance.values()) <= 2, "Sitemap pages must remain within two link hops");
  const homeHtml = renderedPages.get(site);
  assert(homeHtml.includes("q=60"), "Homepage hero must use the approved lighter quality");
  const optimizedImages = [];
  for (const quality of [60, 75]) {
    const response = await request(
      `/_next/image?url=%2Fassets%2Fwhite-house-hero.webp&w=750&q=${quality}`,
      { headers: { Accept: "image/webp" } },
    );
    assert.equal(response.status, 200, `Hero quality ${quality}`);
    assert.match(response.headers.get("content-type"), /image\/webp/);
    optimizedImages.push(Buffer.from(await response.arrayBuffer()).length);
  }
  assert(optimizedImages[0] < optimizedImages[1], "Hero quality 60 must reduce transfer bytes");
  console.log(
    `Guide links/reachability verified; hero WebP bytes: quality 75 ${optimizedImages[1]}, quality 60 ${optimizedImages[0]}.`,
  );
  for (const image of imagePaths) {
    const response = await request(image);
    assert.equal(response.status, 200, image);
    assert.match(response.headers.get("content-type"), /image\/png/);
    const bytes = Buffer.from(await response.arrayBuffer());
    assert.equal(bytes.subarray(0, 8).toString("hex"), "89504e470d0a1a0a");
    assert.equal(bytes.readUInt32BE(16), 1200);
    assert.equal(bytes.readUInt32BE(20), 630);
    assert(bytes.length < 5 * 1024 * 1024);
  }

  const robots = await (await request("/robots.txt")).text();
  for (const rule of [
    "User-Agent: *",
    "Allow: /",
    "Disallow: /api/",
    "Disallow: /auth",
    "Disallow: /staff/",
    `Sitemap: ${site}/sitemap.xml`,
  ])
    assert(robots.includes(rule), rule);
  const llmsResponse = await request("/llms.txt");
  assert.equal(llmsResponse.status, 200);
  assert.match(llmsResponse.headers.get("content-type"), /text\/plain; charset=utf-8/);
  const llms = await llmsResponse.text();
  assertNoEmDash(llms, "/llms.txt");
  assert(llms.startsWith("# US Vital Certificates (USVC)\n"));
  assert(llms.includes("not a government agency"));
  assert.equal((llms.match(/\/guides\//g) || []).length, 80);
  const links = [...llms.matchAll(/\]\((https:\/\/[^)]+)\)/g)].map((m) => m[1]);
  assert(links.length > 13);
  for (const link of links) {
    assert(
      urls.includes(link) || [site + "/sitemap.xml", site + "/robots.txt"].includes(link),
      link,
    );
    assert.equal((await request(new URL(link).pathname)).status, 200, link);
  }

  const noindexOrder = await request("/state/california/order/birth-certificate");
  assert.equal(noindexOrder.status, 200);
  const noindexOrderHtml = await noindexOrder.text();
  assertNoEmDash(noindexOrderHtml, "order page");
  assert(
    tagValues(noindexOrderHtml, "name", "robots").some(
      (value) => value.includes("noindex") && value.includes("follow"),
    ),
    "Order pages must be noindex, follow",
  );

  for (const path of [
    "/resume",
    "/resume-california-birth-certificate",
    "/track-order",
    "/order/confirmation/test",
    "/state/vermont/order/birth-certificate",
    "/state/wyoming/order/birth-certificate",
  ]) {
    const response = await request(path);
    const html = await response.text();
    assertNoEmDash(html, path);
    assert(
      tagValues(html, "name", "robots").some((v) => v.includes("noindex")),
      path,
    );
  }
  for (const certificate of [
    "birth-certificate",
    "death-certificate",
    "marriage-certificate",
    "divorce-certificate",
  ]) {
    for (const slug of ["not-a-state", "California"]) {
      for (const middle of ["", "order/"]) {
        const path = `/state/${slug}/${middle}${certificate}`;
        await assertNotFound(path);
      }
    }
    const legacy = await request(`/state/california/${certificate}`);
    assert.equal(legacy.status, 308);
    assert.equal(legacy.headers.get("location"), `/state/california/order/${certificate}`);
  }
  // Exercise both blocking crawler metadata and a normal browser's streamed metadata.
  for (const path of [
    "/not-a-real-legal-page",
    "/missing/nested/page",
    "/state/not-a-state",
    "/state/California",
    "/guides/not-a-state/birth-certificate",
    "/guides/alabama/death-certificate",
    "/guides/california/not-a-certificate",
    "/guides/California/divorce-certificate",
    "/guides/California/birth-certificate",
    "/state/california/order/not-a-certificate",
    "/state/california/not-a-certificate",
    "/state/not-a-state/order/birth-certificate",
  ]) {
    await assertNotFound(path);
    await assertNotFound(path, { "User-Agent": "Mozilla/5.0" });
  }
  for (const state of ["vermont", "wyoming"]) {
    for (const suffix of ["", "/order/birth-certificate"]) {
      const path = `/state/${state}${suffix}`;
      const response = await request(path);
      assert.equal(response.status, 200, path);
      const html = await response.text();
      assertNoEmDash(html, path);
      assert(
        tagValues(html, "name", "robots").some((value) => value.includes("noindex")),
        path,
      );
      assert(html.includes("We don&#x27;t currently accept orders for this state."), path);
      assert(!html.includes("<form"), path);
    }
  }
  for (const host of ["staging.usvitalcertificates.org", "flow.usvitalcertificates.org"]) {
    const response = await request("/", { headers: { Host: host } });
    assert(response.headers.get("x-robots-tag")?.includes("noindex"), host);
    await response.arrayBuffer();
  }
  console.log(
    `SEO HTTP checks passed: ${urls.length} public pages with complete social metadata; image bytes/dimensions, robots, llms links, private noindex, canonical-free/noindex 404s, unavailable notices and legacy redirects verified.`,
  );
} finally {
  if (child.exitCode === null) {
    const exited = once(child, "exit");
    child.kill("SIGTERM");
    const timeout = setTimeout(() => child.kill("SIGKILL"), 5000);
    await exited;
    clearTimeout(timeout);
  }
}
