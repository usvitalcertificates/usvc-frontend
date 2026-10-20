"use client";

import Link from "next/link";
import { dateTime, money, PaymentPill, type StripePayment } from "./dashboard-shared";
export function StripePaymentTable({ payments }: { payments: StripePayment[] }) {
  return (
    <div className="staff-tablewrap">
      <table className="staff-table staff-cards-fallback staff-dashboard-table">
        <thead>
          <tr>
            <th>Payment / date</th>
            <th>Customer</th>
            <th>Amount</th>
            <th>Stripe status</th>
            <th>Flow order</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((payment) => (
            <tr key={payment.id}>
              <td data-label="Payment / date">
                <span className="staff-payment-reference">{payment.id}</span>
                <small className="staff-row-meta">{dateTime(payment.createdAt)}</small>
              </td>
              <td data-label="Customer">
                {payment.customerName || "Name unavailable"}
                <small className="staff-row-meta">{payment.email || "Email unavailable"}</small>
              </td>
              <td data-label="Amount">
                <strong>{money(payment.amountCents, payment.currency)}</strong>
                {payment.refundedCents ? (
                  <small className="staff-row-meta">
                    {money(payment.refundedCents, payment.currency)} refunded
                  </small>
                ) : null}
              </td>
              <td data-label="Stripe status">
                <PaymentPill status={payment.status} />
                {payment.failure ? (
                  <small className="staff-row-meta">{payment.failure}</small>
                ) : null}
              </td>
              <td data-label="Flow order">
                {payment.order ? (
                  <>
                    <Link href={`/staff/unpaid-orders/${payment.order.id}`}>
                      {payment.order.publicNumber}
                    </Link>
                    <div>
                      <PaymentPill status={payment.order.paymentStatus} />
                    </div>
                  </>
                ) : (
                  <span className="staff-pill gray">Unmatched payment</span>
                )}
                {payment.discrepancy ? (
                  <small className="staff-payment-mismatch">{payment.discrepancy}</small>
                ) : null}
              </td>
              <td data-label="Action">
                <Link className="staff-btn" href={`/staff/payments/${payment.id}`}>
                  View payment
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
