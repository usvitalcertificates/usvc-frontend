import { BIRTH_GUIDE_SOURCES, SITE_URL } from "@/lib/seo";

export const dynamic = "force-static";

/** Optional public-resource directory; never includes application or customer data. */
export function GET() {
  const guides = Object.entries(BIRTH_GUIDE_SOURCES)
    .map(
      ([slug, guide]) =>
        `- [${guide.state} birth-certificate guide](${SITE_URL}/guides/${slug}/birth-certificate): An introductory guide with a link to the official issuing agency.`,
    )
    .join("\n");
  const text = `# US Vital Certificates (USVC)

> USVC is an independent application assistance service for US birth, death, marriage and divorce certificate requests. It is not a government agency and is not affiliated with or endorsed by a federal or state office.

USVC provides guided online requests, application review and processing support. Government agencies control eligibility, official fees, record issuance and processing times. USVC service charges are separate from government and shipping charges. Records may be requested directly from the issuing agency, potentially at a lower cost. Current availability is shown in the state directory.

## Service information

- [Home](${SITE_URL}): Overview of the independent service and ordering process.
- [Certificate types](${SITE_URL}/certificates): Birth, death, marriage and divorce certificate assistance.
- [State directory](${SITE_URL}/find-your-state): Available jurisdictions and links to public state pages.
- [Frequently asked questions](${SITE_URL}/faq): Service fees, eligibility, processing, shipping and refunds.
- [Contact support](${SITE_URL}/contact): Public support contact page.

## Official-resource birth guides

${guides}

## Policies

- [Terms of service](${SITE_URL}/terms-of-service): Service terms, fees and cancellation policies.
- [Privacy policy](${SITE_URL}/privacy-policy): Information handling and privacy practices.
- [Accessibility](${SITE_URL}/accessibility): Accessibility information.

## Optional

- [Sitemap](${SITE_URL}/sitemap.xml): Canonical public page inventory.
- [Robots](${SITE_URL}/robots.txt): Crawler access rules.
`;
  return new Response(text, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
