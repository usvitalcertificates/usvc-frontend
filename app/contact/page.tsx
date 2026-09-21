"use client";

import { Clock, Mail } from "lucide-react";
import { FormEvent, useRef, useState } from "react";
import { submitContactMessage } from "../../lib/api";
import { Disclaimer, PageHeader } from "../usvc-ui";

const sensitiveContentPattern = /\b\d{3}[- ]?\d{2}[- ]?\d{4}\b|\b(?:\d[ -]?){12,18}\d\b/;

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
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ fullName: "", email: "", orderNumber: "", message: "" });
  const formStartedAt = useRef(Date.now());
  const showsSensitiveWarning = sensitiveContentPattern.test(form.message);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;
    setError("");
    setSubmitting(true);
    const formElement = event.currentTarget;
    try {
      await submitContactMessage({
        ...form,
        antiAbuse: {
          honeypot: String(new FormData(formElement).get("contact-preference") ?? ""),
          formStartedAt: formStartedAt.current,
        },
      });
      setSent(true);
      setForm({ fullName: "", email: "", orderNumber: "", message: "" });
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Unable to send your message.");
    } finally {
      setSubmitting(false);
    }
  }

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
              <form className="contact-form" onSubmit={submit}>
                <div>
                  <label htmlFor="contact-name">
                    Full name <span>*</span>
                  </label>
                  <input
                    id="contact-name"
                    name="fullName"
                    autoComplete="name"
                    value={form.fullName}
                    onChange={(event) => setForm({ ...form, fullName: event.target.value })}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="contact-email">
                    Email address <span>*</span>
                  </label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={form.email}
                    onChange={(event) => setForm({ ...form, email: event.target.value })}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="contact-order">Order number (optional)</label>
                  <input
                    id="contact-order"
                    name="orderNumber"
                    value={form.orderNumber}
                    onChange={(event) => setForm({ ...form, orderNumber: event.target.value })}
                  />
                </div>
                <div>
                  <label htmlFor="contact-message">
                    How can we help? <span>*</span>
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    rows={6}
                    value={form.message}
                    onChange={(event) => setForm({ ...form, message: event.target.value })}
                    required
                  />
                </div>
                <input
                  aria-hidden="true"
                  autoComplete="new-password"
                  className="contact-honeypot"
                  data-1p-ignore="true"
                  data-lpignore="true"
                  name="contact-preference"
                  tabIndex={-1}
                  type="text"
                />
                <p>Never include payment card numbers or Social Security numbers in this form.</p>
                {showsSensitiveWarning && (
                  <p className="contact-warning" role="status">
                    This message may contain a Social Security or card number. For your privacy,
                    remove it before sending if possible.
                  </p>
                )}
                {error && (
                  <p className="application-error" role="alert">
                    {error}
                  </p>
                )}
                <button className="button button-primary" disabled={submitting} type="submit">
                  {submitting ? "Sending…" : "Send Message"}
                </button>
              </form>
            )}
          </div>
          <aside className="support-panel">
            <h2>Direct support</h2>
            <SupportRow icon={Mail} title="Email">
              <a href="mailto:support@usvitalcertificates.org">support@usvitalcertificates.org</a>
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
