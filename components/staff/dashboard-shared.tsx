"use client";

import { useEffect, useState, type ReactNode } from "react";
import { staffRole } from "@/lib/staff-client";
import { useInactivitySignout, useRequireStaffAuth } from "@/lib/staff-auth-hook";

export const OUTCOME_LABELS: Record<string, string> = {
  NOT_CONTACTED: "Not contacted",
  ATTEMPTED_CONTACT: "Attempted contact",
  CONTACTED: "Contacted",
  FOLLOW_UP_LATER: "Follow up later",
  NOT_INTERESTED: "Not interested",
};
export function DashboardAccess({ children }: { children: ReactNode }) {
  useRequireStaffAuth();
  useInactivitySignout();
  const [allowed, setAllowed] = useState<boolean | null>(null);
  useEffect(() => {
    const role = staffRole();
    setAllowed(role === "ADMIN" || role === "CS");
  }, []);
  if (allowed === null) return <p role="status">Checking access…</p>;
  if (!allowed)
    return (
      <p className="staff-alert error" role="alert">
        This dashboard is restricted to ADMIN and CS roles.
      </p>
    );
  return <>{children}</>;
}
export function money(cents: number, currency = "usd") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(cents / 100);
}
export function dateTime(value: string) {
  return new Date(value).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" });
}
const PAYMENT_LABELS: Record<string, string> = {
  PENDING: "Pending",
  FAILED: "Failed",
  REFUNDED: "Refunded",
  PAID: "Paid",
  succeeded: "Succeeded",
  failed: "Failed",
  pending: "Pending",
  processing: "Processing",
  requires_action: "Needs verification",
  requires_capture: "Awaiting capture",
  canceled: "Cancelled",
  requires_confirmation: "Awaiting confirmation",
  awaiting_payment: "Awaiting payment",
  refunded: "Refunded",
  partially_refunded: "Partially refunded",
};
export function PaymentPill({ status }: { status: string }) {
  const tone = ["PAID", "succeeded"].includes(status)
    ? "green"
    : ["FAILED", "failed"].includes(status)
      ? "red"
      : "gray";
  return (
    <span className={`staff-pill ${tone}`}>
      {PAYMENT_LABELS[status] ?? status.replaceAll("_", " ")}
    </span>
  );
}
export interface UnpaidOrder {
  id: string;
  publicNumber: string;
  certificate: string;
  stateCode: string;
  stateName: string;
  customerName: string;
  email: string;
  phone: string;
  createdAt: string;
  amountCents: number;
  currency: string;
  paymentStatus: string;
  status: string;
  outcome: string;
  unresolved: boolean;
}
export interface StripePayment {
  id: string;
  paymentIntentId: string | null;
  chargeId: string | null;
  createdAt: string;
  amountCents: number;
  currency: string;
  status: string;
  stripeStatus: string;
  refundedCents: number;
  customerName: string;
  email: string;
  mode: string;
  card: { brand: string; last4: string } | null;
  failure: string | null;
  discrepancy: string | null;
  order: {
    id: string;
    publicNumber: string;
    paymentStatus: string;
    amountCents: number;
    currency: string;
  } | null;
}
