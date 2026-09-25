import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Disclaimer, PageHeader } from "../../usvc-ui";

const STATES: Array<readonly [string, string]> = [
  ["Alabama", "AL"],
  ["Alaska", "AK"],
  ["Arizona", "AZ"],
  ["Arkansas", "AR"],
  ["California", "CA"],
  ["Colorado", "CO"],
  ["Connecticut", "CT"],
  ["Delaware", "DE"],
  ["District of Columbia", "DC"],
  ["Florida", "FL"],
  ["Georgia", "GA"],
  ["Hawaii", "HI"],
  ["Idaho", "ID"],
  ["Illinois", "IL"],
  ["Indiana", "IN"],
  ["Iowa", "IA"],
  ["Kansas", "KS"],
  ["Kentucky", "KY"],
  ["Louisiana", "LA"],
  ["Maine", "ME"],
  ["Maryland", "MD"],
  ["Massachusetts", "MA"],
  ["Michigan", "MI"],
  ["Minnesota", "MN"],
  ["Mississippi", "MS"],
  ["Missouri", "MO"],
  ["Montana", "MT"],
  ["Nebraska", "NE"],
  ["Nevada", "NV"],
  ["New Hampshire", "NH"],
  ["New Jersey", "NJ"],
  ["New Mexico", "NM"],
  ["New York", "NY"],
  ["North Carolina", "NC"],
  ["North Dakota", "ND"],
  ["Ohio", "OH"],
  ["Oklahoma", "OK"],
  ["Oregon", "OR"],
  ["Pennsylvania", "PA"],
  ["Puerto Rico", "PR"],
  ["Rhode Island", "RI"],
  ["South Carolina", "SC"],
  ["South Dakota", "SD"],
  ["Tennessee", "TN"],
  ["Texas", "TX"],
  ["Utah", "UT"],
  ["Vermont", "VT"],
  ["Virginia", "VA"],
  ["Washington", "WA"],
  ["West Virginia", "WV"],
  ["Wisconsin", "WI"],
  ["Wyoming", "WY"],
] as const;

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const CERTIFICATES = [
  {
    slug: "birth-certificate",
    name: "Birth Certificate",
    short: "birth",
    description:
      "Assistance preparing and submitting a request for a birth record held by the issuing state agency.",
  },
  {
    slug: "death-certificate",
    name: "Death Certificate",
    short: "death",
    description:
      "Assistance preparing and submitting a request for a death record held by the issuing state agency.",
  },
  {
    slug: "marriage-certificate",
    name: "Marriage Certificate",
    short: "marriage",
    description:
      "Assistance preparing and submitting a request for a marriage record held by the issuing state agency.",
  },
  {
    slug: "divorce-certificate",
    name: "Divorce Certificate",
    short: "divorce",
    description:
      "Assistance preparing and submitting a request for a divorce record or certificate held by the issuing state agency.",
  },
] as const;

const INSTRUCTIONS =
  "Complete the guided application and USVC will review your submitted information before it is forwarded for processing.";
const ELIGIBILITY =
  "Eligibility to receive a certified record is determined by the issuing agency and may be limited to the person named on the record or specific qualifying relatives and representatives.";

export async function generateMetadata({ params }: { params: Promise<{ state: string }> }) {
  const { state } = await params;
  const found = STATES.find(([name]) => slugify(name) === state);
  const name = found ? found[0] : state;
  return {
    title: `${name} Vital Records | Birth, Death, Marriage & Divorce Certificates | USVC`,
    description: `How to request ${name} birth, death, marriage, and divorce certificate copies: eligibility, information needed, fees, and processing options, with guided help from USVC, an independent document assistance service.`,
  };
}

export default async function StatePage({ params }: { params: Promise<{ state: string }> }) {
  const { state } = await params;
  const found = STATES.find(([name]) => slugify(name) === state);
  if (!found) notFound();
  const name = found[0];

  return (
    <main>
      <nav aria-label="Breadcrumb" className="breadcrumbs">
        <ol>
          <li>
            <Link href="/">Home</Link>
            <ChevronRight aria-hidden="true" />
          </li>
          <li>
            <Link href="/find-your-state">Find Your State</Link>
            <ChevronRight aria-hidden="true" />
          </li>
          <li>
            <span aria-current="page">{name}</span>
          </li>
        </ol>
      </nav>

      <PageHeader
        eyebrow="Available Certificates"
        title={`Your ${name} Vital Records. Simplified.`}
        subtitle={`Request assistance with your ${name} birth, death, marriage, or divorce certificate application.`}
      />

      <section className="page-section">
        <div className="container">
          <div className="certificate-type-grid">
            {CERTIFICATES.map((cert) => (
              <article key={cert.slug} className="certificate-type-card">
                <h2>
                  {name} {cert.name}
                </h2>
                <div className="patriotic-rule" aria-hidden="true" />
                <p className="type-description">{cert.description}</p>
                <p className="fee-line">Online Processing Fee $149.00 per copy</p>
                <p className="fee-note">
                  Agency fees are charged separately upon review and acceptance by the State Agency.
                </p>
                <Link href={`/state/${state}/order/${cert.slug}`} className="button button-primary">
                  Start This Request
                </Link>
                <Link href={`/state/${state}/${cert.slug}`} className="howto-link">
                  How to get a {name} {cert.short} certificate
                </Link>
              </article>
            ))}
          </div>

          <div className="info-grid">
            <section className="info-card">
              <h2>{name} instructions</h2>
              <p>{INSTRUCTIONS}</p>
            </section>
            <section className="info-card">
              <h2>Who may request a record</h2>
              <p>{ELIGIBILITY}</p>
            </section>
          </div>

          <Disclaimer className="page-disclaimer" />
        </div>
      </section>
    </main>
  );
}
