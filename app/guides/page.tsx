import { GUIDE_INVENTORY, GUIDE_CERTIFICATES } from "@/lib/guide-inventory";
import type { Metadata } from "next";
import Link from "next/link";
import { SeoJsonLd } from "@/app/seo-json-ld";
import { PageHeader } from "@/app/usvc-ui";
import { assertSeoLength, BIRTH_GUIDE_SOURCES, SITE_URL, socialMetadata } from "@/lib/seo";

const title = "Vital Record Guides by State and Certificate Type";
const description =
  "Birth, death, marriage and divorce guides for 13 states. Find the right record, official office, request steps and source links.";

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
      itemListElement: GUIDE_INVENTORY.map((guide, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: `${guide.stateName} ${guide.type} Certificate Guide`,
        url: `${SITE_URL}${guide.path}`,
      })),
    },
  };

  return (
    <main>
      <SeoJsonLd value={ld} />
      <PageHeader
        eyebrow="Official-resource guides"
        title={title}
        subtitle="Explore 52 guides covering birth, death, marriage and divorce records in the same 13 states."
      />
      <section className="page-section">
        <div className="container">
          <p className="state-intro">
            These guides summarize official state resources. Requirements can change, so each guide
            links to the issuing agency and shows when its sources were checked. Start with the
            state where the event was recorded.
          </p>
          <div className="certificate-type-grid">
            {GUIDE_CERTIFICATES.map((type) => (
              <article className="certificate-type-card" key={type} id={`${type}-guides`}>
                <h2>{type.charAt(0).toUpperCase() + type.slice(1)} Certificate Guides</h2>
                <div className="patriotic-rule" aria-hidden="true" />
                <p className="certificate-support-intro">
                  Choose your state for official {type}-record offices, document choices and request
                  instructions.
                </p>
                <ul className="guide-link-list">
                  {guides.map(([slug, guide]) => (
                    <li key={slug}>
                      <Link className="guide-link" href={`/guides/${slug}/${type}-certificate`}>
                        {guide.state} {type} certificate guide
                      </Link>
                    </li>
                  ))}
                </ul>
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
