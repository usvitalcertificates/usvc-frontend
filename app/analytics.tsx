"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import {
  googleAdsPurchaseData,
  googleAdsPurchaseStorageKey,
  isGoogleAdsProductionHost,
  type GoogleAdsPurchaseEvent,
} from "./google-ads-analytics-data";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
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

function sendEvent(event: string, params: Record<string, unknown>) {
  window.dataLayer ??= [];
  window.gtag ??= (...args: unknown[]) => window.dataLayer?.push(args);
  window.gtag("event", event, params);
}

function sendGoogleAdsPurchase(data: GoogleAdsPurchaseEvent) {
  sendEvent("conversion_event_purchase_2", data);
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
 * Direct Google Ads purchase goal. This is intentionally browser-side so the
 * Google tag/GTM container can attribute the paid visit; payment truth and
 * value come only from the server-verified confirmation response.
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

export function Analytics({
  enabled,
  measurementId,
}: {
  enabled: boolean;
  measurementId?: string;
}) {
  const pathname = usePathname();
  const validMeasurementId = /^G-[A-Z0-9]+$/.test(measurementId ?? "");
  const [active, setActive] = useState(false);

  useEffect(() => {
    setActive(enabled && validMeasurementId && isProductionHost());
  }, [enabled, validMeasurementId]);

  useEffect(() => {
    analyticsActive = active;
    googleAdsActive = active;
    if (active) {
      for (const queued of pendingEvents.splice(0)) sendEvent(queued.event, queued.params);
      for (const purchase of pendingGoogleAdsPurchases.splice(0)) sendGoogleAdsPurchase(purchase);
      if (!pathname.startsWith("/staff")) trackAnalytics("page_view", { page_path: pathname });
    }
    return () => {
      analyticsActive = false;
      googleAdsActive = false;
    };
  }, [active, pathname]);

  if (!active || !measurementId) return null;
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
      />
      <Script id="usvc-ga4" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}window.gtag=gtag;gtag('js',new Date());gtag('config','${measurementId}',{send_page_view:false,url_passthrough:true});`}
      </Script>
    </>
  );
}
