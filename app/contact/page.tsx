"use client";

import Link from "next/link";
import { FormEvent, useRef, useState } from "react";
import { submitContactMessage } from "../../lib/api";
import { PageHeader } from "../usvc-ui";
import { trackAnalytics } from "../analytics";

const sensitiveContentPattern = /\b\d{3}[- ]?\d{2}[- ]?\d{4}\b|\b(?:\d[ -]?){12,18}\d\b/;

const CONTACT_REASONS = [
  "Order Status Inquiry",
  "Correction to My Order Information",
  "Issue with Document Delivery",
  "Billing Question",
  "Cancel Order",
  "Other (Please specify in message below)",
] as const;

export default function Contact() {
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    orderNumber: "",
    reason: CONTACT_REASONS[0] as string,
    message: "",
  });
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
        fullName: `${form.firstName} ${form.lastName}`.trim(),
        email: form.email,
        orderNumber: form.orderNumber,
        message: `[${form.reason}] ${form.message}`,
        antiAbuse: {
          honeypot: String(new FormData(formElement).get("contact-preference") ?? ""),
          formStartedAt: formStartedAt.current,
        },
      });
      trackAnalytics("contact_submitted");
      setSent(true);
      setForm({
        firstName: "",
        lastName: "",
        email: "",
        orderNumber: "",
        reason: CONTACT_REASONS[0],
        message: "",
      });
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Unable to send your message.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main>
      <PageHeader
        eyebrow="Client Support"
        title="Contact USVC Support"
        subtitle="Need an update on a request already submitted? Send us a message."
      />
      <section className="page-section contact-page">
        <div className="container contact-column">
          <div className="contact-info-panel">
            <p>
              Welcome to the Client Support Center. This page and contact form are{" "}
              <strong>
                exclusively for individuals who have already placed an order through our platform.
              </strong>
            </p>
            <p>
              usvitalcertificates.org is an ordering platform designed to assist you in obtaining
              your official vital records. To ensure we can provide focused support for your
              existing order, please have your Order Number ready. You can find your Order Number in
              the confirmation email you received shortly after placing your order.
            </p>
            <p>
              For quick answers to many common questions (both general and order-related), please
              first consult our comprehensive{" "}
              <Link href="/faq">Frequently Asked Questions (FAQ)</Link> page.
            </p>
            <p>
              <strong>
                Still have a general question (not about an existing order with
                usvitalcertificates.org) after checking our FAQ?
              </strong>
            </p>
            <p>
              Detailed information on eligibility requirements, fees, and delivery options is
              presented{" "}
              <strong>
                directly within our online order form pages as you select your state and document
                type (before any payment is required).
              </strong>{" "}
              We strongly encourage you to begin this process on our website to find this
              information first.
            </p>
            <p>
              If, after reviewing the information provided during our online ordering process and in
              the FAQ, your inquiry still relates to topics such as:
            </p>
            <ul>
              <li>Specifics not covered on our website about eligibility or requirements.</li>
              <li>
                Details about vital records in a particular state not found on our platform during
                the order preparation.
              </li>
              <li>
                Other questions if you have <strong>not yet placed an order</strong> with us and
                cannot find the answers on our site.
              </li>
            </ul>
            <p>
              Then please contact the <strong>vital records issuing</strong> agency (e.g., the State
              Department of Health or County Clerk&apos;s Office) for your state or county directly.{" "}
              <strong>This form is only for support related to existing orders.</strong>
            </p>
          </div>
          <div>
            <h2 className="form-heading">Send a message</h2>
            <p className="required-note">Items with an *asterisk are required fields.</p>
            {sent ? (
              <div className="contact-success" role="status">
                <strong>Thank you — message received.</strong>
                <p>
                  A USVC representative usually replies to your email within one business day,
                  excluding weekends and holidays.
                </p>
              </div>
            ) : (
              <form className="contact-form" onSubmit={submit}>
                <div className="contact-name-row">
                  <div>
                    <label htmlFor="contact-first-name">
                      Your First Name <span>*</span>
                    </label>
                    <input
                      id="contact-first-name"
                      name="firstName"
                      autoComplete="given-name"
                      value={form.firstName}
                      onChange={(event) => setForm({ ...form, firstName: event.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-last-name">
                      Your Last Name <span>*</span>
                    </label>
                    <input
                      id="contact-last-name"
                      name="lastName"
                      autoComplete="family-name"
                      value={form.lastName}
                      onChange={(event) => setForm({ ...form, lastName: event.target.value })}
                      required
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="contact-email">
                    Email <span>*</span>
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
                  <label htmlFor="contact-order">
                    Order Number <span>*</span>
                  </label>
                  <input
                    id="contact-order"
                    name="orderNumber"
                    placeholder="Order Number"
                    value={form.orderNumber}
                    onChange={(event) => setForm({ ...form, orderNumber: event.target.value })}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="contact-reason">
                    Reason for Contacting Us <span>*</span>
                  </label>
                  <select
                    id="contact-reason"
                    name="reason"
                    value={form.reason}
                    onChange={(event) => setForm({ ...form, reason: event.target.value })}
                    required
                  >
                    {CONTACT_REASONS.map((reason) => (
                      <option key={reason} value={reason}>
                        {reason}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="contact-message" className="sr-only">
                    Your message <span>*</span>
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    rows={6}
                    placeholder="Enter your message here..."
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
          <div className="contact-address-block">
            <h2>Disclaimer</h2>
            <p>
              This site is available for use by the general public and legal profession to obtain
              government approved and official certificates issued by the government agency. We act
              as agents for expediting vital certificate applications. We are not affiliated with
              any government agency. Vital certificates and forms may be ordered from the relevant
              government agency for free or a lesser cost.
            </p>
            <div className="contact-address-details">
              <p>usvitalcertificates.org</p>
              <p>US VITAL CERTIFICATES, LLC</p>
              <p>7345 W Sand Lake Rd Ste 210 Office 4464</p>
              <p>Orlando, FL 32819</p>
              <p>
                <a href="mailto:support@usvitalcertificates.org">support@usvitalcertificates.org</a>
              </p>
              <p>(689) 367-5431</p>
              <p>
                <em>(Mailing &amp; Correspondence)</em>
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
