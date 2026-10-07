import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { assertSeoLength } from "@/lib/seo";
import { isStateUnsupported, STATE_UNAVAILABLE_MESSAGE } from "@/lib/state-availability";
import { OrderForm } from "../../[certificate]/order-form";
import { PageHeader } from "../../../../usvc-ui";

const labels: Record<string, string> = {
  "birth-certificate": "Birth",
  "death-certificate": "Death",
  "marriage-certificate": "Marriage",
  "divorce-certificate": "Divorce",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ state: string; certificate: string }>;
}): Promise<Metadata> {
  const { state, certificate } = await params;
  const name = state
    .split("-")
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join(" ");
  const type = certificate
    .replace("-certificate", "")
    .replace(/^./, (letter) => letter.toUpperCase());
  const title = assertSeoLength("title", `${name} ${type} Certificate Application`);
  const description = assertSeoLength(
    "description",
    `Start a guided ${name} ${type.toLowerCase()} certificate request with USVC review and tracking.`,
  );
  const url = `https://usvitalcertificates.org/state/${state}/order/${certificate}`;
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

function titleCase(value: string) {
  return value
    .split("-")
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join(" ");
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
