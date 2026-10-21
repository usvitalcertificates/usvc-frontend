import { notFound, permanentRedirect } from "next/navigation";
import { isKnownStateSlug } from "@/lib/seo";

const VALID_CERTIFICATES = new Set([
  "birth-certificate",
  "death-certificate",
  "marriage-certificate",
  "divorce-certificate",
]);

/**
 * Legacy route: /state/[state]/[certificate] permanently moved to
 * /state/[state]/order/[certificate].
 *
 * Previously served a 200 with noindex + canonical. A 308 tells Google
 * there is only one copy, clearing "Duplicate / Excluded by noindex".
 * Invalid certificate/state slugs 404 before redirecting. VT/WY notices
 * are handled by the canonical /order/ page.
 */
export async function generateMetadata() {
  return {};
}

export default async function CertificateLegacyRedirect({
  params,
}: {
  params: Promise<{ state: string; certificate: string }>;
}) {
  const { state, certificate } = await params;
  if (!VALID_CERTIFICATES.has(certificate) || !isKnownStateSlug(state)) notFound();
  permanentRedirect(`/state/${state}/order/${certificate}`);
}
