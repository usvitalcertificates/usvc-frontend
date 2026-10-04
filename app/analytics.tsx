"use client";

import { useEffect, useState } from "react";

import {
  googleAdsPurchaseData,
  googleAdsPurchaseStorageKey,
  isGoogleAdsProductionHost,
  type GoogleAdsPurchaseEvent,
} from "./google-ads-analytics-data";

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
  }
}

let analyticsActive = false;
let googleAdsActive = false;

/** Events fired before activation (e.g. mount effects, which run before the
 *  Analytics effect flips the flag) wait here and flush once active, so mount
 *  events like select_certificate are never silently dropped. */
const pendingEvents: Array<{ event: string; params: Record<string, unknown> }> = [];
const pendingGoogleAdsPurchases: GoogleAdsPurchaseEvent[] = [];
const recordedGoogleAdsPurchases = new Set<string>();

/** Universal GTM contract: every event is a plain dataLayer object. Tags,
 *  triggers, and destinations all live in the GTM dashboard — code only
 *  declares *when* something happened and *what* data travels with it. */
function sendEvent(event: string, params: Record<string, unknown>) {
  window.dataLayer ??= [];
  window.dataLayer.push({ event, ...params });
}

/** Google Ads purchase, fired through GTM: the `Purchase` custom event (exact
 *  casing) triggers both the GA4 Purchase tag and the Microsoft UET tag.
 *  Payment truth and value come only from the server-verified confirmation
 *  response. */
function sendGoogleAdsPurchase(data: GoogleAdsPurchaseEvent) {
  sendEvent("Purchase", data);
}

function isProductionHost(): boolean {
  return (
    typeof window !== "undefined" &&
    ["usvitalcertificates.org", "www.usvitalcertificates.org"].includes(window.location.hostname)
  );
}

export function trackAnalytics(event: string, params: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  if (!analyticsActive) {
    if (pendingEvents.length < 20) pendingEvents.push({ event, params });
    return;
  }
  sendEvent(event, params);
}

/**
 * Sale attribution for the GTM purchase goal. Browser-side so the GTM
 * container (Google tag + UET) can attribute the paid visit; payment truth
 * and value come only from the server-verified confirmation response.
 */
export function trackGoogleAdsPurchase(publicNumber: string, amountCents: number) {
  if (typeof window === "undefined" || !isGoogleAdsProductionHost(window.location.hostname)) return;
  const data = googleAdsPurchaseData(publicNumber, amountCents);
  if (!data) return;

  const storageKey = googleAdsPurchaseStorageKey(data.transaction_id);
  try {
    if (window.sessionStorage.getItem(storageKey) === "1") return;
    window.sessionStorage.setItem(storageKey, "1");
  } catch {
    if (recordedGoogleAdsPurchases.has(data.transaction_id)) return;
    recordedGoogleAdsPurchases.add(data.transaction_id);
  }

  if (!googleAdsActive) {
    if (pendingGoogleAdsPurchases.length < 20) pendingGoogleAdsPurchases.push(data);
    return;
  }
  sendGoogleAdsPurchase(data);
}

function readCookie(name: string): string | undefined {
  return document.cookie
    .split("; ")
    .find((entry) => entry.startsWith(`${name}=`))
    ?.slice(name.length + 1);
}

/** GA cookies are pseudonymous attribution metadata, never application data. */
export function getAnalyticsAttribution(): { clientId?: string; sessionId?: string } | undefined {
  if (!analyticsActive || typeof document === "undefined") return undefined;
  const ga = readCookie("_ga");
  const clientId = ga?.match(/^GA\d+\.\d+\.(\d+\.\d+)$/)?.[1];
  const sessionCookie = document.cookie
    .split("; ")
    .find((entry) => entry.startsWith("_ga_"))
    ?.split("=", 2)[1];
  const sessionId = sessionCookie?.match(/^GS\d+\.\d+\.(\d+)/)?.[1];
  return clientId || sessionId ? { clientId, sessionId } : undefined;
}

/** OpenAI pixel first-party cookies (`__oppref` click ref, `__obref` browser ref).
 *  Opaque attribution IDs only — never application data. Read independently of
 *  GA activation so server Conversions API matching works when GA is off. */
export function getOpenAIAttribution():
  { openAiOppref?: string; openAiObref?: string } | undefined {
  if (typeof document === "undefined") return undefined;
  const oppref = readCookie("__oppref")?.trim().slice(0, 500);
  const obref = readCookie("__obref")?.trim().slice(0, 500);
  if (!oppref && !obref) return undefined;
  return {
    ...(oppref ? { openAiOppref: oppref } : {}),
    ...(obref ? { openAiObref: obref } : {}),
  };
}

export function Analytics({ enabled }: { enabled: boolean }) {
  const [active, setActive] = useState(false);

  useEffect(() => {
    setActive(enabled && isProductionHost());
  }, [enabled]);

  useEffect(() => {
    analyticsActive = active;
    googleAdsActive = active;
    if (active) {
      for (const queued of pendingEvents.splice(0)) sendEvent(queued.event, queued.params);
      for (const purchase of pendingGoogleAdsPurchases.splice(0)) sendGoogleAdsPurchase(purchase);
      // No manual page_view: the GTM Google tag sends one automatically on
      // container load — pushing our own would double-count every pageview.
    }
    return () => {
      analyticsActive = false;
      googleAdsActive = false;
    };
  }, [active]);

  // GTM container (layout) owns all loading. This component only flips the
  // gates that release queued events.
  return null;
}
