import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { URL } from "node:url";
import {
  isCountyTemporarilyUnavailable,
  isNewYorkCountyUnavailable,
} from "../lib/county-availability.ts";

const unavailable = ["New York", "Kings", "Bronx", "Richmond", "Queens"];
test("the same five NYC counties are unavailable without any certificate-specific condition", () => {
  const geo = JSON.parse(readFileSync(new URL("../public/geo/NY.json", import.meta.url), "utf8"));
  assert.deepEqual(
    geo.counties
      .filter((c) => isNewYorkCountyUnavailable("NY", c.name))
      .map((c) => c.name)
      .sort(),
    [...unavailable].sort(),
  );
  for (const county of unavailable)
    assert.equal(isCountyTemporarilyUnavailable("NY", county), true);
  assert.equal(isCountyTemporarilyUnavailable("NY", "Albany"), false);
});
test("New York county checks normalize names without broadening the state rule", () => {
  assert.equal(isNewYorkCountyUnavailable("ny", "  QUEENS  "), true);
  assert.equal(isNewYorkCountyUnavailable("NY", "Queensbury"), false);
  assert.equal(isNewYorkCountyUnavailable("CA", "Kings"), false);
});
test("California restrictions retain the same counties and certificate scope", () => {
  const counties = [
    "San Francisco",
    "San Bernardino",
    "Yolo",
    "Riverside",
    "Del Norte",
    "Lake",
    "Sutter",
    "Kings",
    "Santa Barbara",
  ];
  for (const county of counties) assert.equal(isCountyTemporarilyUnavailable("CA", county), true);
  assert.equal(isCountyTemporarilyUnavailable("CA", "Los Angeles"), false);
});

test("California divorce is unavailable statewide without disabling other products or states", async () => {
  const { isCertificateUnavailable } = await import("../lib/state-availability.ts");
  for (const state of ["CA", "california"])
    for (const certificate of ["DIVORCE", "divorce-certificate"])
      assert.equal(isCertificateUnavailable(state, certificate), true);
  for (const certificate of ["birth-certificate", "death-certificate", "marriage-certificate"])
    assert.equal(isCertificateUnavailable("california", certificate), false);
  for (const state of ["alabama", "new-york", "texas"])
    assert.equal(isCertificateUnavailable(state, "divorce-certificate"), false);
});
