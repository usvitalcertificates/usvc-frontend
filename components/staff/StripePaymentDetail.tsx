"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { staffJson } from "@/lib/staff-client";
import { BackLink, PageBand, SkeletonRows } from "./ui";
import { CopyButton } from "./CopyButton";
import {
  DashboardAccess,
  dateTime,
  money,
  PaymentPill,
  type StripePayment,
} from "./dashboard-shared";
interface Attempt {
  id: string;
  createdAt: string;
  amountCents: number;
  currency: string;
  status: string;
  failure: string | null;
  card: { brand: string; last4: string } | null;
}
interface Refund {
  id: string;
  createdAt: string;
  amountCents: number;
  currency: string;
  status: string;
}
interface Detail {
  payment: StripePayment;
  checkedAt: string;
  attempts: { items: Attempt[]; nextCursor: string | null };
  refunds: { items: Refund[]; nextCursor: string | null };
}
function DetailBody({ reference }: { reference: string }) {
  const [request, setRequest] = useState<{
    kind: "refresh" | "attempts" | "refunds";
    cursor?: string;
  }>({ kind: "refresh" });
  const [detail, setDetail] = useState<Detail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError("");
    if (request.kind === "refresh") setDetail(null);
    const query = new URLSearchParams();
    if (request.cursor)
      query.set(request.kind === "attempts" ? "attemptAfter" : "refundAfter", request.cursor);
    staffJson<Detail>(
      `/staff/payments/${encodeURIComponent(reference)}${query.size ? `?${query}` : ""}`,
      {
        signal: controller.signal,
      },
    )
      .then((data) => {
        if (!controller.signal.aborted)
          setDetail((current) => {
            if (!current || request.kind === "refresh") return data;
            return {
              ...data,
              attempts:
                request.kind === "attempts"
                  ? {
                      ...data.attempts,
                      items: [
                        ...new Map(
                          [...current.attempts.items, ...data.attempts.items].map((a) => [a.id, a]),
                        ).values(),
                      ],
                    }
                  : current.attempts,
              refunds:
                request.kind === "refunds"
                  ? {
                      ...data.refunds,
                      items: [
                        ...new Map(
                          [...current.refunds.items, ...data.refunds.items].map((a) => [a.id, a]),
                        ).values(),
                      ],
                    }
                  : current.refunds,
            };
          });
      })
      .catch((e) => {
        if (!controller.signal.aborted) {
          setDetail(null);
          setError(
            e instanceof Error
              ? e.message
              : "Stripe is unavailable. Payment status has not been confirmed.",
          );
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [reference, request]);
  const payment = detail?.payment;
  return (
    <>
      <BackLink href="/staff/payments">Stripe Payments</BackLink>
      <PageBand
        eyebrow="Read-only payment details"
        title="Payment verification"
        subtitle="Current provider details alongside the Flow order record."
        actions={
          <button
            className="staff-btn secondary"
            disabled={loading}
            onClick={() => setRequest({ kind: "refresh" })}
          >
            Refresh from Stripe
          </button>
        }
      />
      {error ? (
        <p className="staff-alert error" role="alert">
          {error}
        </p>
      ) : null}
      {loading && !detail ? (
        <SkeletonRows rows={6} />
      ) : detail && payment ? (
        <>
          <div className="staff-payment-context" role="status">
            <span className={`staff-pill ${payment.mode === "live" ? "green" : "amber"}`}>
              {payment.mode === "live" ? "Live mode" : "Test mode"}
            </span>
            <span>Checked {dateTime(detail.checkedAt)}</span>
          </div>
          {payment.discrepancy ? (
            <p role="alert" className="staff-alert error">
              {payment.discrepancy} Review the payment references before contacting the customer.
              This screen does not change Flow payment status.
            </p>
          ) : null}
          <div className="staff-dashboard-detail-grid">
            <section className="staff-panel staff-panel-body">
              <h2>Stripe payment</h2>
              <dl className="staff-dashboard-facts">
                <dt>Reference</dt>
                <dd className="staff-payment-reference">
                  {payment.id}
                  <CopyButton value={payment.id} label="payment reference" />
                </dd>
                {payment.paymentIntentId && payment.paymentIntentId !== payment.id ? (
                  <>
                    <dt>Payment intent</dt>
                    <dd className="staff-payment-reference">
                      {payment.paymentIntentId}
                      <CopyButton value={payment.paymentIntentId} label="payment intent" />
                    </dd>
                  </>
                ) : null}
                {payment.chargeId && payment.chargeId !== payment.id ? (
                  <>
                    <dt>Charge</dt>
                    <dd className="staff-payment-reference">
                      {payment.chargeId}
                      <CopyButton value={payment.chargeId} label="charge reference" />
                    </dd>
                  </>
                ) : null}
                <dt>Created</dt>
                <dd>{dateTime(payment.createdAt)}</dd>
                <dt>Status</dt>
                <dd>
                  <PaymentPill status={payment.status} />
                </dd>
                <dt>Amount</dt>
                <dd>{money(payment.amountCents, payment.currency)}</dd>
                <dt>Refunded</dt>
                <dd>{money(payment.refundedCents, payment.currency)}</dd>
                <dt>Customer</dt>
                <dd>{payment.customerName || "Unavailable"}</dd>
                <dt>Email</dt>
                <dd>{payment.email || "Unavailable"}</dd>
                <dt>Card</dt>
                <dd>
                  {payment.card
                    ? `${payment.card.brand} ending ${payment.card.last4}`
                    : "Unavailable"}
                </dd>
              </dl>
              {payment.failure ? <p>{payment.failure}</p> : null}
            </section>
            <section className="staff-panel staff-panel-body">
              <h2>Flow order</h2>
              {payment.order ? (
                <>
                  <dl className="staff-dashboard-facts">
                    <dt>Order</dt>
                    <dd>
                      {payment.order.publicNumber}
                      <CopyButton value={payment.order.publicNumber} label="order number" />
                    </dd>
                    <dt>Payment status</dt>
                    <dd>
                      <PaymentPill status={payment.order.paymentStatus} />
                    </dd>
                    <dt>Order amount</dt>
                    <dd>{money(payment.order.amountCents, payment.order.currency)}</dd>
                  </dl>
                  <Link
                    className="staff-btn secondary"
                    href={`/staff/unpaid-orders/${payment.order.id}`}
                  >
                    Contact and follow-up history
                  </Link>
                </>
              ) : (
                <p>
                  No matching order was found in Flow. This payment is still visible because it
                  exists in Stripe.
                </p>
              )}
            </section>
          </div>
          <section className="staff-panel staff-panel-body">
            <h2>Payment attempts</h2>
            {detail.attempts.items.length ? (
              <ul className="staff-payment-records">
                {detail.attempts.items.map((attempt) => (
                  <li key={attempt.id}>
                    <div className="staff-dashboard-history-heading">
                      <strong className="staff-payment-reference">{attempt.id}</strong>
                      <PaymentPill status={attempt.status} />
                      <span>{money(attempt.amountCents, attempt.currency)}</span>
                      <time dateTime={attempt.createdAt}>{dateTime(attempt.createdAt)}</time>
                    </div>
                    {attempt.card ? (
                      <p>
                        {attempt.card.brand} ending {attempt.card.last4}
                      </p>
                    ) : null}
                    {attempt.failure ? <p>{attempt.failure}</p> : null}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No charge attempts have been recorded for this payment.</p>
            )}
            {detail.attempts.nextCursor ? (
              <button
                className="staff-btn secondary"
                disabled={loading}
                onClick={() =>
                  setRequest({ kind: "attempts", cursor: detail.attempts.nextCursor ?? undefined })
                }
              >
                Load older attempts
              </button>
            ) : null}
          </section>
          <section className="staff-panel staff-panel-body">
            <h2>Refund history</h2>
            {detail.refunds.items.length ? (
              <ul className="staff-payment-records">
                {detail.refunds.items.map((refund) => (
                  <li key={refund.id}>
                    <div className="staff-dashboard-history-heading">
                      <strong className="staff-payment-reference">{refund.id}</strong>
                      <span className="staff-pill gray">{refund.status}</span>
                      <span>{money(refund.amountCents, refund.currency)}</span>
                      <time dateTime={refund.createdAt}>{dateTime(refund.createdAt)}</time>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No refunds recorded.</p>
            )}
            {detail.refunds.nextCursor ? (
              <button
                className="staff-btn secondary"
                disabled={loading}
                onClick={() =>
                  setRequest({ kind: "refunds", cursor: detail.refunds.nextCursor ?? undefined })
                }
              >
                Load older refunds
              </button>
            ) : null}
          </section>
        </>
      ) : null}
    </>
  );
}
export function StripePaymentDetail({ reference }: { reference: string }) {
  return (
    <DashboardAccess>
      <DetailBody reference={reference} />
    </DashboardAccess>
  );
}
