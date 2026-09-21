import { StateSelector } from "../state-selector";
import { Disclaimer, PageHeader } from "../usvc-ui";

export const metadata = { title: "Find Your State | USVC" };

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
          <Disclaimer className="page-disclaimer" />
          <p className="state-help">
            Not sure which state to choose? Contact USVC support at support@usvitalcertificates.org
            and we will help you decide before you start.
          </p>
        </div>
      </section>
    </main>
  );
}
