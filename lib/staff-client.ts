"use client";

const ACCESS_KEY = "usvc-staff-access";
const REFRESH_KEY = "usvc-staff-refresh";

export function staffTokens(): { access: string | null; refresh: string | null } {
  if (typeof window === "undefined") return { access: null, refresh: null };
  return {
    access: sessionStorage.getItem(ACCESS_KEY),
    refresh: sessionStorage.getItem(REFRESH_KEY),
  };
}

export function saveStaffTokens(access: string, refresh: string): void {
  sessionStorage.setItem(ACCESS_KEY, access);
  sessionStorage.setItem(REFRESH_KEY, refresh);
}

export function staffRole(): string | null {
  const access = typeof window !== "undefined" ? sessionStorage.getItem(ACCESS_KEY) : null;
  if (!access) return null;
  try {
    const payload = JSON.parse(atob(access.split(".")[1]));
    return typeof payload.role === "string" ? payload.role : null;
  } catch {
    return null;
  }
}

export function clearStaffSession(): void {
  sessionStorage.removeItem(ACCESS_KEY);
  sessionStorage.removeItem(REFRESH_KEY);
}

async function refreshAccess(): Promise<string | null> {
  const { refresh } = staffTokens();
  if (!refresh) return null;
  const response = await fetch("/api/backend/auth/refresh", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ refreshToken: refresh }),
  });
  if (!response.ok) {
    clearStaffSession();
    return null;
  }
  const data = await response.json();
  saveStaffTokens(data.accessToken, data.refreshToken);
  return data.accessToken as string;
}

/** Authenticated fetch through the same-origin proxy. Retries once after refresh. */
export async function staffFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const send = (token: string | null) => {
    const headers = new Headers(init.headers);
    if (token) headers.set("authorization", `Bearer ${token}`);
    if (init.body && !headers.has("content-type")) headers.set("content-type", "application/json");
    return fetch(`/api/backend${path}`, { ...init, headers });
  };
  let response = await send(staffTokens().access);
  if (response.status === 401) {
    const renewed = await refreshAccess();
    if (!renewed) {
      if (typeof window !== "undefined" && !window.location.pathname.startsWith("/auth")) {
        window.location.href = "/auth";
      }
      return response;
    }
    response = await send(renewed);
  }
  return response;
}

/** Reads a response as JSON, falling back to plain text. A non-JSON error
 *  body (proxies, gateways, rate limiters) must never surface as a parser
 *  SyntaxError in the UI. */
async function readBody(response: Response): Promise<{ message?: string }> {
  const text = await response.text().catch(() => "");
  if (!text) return {};
  try {
    const data = JSON.parse(text) as unknown;
    if (data && typeof data === "object") return data as { message?: string };
    return { message: String(data) };
  } catch {
    // Plain-text or HTML error body: strip tags, keep it short and readable.
    const message = text
      .replace(/<[^>]*>/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 200);
    return message ? { message } : {};
  }
}

/** staffFetch + safe body read. Use this instead of response.json() so a
 *  non-JSON error body never throws a parser SyntaxError into the UI. */
export async function staffData<T = { message?: string }>(
  path: string,
  init: RequestInit = {},
): Promise<{ response: Response; data: T }> {
  const response = await staffFetch(path, init);
  const data = (await readBody(response)) as T;
  return { response, data };
}

export async function staffJson<T>(path: string, init: RequestInit = {}): Promise<T> {
  const { response, data } = await staffData<T>(path, init);
  if (!response.ok) {
    throw new Error(
      (data as { message?: string }).message || `Request failed (${response.status})`,
    );
  }
  return data;
}

export async function staffLogout(): Promise<void> {
  const { refresh } = staffTokens();
  if (refresh) {
    await fetch("/api/backend/auth/logout", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ refreshToken: refresh }),
    }).catch(() => undefined);
  }
  clearStaffSession();
}
