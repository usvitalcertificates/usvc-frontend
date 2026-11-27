import { ChevronRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { FaqAccordion } from "@/app/faq/faq-accordion";
import { faqAnswerToPlainText } from "@/app/faq/faq-data";
import { SeoJsonLd } from "@/app/seo-json-ld";
import { PageHeader } from "@/app/usvc-ui";
import {
  ORGANIZATION_ID,
  SITEMAP_TOPICS_LAST_MODIFIED,
  SITE_URL,
  assertSeoLength,
  socialMetadata,
} from "@/lib/seo";
import type { TopicGuide } from "./topic-guides";

function TopicLink({ href, label }: { href: string; label: string }) {
  return href.startsWith("/") ? (
    <Link className="guide-link" href={href}>
      {label}
    </Link>
  ) : (
    <a className="guide-link" href={href} target="_blank" rel="noopener noreferrer">
      {label}
    </a>
  );
}

export function topicMetadata(topic: TopicGuide): Metadata {
  const title = assertSeoLength("title", topic.metaTitle);
  const description = assertSeoLength("description", topic.metaDescription);
  const url = `${SITE_URL}/guides/${topic.slug}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    ...socialMetadata({ title, description, url, type: "article" }),
  };
}

/** Cross-state topic guide; reuses the state-guide layout classes. */
export function TopicPage({ topic }: { topic: TopicGuide }) {
  const url = `${SITE_URL}/guides/${topic.slug}`;
  const ld = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: topic.h1,
        description: topic.metaDescription,
        mainEntityOfPage: url,
        dateModified: SITEMAP_TOPICS_LAST_MODIFIED,
        inLanguage: "en-US",
        author: { "@id": ORGANIZATION_ID },
        publisher: { "@id": ORGANIZATION_ID },
        citation: topic.sources.map((source) => source.href),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Guides", item: `${SITE_URL}/guides` },
          { "@type": "ListItem", position: 3, name: topic.breadcrumb, item: url },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: topic.faqs.map((faq) => ({
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
            <Link href="/guides">Guides</Link>
            <ChevronRight aria-hidden="true" />
          </li>
          <li>
            <span aria-current="page">{topic.breadcrumb}</span>
          </li>
        </ol>
      </nav>
      <PageHeader eyebrow="Vital records guide" title={topic.h1} subtitle={topic.subtitle} />
      <section className="page-section">
        <div className="container guide-layout">
          <div className="guide-summary">
            <p className="eyebrow">The short answer</p>
            {topic.intro.map((paragraph, index) => (
              <p key={`intro-${index}`}>{paragraph}</p>
            ))}
            <dl className="guide-facts">
              {topic.quickFacts.map((fact) => (
                <div key={fact.label}>
                  <dt>{fact.label}</dt>
                  <dd>{fact.value}</dd>
                </div>
              ))}
            </dl>
            <div className="guide-cta">
              <div>
                <h3>Ready to start a request?</h3>
                <p>Choose the state where the event happened to see available certificates.</p>
              </div>
              <Link className="button button-primary" href="/find-your-state">
                Find Your State
              </Link>
            </div>
          </div>

          {topic.sections.map((section) => (
            <section key={section.id} className="guide-section" id={section.id}>
              <h2>{section.heading}</h2>
              {section.paragraphs?.map((paragraph, index) => (
                <p key={`${section.id}-p${index}`}>{paragraph}</p>
              ))}
              {section.bullets ? (
                <ul>
                  {section.bullets.map((bullet, index) => (
                    <li key={`${section.id}-b${index}`}>{bullet}</li>
                  ))}
                </ul>
              ) : null}
              {section.note ? <p className="guide-note">{section.note}</p> : null}
              {section.links ? (
                <ul className="guide-link-list">
                  {section.links.map((link) => (
                    <li key={link.href}>
                      <TopicLink href={link.href} label={link.label} />
                    </li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}

          <section className="guide-section guide-faq-section">
            <h2>Common questions, answered</h2>
            <FaqAccordion items={topic.faqs} />
          </section>

          <div className="guide-sources">
            <h2>Official sources</h2>
            <p>
              This guide summarizes official published information. Requirements and fees are
              controlled by the issuing agency and may change.
            </p>
            <ul className="guide-link-list">
              {topic.sources.map((source) => (
                <li key={source.href}>
                  <TopicLink href={source.href} label={source.label} />
                </li>
              ))}
            </ul>
            <p className="legal-updated">Official sources checked: {topic.sourceChecked}.</p>
            <p className="guide-related">
              Read our{" "}
              <Link className="guide-link" href="/editorial">
                editorial policy
              </Link>{" "}
              for sourcing, review, and corrections.
            </p>
          </div>

          <nav className="guide-related" aria-label="Related guides">
            <h2>Related guides</h2>
            <ul className="guide-link-list">
              {topic.related.map((link) => (
                <li key={link.href}>
                  <TopicLink href={link.href} label={link.label} />
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </section>
    </main>
  );
}
