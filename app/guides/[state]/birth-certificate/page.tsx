import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SeoJsonLd } from "@/app/seo-json-ld";
import { PageHeader } from "@/app/usvc-ui";
import { assertSeoLength, BIRTH_GUIDE_SOURCES, SITE_URL } from "@/lib/seo";

const CHECKED = "September 30, 2026";

/** Prerender the 10 pilot guides (P0 SEO) so they are static HTML,
 *  not dependent on sitemap-only discovery. */
export async function generateStaticParams() {
  return Object.keys(BIRTH_GUIDE_SOURCES).map((state) => ({ state }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ state: string }>;
}): Promise<Metadata> {
  const { state } = await params;
  const guide = BIRTH_GUIDE_SOURCES[state];
  if (!guide) return {};
  const title = assertSeoLength("title", `How to Get a ${guide.state} Birth Certificate`);
  const description = assertSeoLength(
    "description",
    `Official guidance plus USVC help for a ${guide.state} birth certificate request. Eligibility, fees, steps.`,
  );
  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/guides/${state}/birth-certificate` },
    openGraph: {
      title,
      description,
      type: "article",
    },
    twitter: { card: "summary_large_image" },
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
  const orderUrl = `/state/${state}/order/birth-certificate`;
  const faqs = [
    {
      q: `Where do I find the official ${guide.state} birth-certificate requirements?`,
      a: `On the issuing agency page linked above — it is the source of truth for current request options, required documentation, eligibility, fees, and processing information, all of which can change.`,
    },
    {
      q: "What information should I have ready before I start?",
      a: "Typically the subject's full name at birth, date and place of birth, and parents' names, plus your contact details and a deliverable shipping address. The agency page lists the exact documents it requires.",
    },
    {
      q: "How long does a request take?",
      a: "Our guided USVC form takes most people about 10 minutes. Agency processing and delivery times vary by state — confirm current times on the official agency page before you plan around a deadline.",
    },
    {
      q: "Can USVC file the request for me?",
      a: "Yes. USVC provides a guided online request flow, reviews your submitted information for completeness, files it with the agency, and helps you track the request process. We are an independent assistance service, not a government agency.",
    },
  ];
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
            A {guide.state} birth certificate is issued under the rules of the {guide.state} issuing
            agency — so the record you need is held where the birth happened, not necessarily where
            you live now. This guide explains how to check the current official requirements and how
            USVC can help you submit a complete request.
          </p>
          <h2>Start with the official {guide.state} resource</h2>
          <p>
            The official issuing-agency page explains its current request options, required
            documentation, eligibility, fees, and processing information. Those details can change
            without notice, so the agency page — not this guide — is the source of truth. Open it
            first and confirm which request path fits your situation before you gather documents or
            pay anything.
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
          <h2>How a {guide.state} request usually works</h2>
          <p>
            Most states follow the same broad pattern. First, confirm on the agency page whether you
            are eligible to receive the record — eligibility is set by the issuing agency and is
            often limited to the person named on the record or specific qualifying relatives and
            representatives. Second, gather the information the agency asks for: the subject&apos;s
            full name at birth, date and place of birth, and parents&apos; names, plus your own
            contact details and a deliverable shipping address. Third, submit the request through
            the channel the agency currently supports and keep your confirmation so you can track
            it.
          </p>
          <h2>What to have ready before you start</h2>
          <p>
            Having these details on hand makes the guided flow take most people about 10 minutes:
            the subject&apos;s full name at birth, date of birth, city or county of birth, and
            parents&apos; names; your relationship to the subject; and a shipping address where a
            certificate can be signed for if it ships by courier. If any detail is uncertain — a
            spelling, an exact date, a parent&apos;s name — check the agency&apos;s instructions for
            what it accepts before you submit, since corrections after filing can add delays.
          </p>
          <h2>How USVC can help</h2>
          <p>
            USVC is an independent document assistance service, not a government agency. We provide
            a guided online request flow in plain language, review submitted information for
            completeness and inconsistencies, file the request with the agency, and help you track
            the request process. Our online processing fee is $149.00 per copy; agency fees are
            charged separately upon review and acceptance by the state agency.
          </p>
          <p>
            <Link className="button button-primary" href={orderUrl}>
              Start your {guide.state} request
            </Link>
          </p>
          <p>
            Prefer to compare record types first? See{" "}
            <Link className="howto-link" href={`/state/${state}`}>
              all {guide.state} vital-record options
            </Link>{" "}
            or browse{" "}
            <Link className="howto-link" href="/certificates">
              certificate types
            </Link>
            .
          </p>
          <h2>Before you begin</h2>
          <p>
            Review the official agency instructions, gather the information requested by the agency,
            and use the agency resource for current requirements or questions about your
            eligibility. If you are ordering for someone else, confirm you qualify to receive their
            record — agencies enforce this strictly.
          </p>
          <h2>{guide.state} birth-certificate questions, answered</h2>
          {faqs.map((faq) => (
            <div key={faq.q}>
              <h3>{faq.q}</h3>
              <p>{faq.a}</p>
            </div>
          ))}
          <p className="legal-updated">
            Official source checked: {CHECKED}. Requirements are controlled by the issuing agency
            and may change.
          </p>
        </div>
      </section>
    </main>
  );
}
