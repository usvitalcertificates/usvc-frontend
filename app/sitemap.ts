import type { MetadataRoute } from "next";
import {
  BIRTH_GUIDE_SOURCES,
  CERTIFICATE_SLUGS,
  INDEXABLE_STATES,
  SITEMAP_GUIDES_LAST_MODIFIED,
  SITEMAP_ORDERS_LAST_MODIFIED,
  SITEMAP_STATES_LAST_MODIFIED,
  SITEMAP_STATIC_LAST_MODIFIED,
  SITE_URL,
} from "@/lib/seo";

const STATIC_PATHS = [
  "",
  "/certificates",
  "/find-your-state",
  "/faq",
  "/contact",
  "/privacy-policy",
  "/terms-of-service",
  "/accessibility",
];

/**
 * Single-file sitemap at /sitemap.xml (P0 SEO). 268 URLs, well under
 * Google's 50k limit. Stable per-section <lastmod> (no `new Date()`
 * churn) so Google trusts it for recrawl priority. A 4-way split via
 * generateSitemaps was tried but Next 16 serves children at
 * /sitemap/<id>.xml with no /sitemap.xml index, which would 404 the
 * GSC-submitted URL — so single file stays until a proper index route
 * is added.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...STATIC_PATHS.map((path) => ({
      url: `${SITE_URL}${path}`,
      lastModified: SITEMAP_STATIC_LAST_MODIFIED,
      changeFrequency: "monthly" as const,
      priority: path ? 0.7 : 1,
    })),
    ...INDEXABLE_STATES.map((state) => ({
      url: `${SITE_URL}/state/${state}`,
      lastModified: SITEMAP_STATES_LAST_MODIFIED,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...INDEXABLE_STATES.flatMap((state) =>
      CERTIFICATE_SLUGS.map((certificate) => ({
        url: `${SITE_URL}/state/${state}/order/${certificate}`,
        lastModified: SITEMAP_ORDERS_LAST_MODIFIED,
        changeFrequency: "monthly" as const,
        priority: 0.6,
      })),
    ),
    ...Object.keys(BIRTH_GUIDE_SOURCES).map((state) => ({
      url: `${SITE_URL}/guides/${state}/birth-certificate`,
      lastModified: SITEMAP_GUIDES_LAST_MODIFIED,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
