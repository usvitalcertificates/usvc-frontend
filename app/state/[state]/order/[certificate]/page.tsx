import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { assertSeoLength, CERTIFICATE_SLUGS, INDEXABLE_STATES, titleCase } from "@/lib/seo";
import { isStateUnsupported, STATE_UNAVAILABLE_MESSAGE } from "@/lib/state-availability";
import { OrderForm } from "../../[certificate]/order-form";
import { PageHeader } from "../../../../usvc-ui";

const labels: Record<string, string> = {
  "birth-certificate": "Birth",
  "death-certificate": "Death",
  "marriage-certificate": "Marriage",
  "divorce-certificate": "Divorce",
};

/** Prerender all indexable order pages + VT/WY notice variants (P0 SEO)
 *  so Google gets static HTML for the 200-URL cluster. */
export async function generateStaticParams() {
  const states = [...INDEXABLE_STATES, "vermont", "wyoming"];
  return states.flatMap((state) =>
    CERTIFICATE_SLUGS.map((certificate) => ({ state, certificate })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ state: string; certificate: string }>;
}): Promise<Metadata> {
  const { state, certificate } = await params;
  if (!labels[certificate]) return {};
  const name = titleCase(state);
  const type = certificate
    .replace("-certificate", "")
    .replace(/^./, (letter) => letter.toUpperCase());
  const title = assertSeoLength("title", `${name} ${type} Certificate Application`);
  const description = assertSeoLength(
    "description",
    `Start a guided ${name} ${type.toLowerCase()} certificate request with USVC review and tracking.`,
  );
  const url = `https://usvitalcertificates.org/state/${state}/order/${certificate}`;
  // VT/WY render an unavailable notice, never a form: keep crawlable
  // for users but out of the index (matches state-hub behavior).
  if (isStateUnsupported(state)) {
    return {
      title,
      description,
      robots: { index: false, follow: true },
      alternates: { canonical: url },
      openGraph: { title, description, url, type: "website" },
      twitter: { card: "summary_large_image" },
    };
  }
  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: { title, description, url, type: "website" },
    twitter: { card: "summary_large_image" },
  };
}

export default async function CertificateOrderPage({
  params,
}: {
  params: Promise<{ state: string; certificate: string }>;
}) {
  const { state, certificate } = await params;
  const type = labels[certificate];
  if (!type) notFound();
  const stateName = titleCase(state);
  if (isStateUnsupported(state)) {
    return (
      <main>
        <PageHeader
          eyebrow={`${stateName} · ${type} Certificate`}
          title={`${stateName} ${type} Certificate Application`}
          subtitle="Check availability for this state."
        />
        <section className="page-section">
          <div className="container">
            <p className="notice" role="status">
              {STATE_UNAVAILABLE_MESSAGE} See{" "}
              <Link href="/find-your-state">all available states</Link>.
            </p>
          </div>
        </section>
      </main>
    );
  }
  return (
    <main>
      <PageHeader
        eyebrow={`${stateName} · ${type} Certificate`}
        title={`${stateName} ${type} Certificate Application`}
        subtitle="Complete this application in one page, then submit payment."
      />
      <section className="application-page">
        <div className="application-container">
          <OrderForm stateCode={state} certificate={certificate} />
        </div>
      </section>
    </main>
  );
}
