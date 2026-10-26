import type { Metadata } from "next";
import { assertSeoLength, SITE_URL, socialMetadata } from "@/lib/seo";
import type { BirthGuideContent } from "./[state]/birth-certificate/guide-types";
export function guideMetadata(
  state: string,
  certificate: string,
  content: BirthGuideContent,
): Metadata {
  const title = assertSeoLength("title", content.metaTitle);
  const description = assertSeoLength("description", content.metaDescription);
  const url = `${SITE_URL}/guides/${state}/${certificate}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    ...socialMetadata({ title, description, url, type: "article" }),
  };
}
