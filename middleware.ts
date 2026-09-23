import { NextResponse, type NextRequest } from "next/server";

const FLOW_PREFIX = "flow.";
const STAFF_PATHS = ["/auth", "/staff", "/api"];
const PUBLIC_FUNNEL = ["/checkout", "/track-order", "/order", "/state", "/contact", "/faq"];

function isFlowHost(host: string): boolean {
  const name = host.split(":")[0].toLowerCase();
  return name === "flow.localtest" || name.startsWith(FLOW_PREFIX);
}

function isLocalOrPreview(host: string): boolean {
  const name = host.split(":")[0].toLowerCase();
  return (
    name === "localhost" ||
    name === "127.0.0.1" ||
    name.endsWith(".vercel.app") ||
    name.endsWith(".localtest")
  );
}

/** Staging serves both the public site and the staff portal by path
 *  (production keeps them host-separated: main site vs flow.*). */
function isStagingHost(host: string): boolean {
  const name = host.split(":")[0].toLowerCase();
  return name === "staging.usvitalcertificates.org" || name.startsWith("staging.");
}

/**
 * Host split for the single-project setup. `flow.*` serves only the staff
 * portal (/auth, /staff); the public site serves everything except staff.
 * Staging, localhost, and Vercel previews allow all paths for development
 * and testing.
 */
export function middleware(request: NextRequest) {
  const host = request.headers.get("host") ?? "";
  const { pathname } = request.nextUrl;
  const staffArea = pathname === "/auth" || pathname === "/staff" || pathname.startsWith("/staff/");
  const withStaffFlag = () => {
    if (!staffArea) return NextResponse.next();
    const headers = new Headers(request.headers);
    headers.set("x-staff-area", "1");
    const response = NextResponse.next({ request: { headers } });
    // Staff pages must never be indexed, on any host.
    response.headers.set("x-robots-tag", "noindex, nofollow");
    return response;
  };

  if (isLocalOrPreview(host) || isStagingHost(host)) {
    // Localhost, previews, and staging allow all paths.
    if (pathname === "/" && host.split(":")[0].toLowerCase() === "flow.localtest") {
      return NextResponse.rewrite(new URL("/staff", request.url));
    }
    return withStaffFlag();
  }

  if (isFlowHost(host)) {
    if (pathname === "/") return NextResponse.rewrite(new URL("/staff", request.url));
    const allowed =
      STAFF_PATHS.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)) ||
      pathname.startsWith("/_next") ||
      pathname.startsWith("/assets") ||
      pathname === "/favicon.ico";
    if (!allowed) return new NextResponse("Not found", { status: 404 });
    return withStaffFlag();
  }

  if (pathname === "/auth" || pathname === "/staff" || pathname.startsWith("/staff/")) {
    return new NextResponse("Not found", { status: 404 });
  }
  if (PUBLIC_FUNNEL.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`))) {
    return NextResponse.next();
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
