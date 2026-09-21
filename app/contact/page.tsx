"use client";

import { Clock, Mail, Phone } from "lucide-react";
import { useState } from "react";
import { Disclaimer, PageHeader } from "../usvc-ui";

function SupportRow({
  icon: Icon,
  title,
  children,
}: {
  icon: typeof Mail;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="support-row">
      <Icon aria-hidden="true" />
      <div>
        <h3>{title}</h3>
        <p>{children}</p>
      </div>
    </div>
  );
}

export default function Contact() {
  const [sent, setSent] = useState(false);
  return (
    <main>
      <PageHeader
        eyebrow="We are here to help"
        title="Contact USVC"
        subtitle="Questions before you order, or need an update on a request already submitted? Send us a message."
      />
      <section className="page-section contact-page">
        <div className="container contact-grid">
          <div>
            <h2 className="form-heading">Send a message</h2>
            {sent ? (
              <div className="contact-success" role="status">
                <strong>Thank you — message received.</strong>
                <p>A USVC representative will reply to your email within one business day.</p>
              </div>
            ) : (
              <form
                className="contact-form"
                onSubmit={(event) => {
                  event.preventDefault();
                  setSent(true);
                }}
              >
                <div>
                  <label htmlFor="contact-name">
                    Full name <span>*</span>
                  </label>
                  <input id="contact-name" required />
                </div>
                <div>
                  <label htmlFor="contact-email">
                    Email address <span>*</span>
                  </label>
                  <input id="contact-email" type="email" required />
                </div>
                <div>
                  <label htmlFor="contact-order">Order number (optional)</label>
                  <input id="contact-order" />
                </div>
                <div>
                  <label htmlFor="contact-message">
                    How can we help? <span>*</span>
                  </label>
                  <textarea id="contact-message" rows={6} required />
                </div>
                <p>Never include payment card numbers or Social Security numbers in this form.</p>
                <button className="button button-primary" type="submit">
                  Send Message
                </button>
              </form>
            )}
          </div>
          <aside className="support-panel">
            <h2>Direct support</h2>
            <SupportRow icon={Mail} title="Email">
              <a href="mailto:support@usvitalcertificates.org">support@usvitalcertificates.org</a>
            </SupportRow>
            <SupportRow icon={Phone} title="Phone">
              <a href="tel:0000000000">(000) 000-0000</a>
            </SupportRow>
            <SupportRow icon={Clock} title="Hours">
              Monday – Friday, 9:00 AM – 6:00 PM ET
            </SupportRow>
            <Disclaimer compact />
          </aside>
        </div>
      </section>
    </main>
  );
}
