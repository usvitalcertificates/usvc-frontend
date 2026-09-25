"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import {
  checkoutStartedData,
  isOpenAIProductionHost,
  orderCreatedData,
  publicPageId,
  type OpenAIContentsEvent,
} from "./openai-analytics-data";

type OpenAIEventName = "page_viewed" | "checkout_started" | "order_created";
type QueuedEvent = { name: OpenAIEventName; data: OpenAIContentsEvent };

declare global {
  interface Window {
    oaiq?: (...args: unknown[]) => void;
  }
}

let pixelReady = false;
const pendingEvents: QueuedEvent[] = [];
const recordedOrders = new Set<string>();

function isProductionHost(): boolean {
  return typeof window !== "undefined" && isOpenAIProductionHost(window.location.hostname);
}

function sendOpenAIEvent(name: OpenAIEventName, data: OpenAIContentsEvent) {
  if (!pixelReady || !window.oaiq) {
    if (pendingEvents.length < 20) pendingEvents.push({ name, data });
    return;
  }
  window.oaiq("measure", name, data);
}

export function trackOpenAICheckoutStarted(input: {
  amountCents: number;
  certificate: string;
  copies: number;
}) {
  const data = checkoutStartedData(input);
  if (data) sendOpenAIEvent("checkout_started", data);
}

export function trackOpenAIOrderCreated(orderKey: string, amountCents: number) {
  const data = orderCreatedData(amountCents);
  if (!orderKey || !data) return;
  const storageKey = `usvc:oaiq:order-created:${orderKey}`;
  try {
    if (window.localStorage.getItem(storageKey) === "1") return;
    window.localStorage.setItem(storageKey, "1");
  } catch {
    if (recordedOrders.has(orderKey)) return;
    recordedOrders.add(orderKey);
  }
  sendOpenAIEvent("order_created", data);
}

export function OpenAIAnalytics({
  enabled,
  pixelId,
  debug = false,
}: {
  enabled: boolean;
  pixelId?: string;
  debug?: boolean;
}) {
  const pathname = usePathname();
  const [active, setActive] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setActive(enabled && Boolean(pixelId) && isProductionHost());
  }, [enabled, pixelId]);

  useEffect(() => {
    if (!ready) return;
    const pageId = publicPageId(pathname);
    if (!pageId) return;
    sendOpenAIEvent("page_viewed", {
      type: "contents",
      contents: [{ id: pageId, name: pageId, content_type: "page" }],
    });
  }, [pathname, ready]);

  if (!active || !pixelId) return null;

  const initializePixel = () => {
    pixelReady = true;
    for (const event of pendingEvents.splice(0)) {
      window.oaiq?.("measure", event.name, event.data);
    }
    setReady(true);
  };

  return (
    <Script id="usvc-openai-pixel" strategy="afterInteractive" onReady={initializePixel}>
      {`!function(w,d,s,u){if(w.oaiq)return;var q=function(){q.q.push(arguments)};q.q=[];w.oaiq=q;var j=d.createElement(s);j.async=1;j.src=u;var f=d.getElementsByTagName(s)[0];f.parentNode.insertBefore(j,f)}(window,document,"script","https://bzrcdn.openai.com/sdk/oaiq.min.js");oaiq("init",{pixelId:${JSON.stringify(pixelId)},debug:${debug ? "true" : "false"}});`}
    </Script>
  );
}
