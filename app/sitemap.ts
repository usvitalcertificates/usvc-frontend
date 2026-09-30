import type { MetadataRoute } from "next";
import { CERTIFICATE_SLUGS, INDEXABLE_STATES, SITE_URL } from "@/lib/seo";
import { BIRTH_GUIDE_SOURCES } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths = [
    "",
    "/certificates",
    "/find-your-state",
    "/faq",
    "/contact",
    "/privacy-policy",
    "/terms-of-service",
    "/accessibility",
  ];
  return [
    ...staticPaths.map((path) => ({
      url: `${SITE_URL}${path}`,
      changeFrequency: "monthly" as const,
      priority: path ? 0.7 : 1,
    })),
    ...INDEXABLE_STATES.flatMap((state) => [
      { url: `${SITE_URL}/state/${state}`, changeFrequency: "monthly" as const, priority: 0.8 },
      ...CERTIFICATE_SLUGS.map((certificate) => ({
        url: `${SITE_URL}/state/${state}/order/${certificate}`,
        changeFrequency: "monthly" as const,
        priority: 0.6,
      })),
    ]),
    ...Object.keys(BIRTH_GUIDE_SOURCES).map((state) => ({
      url: `${SITE_URL}/guides/${state}/birth-certificate`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
