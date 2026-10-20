"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { staffData, staffJson } from "@/lib/staff-client";
import { CopyIconButton } from "./CopyButton";
import {
  Mail,
  Phone,
  UserRound,
  ClipboardList,
  MessageSquareText,
  Link2,
  Copy,
  RefreshCw,
  ShieldCheck,
  Clock3,
} from "lucide-react";
import { BackLink, PageBand, SkeletonRows, StatusPill } from "./ui";
import {
  DashboardAccess,
  dateTime,
  money,
  OUTCOME_LABELS,
  PaymentPill,
  FollowUpPill,
  type UnpaidOrder,
} from "./dashboard-shared";
interface Detail {
  order: UnpaidOrder;
  history: {
    id: string;
    note: string;
    outcome: string | null;
    author: string;
    createdAt: string;
  }[];
}
function DetailBody({ id }: { id: string }) {
  const router = useRouter();
  const [resumeLink, setResumeLink] = useState<{ url: string; expiresAt: string } | null>(null);
  const [linkBusy, setLinkBusy] = useState(false);
  const [linkNotice, setLinkNotice] = useState("");
  const [detail, setDetail] = useState<Detail | null>(null);
  const [version, setVersion] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [note, setNote] = useState("");
  const [outcome, setOutcome] = useState("NOT_CONTACTED");
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError("");
    staffJson<Detail>(`/staff/unpaid-orders/${encodeURIComponent(id)}`, {
      signal: controller.signal,
    })
      .then((data) => {
        if (!controller.signal.aborted) {
          setDetail(data);
          setOutcome(data.order.outcome);
        }
      })
      .catch((e) => {
        if (!controller.signal.aborted) {
          setDetail(null);
          setError(e instanceof Error ? e.message : "Could not load order.");
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [id, version]);
  async function generateResumeLink() {
    if (linkBusy) return;
    setLinkBusy(true);
    setError("");
    setLinkNotice("");
    try {
      const result = await staffJson<{ url: string; expiresAt: string }>(
        `/staff/unpaid-orders/${encodeURIComponent(id)}/resume-link`,
        { method: "POST", body: "{}" },
      );
      setResumeLink(result);
      setLinkNotice(
        "Link created. The customer must verify their email before viewing the application.",
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not create resume link.");
    } finally {
      setLinkBusy(false);
    }
  }
  async function copyResume() {
    if (!resumeLink) return;
    try {
      await navigator.clipboard.writeText(resumeLink.url);
      setLinkNotice("Resume link copied.");
    } catch {
      setLinkNotice("Could not copy automatically. Select and copy the link below.");
    }
  }
  async function save(event: FormEvent) {
    event.preventDefault();
    if (saving) return;
    setSaving(true);
    setError("");
    setNotice("");
    try {
      const { response, data } = await staffData<{ message?: string }>(
        `/staff/unpaid-orders/${encodeURIComponent(id)}/follow-ups`,
        { method: "POST", body: JSON.stringify({ note, outcome }) },
      );
      if (response.status === 409) {
        router.replace("/staff/unpaid-orders");
        return;
      }
      if (!response.ok) throw new Error(data.message || "Could not save follow-up.");
      setNote("");
      setNotice("Follow-up saved.");
      setVersion((v) => v + 1);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not save follow-up.");
    } finally {
      setSaving(false);
    }
  }
  return (
    <div className="staff-recovery-detail">
      <BackLink href="/staff/unpaid-orders">Unpaid Orders</BackLink>
      <PageBand
        eyebrow="Customer follow-up"
        title={detail?.order.publicNumber ?? "Order follow-up"}
        subtitle="Review customer details, record your contact attempt, and track the next step."
      />
      {error ? (
        <p className="staff-alert error" role="alert">
          {error}
        </p>
      ) : null}
      {notice ? (
        <p className="staff-alert success" role="status">
          {notice}
        </p>
      ) : null}
      {loading ? (
        <SkeletonRows rows={5} />
      ) : detail ? (
        <>
          {detail.order.paymentStatus === "PAID" ? (
            <p className="staff-alert" role="status">
              This order is now paid. Outreach history is read-only and the order is no longer in
              the unpaid list.
            </p>
          ) : null}
          {detail.order.unresolved ? (
            <p className="staff-alert" role="status">
              Payment is unresolved. Check Stripe before asking this customer to make another
              payment.
            </p>
          ) : null}
          {detail.order.paymentStatus === "REFUNDED" ? (
            <p className="staff-alert" role="status">
              This order was refunded. Review its payment history before following up.
            </p>
          ) : null}
          <div className="staff-dashboard-detail-grid staff-recovery-grid">
            <section
              className="staff-panel staff-recovery-card"
              aria-labelledby="customer-details-heading"
            >
              <div className="staff-recovery-card-heading">
                <span className="staff-recovery-icon">
                  <UserRound aria-hidden />
                </span>
                <div>
                  <h2 id="customer-details-heading">Customer details</h2>
                  <p>Contact information and order summary</p>
                </div>
              </div>
              <div className="staff-customer-identity">
                <span className="staff-customer-avatar" aria-hidden>
                  {detail.order.customerName.trim().charAt(0).toUpperCase() || "?"}
                </span>
                <div>
                  <h3>{detail.order.customerName || "Name unavailable"}</h3>
                  <span>Customer contact</span>
                </div>
              </div>
              <dl className="staff-contact-list">
                <div>
                  <dt>
                    <Mail aria-hidden />
                    Email address
                  </dt>
                  <dd>
                    <span>{detail.order.email || "Unavailable"}</span>
                    <CopyIconButton value={detail.order.email} label="email" />
                  </dd>
                </div>
                <div>
                  <dt>
                    <Phone aria-hidden />
                    Phone number
                  </dt>
                  <dd>
                    <span>{detail.order.phone || "Unavailable"}</span>
                    <CopyIconButton value={detail.order.phone} label="phone" />
                  </dd>
                </div>
              </dl>
              <div className="staff-recovery-section-heading">
                <ClipboardList aria-hidden />
                <h3>Order overview</h3>
              </div>
              <dl className="staff-recovery-overview">
                <div className="staff-recovery-reference">
                  <dt>Order reference</dt>
                  <dd>
                    <span>{detail.order.publicNumber}</span>
                    <CopyIconButton value={detail.order.publicNumber} label="order number" />
                  </dd>
                </div>
                <div>
                  <dt>Certificate</dt>
                  <dd>
                    {detail.order.stateName} ·{" "}
                    {detail.order.certificate.charAt(0) +
                      detail.order.certificate.slice(1).toLowerCase()}
                  </dd>
                </div>
                <div>
                  <dt>Order amount</dt>
                  <dd className="staff-recovery-amount">
                    {money(detail.order.amountCents, detail.order.currency)}
                  </dd>
                </div>
                <div>
                  <dt>Created</dt>
                  <dd>{dateTime(detail.order.createdAt)}</dd>
                </div>
                <div>
                  <dt>Payment status</dt>
                  <dd>
                    <PaymentPill status={detail.order.paymentStatus} />
                  </dd>
                </div>
                <div>
                  <dt>Workflow status</dt>
                  <dd>
                    <StatusPill status={detail.order.status} />
                  </dd>
                </div>
                <div>
                  <dt>Current follow-up</dt>
                  <dd>
                    <FollowUpPill outcome={detail.order.outcome} />
                  </dd>
                </div>
              </dl>
              <div className="staff-recovery-card-footer">
                <Link href="/staff/payments" className="staff-btn secondary">
                  Check Stripe Payments
                </Link>
              </div>
            </section>
            <section
              className="staff-panel staff-recovery-card"
              aria-labelledby="record-follow-up-heading"
            >
              <div className="staff-recovery-card-heading">
                <span className="staff-recovery-icon mint">
                  <MessageSquareText aria-hidden />
                </span>
                <div>
                  <h2 id="record-follow-up-heading">Record follow-up</h2>
                  <p>Save the result and next step for your team.</p>
                </div>
              </div>
              <form onSubmit={save} className="staff-dashboard-form staff-recovery-form">
                <fieldset disabled={saving || detail.order.paymentStatus === "PAID"}>
                  <div className="staff-recovery-field">
                    <label htmlFor="follow-up-outcome">Outcome</label>
                    <p id="outcome-help">What happened when you contacted the customer?</p>
                    <select
                      id="follow-up-outcome"
                      aria-describedby="outcome-help"
                      value={outcome}
                      onChange={(e) => setOutcome(e.target.value)}
                    >
                      {Object.entries(OUTCOME_LABELS).map(([key, label]) => (
                        <option key={key} value={key}>
                          {label}
                        </option>
                      ))}
                    </select>
                    <div className="staff-outcome-preview">
                      <span>Selected outcome</span>
                      <FollowUpPill outcome={outcome} />
                    </div>
                  </div>
                  <div className="staff-recovery-field">
                    <label htmlFor="follow-up-note">Contact note</label>
                    <p id="note-help">Add the customer’s response and any agreed next step.</p>
                    <textarea
                      id="follow-up-note"
                      aria-describedby="note-help note-privacy"
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      rows={6}
                      maxLength={2000}
                      placeholder="For example: Customer requested a callback tomorrow afternoon."
                    />
                    <div className="staff-recovery-note-meta">
                      <span id="note-privacy">Keep card numbers and SSNs out of notes.</span>
                      <span>{note.length.toLocaleString()} / 2,000</span>
                    </div>
                  </div>
                  <div className="staff-recovery-save">
                    <button type="submit" className="staff-btn" disabled={saving}>
                      {saving ? "Saving…" : "Save follow-up"}
                    </button>
                    <span>Your team can view saved follow-ups below.</span>
                  </div>
                </fieldset>
              </form>
            </section>
          </div>
          <section className="staff-panel staff-resume-panel" aria-labelledby="resume-link-heading">
            <div className="staff-resume-header">
              <div className="staff-resume-title">
                <span className="staff-recovery-icon">
                  <Link2 aria-hidden />
                </span>
                <div>
                  <h2 id="resume-link-heading">Resume application</h2>
                  <p>Share the customer’s saved application in your follow-up email.</p>
                </div>
              </div>
              {detail.order.paymentStatus !== "REFUNDED" ? (
                <span className="staff-resume-verification">
                  <ShieldCheck aria-hidden /> Email verification required
                </span>
              ) : null}
            </div>
            {detail.order.paymentStatus === "REFUNDED" ? (
              <p className="staff-resume-empty">
                Refunded orders cannot be reopened or charged through recovery.
              </p>
            ) : resumeLink ? (
              <div className="staff-resume-content">
                <label htmlFor="private-resume-link">Private resume link</label>
                <div className="staff-resume-link-row">
                  <input
                    id="private-resume-link"
                    readOnly
                    value={resumeLink.url}
                    onFocus={(e) => e.target.select()}
                    aria-describedby="resume-link-help"
                  />
                  <button className="staff-btn" onClick={copyResume}>
                    <Copy aria-hidden /> Copy link
                  </button>
                </div>
                <div className="staff-resume-footer">
                  <div>
                    <p className="staff-resume-expiry">
                      <Clock3 aria-hidden /> Expires {dateTime(resumeLink.expiresAt)}
                    </p>
                    <p id="resume-link-help">
                      Send this link manually. Replacing it disables the previous link and its
                      sessions.
                    </p>
                  </div>
                  <button
                    className="staff-btn secondary"
                    disabled={linkBusy || detail.order.paymentStatus === "PAID"}
                    onClick={generateResumeLink}
                  >
                    <RefreshCw aria-hidden />
                    {linkBusy ? "Replacing…" : "Replace link"}
                  </button>
                </div>
              </div>
            ) : (
              <div className="staff-resume-empty">
                <div>
                  <strong>Create a secure link for this order</strong>
                  <p>The link is valid for 48 hours. You choose what to write and send.</p>
                </div>
                <button
                  className="staff-btn"
                  disabled={linkBusy || detail.order.paymentStatus === "PAID"}
                  onClick={generateResumeLink}
                >
                  <Link2 aria-hidden />
                  {linkBusy ? "Generating…" : "Generate resume link"}
                </button>
              </div>
            )}
            {linkNotice ? (
              <p className="staff-resume-notice" role="status">
                {linkNotice}
              </p>
            ) : null}
          </section>
          <section
            className="staff-panel staff-recovery-history"
            aria-labelledby="follow-up-history-heading"
          >
            <div className="staff-recovery-history-heading">
              <div>
                <h2 id="follow-up-history-heading">Follow-up history</h2>
                <p>A shared record of contact attempts and customer responses.</p>
              </div>
              <span className="staff-history-count">
                {detail.history.length} {detail.history.length === 1 ? "entry" : "entries"}
              </span>
            </div>
            {detail.history.length ? (
              <ol className="staff-outreach-history">
                {detail.history.map((entry) => (
                  <li key={entry.id}>
                    <div className="staff-dashboard-history-heading">
                      <strong>{entry.author}</strong>
                      <time dateTime={entry.createdAt}>{dateTime(entry.createdAt)}</time>
                      {entry.outcome ? <FollowUpPill outcome={entry.outcome} /> : null}
                    </div>
                    {entry.note ? <p className="staff-outreach-note">{entry.note}</p> : null}
                  </li>
                ))}
              </ol>
            ) : (
              <div className="staff-outreach-empty">
                <MessageSquareText aria-hidden />
                <div>
                  <strong>No follow-ups yet</strong>
                  <p>Save a contact attempt to start this customer’s history.</p>
                </div>
              </div>
            )}
          </section>
        </>
      ) : null}
    </div>
  );
}
export function UnpaidOrderDetail({ id }: { id: string }) {
  return (
    <DashboardAccess>
      <DetailBody id={id} />
    </DashboardAccess>
  );
}
