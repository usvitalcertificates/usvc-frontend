import test from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { URL } from "node:url";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
const guideDir = "app/guides/[state]/birth-certificate/content";
const guideFiles = readdirSync(new URL(`../${guideDir}/`, import.meta.url))
  .filter((name) => name.endsWith(".ts"))
  .map((name) => `${guideDir}/${name}`);

test("public guide and state copy contains no em dash", () => {
  for (const file of [
    "app/state/[state]/page.tsx",
    "app/guides/[state]/birth-certificate/guide-content.ts",
    ...guideFiles,
  ]) {
    assert.doesNotMatch(read(file), /—/, `${file} must not contain an em dash`);
  }
});

test("agency-source copy uses the approved sentence", () => {
  for (const file of [
    "app/guides/[state]/birth-certificate/guide-content.ts",
    `${guideDir}/california.ts`,
    `${guideDir}/florida.ts`,
    `${guideDir}/texas.ts`,
    `${guideDir}/new-york.ts`,
  ]) {
    assert.match(read(file), /which this guide doesn't control/, file);
  }
});

test("California uses maiden name instead of name at birth", () => {
  const california = read(`${guideDir}/california.ts`);
  assert.doesNotMatch(california, /mother's name at birth/i);
  assert.match(california, /including the mother's maiden name/);
});

test("public copy never asks for a different county", () => {
  for (const file of [
    "app/state/[state]/[certificate]/order-form.tsx",
    "lib/county-availability.ts",
  ]) {
    assert.doesNotMatch(read(file), /Please select a different/i, file);
  }
});
