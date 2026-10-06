import Link from "next/link";
import { Baby, FileBadge, Gem, Ribbon } from "lucide-react";

import { PageHeader } from "../usvc-ui";

const certificates = [
  {
    name: "Birth Certificates",
    icon: Baby,
    summary:
      "A certified birth certificate is the primary proof of identity, age, citizenship and parentage in the United States.",
    points: [
      "Applying for a U.S. passport, REAL ID or state driver's license",
      "Enrolling a child in school, daycare or youth sports",
      "Claiming Social Security, pension or survivor benefits",
      "Employment eligibility, immigration filings and military enlistment",
    ],
    cta: "Order Birth Certificate",
  },
  {
    name: "Death Certificates",
    icon: Ribbon,
    summary:
      "A certified death certificate is required by nearly every institution that holds an account or policy in the decedent's name.",
    points: [
      "Filing life insurance and annuity claims",
      "Settling an estate, probate court and transferring real property",
      "Closing bank, brokerage, utility and credit accounts",
      "Notifying Social Security and claiming survivor benefits",
    ],
    cta: "Order Death Certificate",
  },
  {
    name: "Marriage Certificates",
    icon: Gem,
    summary:
      "A certified marriage certificate proves a legal union and is the document agencies ask for when a name or status changes.",
    points: [
      "Changing your name with Social Security, the DMV and your bank",
      "Adding a spouse to health insurance or an employer benefit plan",
      "Spousal immigration petitions and visa applications",
      "Joint mortgages, tax filings and beneficiary designations",
    ],
    cta: "Order Marriage Certificate",
  },
  {
    name: "Divorce Certificates",
    icon: FileBadge,
    summary:
      "A divorce certificate or certified decree confirms a marriage has legally ended and that you are free to remarry.",
    points: [
      "Obtaining a new marriage license",
      "Restoring a former name on identity documents",
      "Enforcing custody, support or property terms",
      "Refinancing, retitling property and updating beneficiaries",
    ],
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
                  <p className="type-description">{certificate.summary}</p>
                  <ul className="type-points">
                    {certificate.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
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
