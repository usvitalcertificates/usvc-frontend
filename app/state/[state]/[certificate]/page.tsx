import { notFound } from "next/navigation";
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
  return {
    title: `${titleCase(state)} ${labels[certificate] ?? "Vital"} Certificate Application | USVC`,
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
