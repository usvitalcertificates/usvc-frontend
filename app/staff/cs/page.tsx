"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Clock, Inbox, UserCheck, Zap } from "lucide-react";
import { staffJson, staffRole } from "@/lib/staff-client";
import { useInactivitySignout, useRequireStaffAuth } from "@/lib/staff-auth-hook";
import {
  EmptyState,
  PageBand,
  Pagination,
  SkeletonRows,
  StatCard,
  TimedActionModal,
} from "@/components/staff/ui";

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
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [error, setError] = useState("");
  const [claimed, setClaimed] = useState<{ number: string; id: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [certificate, setCertificate] = useState("");
  const [assigned, setAssigned] = useState("all");
  const [rushOnly, setRushOnly] = useState(false);
  const [kpis, setKpis] = useState({ total: 0, unassigned: 0, mine: 0, rush: 0 });

  const load = useCallback(async () => {
    setError("");
    setLoading(true);
    try {
      const params = new URLSearchParams({ status: "TO_CS", assigned, page: String(page) });
      if (search.trim()) params.set("search", search.trim());
      if (certificate) params.set("certificate", certificate);
      if (rushOnly) params.set("rushOnly", "true");
      const res = await staffJson<{ orders: CsOrder[]; total?: number; pages?: number }>(
        `/staff/orders?${params.toString()}`,
      );
      setOrders(res.orders ?? []);
      setTotal(res.total ?? 0);
      setPages(res.pages ?? 1);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load corrections");
    } finally {
      setLoading(false);
    }
  }, [search, certificate, assigned, rushOnly, page]);

  // KPI counts for the corrections inbox. Derived from a few lightweight
  // queries so the stat cards stay accurate no matter what the table filters.
  const loadKpis = useCallback(async () => {
    try {
      const [all, unassigned, mine] = await Promise.all([
        staffJson<{ orders?: CsOrder[]; total?: number }>(`/staff/orders?status=TO_CS`),
        staffJson<{ orders?: CsOrder[]; total?: number }>(
          `/staff/orders?status=TO_CS&assigned=unassigned`,
        ),
        staffJson<{ orders?: CsOrder[]; total?: number }>(
          `/staff/orders?status=TO_CS&assigned=mine`,
        ),
      ]);
      const u = (unassigned.orders ?? []) as CsOrder[];
      const m = (mine.orders ?? []) as CsOrder[];
      setKpis({
        total: all.total ?? 0,
        unassigned: unassigned.total ?? 0,
        mine: mine.total ?? 0,
        rush: [...u, ...m].filter((o) => o.rush).length,
      });
    } catch {
      /* KPIs are decorative; the table is authoritative. */
    }
  }, []);

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
    if (role === "ADMIN" || role === "CS") {
      void load();
      void loadKpis();
    } else {
      setLoading(false);
    }
  }, [load, loadKpis]);

  const resetPage = () => setPage(1);

  if (!allowed && !loading) {
    return (
      <>
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
        subtitle={`Orders sent To CS with a problem note. Showing ${orders.length} of ${total}.`}
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

      <div className="staff-stats">
        <StatCard value={kpis.total} label="To CS" icon={<Clock aria-hidden />} tone="rose" />
        <StatCard
          value={kpis.unassigned}
          label="Unassigned"
          icon={<Inbox aria-hidden />}
          tone="blue"
        />
        <StatCard
          value={kpis.mine}
          label="Assigned to me"
          icon={<UserCheck aria-hidden />}
          tone="lavender"
        />
        <StatCard value={kpis.rush} label="Rush" icon={<Zap aria-hidden />} tone="amber" />
      </div>

      <div className="staff-panel">
        <div className="staff-filters" role="search" aria-label="Corrections filters">
          <label className="search">
            Search
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                resetPage();
              }}
              placeholder="Order number, name, or email…"
              autoComplete="off"
            />
          </label>
          <label>
            Certificate type
            <select
              value={certificate}
              onChange={(e) => {
                setCertificate(e.target.value);
                resetPage();
              }}
            >
              <option value="">All certificate types</option>
              <option value="BIRTH">Birth</option>
              <option value="DEATH">Death</option>
              <option value="MARRIAGE">Marriage</option>
              <option value="DIVORCE">Divorce</option>
            </select>
          </label>
          <label>
            Assignment
            <select
              value={assigned}
              onChange={(e) => {
                setAssigned(e.target.value);
                resetPage();
              }}
            >
              <option value="all">All orders</option>
              <option value="unassigned">Unassigned only</option>
              <option value="mine">Assigned to me</option>
            </select>
          </label>
        </div>

        <div className="staff-chips" role="group" aria-label="Quick filters">
          {(
            [
              ["all", "All"],
              ["unassigned", "Unassigned"],
              ["mine", "Mine"],
              ["rush", "Rush"],
            ] as const
          ).map(([value, label]) => {
            const active =
              value === "all"
                ? assigned === "all" && !rushOnly
                : value === "rush"
                  ? rushOnly
                  : assigned === value;
            return (
              <button
                key={value}
                type="button"
                aria-pressed={active}
                onClick={() => {
                  if (value === "all") {
                    setAssigned("all");
                    setRushOnly(false);
                  } else if (value === "rush") {
                    setRushOnly(true);
                  } else {
                    setAssigned(value);
                    setRushOnly(false);
                  }
                  resetPage();
                }}
              >
                {label}
              </button>
            );
          })}
        </div>

        {loading ? (
          <SkeletonRows rows={6} />
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
                  <th>Correction note</th>
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
                          <br />
                          <span className="staff-pill gray staff-time-badge">
                            {new Date(o.sentToCsAt).toLocaleTimeString("en-US", {
                              hour: "numeric",
                              minute: "2-digit",
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
                    </td>
                    <td>
                      {o.stateCode} {o.certificate.charAt(0) + o.certificate.slice(1).toLowerCase()}
                      <br />
                      <span className="staff-row-meta">{o.county || "—"}</span>
                    </td>
                    <td className="staff-correction-note-cell">
                      {o.lastNote ? (
                        <span className="staff-correction-note">
                          <strong>Correction needed</strong>
                          <span>{o.lastNote}</span>
                        </span>
                      ) : (
                        <span className="staff-row-meta">—</span>
                      )}
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
      <Pagination page={page} pages={pages} onChange={setPage} />
    </>
  );
}
