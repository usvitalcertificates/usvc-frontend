import type { Metadata } from "next";
import Link from "next/link";
import { SeoJsonLd } from "@/app/seo-json-ld";
import { PageHeader } from "@/app/usvc-ui";
import {
  assertSeoLength,
  ORGANIZATION_ID,
  SITE_URL,
  SITEMAP_STATIC_LAST_MODIFIED,
  socialMetadata,
} from "@/lib/seo";

const title = "About US Vital Certificates";
const description =
  "USVC is an independent application assistance service for US vital records. Learn what we do, how we help, and our limits.";

export const metadata: Metadata = {
  title: assertSeoLength("title", title),
  description: assertSeoLength("description", description),
  alternates: { canonical: `${SITE_URL}/about` },
  ...socialMetadata({
    title,
    description,
    url: `${SITE_URL}/about`,
    type: "website",
  }),
};

export default function AboutPage() {
  const ld = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: title,
    description,
    url: `${SITE_URL}/about`,
    inLanguage: "en-US",
    dateModified: SITEMAP_STATIC_LAST_MODIFIED,
    mainEntity: { "@id": ORGANIZATION_ID },
    publisher: { "@id": ORGANIZATION_ID },
  };

  return (
    <main>
      <SeoJsonLd value={ld} />
      <PageHeader
        eyebrow="About USVC"
        title={title}
        subtitle="An independent application assistance service for US birth, death, marriage, and divorce certificates."
      />
      <section className="page-section">
        <div className="container">
          <div className="legal-body legal-soft">
            <p className="legal-updated">Last reviewed: October 22, 2026</p>

            <div className="legal-section">
              <h2>Who we are</h2>
              <p>
                US Vital Certificates (USVC) is an application assistance service operated by US
                VITAL CERTIFICATES, LLC. We help people prepare and submit requests for official
                vital records from US government agencies.
              </p>
              <p>
                We are an independent service. We are not a government agency and are not affiliated
                with or endorsed by any federal, state, county, or municipal office. Official
                records may be available directly from the issuing agency, potentially at a lower
                cost.
              </p>
            </div>

            <div className="legal-section">
              <h2>What we do</h2>
              <p className="legal-bullet">
                • Guide you through the information an issuing agency asks for, using plain-language
                prompts.
              </p>
              <p className="legal-bullet">
                • Review your submitted details for missing information or inconsistencies before
                filing.
              </p>
              <p className="legal-bullet">
                • Submit the request through the appropriate agency process and provide online order
                tracking.
              </p>
              <p className="legal-bullet">
                • Answer support questions about an order that has already been placed with USVC.
              </p>
            </div>

            <div className="legal-section">
              <h2>What we do not do</h2>
              <p className="legal-bullet">
                • We do not issue birth, death, marriage, or divorce certificates.
              </p>
              <p className="legal-bullet">
                • We do not control agency eligibility rules, fees, processing times, or delivery.
              </p>
              <p className="legal-bullet">
                • We do not guarantee that an agency will approve a request or meet a particular
                date.
              </p>
              <p className="legal-bullet">
                • We do not provide legal advice or decide whether a record is legally sufficient
                for your purpose.
              </p>
            </div>

            <div className="legal-section">
              <h2>How the service works</h2>
              <p>
                You choose the state where the event occurred and the type of record you need. You
                complete the guided form, review your details, and submit payment for the USVC
                service. We then review the request for missing information and file it with the
                issuing agency.
              </p>
              <p>
                The agency controls whether to issue the record, how much its own fee is, and how
                long it takes. When the agency mails the record, it comes directly from that agency.
                You can track the USVC portion of the request online.
              </p>
            </div>

            <div className="legal-section">
              <h2>Fees and independence</h2>
              <p>
                The order form shows the current USVC service fee before you pay. Government agency
                fees and shipping charges are separate and are set by the agency or carrier. Our
                guides are free to read, and we do not sell placements in them.
              </p>
              <p>
                We publish state rules and official links to help you understand the process. We do
                not publish a state fee or processing time unless the issuing agency provides a
                clear, current figure. Agency requirements control.
              </p>
            </div>

            <div className="legal-section">
              <h2>Editorial standards</h2>
              <p>
                Our state guides summarize official agency pages and link to the source. Each guide
                shows when its sources were checked. We separate official requirements from the USVC
                service, correct errors when we find them, and do not invent authors, credentials,
                reviews, or agency relationships. Read our{" "}
                <Link className="guide-link" href="/editorial">
                  editorial policy
                </Link>
                .
              </p>
            </div>

            <div className="legal-section">
              <h2>Company and contact details</h2>
              <p>
                US VITAL CERTIFICATES, LLC
                <br />
                7345 W Sand Lake Rd Ste 210 Office 4464
                <br />
                Orlando, FL 32819
                <br />
                <em>Mailing and correspondence address</em>
              </p>
              <p>
                Email:{" "}
                <a href="mailto:support@usvitalcertificates.org">support@usvitalcertificates.org</a>
                <br />
                Phone: (201) 534-9279
              </p>
              <p>
                For help with an existing order, use{" "}
                <Link className="guide-link" href="/contact">
                  contact support
                </Link>
                . For general questions about the service, start with the{" "}
                <Link className="guide-link" href="/faq">
                  FAQ
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
