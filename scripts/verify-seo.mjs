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
  assert.equal(urls.length, 268);
  assert.equal(new Set(urls).size, 268);
  assert(urls.every((url) => new URL(url).origin === site));
  assert(
    !urls.some((url) =>
      /\/(?:resume|staff|auth|track-order|api|llms\.txt)(?:\/|$)/.test(new URL(url).pathname),
    ),
  );
  assert(!urls.some((url) => /\/state\/(?:vermont|wyoming)(?:\/|$)/.test(url)));
  assert(
    !urls.some((url) => /\/state\/[^/]+\/(?:birth|death|marriage|divorce)-certificate$/.test(url)),
  );
  const imagePaths = new Set();
  let cursor = 0;
  await Promise.all(
    Array.from({ length: 6 }, async () => {
      while (cursor < urls.length) {
        const url = urls[cursor++];
        const response = await request(new URL(url).pathname);
        assert.equal(response.status, 200, url);
        const html = await response.text();
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
  assert(llms.startsWith("# US Vital Certificates (USVC)\n"));
  assert(llms.includes("not a government agency"));
  assert.equal((llms.match(/\/guides\//g) || []).length, 10);
  const links = [...llms.matchAll(/\]\((https:\/\/[^)]+)\)/g)].map((m) => m[1]);
  assert(links.length > 10);
  for (const link of links) {
    assert(
      urls.includes(link) || [site + "/sitemap.xml", site + "/robots.txt"].includes(link),
      link,
    );
    assert.equal((await request(new URL(link).pathname)).status, 200, link);
  }

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
        const response = await request(path);
        assert.equal(response.status, 404, path);
        const html = await response.text();
        assert(!html.includes("<form"), path);
        assert(!html.includes('"@type":"HowTo"'), path);
      }
    }
    const legacy = await request(`/state/california/${certificate}`);
    assert.equal(legacy.status, 308);
    assert.equal(legacy.headers.get("location"), `/state/california/order/${certificate}`);
  }
  for (const host of ["staging.usvitalcertificates.org", "flow.usvitalcertificates.org"]) {
    const response = await request("/", { headers: { Host: host } });
    assert(response.headers.get("x-robots-tag")?.includes("noindex"), host);
    await response.arrayBuffer();
  }
  console.log(
    `SEO HTTP checks passed: ${urls.length} public pages with complete social metadata; image bytes/dimensions, robots, llms links, private noindex, invalid-state 404s and legacy redirects verified.`,
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
