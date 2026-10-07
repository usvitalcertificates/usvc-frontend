import type { Metadata } from "next";
import { Check, ChevronRight, Lock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { assertSeoLength } from "@/lib/seo";
import { isStateUnsupported, STATE_UNAVAILABLE_MESSAGE } from "@/lib/state-availability";
import { PageHeader } from "../../usvc-ui";

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
  },
  {
    slug: "death-certificate",
    name: "Death Certificate",
    short: "death",
  },
  {
    slug: "marriage-certificate",
    name: "Marriage Certificate",
    short: "marriage",
  },
  {
    slug: "divorce-certificate",
    name: "Divorce Certificate",
    short: "divorce",
  },
] as const;

const INSTRUCTIONS =
  "Complete the guided application and USVC will review your submitted information before it is forwarded for processing.";
const ELIGIBILITY =
  "Eligibility to receive a certified record is determined by the issuing agency and may be limited to the person named on the record or specific qualifying relatives and representatives.";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ state: string }>;
}): Promise<Metadata> {
  const { state } = await params;
  const found = STATES.find(([name]) => slugify(name) === state);
  const name = found ? found[0] : state;
  const title = assertSeoLength(
    "title",
    `${name} Vital Records: birth, death, marriage, divorce help`,
  );
  const description = assertSeoLength(
    "description",
    `${name} birth, death, marriage, divorce guide: eligibility, fees, and how to request with USVC help.`,
  );
  const unavailable = isStateUnsupported(state);
  return {
    title,
    description,
    ...(unavailable ? { robots: { index: false, follow: true } as const } : {}),
    alternates: { canonical: `https://usvitalcertificates.org/state/${state}` },
    openGraph: {
      title,
      description,
      url: `https://usvitalcertificates.org/state/${state}`,
      type: "website",
    },
    twitter: { card: "summary_large_image" },
  };
}

export default async function StatePage({ params }: { params: Promise<{ state: string }> }) {
  const { state } = await params;
  const found = STATES.find(([name]) => slugify(name) === state);
  if (!found) notFound();
  const name = found[0];
  const unavailable = isStateUnsupported(state);

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
        title={`Your ${name} Vital Records Request, Simplified.`}
        subtitle={`Request assistance with your ${name} birth, death, marriage, or divorce certificate application.`}
      />
      <section className="page-section">
        <div className="container">
          {unavailable ? (
            <p className="notice" role="status">
              {STATE_UNAVAILABLE_MESSAGE} See{" "}
              <Link href="/find-your-state">all available states</Link>.
            </p>
          ) : null}
          <div className="certificate-type-grid">
            {CERTIFICATES.map((cert) => (
              <article key={cert.slug} className="certificate-type-card">
                <h2>
                  {name} {cert.name}
                </h2>
                <div className="patriotic-rule" aria-hidden="true" />
                <p className="fee-line">Online Processing Fee $149.00 per copy</p>
                <p className="fee-note">
                  Agency fees are charged separately upon review and acceptance by the State Agency.
                </p>
                {unavailable ? (
                  <button
                    type="button"
                    className="button button-primary"
                    disabled
                    aria-disabled="true"
                  >
                    Not available yet
                  </button>
                ) : (
                  <Link
                    href={`/state/${state}/order/${cert.slug}`}
                    className="button button-primary"
                  >
                    Start This Request
                  </Link>
                )}
                {unavailable ? null : (
                  <Link href={`/state/${state}/order/${cert.slug}`} className="howto-link">
                    How to get a {name} {cert.short} certificate
                  </Link>
                )}
              </article>
            ))}
          </div>

          <div className="state-benefits">
            <ul className="assurance-list">
              <li>
                <Check aria-hidden="true" /> Secure online ordering
              </li>
              <li>
                <Check aria-hidden="true" /> Expert application review
              </li>
              <li>
                <Check aria-hidden="true" /> Filed with the state agency
              </li>
              <li>
                <Check aria-hidden="true" /> Track your order online
              </li>
            </ul>
            <p className="state-help">
              Ordering from a different state?{" "}
              <Link className="howto-link" href="/find-your-state">
                Find your state
              </Link>
            </p>
            <p className="state-payment">
              <Lock aria-hidden="true" /> 256-bit SSL encrypted checkout{" "}
              <Image src="/assets/visa.svg" alt="Visa" width={44} height={28} />
              <Image src="/assets/mastercard.svg" alt="Mastercard" width={44} height={28} />
            </p>
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
        </div>
      </section>
    </main>
  );
}
