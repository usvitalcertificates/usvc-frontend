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

const title = "Editorial Policy and Source Standards";
const description =
  "How USVC researches, reviews, updates, and corrects its state vital-record guides, including sourcing and AI disclosure.";

export const metadata: Metadata = {
  title: assertSeoLength("title", title),
  description: assertSeoLength("description", description),
  alternates: { canonical: `${SITE_URL}/editorial` },
  ...socialMetadata({
    title,
    description,
    url: `${SITE_URL}/editorial`,
    type: "website",
  }),
};

export default function EditorialPage() {
  const ld = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    description,
    url: `${SITE_URL}/editorial`,
    inLanguage: "en-US",
    dateModified: SITEMAP_STATIC_LAST_MODIFIED,
    publisher: { "@id": ORGANIZATION_ID },
    about: { "@type": "Thing", name: "Editorial standards for vital-record guides" },
  };

  return (
    <main>
      <SeoJsonLd value={ld} />
      <PageHeader
        eyebrow="Editorial standards"
        title={title}
        subtitle="How we decide what to publish, which sources we trust, and how we handle corrections."
      />
      <section className="page-section">
        <div className="container">
          <div className="legal-body legal-soft">
            <p className="legal-updated">Last reviewed: 10/22/2026</p>

            <div className="legal-section">
              <h2>Our purpose</h2>
              <p>
                USVC publishes plain-language guides to help people understand how to request birth
                certificates from state vital-records agencies. The guides are free to read. They
                are separate from the paid application assistance service and are written to explain
                the official process, not to promise an outcome.
              </p>
            </div>

            <div className="legal-section">
              <h2>What our guides cover</h2>
              <p>
                Each guide explains who may request a record, what information and identification
                may be required, the available filing paths, how corrections and adoption records
                work, and where to find official forms. We also explain when a rule is controlled by
                a state agency, a county office, or a local health department.
              </p>
              <p>
                Our current guides cover birth certificates in 13 states. We add a state only after
                reviewing the issuing agency&apos;s published requirements.
              </p>
            </div>

            <div className="legal-section">
              <h2>Source standards</h2>
              <p>
                We prefer primary sources: the state health department, the state vital-records
                office, the county or local office that issues the record, official application
                forms, and published statutes or regulations. Every guide links to the official
                source pages used for its factual claims.
              </p>
              <p>
                We do not use forums, social posts, competitor pages, or AI-generated summaries as
                sources for a requirement. If an official page is unclear or conflicts with another
                official page, we say so and direct the reader to the issuing agency for a final
                answer.
              </p>
            </div>

            <div className="legal-section">
              <h2>How a guide is created and reviewed</h2>
              <p className="legal-bullet">
                • We identify the agency that controls the record and collect its current published
                guidance.
              </p>
              <p className="legal-bullet">
                • We draft the guide in plain language and attach a source to each factual claim.
              </p>
              <p className="legal-bullet">
                • A USVC reviewer checks the draft against the cited official source before
                publication.
              </p>
              <p className="legal-bullet">
                • We publish the source-checked date and update it when we recheck the guide.
              </p>
              <p>
                Guides are published under the USVC organization byline. We do not invent individual
                authors, credentials, review counts, or agency endorsements.
              </p>
            </div>

            <div className="legal-section">
              <h2>Fees, processing times, and eligibility</h2>
              <p>
                Government agencies control their own fees, eligibility rules, and processing times.
                We do not publish a state fee or processing time unless the issuing agency provides
                a clear, current figure. When a figure is not published, the guide tells you to
                confirm it with the agency.
              </p>
              <p>
                The USVC service fee is shown in the order form before payment. Agency fees and
                shipping are separate. A guide never replaces the agency&apos;s own instructions or
                a legal or genealogical professional&apos;s advice.
              </p>
            </div>

            <div className="legal-section">
              <h2>Updates and corrections</h2>
              <p>
                We recheck guides when an agency announces a change and on a periodic review
                schedule. The source-checked date on each guide shows the last review; it is not a
                guarantee that an agency will not change a rule afterward.
              </p>
              <p>
                If you find an error, email{" "}
                <a href="mailto:support@usvitalcertificates.org">support@usvitalcertificates.org</a>{" "}
                with the page URL, the sentence at issue, and an official source if you have one. We
                review the report and, when warranted, update the page and its source-checked date.
              </p>
            </div>

            <div className="legal-section">
              <h2>Independence and commercial relationships</h2>
              <p>
                Official sources are listed because they are the agency that controls the record or
                the agency&apos;s published guidance, not because of a commercial relationship. We
                do not sell placements in our guides. USVC earns its service fee only when a
                customer chooses to use the paid application assistance service.
              </p>
            </div>

            <div className="legal-section">
              <h2>AI and automation disclosure</h2>
              <p>
                We may use AI-assisted tools for outlining, drafting, and plain-language editing. We
                do not treat AI output as a source. Official sources control the facts, and a USVC
                reviewer checks each guide against those sources before publication. If you see
                something that does not match the official source, tell us and we will review it.
              </p>
            </div>

            <div className="legal-section">
              <h2>Questions</h2>
              <p>
                Read more{" "}
                <Link className="guide-link" href="/about">
                  about USVC
                </Link>
                , browse the{" "}
                <Link className="guide-link" href="/guides">
                  birth-certificate guides
                </Link>
                , or{" "}
                <Link className="guide-link" href="/contact">
                  contact support
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
