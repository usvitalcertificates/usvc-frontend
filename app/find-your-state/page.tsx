import Link from "next/link";

import { BIRTH_GUIDE_SOURCES, socialMetadata } from "@/lib/seo";
import { StateSelector } from "../state-selector";
import { PageHeader } from "../usvc-ui";

export const metadata = {
  title: "Vital Records by State: Find Your Certificate",
  description:
    "Find birth, death, marriage and divorce records by state. Choose where the event occurred to explore certificate options and USVC application help.",
  alternates: { canonical: "https://usvitalcertificates.org/find-your-state" },
  ...socialMetadata({
    title: "Vital Records by State: Find Your Certificate",
    description:
      "Find birth, death, marriage and divorce records by state. Choose where the event occurred to explore certificate options and USVC application help.",
    url: "https://usvitalcertificates.org/find-your-state",
    type: "website",
  }),
};

export default function FindState() {
  return (
    <main>
      <PageHeader
        eyebrow="Step 1 of your request"
        title="Find Vital Records by State"
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
              Not sure which state to choose? Select the state where the vital event (birth, death,
              marriage, or divorce) occurred; that is where the record is held. See the{" "}
              <Link href="/faq">FAQ</Link> for common cases.
            </p>
            <p className="state-help">
              Researching first? Read an official-resource birth-certificate guide:{" "}
              {Object.keys(BIRTH_GUIDE_SOURCES).map((slug, index) => (
                <span key={slug}>
                  {index > 0 ? ", " : null}
                  <Link className="howto-link" href={`/guides/${slug}/birth-certificate`}>
                    {BIRTH_GUIDE_SOURCES[slug].state}
                  </Link>
                </span>
              ))}
              .
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
