import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Disclaimer, PageHeader } from "../usvc-ui";
import { LEGAL_DOCUMENTS } from "./legal-data";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ legal: string }>;
}): Promise<Metadata> {
  const { legal } = await params;
  const doc = LEGAL_DOCUMENTS[legal];
  const title = `${doc?.title ?? "Legal"} | USVC Vital Certificates`;
  const description = doc?.description ?? "USVC legal information.";
  return {
    title,
    description,
    alternates: { canonical: `https://usvitalcertificates.org/${legal}` },
    openGraph: {
      title,
      description,
      url: `https://usvitalcertificates.org/${legal}`,
      type: "website",
    },
  };
}

export default async function Legal({ params }: { params: Promise<{ legal: string }> }) {
  const { legal } = await params;
  const doc = LEGAL_DOCUMENTS[legal];
  if (!doc) notFound();
  return (
    <main>
      <PageHeader eyebrow="Legal" title={doc.title} subtitle={doc.description} />
      <section className="page-section">
        <div className="container">
          <div className="legal-body">
            <p className="legal-updated">Last updated: {doc.lastUpdated}</p>
            {doc.sections.map((section) => (
              <div key={section.heading} className="legal-section">
                <h2>{section.heading}</h2>
                <div className="patriotic-rule" aria-hidden="true" />
                {section.body.map((paragraph) =>
                  paragraph.startsWith("• ") ? (
                    <p key={paragraph} className="legal-bullet">
                      {paragraph}
                    </p>
                  ) : (
                    <p key={paragraph}>{paragraph}</p>
                  ),
                )}
              </div>
            ))}
            <Disclaimer className="page-disclaimer" />
          </div>
        </div>
      </section>
    </main>
  );
}
