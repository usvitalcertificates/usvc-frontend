import test from "node:test";
import { URL } from "node:url";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { stripTypeScriptTypes } from "node:module";
import { RECORD_GUIDE_DATA } from "./guides/record-guide-data.ts";
const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
// Exercise the actual content builder with its reviewed data in Node's strip-types runner.
const builder = stripTypeScriptTypes(read("app/guides/record-guide-content.ts")).replace(
  /import \{ RECORD_GUIDE_DATA \} from "\.\/record-guide-data";/,
  `const RECORD_GUIDE_DATA = ${JSON.stringify(RECORD_GUIDE_DATA)};`,
);
const { getRecordGuideContent, RECORD_GUIDE_TYPES } = await import(
  `data:text/javascript,${encodeURIComponent(builder)}`
);
const expected = [
  "california",
  "texas",
  "florida",
  "new-york",
  "pennsylvania",
  "illinois",
  "ohio",
  "georgia",
  "north-carolina",
  "michigan",
  "new-jersey",
  "virginia",
  "washington",
];
test("exactly 39 new guides cover the existing 13 states", () => {
  assert.deepEqual(Object.keys(RECORD_GUIDE_DATA).sort(), expected.toSorted());
  assert.equal(expected.length * RECORD_GUIDE_TYPES.length, 39);
});
for (const state of expected)
  for (const certificate of RECORD_GUIDE_TYPES) {
    test(`${state}/${certificate} has complete sourced content and unique sections`, () => {
      const content = getRecordGuideContent(state, certificate);
      assert.ok(content);
      assert.ok(content.metaTitle.length >= 25 && content.metaTitle.length <= 150);
      assert.ok(content.metaDescription.length >= 25 && content.metaDescription.length <= 150);
      assert.equal(content.sourceChecked, "10/27/2026");
      assert.equal(content.sections.length, 10);
      assert.equal(new Set(content.sections.map((s) => s.id)).size, 10);
      assert.ok(content.faqs.length >= 9);
      assert.ok(content.quickFacts.length >= 7);
      const prose = JSON.stringify(content);
      assert.doesNotMatch(prose, /undefined|\$\{|[—–]/);
      assert.ok(prose.split(/\s+/).length > 1100);
      assert.ok(content.sources.length >= 1);
      for (const source of content.sources)
        assert.match(new URL(source.href).hostname, /\.gov$|\.courts\.phila\.gov$/);
      const facts = RECORD_GUIDE_DATA[state].records[certificate.replace("-certificate", "")];
      for (const fact of [facts.authority, facts.record, facts.access, facts.route, facts.detail])
        assert.ok(prose.includes(fact), fact);
      assert.match(content.ctaLabel, /Ask About/);
    });
  }
test("invalid states and unsupported guide types have no fallback content", () => {
  for (const [state, type] of [
    ["alabama", "death-certificate"],
    ["California", "death-certificate"],
    ["constructor", "death-certificate"],
    ["california", "birth-certificate"],
    ["california", "not-a-certificate"],
  ])
    assert.equal(getRecordGuideContent(state, type), undefined);
});
test("guides distinguish verifications, event certificates and decrees", () => {
  for (const state of ["texas", "illinois"])
    for (const type of ["marriage", "divorce"])
      assert.match(getRecordGuideContent(state, `${type}-certificate`).intro.join(" "), /verif/i);
  assert.match(
    getRecordGuideContent("california", "divorce-certificate").intro.join(" "),
    /does not establish/,
  );
  assert.match(
    getRecordGuideContent("new-jersey", "divorce-certificate").intro.join(" "),
    /court record/,
  );
  assert.match(
    getRecordGuideContent("ohio", "marriage-certificate").intro.join(" "),
    /probate court/,
  );
});
test("CI and commit hooks generate Next route types before checking TypeScript", () => {
  const pkg = JSON.parse(read("package.json"));
  assert.equal(pkg.scripts.typecheck, "next typegen && tsc --noEmit");
  assert.match(read(".github/workflows/ci.yml"), /run: npm run typecheck/);
  assert.match(read(".husky/pre-commit"), /npm run typecheck/);
});
