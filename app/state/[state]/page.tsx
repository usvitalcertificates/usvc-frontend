import type { Metadata } from "next";
import { Check, ChevronRight, Lock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SeoJsonLd } from "@/app/seo-json-ld";
import {
  assertSeoLength,
  BIRTH_GUIDE_SOURCES,
  CERTIFICATE_DETAILS,
  SITE_URL,
  socialMetadata,
} from "@/lib/seo";
import { isStateUnsupported, STATE_UNAVAILABLE_MESSAGE } from "@/lib/state-availability";
import { STATES } from "@/lib/states";
import { PageHeader } from "../../usvc-ui";

const CERTIFICATES = [
  {
    slug: "birth-certificate",
    name: "Birth Certificate",
    short: "birth",
  },
  {
    slug: "death-certificate",
    name: "Death Certificate",
    short: "death",
  },
  {
    slug: "marriage-certificate",
    name: "Marriage Certificate",
    short: "marriage",
  },
  {
    slug: "divorce-certificate",
    name: "Divorce Certificate",
    short: "divorce",
  },
] as const;

const INSTRUCTIONS =
  "Complete the guided application and USVC will review your submitted information before it is forwarded for processing.";
const ELIGIBILITY =
  "Eligibility to receive a certified record is determined by the issuing agency and may be limited to the person named on the record or specific qualifying relatives and representatives.";

/** Prerender all 52 state hubs (P0 SEO) so crawlers get static HTML
 *  instead of relying on the JS StateSelector grid. VT/WY prerender
 *  with noindex via generateMetadata. */
export async function generateStaticParams() {
  return STATES.map(({ slug }) => ({ state: slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ state: string }>;
}): Promise<Metadata> {
  const { state } = await params;
  const found = STATES.find(({ slug }) => slug === state);
  if (!found) return {};
  const name = found.name;
  const title = assertSeoLength(
    "title",
    `${name} Vital Records: birth, death, marriage, divorce help`,
  );
  const description = assertSeoLength(
    "description",
    `${name} birth, death, marriage, divorce guide: eligibility, fees, and how to request with USVC help.`,
  );
  const unavailable = isStateUnsupported(state);
  return {
    title,
    description,
    ...(unavailable ? { robots: { index: false, follow: true } as const } : {}),
    alternates: { canonical: `https://usvitalcertificates.org/state/${state}` },
    ...socialMetadata({
      title,
      description,
      url: `https://usvitalcertificates.org/state/${state}`,
      type: "website",
    }),
  };
}

export default async function StatePage({ params }: { params: Promise<{ state: string }> }) {
  const { state } = await params;
  const found = STATES.find(({ slug }) => slug === state);
  if (!found) notFound();
  const name = found.name;
  const unavailable = isStateUnsupported(state);
  const guide = BIRTH_GUIDE_SOURCES[state];
  const url = `${SITE_URL}/state/${state}`;
  const certUses = CERTIFICATES.map((cert) => CERTIFICATE_DETAILS[cert.slug].uses);
  const faqs = [
    {
      q: `How do I request a ${name} vital record with USVC?`,
      a: `Choose one of the four certificate types above, complete the guided ${name} application (most people finish in about 10 minutes), and submit payment. We review your information for missing details, file it with the issuing agency, and you track the request online.`,
    },
    {
      q: `How much does a ${name} request cost through USVC?`,
      a: "The order form shows the current USVC online processing fee before you pay. Agency fees are charged separately upon review and acceptance by the state agency and will appear separately.",
    },
    {
      q: `Who can receive a certified ${name} record?`,
      a: "The issuing agency decides eligibility, usually the person named on the record or specific qualifying relatives and representatives. Confirm your eligibility with the official agency resource before you apply.",
    },
    {
      q: "Do I need to visit an office in person?",
      a: "No. There is no walk-in service and no office visit needed. You order online with USVC and track the request.",
    },
  ];
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
          { "@type": "ListItem", position: 3, name: name, item: url },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.q,
          acceptedAnswer: { "@type": "Answer", text: faq.a },
        })),
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
            <ChevronRight aria-hidden="true" />
          </li>
          <li>
            <Link href="/find-your-state">Find Your State</Link>
            <ChevronRight aria-hidden="true" />
          </li>
          <li>
            <span aria-current="page">{name}</span>
          </li>
        </ol>
      </nav>

      <PageHeader
        eyebrow="Available Certificates"
        title={`Your ${name} Vital Records Request, Simplified.`}
        subtitle={`Request assistance with your ${name} birth, death, marriage, or divorce certificate application.`}
      />
      <section className="page-section">
        <div className="container">
          <p className="state-intro">
            {name} vital records, including birth, death, marriage, and divorce certificates, are
            issued under {name === "District of Columbia" ? "District" : "state"} rules, so the
            agency holding your record depends on where the event happened, not where you live now.
            Below you can start a guided {name} request for any of the four record types with USVC
            review and online tracking.
          </p>
          {guide ? (
            <p className="state-guide-callout">
              Need the detailed process? Read the{" "}
              <Link className="guide-link" href={`/guides/${state}/birth-certificate`}>
                {name} birth certificate guide
              </Link>
              .
            </p>
          ) : null}
          {unavailable ? (
            <p className="notice" role="status">
              {STATE_UNAVAILABLE_MESSAGE} See{" "}
              <Link href="/find-your-state">all available states</Link>.
            </p>
          ) : null}
          <div className="certificate-type-grid">
            {CERTIFICATES.map((cert) => (
              <article key={cert.slug} className="certificate-type-card">
                <h2>
                  {name} {cert.name}
                </h2>
                <div className="patriotic-rule" aria-hidden="true" />
                <p className="certificate-support-intro">
                  Request your official {name} {cert.name} in less than 10 minutes.
                </p>
                <ul className="certificate-support-points">
                  <li>Full-Service Support from Start to Finish</li>
                  <li>100% Protected and Secure</li>
                </ul>
                {unavailable ? (
                  <button
                    type="button"
                    className="button button-primary"
                    disabled
                    aria-disabled="true"
                  >
                    Not available yet
                  </button>
                ) : (
                  <Link
                    href={`/state/${state}/order/${cert.slug}`}
                    className="button button-primary"
                  >
                    Start This Request
                  </Link>
                )}
              </article>
            ))}
          </div>

          <div className="state-benefits">
            <ul className="assurance-list">
              <li>
                <Check aria-hidden="true" /> Secure online ordering
              </li>
              <li>
                <Check aria-hidden="true" /> Expert application review
              </li>
              <li>
                <Check aria-hidden="true" /> Filed with the state agency
              </li>
              <li>
                <Check aria-hidden="true" /> Track your order online
              </li>
            </ul>
            <p className="state-help">
              Ordering from a different state?{" "}
              <Link className="howto-link" href="/find-your-state">
                Find your state
              </Link>
            </p>
            <p className="state-payment">
              <Lock aria-hidden="true" /> 256-bit SSL encrypted checkout{" "}
              <Image src="/assets/visa.svg" alt="Visa" width={44} height={28} />
              <Image src="/assets/mastercard.svg" alt="Mastercard" width={44} height={28} />
            </p>
          </div>

          <div className="info-grid">
            <section className="info-card">
              <h2>{name} instructions</h2>
              <p>{INSTRUCTIONS}</p>
            </section>
            <section className="info-card">
              <h2>Who may request a record</h2>
              <p>{ELIGIBILITY}</p>
            </section>
          </div>

          <div className="info-grid">
            <section className="info-card">
              <h2>What each {name} record is used for</h2>
              {certUses.map((uses) => (
                <p key={uses}>{uses}</p>
              ))}
            </section>
            <section className="info-card">
              <h2>{name} questions, answered</h2>
              {faqs.map((faq) => (
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
