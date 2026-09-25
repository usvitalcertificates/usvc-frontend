"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { staffJson, staffRole } from "@/lib/staff-client";
import { useInactivitySignout, useRequireStaffAuth } from "@/lib/staff-auth-hook";
import {
  BackLink,
  EmptyState,
  PageBand,
  Pagination,
  SkeletonRows,
  StatusPill,
} from "@/components/staff/ui";
import { CopyIconButton } from "@/components/staff/CopyButton";

interface OrderActivitySummary {
  id: string;
  publicNumber: string;
  certificate: string;
  stateCode: string;
  county: string;
  rush: boolean;
  status: string;
  activityCount: number;
  latestActivityAt: string | null;
}

export default function OrdersAnalyticsList() {
  useRequireStaffAuth();
  useInactivitySignout();
  const [isAdmin, setIsAdmin] = useState(false);
  const [orderActivity, setOrderActivity] = useState<OrderActivitySummary[]>([]);
  const [orderActivityTotal, setOrderActivityTotal] = useState(0);
  const [activityPage, setActivityPage] = useState(1);
  const [activityPages, setActivityPages] = useState(1);
  const [activitySearch, setActivitySearch] = useState("");
  const [activityLoading, setActivityLoading] = useState(true);
  const [error, setError] = useState("");

  const loadOrderActivity = useCallback(async () => {
    setActivityLoading(true);
    try {
      const search = new URLSearchParams({ page: String(activityPage), limit: "20" });
      if (activitySearch.trim()) search.set("search", activitySearch.trim());
      const result = await staffJson<{
        orders: OrderActivitySummary[];
        total: number;
        pages: number;
      }>(`/admin/order-activity?${search}`);
      setOrderActivity(result.orders);
      setOrderActivityTotal(result.total);
      setActivityPages(result.pages);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load order activity");
    } finally {
      setActivityLoading(false);
    }
  }, [activityPage, activitySearch]);

  useEffect(() => {
    setIsAdmin(staffRole() === "ADMIN");
  }, []);

  useEffect(() => {
    if (isAdmin) void loadOrderActivity();
  }, [isAdmin, loadOrderActivity]);

  if (!isAdmin) {
    return (
      <>
        <BackLink href="/staff">← Back to Open Orders</BackLink>
        <p role="alert" className="staff-alert error">
          Orders analytics is restricted to ADMIN.
        </p>
      </>
    );
  }

  return (
    <>
      <PageBand
        eyebrow="Administration — orders analytics"
        title="Orders Analytics"
        subtitle="Every order with recorded staff activity — search and open any audit timeline."
      />
      {error ? (
        <p role="alert" className="staff-alert error">
          {error}
        </p>
      ) : null}

      <div className="staff-panel">
        <div className="staff-order-activity-head">
          <p className="staff-orders-count" role="status">
            {activityLoading
              ? "Loading orders…"
              : `Showing ${orderActivity.length} of ${orderActivityTotal} orders`}
          </p>
          <div className="staff-orders-search">
            <label className="search">
              Search order number
              <input
                value={activitySearch}
                placeholder="USCA-BT-…"
                onChange={(event) => {
                  setActivitySearch(event.target.value);
                  setActivityPage(1);
                }}
              />
            </label>
            {activitySearch.trim() ? (
              <button
                type="button"
                className="staff-btn secondary"
                onClick={() => {
                  setActivitySearch("");
                  setActivityPage(1);
                }}
              >
                Clear
              </button>
            ) : null}
          </div>
        </div>
        {activityLoading ? (
          <SkeletonRows rows={6} />
        ) : orderActivity.length === 0 ? (
          <EmptyState title="No order activity found." hint="Try another order number." />
        ) : (
          <div className="staff-tablewrap">
            <table className="staff-table staff-cards-fallback staff-order-activity-table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Certificate</th>
                  <th>Current status</th>
                  <th>Total activity</th>
                  <th>Latest activity</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {orderActivity.map((order) => (
                  <tr key={order.id}>
                    <td>
                      <span className="staff-ordercell">
                        <CopyIconButton value={order.publicNumber} label="order number" />
                        <span>
                          <strong>{order.publicNumber}</strong>
                          {order.rush ? <span className="staff-pill amber">RUSH</span> : null}
                        </span>
                      </span>
                    </td>
                    <td>
                      {order.stateCode} {order.certificate}
                      <br />
                      <span className="staff-row-meta">{order.county || "—"}</span>
                    </td>
                    <td>
                      <StatusPill status={order.status} />
                    </td>
                    <td>
                      <span className="staff-activity-count">{order.activityCount}</span>
                    </td>
                    <td className="staff-analytics-date">
                      {order.latestActivityAt
                        ? new Date(order.latestActivityAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                        : "—"}
                      {order.latestActivityAt ? (
                        <span>
                          {new Date(order.latestActivityAt).toLocaleTimeString("en-US", {
                            hour: "numeric",
                            minute: "2-digit",
                          })}
                        </span>
                      ) : null}
                    </td>
                    <td>
                      <Link
                        className="staff-btn secondary"
                        href={`/staff/admin/orders-analytics/${order.id}`}
                      >
                        View activity
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <Pagination page={activityPage} pages={activityPages} onChange={setActivityPage} />
    </>
  );
}
