"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { staffData, staffJson } from "@/lib/staff-client";
import { CopyButton } from "./CopyButton";
import { BackLink, PageBand, SkeletonRows, StatusPill } from "./ui";
import {
  DashboardAccess,
  dateTime,
  money,
  OUTCOME_LABELS,
  PaymentPill,
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
    <>
      <BackLink href="/staff/unpaid-orders">Unpaid Orders</BackLink>
      <PageBand
        eyebrow="Customer follow-up"
        title={detail?.order.publicNumber ?? "Order follow-up"}
        subtitle="Customer contact and outreach history. Fulfillment ownership is unchanged."
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
          <div className="staff-dashboard-detail-grid">
            <section className="staff-panel staff-panel-body">
              <h2>Customer and order</h2>
              <dl className="staff-dashboard-facts">
                <dt>Name</dt>
                <dd>{detail.order.customerName}</dd>
                <dt>Email</dt>
                <dd>
                  {detail.order.email || "Unavailable"}
                  <CopyButton value={detail.order.email} label="email" />
                </dd>
                <dt>Phone</dt>
                <dd>
                  {detail.order.phone || "Unavailable"}
                  <CopyButton value={detail.order.phone} label="phone" />
                </dd>
                <dt>Created</dt>
                <dd>{dateTime(detail.order.createdAt)}</dd>
                <dt>Certificate</dt>
                <dd>
                  {detail.order.stateName} · {detail.order.certificate.toLowerCase()}
                </dd>
                <dt>Amount</dt>
                <dd>{money(detail.order.amountCents, detail.order.currency)}</dd>
                <dt>Payment</dt>
                <dd>
                  <PaymentPill status={detail.order.paymentStatus} />
                </dd>
                <dt>Workflow</dt>
                <dd>
                  <StatusPill status={detail.order.status} />
                </dd>
                <dt>Order reference</dt>
                <dd>
                  {detail.order.publicNumber}
                  <CopyButton value={detail.order.publicNumber} label="order number" />
                </dd>
              </dl>
              <Link href="/staff/payments" className="staff-btn secondary">
                Check Stripe Payments
              </Link>
            </section>
            <section className="staff-panel staff-panel-body">
              <h2>Record follow-up</h2>
              <p className="staff-row-meta">
                Contact customers manually, then record what happened. Do not enter card details or
                SSNs in notes.
              </p>
              <form onSubmit={save} className="staff-dashboard-form">
                <fieldset disabled={saving || detail.order.paymentStatus === "PAID"}>
                  <label>
                    Outcome
                    <select value={outcome} onChange={(e) => setOutcome(e.target.value)}>
                      {Object.entries(OUTCOME_LABELS).map(([key, label]) => (
                        <option key={key} value={key}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Contact note
                    <textarea
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      rows={5}
                      maxLength={2000}
                      placeholder="Contact attempt, customer response, or next step"
                    />
                  </label>
                  <button type="submit" className="staff-btn" disabled={saving}>
                    {saving ? "Saving…" : "Save follow-up"}
                  </button>
                </fieldset>
              </form>
            </section>
          </div>
          <section className="staff-panel staff-panel-body">
            <h2>Follow-up history</h2>
            {detail.history.length ? (
              <ol className="staff-outreach-history">
                {detail.history.map((entry) => (
                  <li key={entry.id}>
                    <div className="staff-dashboard-history-heading">
                      <strong>{entry.author}</strong>
                      <time dateTime={entry.createdAt}>{dateTime(entry.createdAt)}</time>
                      {entry.outcome ? (
                        <span className="staff-pill gray">{OUTCOME_LABELS[entry.outcome]}</span>
                      ) : null}
                    </div>
                    {entry.note ? <p className="staff-outreach-note">{entry.note}</p> : null}
                  </li>
                ))}
              </ol>
            ) : (
              <p>No follow-up has been recorded.</p>
            )}
          </section>
        </>
      ) : null}
    </>
  );
}
export function UnpaidOrderDetail({ id }: { id: string }) {
  return (
    <DashboardAccess>
      <DetailBody id={id} />
    </DashboardAccess>
  );
}
