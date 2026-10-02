import type { Metadata } from "next";
import { assertSeoLength } from "@/lib/seo";
import Page from "../../[certificate]/page";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ state: string; certificate: string }>;
}): Promise<Metadata> {
  const { state, certificate } = await params;
  const name = state
    .split("-")
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join(" ");
  const type = certificate
    .replace("-certificate", "")
    .replace(/^./, (letter) => letter.toUpperCase());
  const title = assertSeoLength("title", `${name} ${type} Certificate Application`);
  const description = assertSeoLength(
    "description",
    `Start a guided ${name} ${type.toLowerCase()} certificate request with USVC review and tracking.`,
  );
  const url = `https://usvitalcertificates.org/state/${state}/order/${certificate}`;
  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: { title, description, url, type: "website" },
    twitter: { card: "summary_large_image" },
  };
}

export default Page;
