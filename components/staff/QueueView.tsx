"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { staffFetch } from "@/lib/staff-client";
import { useInactivitySignout, useRequireStaffAuth } from "@/lib/staff-auth-hook";
import {
  EmptyState,
  PageBand,
  Pagination,
  SkeletonRows,
  StatCard,
  StatusPill,
  Toast,
} from "@/components/staff/ui";

interface QueueOrder {
  id: string;
  publicNumber: string;
  certificate: string;
  stateCode: string;
  county: string;
  requestor: string;
  copies: number;
  rush: boolean;
  status: string;
  assignedToMe: boolean;
  assignedName: string | null;
  createdAt: string;
}

export interface QueuePreset {
  status?: string;
  assigned?: string;
  openOnly?: boolean;
}

function ageLabel(createdAt: string): string {
  const days = Math.floor((Date.now() - new Date(createdAt).getTime()) / 86_400_000);
  if (days <= 0) return "Today";
  if (days === 1) return "1 day";
  return `${days} days`;
}

export function QueueView({
  title,
  subtitle,
  preset,
  showKpis,
}: {
  title: string;
  subtitle: string;
  preset: QueuePreset;
  showKpis?: boolean;
}) {
  useRequireStaffAuth();
  useInactivitySignout();
  const [orders, setOrders] = useState<QueueOrder[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState(preset.status ?? "");
  const [certificate, setCertificate] = useState("");
  const [assigned, setAssigned] = useState(preset.assigned ?? "all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [kpis, setKpis] = useState({ unassigned: 0, mine: 0, attention: 0, rush: 0 });

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({ page: String(page), assigned });
      if (preset.openOnly) params.set("openOnly", "true");
      if (search.trim()) params.set("search", search.trim());
      if (status) params.set("status", status);
      if (certificate) params.set("certificate", certificate);
      const response = await staffFetch(`/staff/orders?${params.toString()}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Could not load the queue");
      setOrders(data.orders);
      setTotal(data.total);
      setPages(data.pages);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load the queue");
    } finally {
      setLoading(false);
    }
  }, [page, assigned, search, status, certificate, preset.openOnly]);

  useEffect(() => {
    void load();
  }, [load]);

  // KPI counts for the open queue (single extra queries would cost more;
  // derive from one unassigned + one mine fetch).
  useEffect(() => {
    if (!showKpis) return;
    let cancelled = false;
    (async () => {
      try {
        const [unassigned, mine] = await Promise.all([
          (await staffFetch("/staff/orders?openOnly=true&assigned=unassigned")).json(),
          (await staffFetch("/staff/orders?openOnly=true&assigned=mine")).json(),
        ]);
        if (cancelled) return;
        const u = unassigned.orders as QueueOrder[];
        const m = mine.orders as QueueOrder[];
        setKpis({
          unassigned: unassigned.total as number,
          mine: mine.total as number,
          attention: [...u, ...m].filter((o) => o.status === "ON_HOLD" || o.status === "NEED_INFO")
            .length,
          rush: [...u, ...m].filter((o) => o.rush).length,
        });
      } catch {
        /* KPIs are decorative; the table is authoritative. */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [showKpis, orders.length]);

  const claim = async (id: string, publicNumber: string) => {
    setError("");
    try {
      const response = await staffFetch(`/staff/orders/${id}/claim`, { method: "POST" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Could not claim this order");
      setToast(`Order ${publicNumber} claimed — it is now in My Work.`);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not claim this order");
    }
  };

  const resetPage = () => setPage(1);

  return (
    <>
      <PageBand
        eyebrow="Internal — Authorized staff only"
        title={title}
        subtitle={`${subtitle} Showing ${orders.length} of ${total}.`}
      />
      {toast ? <Toast message={toast} onDone={() => setToast("")} /> : null}
      {error ? (
        <p role="alert" className="staff-alert error">
          {error}
        </p>
      ) : null}

      {showKpis ? (
        <div className="staff-stats">
          <StatCard value={kpis.unassigned} label="Unassigned open" />
          <StatCard value={kpis.mine} label="Assigned to me" />
          <StatCard value={kpis.attention} label="On hold / need info" />
          <StatCard value={kpis.rush} label="Rush open" />
        </div>
      ) : null}

      <div className="staff-panel">
        <div className="staff-filters" role="search" aria-label="Queue filters">
          <label className="search">
            Search
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                resetPage();
              }}
              placeholder="Order number, name, or email"
            />
          </label>
          {!preset.status ? (
            <label>
              Substatus
              <select
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value);
                  resetPage();
                }}
              >
                <option value="">All Substatuses</option>
                <option value="PAID">Payment Successful</option>
                <option value="IN_REVIEW">Order Processing</option>
                <option value="ON_HOLD">On Hold</option>
                <option value="NEED_INFO">Need Customer Information</option>
                <option value="SUBMITTED">Submitted to Govt Agency</option>
              </select>
            </label>
          ) : null}
          <label>
            Order Type
            <select
              value={certificate}
              onChange={(e) => {
                setCertificate(e.target.value);
                resetPage();
              }}
            >
              <option value="">All Order Types</option>
              <option value="BIRTH">Birth</option>
              <option value="DEATH">Death</option>
              <option value="MARRIAGE">Marriage</option>
              <option value="DIVORCE">Divorce</option>
            </select>
          </label>
          {!preset.assigned ? (
            <label>
              Assignment
              <select
                value={assigned}
                onChange={(e) => {
                  setAssigned(e.target.value);
                  resetPage();
                }}
              >
                <option value="all">Queue + my work</option>
                <option value="unassigned">Unassigned only</option>
                <option value="mine">Assigned to me</option>
              </select>
            </label>
          ) : null}
        </div>

        {loading ? (
          <SkeletonRows rows={6} />
        ) : orders.length === 0 ? (
          <EmptyState
            title="No orders match these filters."
            hint="Try widening the search or substatus."
          />
        ) : (
          <div className="staff-tablewrap">
            <table className="staff-table staff-cards-fallback">
              <thead>
                <tr>
                  <th>Submit Time</th>
                  <th>Order #</th>
                  <th>Certificate</th>
                  <th>Substatus</th>
                  <th>Owner</th>
                  <th>Requestor</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td style={{ whiteSpace: "nowrap" }}>
                      {new Date(order.createdAt).toLocaleString("en-US")}
                      <br />
                      <span style={{ fontSize: "0.82rem", color: "var(--muted-text)" }}>
                        {ageLabel(order.createdAt)} old
                      </span>
                    </td>
                    <td>
                      <strong>{order.publicNumber}</strong>{" "}
                      {order.rush ? <span className="staff-pill red">RUSH</span> : null}
                      <br />
                      <span style={{ fontSize: "0.82rem", color: "var(--muted-text)" }}>
                        {order.copies} {order.copies === 1 ? "copy" : "copies"}
                      </span>
                    </td>
                    <td>
                      {order.stateCode}{" "}
                      {order.certificate.charAt(0) + order.certificate.slice(1).toLowerCase()}
                      <br />
                      <span style={{ fontSize: "0.82rem", color: "var(--muted-text)" }}>
                        {order.county}
                      </span>
                    </td>
                    <td>
                      <StatusPill status={order.status} />
                    </td>
                    <td>{order.assignedName ?? "Unassigned"}</td>
                    <td>{order.requestor}</td>
                    <td style={{ whiteSpace: "nowrap" }}>
                      {order.assignedToMe || order.assignedName ? (
                        <Link className="staff-btn secondary" href={`/staff/${order.id}`}>
                          Open
                        </Link>
                      ) : (
                        <button
                          type="button"
                          className="staff-btn"
                          onClick={() => void claim(order.id, order.publicNumber)}
                        >
                          Claim
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <Pagination page={page} pages={pages} onChange={setPage} />
    </>
  );
}
