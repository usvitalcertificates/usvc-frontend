import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SeoJsonLd } from "@/app/seo-json-ld";
import {
  assertSeoLength,
  ALL_STATE_SLUGS,
  CERTIFICATE_DETAILS,
  CERTIFICATE_SLUGS,
  isKnownStateSlug,
  SITE_URL,
  socialMetadata,
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

/** Prerender every order page, including VT/WY notice variants, so
 *  customers get static HTML without waiting on a dynamic render. */
export async function generateStaticParams() {
  return ALL_STATE_SLUGS.flatMap((state) =>
    CERTIFICATE_SLUGS.map((certificate) => ({ state, certificate })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ state: string; certificate: string }>;
}): Promise<Metadata> {
  const { state, certificate } = await params;
  if (!labels[certificate] || !isKnownStateSlug(state)) return {};
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
  // Order pages are transactional templates. Keep them crawlable for
  // customers and link equity, but out of the search index.
  const robots = { index: false, follow: true } as const;
  if (isStateUnsupported(state)) {
    return {
      title,
      description,
      robots,
      alternates: { canonical: url },
      ...socialMetadata({ title, description, url }),
    };
  }
  return {
    title,
    description,
    robots,
    alternates: {
      canonical: url,
    },
    ...socialMetadata({ title, description, url }),
  };
}

export default async function CertificateOrderPage({
  params,
}: {
  params: Promise<{ state: string; certificate: string }>;
}) {
  const { state, certificate } = await params;
  const type = labels[certificate];
  if (!type || !isKnownStateSlug(state)) notFound();
  const details = CERTIFICATE_DETAILS[certificate];
  const stateName = titleCase(state);
  const url = `${SITE_URL}/state/${state}/order/${certificate}`;
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
