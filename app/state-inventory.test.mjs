import test from "node:test";
import assert from "node:assert/strict";
import { STATES } from "../lib/states.ts";
import { isStateUnsupported } from "../lib/state-availability.ts";
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

// Hubs and address selectors consume STATES directly; order routes consume ALL_STATE_SLUGS.
test("hub/address jurisdictions and order allowlist contain exactly the same slugs", () => {
  const slugs = STATES.map(({ slug }) => slug);
  assert.equal(slugs.length, 52);
  assert.equal(new Set(slugs).size, slugs.length);
  assert.equal(new Set(STATES.map(({ abbreviation }) => abbreviation)).size, STATES.length);
  assert.deepEqual([...slugs].sort(), [...ALL_STATE_SLUGS].sort());
  for (const { name, slug, abbreviation } of STATES) {
    assert.equal(name.toLowerCase().replaceAll(" ", "-"), slug);
    assert.match(abbreviation, /^[A-Z]{2}$/);
    assert.equal(isStateUnsupported(slug), isStateUnsupported(abbreviation));
  }
});

test("sitemap jurisdictions exclude only the two unavailable states", () => {
  assert.equal(new Set(INDEXABLE_STATES).size, 50);
  assert.deepEqual(
    [...INDEXABLE_STATES].sort(),
    STATES.filter(({ slug }) => !isStateUnsupported(slug))
      .map(({ slug }) => slug)
      .sort(),
  );
  assert.deepEqual(
    STATES.filter(({ slug }) => isStateUnsupported(slug))
      .map(({ slug }) => slug)
      .sort(),
    ["vermont", "wyoming"],
  );
  assert(INDEXABLE_STATES.includes("district-of-columbia"));
  assert(INDEXABLE_STATES.includes("puerto-rico"));
});
