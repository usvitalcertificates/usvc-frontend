import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { URL } from "node:url";
import {
  isCountyTemporarilyUnavailable,
  isNewYorkMarriageCountyUnavailable,
} from "../lib/county-availability.ts";

const unavailable = ["New York", "Kings", "Bronx", "Richmond", "Queens"];
test("only the five canonical NYC counties are unavailable for NY marriage", () => {
  const geo = JSON.parse(readFileSync(new URL("../public/geo/NY.json", import.meta.url), "utf8"));
  assert.deepEqual(
    geo.counties
      .filter((c) => isNewYorkMarriageCountyUnavailable("NY", c.name, "marriage-certificate"))
      .map((c) => c.name)
      .sort(),
    [...unavailable].sort(),
  );
  for (const county of unavailable) {
    assert.equal(isCountyTemporarilyUnavailable("NY", county, "marriage-certificate"), true);
    for (const certificate of ["birth-certificate", "death-certificate", "divorce-certificate"])
      assert.equal(isCountyTemporarilyUnavailable("NY", county, certificate), false);
  }
});
test("New York marriage checks normalize names without broadening the state rule", () => {
  assert.equal(isNewYorkMarriageCountyUnavailable("ny", "  QUEENS  ", "MARRIAGE"), true);
  assert.equal(isNewYorkMarriageCountyUnavailable("NY", "Queensbury", "MARRIAGE"), false);
  assert.equal(isNewYorkMarriageCountyUnavailable("CA", "Kings", "MARRIAGE"), false);
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
  for (const certificate of [
    "birth-certificate",
    "death-certificate",
    "marriage-certificate",
    "divorce-certificate",
  ])
    for (const county of counties)
      assert.equal(isCountyTemporarilyUnavailable("CA", county, certificate), true);
  assert.equal(isCountyTemporarilyUnavailable("CA", "Los Angeles", "marriage-certificate"), false);
});
