import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "./usvc-ui";

export const metadata: Metadata = {
  title: "Page Not Found",
  description: "The page you requested does not exist. Find your state or contact USVC support.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <main>
      <PageHeader
        eyebrow="404"
        title="Page not found"
        subtitle="The page you requested does not exist or was moved."
      />
      <section className="page-section">
        <div className="container legal-body">
          <p>
            Check the address, or start from a known page. If you followed a link on our site that
            led here, please contact support and tell us where you clicked.
          </p>
          <p>
            <Link className="button button-primary" href="/find-your-state">
              Find your state
            </Link>{" "}
            <Link className="button button-secondary" href="/">
              Home
            </Link>{" "}
            <Link className="button button-secondary" href="/faq">
              FAQ
            </Link>{" "}
            <Link className="button button-secondary" href="/contact">
              Contact
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
