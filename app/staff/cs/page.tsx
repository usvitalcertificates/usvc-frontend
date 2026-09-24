"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { staffJson, staffRole } from "@/lib/staff-client";
import { useInactivitySignout, useRequireStaffAuth } from "@/lib/staff-auth-hook";
import { BackLink, EmptyState, PageBand, TimedActionModal } from "@/components/staff/ui";

interface CsOrder {
  id: string;
  publicNumber: string;
  certificate: string;
  stateCode: string;
  county: string;
  requestor: string;
  copies: number;
  rush: boolean;
  assignedToMe: boolean;
  assignedName: string | null;
  lastNote: string | null;
  sentToCsAt: string | null;
  createdAt: string;
}

export default function CsCorrections() {
  useRequireStaffAuth();
  useInactivitySignout();
  const [allowed, setAllowed] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [orders, setOrders] = useState<CsOrder[]>([]);
  const [error, setError] = useState("");
  const [claimed, setClaimed] = useState<{ number: string; id: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [certificate, setCertificate] = useState("");
  const [assigned, setAssigned] = useState("all");
  const [rushOnly, setRushOnly] = useState(false);

  const load = useCallback(async () => {
    setError("");
    setLoading(true);
    try {
      const params = new URLSearchParams({ status: "TO_CS", assigned });
      if (search.trim()) params.set("search", search.trim());
      if (certificate) params.set("certificate", certificate);
      if (rushOnly) params.set("rushOnly", "true");
      const res = await staffJson<{ orders: CsOrder[] }>(`/staff/orders?${params.toString()}`);
      setOrders(res.orders ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load corrections");
    } finally {
      setLoading(false);
    }
  }, [search, certificate, assigned, rushOnly]);

  const claim = async (id: string, publicNumber: string) => {
    setError("");
    try {
      await staffJson(`/staff/orders/${id}/claim`, { method: "POST", body: "{}" });
      setClaimed({ number: publicNumber, id });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not take ownership");
    }
  };

  useEffect(() => {
    const role = staffRole();
    setAllowed(role === "ADMIN" || role === "CS");
    setIsAdmin(role === "ADMIN");
    if (role === "ADMIN" || role === "CS") void load();
    else setLoading(false);
  }, [load]);

  if (!allowed && !loading) {
    return (
      <>
        <BackLink href="/staff">← Back to Open Orders</BackLink>
        <p role="alert" className="staff-alert error">
          CS corrections are restricted to CS and ADMIN roles.
        </p>
      </>
    );
  }

  return (
    <>
      <PageBand
        eyebrow="CS — form corrections"
        title="Corrections inbox"
        subtitle="Orders sent To CS with a problem note. Take ownership, open the form, fix it, then mark it GTG so fulfillment can continue."
      />
      {claimed ? (
        <TimedActionModal
          key={claimed.id}
          title="Ownership taken"
          orderNumber={claimed.number}
          primaryLabel="Open Order"
          primaryHref={`/staff/cs/edit/${claimed.id}`}
          seconds={10}
          onClose={() => setClaimed(null)}
        />
      ) : null}
      {error ? (
        <p role="alert" className="staff-alert error">
          {error}
        </p>
      ) : null}
      <div className="staff-panel">
        <div className="staff-filters" role="search" aria-label="Corrections filters">
          <label className="search">
            Search
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Order number, name, or email…"
              autoComplete="off"
            />
          </label>
          <label>
            Certificate type
            <select value={certificate} onChange={(e) => setCertificate(e.target.value)}>
              <option value="">All certificate types</option>
              <option value="BIRTH">Birth</option>
              <option value="DEATH">Death</option>
              <option value="MARRIAGE">Marriage</option>
              <option value="DIVORCE">Divorce</option>
            </select>
          </label>
          <label>
            Assignment
            <select value={assigned} onChange={(e) => setAssigned(e.target.value)}>
              <option value="all">All orders</option>
              <option value="unassigned">Unassigned only</option>
              <option value="mine">Assigned to me</option>
            </select>
          </label>
          <div className="staff-filter-action">
            <button
              type="button"
              className={`staff-btn${rushOnly ? "" : " secondary"}`}
              aria-pressed={rushOnly}
              onClick={() => setRushOnly((v) => !v)}
            >
              Rush
            </button>
          </div>
        </div>
        {!loading && (
          <p className="staff-queue-count">
            {orders.length} order{orders.length === 1 ? "" : "s"} need
            {orders.length === 1 ? "s" : ""} correction.
          </p>
        )}
        {loading ? (
          <p className="staff-queue-loading">Loading corrections…</p>
        ) : orders.length === 0 ? (
          <EmptyState
            title="No orders need correction."
            hint="Orders appear here when fulfillment sends them To CS with an internal note."
          />
        ) : (
          <div className="staff-tablewrap">
            <table className="staff-table staff-cards-fallback staff-corrections-table">
              <thead>
                <tr>
                  <th>Sent to CS</th>
                  <th>Order #</th>
                  <th>Certificate</th>
                  <th>Owner</th>
                  <th>Requestor</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id}>
                    <td className="staff-correction-handoff">
                      {o.sentToCsAt ? (
                        <>
                          <span className="staff-date">
                            {new Date(o.sentToCsAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                        </>
                      ) : (
                        <span className="staff-date">Unavailable</span>
                      )}
                    </td>
                    <td className="staff-correction-order">
                      <strong>{o.publicNumber}</strong>{" "}
                      {o.rush ? <span className="staff-pill amber">RUSH</span> : null}
                      <br />
                      <span className="staff-row-meta">
                        {o.copies} {o.copies === 1 ? "copy" : "copies"}
                      </span>
                      {o.lastNote ? (
                        <span className="staff-correction-note">
                          <strong>Correction needed</strong>
                          <span>{o.lastNote}</span>
                        </span>
                      ) : null}
                    </td>
                    <td>
                      {o.stateCode} {o.certificate.charAt(0) + o.certificate.slice(1).toLowerCase()}
                      <br />
                      <span className="staff-row-meta">{o.county || "—"}</span>
                    </td>
                    <td>{o.assignedName ?? "Unassigned"}</td>
                    <td>{o.requestor}</td>
                    <td className="staff-correction-action">
                      {!o.assignedName ? (
                        <button
                          type="button"
                          className="staff-btn"
                          onClick={() => void claim(o.id, o.publicNumber)}
                        >
                          Take Ownership
                        </button>
                      ) : o.assignedToMe || isAdmin ? (
                        <Link className="staff-btn green" href={`/staff/cs/edit/${o.id}`}>
                          Open Order
                        </Link>
                      ) : (
                        <button
                          type="button"
                          className="staff-btn green"
                          disabled
                          title={`Claimed by ${o.assignedName} — only the owner can open it`}
                        >
                          Open Order
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
    </>
  );
}
