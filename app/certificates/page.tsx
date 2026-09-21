import Link from "next/link";
import { Disclaimer, PageHeader } from "../usvc-ui";

const certificates = [
  {
    name: "Birth Certificates",
    description:
      "Assistance preparing and submitting a request for a birth record held by the issuing state agency.",
    uses: "Often requested for identity documentation, passport applications, school enrollment, and employment purposes, subject to the requirements of the receiving organization.",
  },
  {
    name: "Death Certificates",
    description:
      "Assistance preparing and submitting a request for a death record held by the issuing state agency.",
    uses: "Commonly requested for estate administration, insurance claims, benefit filings, and closing accounts, subject to the requirements of the receiving organization.",
  },
  {
    name: "Marriage Certificates",
    description:
      "Assistance preparing and submitting a request for a marriage record held by the issuing state agency.",
    uses: "Frequently requested for name changes, spousal benefits, immigration filings, and legal matters, subject to the requirements of the receiving organization.",
  },
  {
    name: "Divorce Certificates",
    description:
      "Assistance preparing and submitting a request for a divorce record or certificate held by the issuing state agency.",
    uses: "Often requested for remarriage, name changes, and legal or financial matters, subject to the requirements of the receiving organization.",
  },
] as const;

export const metadata = { title: "Certificate Types | USVC" };

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
            {certificates.map((certificate) => (
              <article className="certificate-type-card" key={certificate.name}>
                <h2>{certificate.name}</h2>
                <div className="patriotic-rule" aria-hidden="true" />
                <p className="type-description">{certificate.description}</p>
                <p className="type-uses">{certificate.uses}</p>
                <Link className="button button-secondary" href="/find-your-state">
                  Select Your State
                </Link>
              </article>
            ))}
          </div>
          <Disclaimer className="page-disclaimer" />
        </div>
      </section>
    </main>
  );
}
