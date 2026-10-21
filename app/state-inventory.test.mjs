import test from "node:test";
import assert from "node:assert/strict";
import { ALL_STATE_SLUGS, INDEXABLE_STATES, isKnownStateSlug } from "../lib/seo.ts";

test("application jurisdictions include supported states and unavailable notices", () => {
  assert.equal(ALL_STATE_SLUGS.length, 52);
  assert.equal(new Set(ALL_STATE_SLUGS).size, 52);
  for (const slug of [...INDEXABLE_STATES, "vermont", "wyoming"])
    assert.equal(isKnownStateSlug(slug), true, slug);
});

test("unknown, mixed-case and noncanonical jurisdiction slugs are rejected", () => {
  for (const slug of [
    "not-a-state",
    "California",
    "NOT-A-STATE",
    "CA",
    " california",
    "",
    "toString",
  ])
    assert.equal(isKnownStateSlug(slug), false, slug);
});
