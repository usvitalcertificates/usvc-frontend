import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // /order/confirmation/ and /track-order stay crawlable for ads/policy
        // review but carry noindex layouts, so customer receipts never index.
        disallow: ["/api/", "/auth", "/staff/"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
