import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SeoJsonLd } from "@/app/seo-json-ld";
import { Disclaimer, PageHeader } from "@/app/usvc-ui";
import { BIRTH_GUIDE_SOURCES, SITE_URL } from "@/lib/seo";

const CHECKED = "September 30, 2026";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ state: string }>;
}): Promise<Metadata> {
  const { state } = await params;
  const guide = BIRTH_GUIDE_SOURCES[state];
  if (!guide) return {};
  const title = `How to Get a ${guide.state} Birth Certificate`;
  return {
    title,
    description: `Official-resource guidance and USVC request help for a ${guide.state} birth certificate.`,
    alternates: { canonical: `${SITE_URL}/guides/${state}/birth-certificate` },
    openGraph: {
      title,
      description: `Official-resource guidance for requesting a ${guide.state} birth certificate.`,
      type: "article",
    },
  };
}

export default async function BirthCertificateGuide({
  params,
}: {
  params: Promise<{ state: string }>;
}) {
  const { state } = await params;
  const guide = BIRTH_GUIDE_SOURCES[state];
  if (!guide) notFound();
  const url = `${SITE_URL}/guides/${state}/birth-certificate`;
  const ld = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: `How to Get a ${guide.state} Birth Certificate`,
        mainEntityOfPage: url,
        dateModified: "2026-09-30",
        author: { "@type": "Organization", name: "US Vital Certificates" },
        about: { "@type": "Thing", name: `${guide.state} birth certificates` },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          {
            "@type": "ListItem",
            position: 2,
            name: `${guide.state} birth certificate guide`,
            item: url,
          },
        ],
      },
    ],
  };
  return (
    <main>
      <SeoJsonLd value={ld} />
      <nav aria-label="Breadcrumb" className="breadcrumbs">
        <ol>
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <span aria-current="page">{guide.state} birth certificate guide</span>
          </li>
        </ol>
      </nav>
      <PageHeader
        eyebrow="Official-resource guide"
        title={`How to Get a ${guide.state} Birth Certificate`}
        subtitle={`A starting point for understanding a ${guide.state} birth-certificate request and the official agency resource.`}
      />
      <section className="page-section">
        <div className="container legal-body">
          <p>
            A birth certificate request is handled under the rules of the issuing jurisdiction.
            Confirm current requirements directly with the official {guide.state} resource before
            you submit a request.
          </p>
          <h2>Start with the official {guide.state} resource</h2>
          <p>
            The official issuing-agency page explains its current request options, required
            documentation, eligibility, fees, and processing information. Those details can change,
            so the agency is the source of truth.
          </p>
          <p>
            <a
              className="button button-secondary"
              href={guide.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              Visit the official {guide.state} birth-records resource
            </a>
          </p>
          <h2>How USVC can help</h2>
          <p>
            USVC is an independent document assistance service, not a government agency. We provide
            a guided online request flow, review submitted information for completeness, and help
            you track the request process.
          </p>
          <p>
            <Link
              className="button button-primary"
              href={`/state/${state}/order/birth-certificate`}
            >
              Start your {guide.state} request
            </Link>
          </p>
          <h2>Before you begin</h2>
          <p>
            Review the official agency instructions, gather the information requested by the agency,
            and use the agency resource for current requirements or questions about your
            eligibility.
          </p>
          <p className="legal-updated">
            Official source checked: {CHECKED}. Requirements are controlled by the issuing agency
            and may change.
          </p>
          <Disclaimer className="page-disclaimer" />
        </div>
      </section>
    </main>
  );
}
