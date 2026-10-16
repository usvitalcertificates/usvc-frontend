import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SeoJsonLd } from "@/app/seo-json-ld";
import {
  assertSeoLength,
  BIRTH_GUIDE_SOURCES,
  CERTIFICATE_DETAILS,
  CERTIFICATE_SLUGS,
  INDEXABLE_STATES,
  SITE_URL,
  titleCase,
} from "@/lib/seo";
import { isStateUnsupported, STATE_UNAVAILABLE_MESSAGE } from "@/lib/state-availability";
import { OrderForm } from "../../[certificate]/order-form";
import { PageHeader } from "../../../../usvc-ui";

const labels: Record<string, string> = {
  "birth-certificate": "Birth",
  "death-certificate": "Death",
  "marriage-certificate": "Marriage",
  "divorce-certificate": "Divorce",
};

/** Prerender all indexable order pages + VT/WY notice variants (P0 SEO)
 *  so Google gets static HTML for the 200-URL cluster. */
export async function generateStaticParams() {
  const states = [...INDEXABLE_STATES, "vermont", "wyoming"];
  return states.flatMap((state) =>
    CERTIFICATE_SLUGS.map((certificate) => ({ state, certificate })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ state: string; certificate: string }>;
}): Promise<Metadata> {
  const { state, certificate } = await params;
  if (!labels[certificate]) return {};
  const name = titleCase(state);
  const type = certificate
    .replace("-certificate", "")
    .replace(/^./, (letter) => letter.toUpperCase());
  const title = assertSeoLength("title", `${name} ${type} Certificate Application`);
  const description = assertSeoLength(
    "description",
    `Start a guided ${name} ${type.toLowerCase()} certificate request with USVC review and tracking.`,
  );
  const url = `https://usvitalcertificates.org/state/${state}/order/${certificate}`;
  // VT/WY render an unavailable notice, never a form: keep crawlable
  // for users but out of the index (matches state-hub behavior).
  if (isStateUnsupported(state)) {
    return {
      title,
      description,
      robots: { index: false, follow: true },
      alternates: { canonical: url },
      openGraph: { title, description, url, type: "website" },
      twitter: { card: "summary_large_image" },
    };
  }
  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: { title, description, url, type: "website" },
    twitter: { card: "summary_large_image" },
  };
}

export default async function CertificateOrderPage({
  params,
}: {
  params: Promise<{ state: string; certificate: string }>;
}) {
  const { state, certificate } = await params;
  const type = labels[certificate];
  if (!type) notFound();
  const details = CERTIFICATE_DETAILS[certificate];
  const stateName = titleCase(state);
  const url = `${SITE_URL}/state/${state}/order/${certificate}`;
  const guideUrl =
    certificate === "birth-certificate" && BIRTH_GUIDE_SOURCES[state]
      ? `/guides/${state}/birth-certificate`
      : null;
  const ld = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          {
            "@type": "ListItem",
            position: 2,
            name: "Find Your State",
            item: `${SITE_URL}/find-your-state`,
          },
          { "@type": "ListItem", position: 3, name: stateName, item: `${SITE_URL}/state/${state}` },
          {
            "@type": "ListItem",
            position: 4,
            name: `${stateName} ${type} Certificate Application`,
            item: url,
          },
        ],
      },
      {
        "@type": "HowTo",
        name: `${stateName} ${type} Certificate Application`,
        description: `Guided ${stateName.toLowerCase()} ${type.toLowerCase()} certificate request with USVC review and tracking.`,
        totalTime: "PT10M",
        step: [
          {
            "@type": "HowToStep",
            position: 1,
            name: "Confirm state and record type",
            text: `Confirm the event happened in ${stateName} and you need a ${type.toLowerCase()} certificate.`,
          },
          {
            "@type": "HowToStep",
            position: 2,
            name: "Answer the guided questions",
            text: "Most people finish in about 10 minutes using plain-language prompts.",
          },
          {
            "@type": "HowToStep",
            position: 3,
            name: "Review and submit",
            text: "USVC reviews your information for missing details, then files it with the issuing agency.",
          },
          {
            "@type": "HowToStep",
            position: 4,
            name: "Track your request",
            text: "Follow progress online with your order number.",
          },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: details.faq.map((faq) => ({
          "@type": "Question",
          name: faq.q,
          acceptedAnswer: { "@type": "Answer", text: faq.a },
        })),
      },
    ],
  };
  if (isStateUnsupported(state)) {
    return (
      <main>
        <PageHeader
          eyebrow={`${stateName} · ${type} Certificate`}
          title={`${stateName} ${type} Certificate Application`}
          subtitle="Check availability for this state."
        />
        <section className="page-section">
          <div className="container">
            <p className="notice" role="status">
              {STATE_UNAVAILABLE_MESSAGE} See{" "}
              <Link href="/find-your-state">all available states</Link>.
            </p>
          </div>
        </section>
      </main>
    );
  }
  return (
    <main>
      <SeoJsonLd value={ld} />
      <PageHeader
        eyebrow={`${stateName} · ${type} Certificate`}
        title={`${stateName} ${type} Certificate Application`}
        subtitle="Complete this application in one page, then submit payment."
      />
      <section className="page-section">
        <div className="container legal-body">
          <p>{details.uses}</p>
          <p>
            This guided {stateName} {type.toLowerCase()} request covers the details the issuing
            agency needs: {details.checklist.join("; ").toLowerCase()}. Our online processing fee is
            $149.00 per copy; agency fees are charged separately upon review and acceptance.{" "}
            <Link className="howto-link" href={`/state/${state}`}>
              Back to all {stateName} record options
            </Link>
            {guideUrl ? (
              <>
                {" "}
                or read the{" "}
                <Link className="howto-link" href={guideUrl}>
                  official {stateName} guide
                </Link>
              </>
            ) : null}
            .
          </p>
        </div>
      </section>
      <section className="application-page">
        <div className="application-container">
          <OrderForm stateCode={state} certificate={certificate} />
        </div>
      </section>
      <section className="page-section">
        <div className="container">
          <div className="info-grid">
            <section className="info-card">
              <h2>Have on hand</h2>
              {details.checklist.map((item) => (
                <p key={item}>{item}</p>
              ))}
            </section>
            <section className="info-card">
              <h2>
                {stateName} {type.toLowerCase()} questions, answered
              </h2>
              {details.faq.map((faq) => (
                <div key={faq.q}>
                  <h3>{faq.q}</h3>
                  <p>{faq.a}</p>
                </div>
              ))}
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}
