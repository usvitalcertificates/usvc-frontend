import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { stripTypeScriptTypes } from "node:module";
import { createServer } from "node:http";
import { once } from "node:events";
import { URL } from "node:url";
import process from "node:process";

const { Request, Response, fetch } = globalThis;
const source = stripTypeScriptTypes(
  readFileSync(new URL("./api/backend/[...path]/route.ts", import.meta.url), "utf8"),
);
async function loadProxy(base = "https://backend.example/api/") {
  const previous = process.env.API_URL;
  process.env.API_URL = base;
  try {
    return await import(
      `data:text/javascript,${encodeURIComponent(source)}#${encodeURIComponent(base)}`
    );
  } finally {
    if (previous === undefined) delete process.env.API_URL;
    else process.env.API_URL = previous;
  }
}
const proxy = await loadProxy();
function request(method = "GET", init = {}, search = "") {
  const req = new Request(`https://website.example/api/backend/orders${search}`, {
    method,
    ...init,
  });
  req.nextUrl = new URL(req.url);
  return req;
}
const context = (path) => ({ params: Promise.resolve({ path }) });

for (const [method, path] of [
  ["POST", ["orders"]],
  ["POST", ["orders", "verify-before-payment"]],
  ["POST", ["orders", "tracking"]],
  ["GET", ["staff", "orders"]],
  ["PATCH", ["staff", "orders", "example-id"]],
  ["PUT", ["staff", "orders", "example-id"]],
  ["DELETE", ["staff", "orders", "example-id", "documents"]],
]) {
  test(`${method} ${path.join("/")} preserves request and response behavior`, async (t) => {
    const body = method === "GET" ? undefined : '{"synthetic":true}';
    const req = request(
      method,
      {
        body,
        headers: {
          "content-type": "application/json",
          authorization: "Bearer synthetic-token",
          "x-forwarded-for": "192.0.2.1",
          cookie: "unrelated=private; usvc-recovery=synthetic-session",
        },
      },
      "?limit=10&cursor=a%2Fb&limit=20",
    );
    const upstreamBody = '{"ok":true}';
    t.mock.method(globalThis, "fetch", async (url, init) => {
      assert.equal(
        url.href,
        `https://backend.example/api/${path.join("/")}?limit=10&cursor=a%2Fb&limit=20`,
      );
      assert.equal(init.method, method);
      assert.equal(init.redirect, "error");
      assert.equal(init.cache, "no-store");
      assert.equal(init.duplex, "half");
      assert.equal(init.headers.get("authorization"), "Bearer synthetic-token");
      assert.equal(init.headers.get("x-forwarded-for"), "192.0.2.1");
      assert.equal(init.headers.get("content-type"), "application/json");
      assert.equal(init.headers.get("cookie"), null);
      if (body) assert.equal(await new Response(init.body).text(), body);
      else assert.equal(init.body, undefined);
      return new Response(upstreamBody, {
        status: 202,
        headers: {
          "content-type": "application/json",
          "cache-control": "no-store",
          "content-disposition": 'attachment; filename="example.json"',
          "set-cookie": "unrelated=upstream",
        },
      });
    });
    const response = await proxy[method](req, context(path));
    assert.equal(response.status, 202);
    assert.equal(await response.text(), upstreamBody);
    assert.equal(response.headers.get("content-type"), "application/json");
    assert.equal(response.headers.get("cache-control"), "no-store");
    assert.equal(
      response.headers.get("content-disposition"),
      'attachment; filename="example.json"',
    );
    assert.equal(response.headers.get("set-cookie"), null);
  });
}

test("crafted schemes, authorities, slashes and delimiters remain backend path data", async (t) => {
  const paths = [
    ["https:", "attacker.example"],
    ["http:", "127.0.0.1:4000", "health"],
    ["//attacker.example"],
    ["", "attacker.example"],
    ["\\\\attacker.example"],
    ["orders", "a/b"],
    ["orders", "%2F%2Fattacker.example"],
    ["orders", "%2e%2e"],
    ["orders", "?redirect=https://attacker.example#fragment"],
  ];
  const calls = [];
  t.mock.method(globalThis, "fetch", async (url) => {
    calls.push(url);
    return Response.json({ ok: true });
  });
  for (const path of paths) {
    const response = await proxy.GET(request(), context(path));
    assert.equal(response.status, 200);
    const target = calls.at(-1);
    assert.equal(target.origin, "https://backend.example");
    assert.equal(target.pathname, `/api/${path.map(encodeURIComponent).join("/")}`);
    assert.equal(target.search, "");
    assert.equal(target.hash, "");
  }
  assert.equal(calls.length, paths.length);
});

test("dot traversal segments return generic 400 without contacting upstream", async (t) => {
  const upstream = t.mock.method(globalThis, "fetch", () => assert.fail("must not fetch"));
  for (const path of [
    ["..", "orders"],
    ["orders", "."],
    ["recovery", "..", "staff"],
  ]) {
    const response = await proxy.GET(request(), context(path));
    assert.equal(response.status, 400);
    assert.deepEqual(await response.json(), { message: "Invalid path." });
  }
  assert.equal(upstream.mock.callCount(), 0);
});

test("recovery forwards only its session cookie and origin, and preserves cookie responses", async (t) => {
  t.mock.method(globalThis, "fetch", async (url, init) => {
    assert.equal(url.href, "https://backend.example/api/recovery/verify");
    assert.equal(init.headers.get("cookie"), "usvc-recovery=synthetic-session");
    assert.equal(init.headers.get("origin"), "https://website.example");
    const response = Response.json({ verified: true });
    response.headers.append(
      "set-cookie",
      "usvc-recovery=renewed; HttpOnly; Secure; Path=/api/backend/recovery",
    );
    response.headers.append("set-cookie", "usvc-recovery-old=; Max-Age=0");
    return response;
  });
  const response = await proxy.POST(
    request("POST", {
      body: '{"code":"synthetic"}',
      headers: {
        cookie: "unrelated=private; usvc-recovery=synthetic-session; another=private",
        origin: "https://website.example",
      },
    }),
    context(["recovery", "verify"]),
  );
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("cache-control"), "no-store");
  assert.equal(response.headers.getSetCookie().length, 2);
  assert.match(response.headers.getSetCookie()[0], /^usvc-recovery=renewed;/);
  assert.deepEqual(await response.json(), { verified: true });
});

test("upstream failures return the existing generic 502", async (t) => {
  t.mock.method(globalThis, "fetch", async () => {
    throw new Error("private provider detail");
  });
  const response = await proxy.GET(request(), context(["orders"]));
  assert.equal(response.status, 502);
  assert.deepEqual(await response.json(), {
    message: "The order service is temporarily unavailable.",
  });
});

test("real fetch refuses upstream redirects without requesting their destinations", async (t) => {
  let destinationRequests = 0;
  const server = createServer((req, res) => {
    if (req.url === "/orders") {
      res.writeHead(302, { location: "/redirect-destination" });
      res.end();
    } else {
      destinationRequests += 1;
      res.end("must not be requested");
    }
  });
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  t.after(
    () =>
      new Promise((resolve, reject) => {
        server.closeAllConnections();
        server.close((error) => (error ? reject(error) : resolve()));
      }),
  );
  t.mock.method(globalThis, "fetch", fetch);
  const localProxy = await loadProxy(`http://127.0.0.1:${server.address().port}`);
  const response = await localProxy.GET(request(), context(["orders"]));
  assert.equal(response.status, 502);
  assert.deepEqual(await response.json(), {
    message: "The order service is temporarily unavailable.",
  });
  assert.equal(destinationRequests, 0);
});
