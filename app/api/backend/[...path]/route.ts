import { NextRequest } from "next/server";

const API_URL = process.env.API_URL ?? "http://localhost:4000";

async function proxy(request: NextRequest, context: RouteContext<"/api/backend/[...path]">) {
  const { path } = await context.params;
  const target = new URL(path.join("/"), `${API_URL.replace(/\/$/, "")}/`);
  target.search = request.nextUrl.search;

  const headers = new Headers();
  const contentType = request.headers.get("content-type");
  if (contentType) headers.set("content-type", contentType);
  // Staff JWT for fulfillment/admin routes. The token lives in sessionStorage
  // on the staff pages and is attached here; it never touches a cookie or URL.
  const authorization = request.headers.get("authorization");
  if (authorization) headers.set("authorization", authorization);

  let response: Response;
  try {
    response = await fetch(target, {
      method: request.method,
      headers,
      body: request.method === "GET" || request.method === "HEAD" ? undefined : request.body,
      // Node.js requires this for a streaming Request body in a Route Handler.
      // @ts-expect-error Next's fetch runtime accepts duplex while the DOM type omits it.
      duplex: "half",
      cache: "no-store",
    });
  } catch {
    return Response.json(
      { message: "The order service is temporarily unavailable." },
      { status: 502 },
    );
  }

  const responseHeaders = new Headers();
  const responseContentType = response.headers.get("content-type");
  if (responseContentType) responseHeaders.set("content-type", responseContentType);
  return new Response(response.body, { status: response.status, headers: responseHeaders });
}

export const GET = proxy;
export const POST = proxy;
export const PATCH = proxy;
export const PUT = proxy;
export const DELETE = proxy;
