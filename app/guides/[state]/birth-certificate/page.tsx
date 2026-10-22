import type { Metadata } from "next";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { FaqAccordion } from "@/app/faq/faq-accordion";
import { faqAnswerToPlainText } from "@/app/faq/faq-data";
import { SeoJsonLd } from "@/app/seo-json-ld";
import { PageHeader } from "@/app/usvc-ui";
import {
  assertSeoLength,
  BIRTH_GUIDE_SOURCES,
  SITEMAP_GUIDES_LAST_MODIFIED,
  SITE_URL,
  socialMetadata,
} from "@/lib/seo";
import { getBirthGuideContent } from "./guide-content";

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
  const content = getBirthGuideContent(state, guide.state, guide.url);
  const title = assertSeoLength("title", content.metaTitle);
  const description = assertSeoLength("description", content.metaDescription);
  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/guides/${state}/birth-certificate` },
    ...socialMetadata({
      title,
      description,
      url: `${SITE_URL}/guides/${state}/birth-certificate`,
      type: "article",
    }),
  };
}

const LINK_RE = /\[([^\]]+)\]\(([^)]+)\)/g;

function GuideLink({ href, children }: { href: string; children: ReactNode }) {
  if (href.startsWith("/")) {
    return (
      <Link className="guide-link" href={href}>
        {children}
      </Link>
    );
  }
  return (
    <a className="guide-link" href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}

function renderInline(text: string, keyPrefix: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  const re = new RegExp(LINK_RE);
  while ((match = re.exec(text)) !== null) {
    if (match.index > lastIndex) nodes.push(text.slice(lastIndex, match.index));
    const label = match[1] ?? "";
    const href = match[2] ?? "#";
    nodes.push(
      <GuideLink key={`${keyPrefix}-l${match.index}`} href={href}>
        {label}
      </GuideLink>,
    );
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) nodes.push(text.slice(lastIndex));
  return nodes;
}

export default async function BirthCertificateGuide({
  params,
}: {
  params: Promise<{ state: string }>;
}) {
  const { state } = await params;
  const guide = BIRTH_GUIDE_SOURCES[state];
  if (!guide) notFound();
  const content = getBirthGuideContent(state, guide.state, guide.url);
  const url = `${SITE_URL}/guides/${state}/birth-certificate`;
  const orderUrl = `/state/${state}/order/birth-certificate`;
  const ld = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: content.metaTitle,
        description: content.metaDescription,
        mainEntityOfPage: url,
        dateModified: SITEMAP_GUIDES_LAST_MODIFIED,
        inLanguage: "en-US",
        author: { "@type": "Organization", name: "US Vital Certificates", url: SITE_URL },
        publisher: {
          "@type": "Organization",
          name: "US Vital Certificates",
          url: SITE_URL,
          logo: { "@type": "ImageObject", url: `${SITE_URL}/assets/usvc-logo.webp` },
        },
        about: { "@type": "Thing", name: `${content.stateName} birth certificates` },
        citation: content.sources.map((source) => source.href),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          {
            "@type": "ListItem",
            position: 2,
            name: `${content.stateName} vital records`,
            item: `${SITE_URL}/state/${state}`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: `${content.stateName} birth certificate guide`,
            item: url,
          },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: content.faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faqAnswerToPlainText(faq.answer) },
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
            <Link href={`/state/${state}`}>{content.stateName} vital records</Link>
            <ChevronRight aria-hidden="true" />
          </li>
          <li>
            <span aria-current="page">{content.stateName} birth certificate guide</span>
          </li>
        </ol>
      </nav>
      <PageHeader
        eyebrow="Official-resource guide"
        title={`How to Get a ${content.stateName} Birth Certificate`}
        subtitle={content.subtitle}
      />
      <section className="page-section">
        <div className="container guide-layout">
          <div className="guide-summary">
            <p className="eyebrow">The short answer</p>
            <h2>{content.stateName} birth certificate requests, simplified</h2>
            {content.intro.map((paragraph, index) => (
              <p key={`intro-${index}`}>{paragraph}</p>
            ))}
            <dl className="guide-facts">
              {content.quickFacts.map((fact) => (
                <div key={fact.label}>
                  <dt>{fact.label}</dt>
                  <dd>{fact.value}</dd>
                </div>
              ))}
            </dl>
            <div className="guide-cta">
              <div>
                <h3>Ready to start your {content.stateName} request?</h3>
                <p>Use the guided form and let USVC review your details before filing.</p>
              </div>
              <Link className="button button-primary" href={orderUrl}>
                {content.ctaLabel}
              </Link>
            </div>
            <p className="guide-cta-note">{content.ctaNote}</p>
          </div>

          {content.sections.map((section) => (
            <section key={section.id} className="guide-section" id={section.id}>
              <h2>{section.heading}</h2>
              {section.paragraphs?.map((paragraph, index) => (
                <p key={`${section.id}-p${index}`}>
                  {renderInline(paragraph, `${section.id}-p${index}`)}
                </p>
              ))}
              {section.bullets ? (
                <ul>
                  {section.bullets.map((bullet, index) => (
                    <li key={`${section.id}-b${index}`}>
                      {renderInline(bullet, `${section.id}-b${index}`)}
                    </li>
                  ))}
                </ul>
              ) : null}
              {section.note ? <p className="guide-note">{section.note}</p> : null}
              {section.links ? (
                <ul className="guide-link-list">
                  {section.links.map((link) => (
                    <li key={link.href}>
                      <GuideLink href={link.href}>{link.label}</GuideLink>
                    </li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}

          <section className="guide-section guide-faq-section">
            <h2>{content.stateName} birth-certificate questions, answered</h2>
            <FaqAccordion items={content.faqs} />
          </section>

          <div className="guide-cta guide-cta-final">
            <div>
              <h2>Start Your {content.stateName} Request</h2>
              <p>
                Finish the guided request in about 10 minutes. Agency fees and shipping are
                separate.
              </p>
            </div>
            <Link className="button button-primary" href={orderUrl}>
              {content.ctaLabel}
            </Link>
          </div>

          <div className="guide-sources">
            <h2>Official sources</h2>
            <p>
              This guide summarizes official published information. Requirements are controlled by
              the issuing agency and may change.
            </p>
            <ul className="guide-link-list">
              {content.sources.map((source) => (
                <li key={source.href}>
                  <GuideLink href={source.href}>{source.label}</GuideLink>
                </li>
              ))}
            </ul>
            <p className="legal-updated">Official sources checked: {content.sourceChecked}.</p>
          </div>

          <p className="guide-related">
            Prefer to compare record types first? See{" "}
            <Link className="guide-link" href={`/state/${state}`}>
              all {content.stateName} vital-record options
            </Link>{" "}
            or browse{" "}
            <Link className="guide-link" href="/certificates">
              certificate types
            </Link>
            . Questions about our service?{" "}
            <Link className="guide-link" href="/faq">
              Read the FAQ
            </Link>{" "}
            or{" "}
            <Link className="guide-link" href="/contact">
              contact support
            </Link>
            .
          </p>
        </div>
      </section>
    </main>
  );
}
