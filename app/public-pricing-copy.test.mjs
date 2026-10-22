import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { URL } from "node:url";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
const PRICE = /\$(?:149|70|79|12)(?:\.00)?(?![0-9])/;

const publicCopy = [
  "app/state/[state]/page.tsx",
  "app/guides/[state]/birth-certificate/guide-content.ts",
  "app/guides/[state]/birth-certificate/page.tsx",
  "app/faq/faq-data.ts",
  "app/page.tsx",
  "app/find-your-state/page.tsx",
];

test("public marketing copy does not publish USVC prices", () => {
  for (const file of publicCopy) {
    assert.doesNotMatch(read(file), PRICE, `${file} must not contain a public price`);
  }
});

test("the order form remains the only price surface", () => {
  for (const file of [
    "app/state/[state]/[certificate]/copy-quantity.tsx",
    "app/state/[state]/[certificate]/order-form.tsx",
    "lib/form-config.ts",
  ]) {
    assert.match(read(file), PRICE, `${file} should show the approved price`);
  }
});
