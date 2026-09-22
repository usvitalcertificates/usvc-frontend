"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

let analyticsActive = false;

/** Events fired before activation (e.g. mount effects, which run before the
 *  Analytics effect flips the flag) wait here and flush once active, so mount
 *  events like select_certificate are never silently dropped. */
const pendingEvents: Array<{ event: string; params: Record<string, unknown> }> = [];

function sendEvent(event: string, params: Record<string, unknown>) {
  window.dataLayer ??= [];
  window.gtag ??= (...args: unknown[]) => window.dataLayer?.push(args);
  window.gtag("event", event, params);
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
    if (active) {
      for (const queued of pendingEvents.splice(0)) sendEvent(queued.event, queued.params);
      if (!pathname.startsWith("/staff")) trackAnalytics("page_view", { page_path: pathname });
    }
    return () => {
      analyticsActive = false;
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
