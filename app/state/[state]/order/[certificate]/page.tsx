import type { Metadata } from "next";
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
  return {
    title: `${name} ${type} Certificate Application`,
    description: `Start a guided ${name} ${type.toLowerCase()} certificate request with USVC.`,
    alternates: {
      canonical: `https://usvitalcertificates.org/state/${state}/order/${certificate}`,
    },
  };
}

export default Page;
