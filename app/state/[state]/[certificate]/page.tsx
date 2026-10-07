import { notFound, permanentRedirect } from "next/navigation";

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
 * Invalid slugs still 404. State validity + VT/WY notices are handled
 * by the canonical /order/ page.
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
  if (!VALID_CERTIFICATES.has(certificate)) notFound();
  permanentRedirect(`/state/${state}/order/${certificate}`);
}
