export type OpenAIContent = {
  id: string;
  name: string;
  content_type: "page" | "product";
  quantity?: number;
};

export type OpenAIContentsEvent = {
  type: "contents";
  amount?: number;
  currency?: "USD";
  contents?: OpenAIContent[];
};

export function isOpenAIProductionHost(hostname: string): boolean {
  return ["usvitalcertificates.org", "www.usvitalcertificates.org"].includes(hostname);
}

/** Returns a non-identifying content label and never exposes dynamic URL segments. */
export function publicPageId(pathname: string): string | null {
  if (pathname === "/staff" || pathname.startsWith("/staff/") || pathname.startsWith("/auth")) {
    return null;
  }
  if (/^\/checkout\/[^/]+$/.test(pathname)) return "checkout";
  if (/^\/order\/confirmation\/[^/]+$/.test(pathname)) return "order_confirmation";
  if (/^\/state\/[^/]+\/[^/]+$/.test(pathname)) return "certificate_application";

  const knownPages: Record<string, string> = {
    "/": "home",
    "/contact": "contact",
    "/faq": "faq",
    "/track-order": "track_order",
    "/privacy-policy": "privacy_policy",
    "/terms-of-use": "terms_of_use",
    "/refund-policy": "refund_policy",
  };
  return knownPages[pathname] ?? "other_public_page";
}

export function checkoutStartedData(input: {
  amountCents: number;
  certificate: string;
  copies: number;
}): OpenAIContentsEvent | null {
  if (!Number.isSafeInteger(input.amountCents) || input.amountCents < 0) return null;
  const copies = Number.isSafeInteger(input.copies) && input.copies > 0 ? input.copies : 1;
  const certificate = input.certificate.toLowerCase();
  return {
    type: "contents",
    amount: input.amountCents,
    currency: "USD",
    contents: [
      {
        id: `usvc-${certificate}`,
        name: `${input.certificate} Certificate`,
        content_type: "product",
        quantity: copies,
      },
    ],
  };
}

export function orderCreatedData(amountCents: number): OpenAIContentsEvent | null {
  if (!Number.isSafeInteger(amountCents) || amountCents < 0) return null;
  return { type: "contents", amount: amountCents, currency: "USD" };
}
