import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { URL } from "node:url";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

const guides = {
  california: "app/guides/[state]/birth-certificate/content/california.ts",
  texas: "app/guides/[state]/birth-certificate/content/texas.ts",
  florida: "app/guides/[state]/birth-certificate/content/florida.ts",
  "new-york": "app/guides/[state]/birth-certificate/content/new-york.ts",
};

const registeredGuides = read("app/guides/[state]/birth-certificate/guide-content.ts");

for (const [slug, file] of Object.entries(guides)) {
  test(`${slug} has a complete, registered guide`, () => {
    const source = read(file);
    const title = source.match(/metaTitle:\s*"([^"]+)"/)?.[1] ?? "";
    const description = source.match(/metaDescription:\s*"([^"]+)"/)?.[1] ?? "";

    assert.match(registeredGuides, new RegExp(`"${slug}"|\\b${slug}:`));
    assert.ok(title.length >= 15 && title.length <= 150, `${slug} title length`);
    assert.ok(description.length >= 25 && description.length <= 150, `${slug} description length`);
    assert.ok((source.match(/\n\s+id: "/g) ?? []).length >= 6, `${slug} sections`);
    assert.ok((source.match(/\n\s+question: /g) ?? []).length >= 9, `${slug} FAQs`);
    assert.ok((source.match(/\n\s+\{ label: /g) ?? []).length >= 7, `${slug} sources`);
    assert.match(source, /sourceChecked: "October 22, 2026"/);
    assert.match(source, /ctaLabel: "Start Your /);
  });
}
