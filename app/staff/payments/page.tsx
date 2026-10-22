"use client";

import { DateInput } from "@/components/DateInput";

import { useEffect, useState, type FormEvent } from "react";
import { staffJson } from "@/lib/staff-client";
import { EmptyState, PageBand, SkeletonRows } from "@/components/staff/ui";
import { DashboardAccess, dateTime, type StripePayment } from "@/components/staff/dashboard-shared";
import { StripePaymentTable } from "@/components/staff/StripePaymentTable";
type Filters = { lookup: string; from: string; to: string };
const initial = { lookup: "", from: "", to: "" };
interface Result {
  payments: StripePayment[];
  nextCursor: string | null;
  hasMore: boolean;
  checkedAt: string;
  mode: string;
  scanning: boolean;
}
function Payments() {
  const [draft, setDraft] = useState<Filters>(initial);
  const [request, setRequest] = useState<{ filters: Filters; cursor?: string; append: boolean }>({
    filters: initial,
    append: false,
  });
  const [payments, setPayments] = useState<StripePayment[]>([]);
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError("");
    if (!request.append) {
      setPayments([]);
      setResult(null);
    }
    const body = {
      ...Object.fromEntries(Object.entries(request.filters).filter(([, value]) => value !== "")),
      ...(request.cursor ? { cursor: request.cursor } : {}),
    };
    staffJson<Result>("/staff/payments/search", {
      method: "POST",
      body: JSON.stringify(body),
      signal: controller.signal,
    })
      .then((data) => {
        if (!controller.signal.aborted) {
          setResult(data);
          setPayments((current) =>
            request.append
              ? [...new Map([...current, ...data.payments].map((p) => [p.id, p])).values()]
              : data.payments,
          );
        }
      })
      .catch((e) => {
        if (!controller.signal.aborted) {
          setPayments([]);
          setResult(null);
          setError(
            e instanceof Error
              ? e.message
              : "Payment history is unavailable. Status has not been confirmed.",
          );
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [request]);
  function submit(event: FormEvent) {
    event.preventDefault();
    setRequest({ filters: { ...draft }, append: false });
  }
  return (
    <>
      <PageBand
        eyebrow="Read-only payment verification"
        title="Stripe Payments"
        subtitle="Payment history directly from the connected Stripe account. Viewing or refreshing never changes a payment or order."
        actions={
          <button
            className="staff-btn secondary"
            disabled={loading}
            onClick={() => setRequest((current) => ({ filters: current.filters, append: false }))}
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
      {result ? (
        <div className="staff-payment-context" role="status">
          <span className={`staff-pill ${result.mode === "live" ? "green" : "amber"}`}>
            {result.mode === "live" ? "Live mode" : "Test mode"}
          </span>
          <span>
            Checked {dateTime(result.checkedAt)} · {payments.length} payments shown
          </span>
        </div>
      ) : null}
      <div className="staff-panel">
        <form
          className="staff-filters staff-dashboard-filters"
          onSubmit={submit}
          aria-label="Stripe payment filters"
        >
          <label className="search">
            Exact lookup
            <input
              value={draft.lookup}
              onChange={(e) => setDraft((current) => ({ ...current, lookup: e.target.value }))}
              placeholder="Order number, pi_… or ch_…"
              maxLength={120}
              autoComplete="off"
            />
          </label>
          <label>
            From
            <DateInput
              value={draft.from}
              onValueChange={(date) => setDraft((current) => ({ ...current, from: date }))}
            />
          </label>
          <label>
            Through
            <DateInput
              min={draft.from || undefined}
              value={draft.to}
              onValueChange={(date) => setDraft((current) => ({ ...current, to: date }))}
            />
          </label>
          <button type="submit" className="staff-btn" disabled={loading}>
            Look up payments
          </button>
          <button
            type="button"
            className="staff-btn secondary"
            disabled={loading}
            onClick={() => {
              setDraft(initial);
              setRequest({ filters: initial, append: false });
            }}
          >
            All history
          </button>
        </form>
        {loading && !request.append ? (
          <SkeletonRows rows={6} />
        ) : payments.length ? (
          <StripePaymentTable payments={payments} />
        ) : !error && !loading ? (
          <EmptyState
            title={result?.hasMore ? "No matches in this part of history" : "No matching payments"}
            hint={
              result?.hasMore
                ? "Continue to older history to check earlier payment attempts for this order."
                : "Check the reference or change the date range."
            }
          />
        ) : null}
      </div>
      {result?.scanning ? (
        <p className="staff-row-meta">
          Order lookup checks older payment history in batches, including earlier attempts. Continue
          until there is no older history to check.
        </p>
      ) : null}
      {result?.nextCursor ? (
        <div className="staff-dashboard-pagination">
          <button
            className="staff-btn secondary"
            disabled={loading}
            onClick={() =>
              setRequest((current) => ({
                ...current,
                cursor: result.nextCursor ?? undefined,
                append: true,
              }))
            }
          >
            {loading ? "Loading…" : "Load older payments"}
          </button>
        </div>
      ) : null}
    </>
  );
}
export default function Page() {
  return (
    <DashboardAccess>
      <Payments />
    </DashboardAccess>
  );
}
