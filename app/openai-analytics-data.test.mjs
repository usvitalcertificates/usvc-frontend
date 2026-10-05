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
import { BIRTH_GUIDE_SOURCES, CERTIFICATE_SLUGS, INDEXABLE_STATES } from "../lib/seo.ts";

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

test("builds a GTM purchase payload only for a valid paid order", () => {
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

test("SEO inventory contains canonical application and pilot guide coverage", () => {
  // 52 directory states minus Vermont + Wyoming (listed but not orderable).
  assert.equal(INDEXABLE_STATES.length, 50);
  assert.ok(!INDEXABLE_STATES.includes("vermont"));
  assert.ok(!INDEXABLE_STATES.includes("wyoming"));
  assert.deepEqual(CERTIFICATE_SLUGS, [
    "birth-certificate",
    "death-certificate",
    "marriage-certificate",
    "divorce-certificate",
  ]);
  assert.deepEqual(Object.keys(BIRTH_GUIDE_SOURCES).sort(), [
    "california",
    "florida",
    "georgia",
    "illinois",
    "michigan",
    "new-york",
    "north-carolina",
    "ohio",
    "pennsylvania",
    "texas",
  ]);
  for (const guide of Object.values(BIRTH_GUIDE_SOURCES)) assert.match(guide.url, /^https:\/\//);
});
