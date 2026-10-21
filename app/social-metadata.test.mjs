import test from "node:test";
import assert from "node:assert/strict";
import { SITE_URL, SOCIAL_IMAGE, socialMetadata } from "../lib/seo.ts";

test("social metadata preserves page identity and includes complete previews", () => {
  const input = {
    title: "California Birth Certificate Application",
    description:
      "Start a guided California birth certificate request with USVC review and tracking.",
    url: `${SITE_URL}/state/california/order/birth-certificate`,
  };
  const result = socialMetadata(input);
  assert.equal(result.openGraph.url, input.url);
  assert.equal(result.openGraph.title, input.title);
  assert.equal(result.twitter.title, input.title);
  assert.equal(result.openGraph.description, input.description);
  assert.equal(result.twitter.description, input.description);
  assert.equal(result.openGraph.type, "website");
  assert.equal(result.openGraph.locale, "en_US");
  assert.equal(result.openGraph.siteName, "US Vital Certificates");
  assert.deepEqual(result.openGraph.images, [SOCIAL_IMAGE]);
  assert.equal(result.twitter.card, "summary_large_image");
  assert.deepEqual(result.twitter.images, [{ url: SOCIAL_IMAGE.url, alt: SOCIAL_IMAGE.alt }]);
});

test("article metadata stays page-specific without sharing mutable image state", () => {
  const article = socialMetadata({
    title: "How to Get a Texas Birth Certificate",
    description: "Official guidance plus USVC help for a Texas birth certificate request.",
    url: `${SITE_URL}/guides/texas/birth-certificate`,
    type: "article",
  });
  assert.equal(article.openGraph.type, "article");
  assert.equal(article.openGraph.url, `${SITE_URL}/guides/texas/birth-certificate`);
  article.openGraph.images[0].alt = "changed";
  assert.notEqual(SOCIAL_IMAGE.alt, "changed");
});
