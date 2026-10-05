import Link from "next/link";

import { StateSelector } from "../state-selector";
import { PageHeader } from "../usvc-ui";

export const metadata = {
  title: "Find Your State to Start Request",
  description:
    "Choose the state where your vital record was issued to start a guided USVC certificate request.",
  alternates: { canonical: "https://usvitalcertificates.org/find-your-state" },
  openGraph: {
    title: "Find Your State to Start Request",
    description:
      "Select your state to see eligibility, fees, and start a guided vital certificate request with USVC.",
    url: "https://usvitalcertificates.org/find-your-state",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

export default function FindState() {
  return (
    <main>
      <PageHeader
        eyebrow="Step 1 of your request"
        title="Find Your State"
        subtitle="Select the state where your vital record was issued to begin."
      />
      <section className="page-section find-state-page">
        <div className="container">
          <div className="state-card">
            <ol className="funnel-steps" aria-label="Request progress">
              <li aria-current="step">1 · Find your state</li>
              <li>2 · Application</li>
              <li>3 · Review &amp; track</li>
            </ol>
            <StateSelector showHeading={false} />
            <p className="state-help">
              Not sure which state to choose? Select the state where the vital event — birth, death,
              marriage, or divorce — occurred; that is where the record is held. See the{" "}
              <Link href="/faq">FAQ</Link> for common cases.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
