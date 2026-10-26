import { GUIDE_INVENTORY } from "@/lib/guide-inventory";
import { SITE_URL } from "@/lib/seo";

export const dynamic = "force-static";

/** Optional public-resource directory; never includes application or customer data. */
export function GET() {
  const guides = GUIDE_INVENTORY.map(
    (guide) =>
      `- [${guide.stateName} ${guide.type}-certificate guide](${SITE_URL}${guide.path}): Official record offices, document choices and request preparation.`,
  ).join("\n");
  const text = `# US Vital Certificates (USVC)

> USVC is an independent application assistance service for US birth, death, marriage and divorce certificate requests. It is not a government agency and is not affiliated with or endorsed by a federal or state office.

USVC provides guided online requests, application review and processing support. Government agencies control eligibility, official fees, record issuance and processing times. USVC service charges are separate from government and shipping charges. Records may be requested directly from the issuing agency, potentially at a lower cost. Current availability is shown in the state directory.

## Service information

- [Home](${SITE_URL}): Overview of the independent service and ordering process.
- [Certificate types](${SITE_URL}/certificates): Birth, death, marriage and divorce certificate assistance.
- [State directory](${SITE_URL}/find-your-state): Available jurisdictions and links to public state pages.
- [Frequently asked questions](${SITE_URL}/faq): Service fees, eligibility, processing, shipping and refunds.
- [About USVC](${SITE_URL}/about): Who operates the service, what it does and does not do, and company contact details.
- [Editorial policy](${SITE_URL}/editorial): Source standards, review process, corrections and AI disclosure.
- [Contact support](${SITE_URL}/contact): Public support contact page.

## Official-resource vital-record guides

- [All certificate guides](${SITE_URL}/guides): Directory of state guides with links to official issuing agencies.

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
