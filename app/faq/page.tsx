import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "../usvc-ui";
import { FaqAccordion } from "./faq-accordion";
import { FAQ_ITEMS, faqAnswerToPlainText } from "./faq-data";

export const metadata: Metadata = {
  title: "Frequently Asked Questions | USVC Vital Certificates",
  description:
    "Answers about USVC fees, processing times, eligibility, shipping, refunds, and how our independent vital certificate assistance service works.",
  alternates: { canonical: "https://usvitalcertificates.org/faq" },
  openGraph: {
    title: "Frequently Asked Questions | USVC Vital Certificates",
    description:
      "Answers about USVC fees, processing times, eligibility, shipping, refunds, and how our independent vital certificate assistance service works.",
    url: "https://usvitalcertificates.org/faq",
    type: "website",
  },
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
          <div className="faq-disclaimer">
            <h2>Disclaimer</h2>
            <p>
              USVC is an independent service and is not a government agency. Our online service
              provides convenient access to official vital records for both the public and legal
              professionals. While you may obtain these records directly from government agencies,
              our platform offers a faster, more convenient alternative, eliminating the need for
              in-person visits. Our fees cover secure online ordering, expert assistance, and a
              thorough review to ensure compliance with all regulations.
            </p>
          </div>
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
