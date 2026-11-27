import { GUIDE_INVENTORY } from "@/lib/guide-inventory";
import type { MetadataRoute } from "next";
import { TOPIC_GUIDE_SLUGS } from "./guides/topic-guides";
import {
  INDEXABLE_STATES,
  SITEMAP_GUIDES_LAST_MODIFIED,
  SITEMAP_STATES_LAST_MODIFIED,
  SITEMAP_STATIC_LAST_MODIFIED,
  SITEMAP_TOPICS_LAST_MODIFIED,
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
  "/about",
  "/editorial",
];

/**
 * Single-file sitemap at /sitemap.xml (P0 SEO). 212 indexable URLs:
 * 50 state hubs, 144 state guides, 7 topic guides, the guide directory and
 * 10 static pages.
 * Order pages are noindex, follow and deliberately excluded so crawl
 * priority stays on hubs and guides.
 * Stable per-section <lastmod> (no `new Date()` churn) so Google
 * trusts it for recrawl priority. Bump a section's date in `lib/seo.ts`
 * only when that section's indexed content or metadata actually changes.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...STATIC_PATHS.map((path) => ({
      url: `${SITE_URL}${path}`,
      lastModified: SITEMAP_STATIC_LAST_MODIFIED,
      changeFrequency: "monthly" as const,
      priority: path ? 0.7 : 1,
    })),
    {
      url: `${SITE_URL}/guides`,
      lastModified: SITEMAP_GUIDES_LAST_MODIFIED,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    ...INDEXABLE_STATES.map((state) => ({
      url: `${SITE_URL}/state/${state}`,
      lastModified: SITEMAP_STATES_LAST_MODIFIED,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...TOPIC_GUIDE_SLUGS.map((slug) => ({
      url: `${SITE_URL}/guides/${slug}`,
      lastModified: SITEMAP_TOPICS_LAST_MODIFIED,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...GUIDE_INVENTORY.map((guide) => ({
      url: `${SITE_URL}${guide.path}`,
      lastModified: SITEMAP_GUIDES_LAST_MODIFIED,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
