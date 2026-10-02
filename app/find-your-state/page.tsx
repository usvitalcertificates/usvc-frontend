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
          <StateSelector showHeading={false} />
          <p className="state-help">
            Not sure which state to choose? Contact USVC support at support@usvitalcertificates.org
            and we will help you decide before you start.
          </p>
        </div>
      </section>
    </main>
  );
}
