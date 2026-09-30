import assert from "node:assert/strict";
import test from "node:test";

import {
  checkoutStartedData,
  isOpenAIProductionHost,
  orderCreatedData,
  publicPageId,
} from "./openai-analytics-data.ts";
import {
  googleAdsPurchaseData,
  googleAdsPurchaseStorageKey,
  isGoogleAdsProductionHost,
} from "./google-ads-analytics-data.ts";

test("allows only the two public production hosts", () => {
  assert.equal(isOpenAIProductionHost("usvitalcertificates.org"), true);
  assert.equal(isOpenAIProductionHost("www.usvitalcertificates.org"), true);
  assert.equal(isOpenAIProductionHost("flow.usvitalcertificates.org"), false);
  assert.equal(isOpenAIProductionHost("localhost"), false);
});

test("normalizes public routes without leaking dynamic identifiers", () => {
  assert.equal(publicPageId("/checkout/private-order-id"), "checkout");
  assert.equal(publicPageId("/order/confirmation/private-order-id"), "order_confirmation");
  assert.equal(publicPageId("/state/california/birth"), "certificate_application");
  assert.equal(publicPageId("/unknown/private-value"), "other_public_page");
  assert.equal(publicPageId("/staff/admin"), null);
  assert.equal(publicPageId("/auth"), null);
});

test("builds checkout data with cents, currency, certificate, and quantity", () => {
  assert.deepEqual(checkoutStartedData({ amountCents: 12999, certificate: "BIRTH", copies: 2 }), {
    type: "contents",
    amount: 12999,
    currency: "USD",
    contents: [
      {
        id: "usvc-birth",
        name: "BIRTH Certificate",
        content_type: "product",
        quantity: 2,
      },
    ],
  });
  assert.equal(checkoutStartedData({ amountCents: 12.99, certificate: "BIRTH", copies: 1 }), null);
});

test("completed-order data contains no order or customer identifier", () => {
  assert.deepEqual(orderCreatedData(12999), {
    type: "contents",
    amount: 12999,
    currency: "USD",
  });
  assert.equal(orderCreatedData(-1), null);
});

test("builds a direct Google Ads conversion only for a valid paid order", () => {
  assert.equal(isGoogleAdsProductionHost("usvitalcertificates.org"), true);
  assert.equal(isGoogleAdsProductionHost("www.usvitalcertificates.org"), true);
  assert.equal(isGoogleAdsProductionHost("flow.usvitalcertificates.org"), false);
  assert.equal(isGoogleAdsProductionHost("staging.usvitalcertificates.org"), false);
  assert.deepEqual(googleAdsPurchaseData("USCA-BT-20260930-00A001", 12999), {
    value: 129.99,
    currency: "USD",
    transaction_id: "USCA-BT-20260930-00A001",
  });
  assert.equal(googleAdsPurchaseData("", 12999), null);
  assert.equal(googleAdsPurchaseData("USCA-BT-20260930-00A001", 0), null);
  assert.equal(googleAdsPurchaseData("USCA-BT-20260930-00A001", 12.99), null);
  assert.equal(
    googleAdsPurchaseStorageKey("USCA-BT-20260930-00A001"),
    "usvc:google-ads-purchase:USCA-BT-20260930-00A001",
  );
});
