import Link from "next/link";
import { Baby, FileBadge, Gem, Ribbon } from "lucide-react";

import { PageHeader } from "../usvc-ui";

const certificates = [
  {
    name: "Birth Certificates",
    icon: Baby,
    uses: "Passport, REAL ID, school enrollment, job or benefits.",
    cta: "Order Birth Certificate",
  },
  {
    name: "Death Certificates",
    icon: Ribbon,
    uses: "Insurance claims, estate matters, benefits, closing accounts.",
    cta: "Order Death Certificate",
  },
  {
    name: "Marriage Certificates",
    icon: Gem,
    uses: "Name change, spouse benefits, immigration, legal matters.",
    cta: "Order Marriage Certificate",
  },
  {
    name: "Divorce Certificates",
    icon: FileBadge,
    uses: "Remarriage, name change, legal or financial matters.",
    cta: "Order Divorce Certificate",
  },
] as const;

export const metadata = {
  title: "Vital Certificate Types Explained",
  description:
    "Learn how USVC helps with birth, death, marriage, and divorce certificate requests. Guided, secure, tracked.",
  alternates: { canonical: "https://usvitalcertificates.org/certificates" },
  openGraph: {
    title: "Vital Certificate Types Explained",
    description:
      "Birth, death, marriage, and divorce certificate help: guided requests, secure handling, and tracking with USVC.",
    url: "https://usvitalcertificates.org/certificates",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

export default function Certificates() {
  return (
    <main>
      <PageHeader
        eyebrow="What we help with"
        title="Certificate Types"
        subtitle="USVC provides application assistance for four categories of vital records. Availability depends on the state you select."
      />
      <section className="page-section certificate-page">
        <div className="container">
          <div className="certificate-type-grid">
            {certificates.map((certificate) => {
              const CertIcon = certificate.icon;
              return (
                <article className="certificate-type-card" key={certificate.name}>
                  <span className="type-icon" aria-hidden="true">
                    <CertIcon />
                  </span>
                  <h2>{certificate.name}</h2>
                  <div className="patriotic-rule" aria-hidden="true" />
                  <p className="type-uses">{certificate.uses}</p>
                  <Link className="button button-secondary" href="/find-your-state">
                    {certificate.cta}
                  </Link>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
