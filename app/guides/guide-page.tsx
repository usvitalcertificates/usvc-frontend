import { ChevronRight } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { FaqAccordion } from "@/app/faq/faq-accordion";
import { faqAnswerToPlainText } from "@/app/faq/faq-data";
import { SeoJsonLd } from "@/app/seo-json-ld";
import { PageHeader } from "@/app/usvc-ui";
import { ORGANIZATION_ID, SITEMAP_GUIDES_LAST_MODIFIED, SITE_URL, socialMetadata } from "@/lib/seo";
import type { BirthGuideContent } from "./[state]/birth-certificate/guide-types";

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

export function GuidePage({
  state,
  certificate = "birth-certificate",
  content,
}: {
  state: string;
  certificate?: string;
  content: BirthGuideContent;
}) {
  const recordType = certificate.replace("-certificate", "");
  const displayType = recordType.charAt(0).toUpperCase() + recordType.slice(1);
  const url = `${SITE_URL}/guides/${state}/${certificate}`;
  const orderUrl = recordType === "birth" ? `/state/${state}/order/${certificate}` : "/contact";
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
        author: { "@id": ORGANIZATION_ID },
        publisher: { "@id": ORGANIZATION_ID },
        about: { "@type": "Thing", name: `${content.stateName} ${recordType} certificates` },
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
            name: `${content.stateName} ${recordType} certificate guide`,
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
            <span aria-current="page">
              {content.stateName} {recordType} certificate guide
            </span>
          </li>
        </ol>
      </nav>
      <PageHeader
        eyebrow="Official-resource guide"
        title={`How to Get a ${content.stateName} ${displayType} Certificate`}
        subtitle={content.subtitle}
      />
      <section className="page-section">
        <div className="container guide-layout">
          <div className="guide-summary">
            <p className="eyebrow">The short answer</p>
            <h2>
              {content.stateName} {recordType} certificate requests, simplified
            </h2>
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
                <p>
                  {recordType === "birth"
                    ? "Use the guided form and let USVC review your details before filing."
                    : "Confirm the record type and service with our team before starting."}
                </p>
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
            <h2>
              {content.stateName} {recordType}-certificate questions, answered
            </h2>
            <FaqAccordion items={content.faqs} />
          </section>

          <div className="guide-cta guide-cta-final">
            <div>
              <h2>Start Your {content.stateName} Request</h2>
              <p>
                {recordType === "birth"
                  ? "Finish the guided request in about 10 minutes. Agency fees and shipping are separate."
                  : "Ask about the specific document you need. You can also request it directly from the official office linked below."}
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
            <p className="guide-related">
              Read our{" "}
              <Link className="guide-link" href="/editorial">
                editorial policy
              </Link>{" "}
              for sourcing, review, and corrections.
            </p>
          </div>

          <nav className="guide-related" aria-label="Other guides for this state">
            <h2>More {content.stateName} record guides</h2>
            <ul className="guide-link-list">
              {["birth", "death", "marriage", "divorce"]
                .filter((type) => type !== recordType)
                .map((type) => (
                  <li key={type}>
                    <Link className="guide-link" href={`/guides/${state}/${type}-certificate`}>
                      {content.stateName} {type} certificate guide
                    </Link>
                  </li>
                ))}
            </ul>
          </nav>
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
