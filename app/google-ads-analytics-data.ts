export type GoogleAdsPurchaseEvent = {
  value: number;
  currency: "USD";
  transaction_id: string;
};

export function isGoogleAdsProductionHost(hostname: string): boolean {
  return ["usvitalcertificates.org", "www.usvitalcertificates.org"].includes(hostname);
}

/** Builds the non-identifying, verified-payment data expected by the Ads goal. */
export function googleAdsPurchaseData(
  publicNumber: string,
  amountCents: number,
): GoogleAdsPurchaseEvent | null {
  const transactionId = publicNumber.trim();
  if (!transactionId || !Number.isSafeInteger(amountCents) || amountCents <= 0) return null;
  return { value: amountCents / 100, currency: "USD", transaction_id: transactionId };
}

export function googleAdsPurchaseStorageKey(transactionId: string): string {
  return `usvc:google-ads-purchase:${transactionId}`;
}
