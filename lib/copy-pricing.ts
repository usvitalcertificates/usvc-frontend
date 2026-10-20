/** Display quote only. The API validates and calculates the charged amount. */
export const MAX_COPIES = 9;
export const FIRST_COPY_CENTS = 14900;
export const ADDITIONAL_COPY_CENTS = 7000;
export function copyPricing(copies: number, rush = false) {
  if (!Number.isInteger(copies) || copies < 1 || copies > MAX_COPIES) return null;
  const serviceCents = FIRST_COPY_CENTS + (copies - 1) * ADDITIONAL_COPY_CENTS;
  return {
    serviceCents,
    regularCents: copies * FIRST_COPY_CENTS,
    savingsCents: (copies - 1) * 7900,
    totalCents: serviceCents + (rush ? 1200 : 0),
  };
}
export const copyMoney = (cents: number) =>
  (cents / 100).toLocaleString("en-US", { style: "currency", currency: "USD" });
