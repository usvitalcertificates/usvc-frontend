import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "../usvc-ui";
import { FaqAccordion } from "./faq-accordion";
import { FAQ_ITEMS, faqAnswerToPlainText } from "./faq-data";
import { SITE_DISCLAIMER } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description:
    "Answers about USVC fees, processing times, eligibility, shipping, refunds, and how our independent service works.",
  alternates: { canonical: "https://usvitalcertificates.org/faq" },
  openGraph: {
    title: "Frequently Asked Questions",
    description:
      "USVC fees, timelines, eligibility, shipping, and refunds: clear answers about our certificate help.",
    url: "https://usvitalcertificates.org/faq",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

export default function FaqPage() {
  const ld = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_ITEMS.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: faqAnswerToPlainText(item.answer) },
    })),
  };
  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <PageHeader
        eyebrow="Support"
        title="Frequently Asked Questions"
        subtitle="Clear answers about our fees, timelines, eligibility rules, and what USVC does and does not do."
      />
      <section className="page-section">
        <div className="container">
          <FaqAccordion items={FAQ_ITEMS} />
          <p className="site-disclaimer">{SITE_DISCLAIMER}</p>
          <div className="faq-support">
            <h2>Still have a question?</h2>
            <p>
              Our support team answers every message. We will never ask for payment details by
              email.
            </p>
            <Link href="/contact" className="button button-secondary">
              Contact Support
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
