import test from "node:test";
import assert from "node:assert/strict";
import { copyPricing, MAX_COPIES } from "../lib/copy-pricing.ts";
test("display quotes match all approved copy prices and per-order rush", () => {
  assert.equal(MAX_COPIES, 9);
  [14900, 21900, 28900, 35900, 42900, 49900, 56900, 63900, 70900].forEach((expected, index) => {
    const copies = index + 1;
    const quote = copyPricing(copies);
    assert.equal(quote.serviceCents, expected);
    assert.equal(quote.savingsCents, index * 7900);
    assert.equal(quote.regularCents - quote.savingsCents, expected);
    assert.equal(copyPricing(copies, true).totalCents, expected + 1200);
  });
});
test("invalid saved quantities require selection instead of silent clamping", () => {
  for (const copies of [0, -1, 1.5, 10, 20, NaN, Infinity]) assert.equal(copyPricing(copies), null);
});
