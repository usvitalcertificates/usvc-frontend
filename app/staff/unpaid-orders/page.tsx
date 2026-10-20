"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { staffJson } from "@/lib/staff-client";
import {
  EmptyState,
  PageBand,
  Pagination,
  SkeletonRows,
  StatCard,
  StatusPill,
} from "@/components/staff/ui";
import { CopyIconButton } from "@/components/staff/CopyButton";
import {
  DashboardAccess,
  dateTime,
  money,
  OUTCOME_LABELS,
  PaymentPill,
  FollowUpPill,
  type UnpaidOrder,
} from "@/components/staff/dashboard-shared";

type Filters = {
  search: string;
  paymentStatus: string;
  certificate: string;
  outcome: string;
  from: string;
  to: string;
  page: number;
};
const initial: Filters = {
  search: "",
  paymentStatus: "",
  certificate: "",
  outcome: "",
  from: "",
  to: "",
  page: 1,
};
interface Result {
  orders: UnpaidOrder[];
  total: number;
  pages: number;
  counts: Record<string, number>;
}
function UnpaidOrders() {
  const [draft, setDraft] = useState(initial);
  const [filters, setFilters] = useState(initial);
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError("");
    const body = Object.fromEntries(Object.entries(filters).filter(([, value]) => value !== ""));
    staffJson<Result>("/staff/unpaid-orders/search", {
      method: "POST",
      body: JSON.stringify(body),
      signal: controller.signal,
    })
      .then((data) => {
        if (!controller.signal.aborted) setResult(data);
      })
      .catch((e) => {
        if (!controller.signal.aborted) {
          setResult(null);
          setError(e instanceof Error ? e.message : "Could not load unpaid orders.");
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [filters]);
  const update = (field: keyof Filters, value: string) =>
    setDraft((current) => ({ ...current, [field]: value }));
  function search(event: FormEvent) {
    event.preventDefault();
    setFilters({ ...draft, page: 1 });
  }
  return (
    <>
      <PageBand
        eyebrow="Customer follow-up"
        title="Unpaid Orders"
        subtitle="Every order that is not paid, including failed and refunded payments. Contact customers and record your follow-up."
        actions={
          <button
            className="staff-btn secondary"
            onClick={() => setFilters((current) => ({ ...current }))}
          >
            Refresh
          </button>
        }
      />
      {error ? (
        <p role="alert" className="staff-alert error">
          {error}
        </p>
      ) : null}
      <div className="staff-stats">
        <StatCard label="Matching orders" value={result?.total ?? "—"} />
        <StatCard label="Pending" value={result?.counts.PENDING ?? 0} tone="amber" />
        <StatCard label="Failed" value={result?.counts.FAILED ?? 0} tone="rose" />
        <StatCard label="Refunded" value={result?.counts.REFUNDED ?? 0} tone="lavender" />
      </div>
      <div className="staff-panel">
        <form
          onSubmit={search}
          className="staff-filters staff-dashboard-filters"
          aria-label="Unpaid order filters"
        >
          <label className="search">
            Search
            <input
              value={draft.search}
              onChange={(e) => update("search", e.target.value)}
              placeholder="Order number, name, email, or phone"
              autoComplete="off"
              maxLength={120}
            />
          </label>
          <label>
            Payment status
            <select
              value={draft.paymentStatus}
              onChange={(e) => update("paymentStatus", e.target.value)}
            >
              <option value="">All unpaid statuses</option>
              <option value="PENDING">Pending</option>
              <option value="FAILED">Failed</option>
              <option value="REFUNDED">Refunded</option>
            </select>
          </label>
          <label>
            Certificate
            <select
              value={draft.certificate}
              onChange={(e) => update("certificate", e.target.value)}
            >
              <option value="">All certificates</option>
              {["BIRTH", "DEATH", "MARRIAGE", "DIVORCE"].map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </label>
          <label>
            Follow-up outcome
            <select value={draft.outcome} onChange={(e) => update("outcome", e.target.value)}>
              <option value="">All outcomes</option>
              {Object.entries(OUTCOME_LABELS).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          <label>
            From
            <input
              type="date"
              value={draft.from}
              onChange={(e) => update("from", e.target.value)}
            />
          </label>
          <label>
            Through
            <input
              type="date"
              min={draft.from || undefined}
              value={draft.to}
              onChange={(e) => update("to", e.target.value)}
            />
          </label>
          <button className="staff-btn" type="submit">
            Apply filters
          </button>
          <button
            className="staff-btn secondary"
            type="button"
            onClick={() => {
              setDraft(initial);
              setFilters({ ...initial });
            }}
          >
            Reset
          </button>
        </form>
        {loading ? (
          <SkeletonRows rows={6} />
        ) : result?.orders.length ? (
          <div className="staff-tablewrap">
            <table className="staff-table staff-cards-fallback staff-dashboard-table staff-unpaid-table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Customer</th>
                  <th>Contact</th>
                  <th>Certificate</th>
                  <th>Amount</th>
                  <th>Payment / workflow</th>
                  <th>Follow-up</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {result.orders.map((order) => (
                  <tr key={order.id}>
                    <td data-label="Order">
                      <strong>{order.publicNumber}</strong>
                      <small className="staff-row-meta">{dateTime(order.createdAt)}</small>
                    </td>
                    <td data-label="Customer">{order.customerName || "Unavailable"}</td>
                    <td data-label="Contact" className="staff-dashboard-contact">
                      <span>
                        {order.email || "No email"}
                        {order.email ? (
                          <CopyIconButton
                            value={order.email}
                            label={`email for ${order.publicNumber}`}
                          />
                        ) : null}
                      </span>
                      <span>
                        {order.phone || "No phone"}
                        {order.phone ? (
                          <CopyIconButton
                            value={order.phone}
                            label={`phone for ${order.publicNumber}`}
                          />
                        ) : null}
                      </span>
                    </td>
                    <td data-label="Certificate">
                      {order.stateCode} {order.certificate.toLowerCase()}
                    </td>
                    <td data-label="Amount">{money(order.amountCents, order.currency)}</td>
                    <td data-label="Payment / workflow">
                      <div className="staff-dashboard-pills">
                        <div className="staff-status-line">
                          <span className="staff-status-caption">Payment</span>
                          <PaymentPill status={order.paymentStatus} />
                        </div>
                        <div className="staff-status-line">
                          <span className="staff-status-caption">Workflow</span>
                          <StatusPill status={order.status} />
                        </div>
                        {order.unresolved ? (
                          <span className="staff-pill amber">Payment unresolved</span>
                        ) : null}
                      </div>
                    </td>
                    <td data-label="Follow-up">
                      <FollowUpPill outcome={order.outcome} />
                    </td>
                    <td data-label="Action">
                      <Link className="staff-btn" href={`/staff/unpaid-orders/${order.id}`}>
                        Follow up
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : !error ? (
          <EmptyState
            title="No matching unpaid orders"
            hint="Change the filters or refresh to check for new orders."
          />
        ) : null}
      </div>
      {result ? (
        <Pagination
          page={filters.page}
          pages={result.pages}
          onChange={(page) => setFilters((current) => ({ ...current, page }))}
        />
      ) : null}
    </>
  );
}
export default function Page() {
  return (
    <DashboardAccess>
      <UnpaidOrders />
    </DashboardAccess>
  );
}
