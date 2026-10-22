import type { Metadata } from "next";
import Link from "next/link";
import { SeoJsonLd } from "@/app/seo-json-ld";
import { PageHeader } from "@/app/usvc-ui";
import { assertSeoLength, BIRTH_GUIDE_SOURCES, SITE_URL, socialMetadata } from "@/lib/seo";

const title = "Birth Certificate Guides by State";
const description =
  "Step-by-step birth certificate guides for 13 states: eligibility, ID, online and mail filing, corrections, adoption records, and official sources.";

export const metadata: Metadata = {
  title: assertSeoLength("title", title),
  description: assertSeoLength("description", description),
  alternates: { canonical: `${SITE_URL}/guides` },
  ...socialMetadata({
    title,
    description,
    url: `${SITE_URL}/guides`,
    type: "website",
  }),
};

const guides = Object.entries(BIRTH_GUIDE_SOURCES).sort(([, a], [, b]) =>
  a.state.localeCompare(b.state),
);

export default function GuidesIndex() {
  const ld = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: title,
    description,
    url: `${SITE_URL}/guides`,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: guides.map(([slug, guide], index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: `${guide.state} Birth Certificate Guide`,
        url: `${SITE_URL}/guides/${slug}/birth-certificate`,
      })),
    },
  };

  return (
    <main>
      <SeoJsonLd value={ld} />
      <PageHeader
        eyebrow="Official-resource guides"
        title={title}
        subtitle="Understand who may request a birth certificate, what to prepare, where to file, and which official agency controls the record."
      />
      <section className="page-section">
        <div className="container">
          <p className="state-intro">
            These guides summarize official state resources. Requirements can change, so each guide
            links to the issuing agency and shows when its sources were checked. Start with the
            state where the birth occurred.
          </p>
          <div className="certificate-type-grid">
            {guides.map(([slug, guide]) => (
              <article className="certificate-type-card" key={slug}>
                <h2>{guide.state} Birth Certificates</h2>
                <div className="patriotic-rule" aria-hidden="true" />
                <p className="certificate-support-intro">
                  Eligibility, identification, filing options, corrections, adoption records, and
                  official sources for {guide.state}.
                </p>
                <Link
                  className="button button-secondary"
                  href={`/guides/${slug}/birth-certificate`}
                >
                  Read the {guide.state} guide
                </Link>
              </article>
            ))}
          </div>
          <p className="state-help">
            Need a different record type?{" "}
            <Link className="howto-link" href="/certificates">
              Compare certificate types
            </Link>{" "}
            or{" "}
            <Link className="howto-link" href="/find-your-state">
              find your state
            </Link>
            .
          </p>
        </div>
      </section>
    </main>
  );
}
