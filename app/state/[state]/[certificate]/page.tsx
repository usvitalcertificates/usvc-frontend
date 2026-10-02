import { notFound } from "next/navigation";
import { assertSeoLength } from "@/lib/seo";
import { OrderForm } from "./order-form";
import { PageHeader } from "../../../usvc-ui";

const labels: Record<string, string> = {
  "birth-certificate": "Birth",
  "death-certificate": "Death",
  "marriage-certificate": "Marriage",
  "divorce-certificate": "Divorce",
};
function titleCase(value: string) {
  return value
    .split("-")
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join(" ");
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ state: string; certificate: string }>;
}) {
  const { state, certificate } = await params;
  const title = assertSeoLength(
    "title",
    `${titleCase(state)} ${labels[certificate] ?? "Vital"} Certificate Application`,
  );
  return {
    title,
    description: assertSeoLength(
      "description",
      `Start a guided ${titleCase(state)} ${(labels[certificate] ?? "vital").toLowerCase()} certificate request with USVC review.`,
    ),
    robots: { index: false, follow: true },
    alternates: {
      canonical: `https://usvitalcertificates.org/state/${state}/order/${certificate}`,
    },
  };
}

export default async function CertificatePage({
  params,
}: {
  params: Promise<{ state: string; certificate: string }>;
}) {
  const { state, certificate } = await params;
  const type = labels[certificate];
  if (!type) notFound();
  const stateName = titleCase(state);
  return (
    <main>
      <PageHeader
        eyebrow={`${stateName} · ${type} Certificate`}
        title={`${stateName} ${type} Certificate Application`}
        subtitle="Complete this application in one page. Review your order summary near the end, then continue to secure payment."
      />
      <section className="application-page">
        <div className="application-container">
          <OrderForm stateCode={state} certificate={certificate} />
        </div>
      </section>
    </main>
  );
}
