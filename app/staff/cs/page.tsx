"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { staffJson, staffRole } from "@/lib/staff-client";
import { useInactivitySignout, useRequireStaffAuth } from "@/lib/staff-auth-hook";
import { BackLink, EmptyState, PageBand, Toast } from "@/components/staff/ui";

interface CsOrder {
  id: string;
  publicNumber: string;
  certificate: string;
  stateCode: string;
  county: string;
  requestor: string;
  copies: number;
  rush: boolean;
  status: string;
  assignedName: string | null;
  createdAt: string;
}

export default function CsCorrections() {
  useRequireStaffAuth();
  useInactivitySignout();
  const [allowed, setAllowed] = useState(false);
  const [orders, setOrders] = useState<CsOrder[]>([]);
  const [error, setError] = useState("");
  const [toast, setToast] = useState<{ text: string; href: string } | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setError("");
    setLoading(true);
    try {
      const res = await staffJson<{ orders: CsOrder[] }>(`/staff/orders?status=${"TO_CS"}`);
      setOrders(res.orders ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load corrections");
    } finally {
      setLoading(false);
    }
  }, []);

  const claim = async (id: string, publicNumber: string) => {
    setError("");
    try {
      await staffJson(`/staff/orders/${id}/claim`, { method: "POST", body: "{}" });
      setToast({ text: `You took ownership of ${publicNumber}.`, href: `/staff/cs/edit/${id}` });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not take ownership");
    }
  };

  useEffect(() => {
    const role = staffRole();
    setAllowed(role === "ADMIN" || role === "CS");
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
      {toast ? (
        <Toast
          message={toast.text}
          action={<Link href={toast.href}>Open editor →</Link>}
          onDone={() => setToast(null)}
        />
      ) : null}
      {error ? (
        <p role="alert" className="staff-alert error">
          {error}
        </p>
      ) : null}
      <div className="staff-panel">
        <div className="staff-panel-body">
          {loading ? (
            <p>Loading corrections…</p>
          ) : orders.length === 0 ? (
            <EmptyState
              title="No orders need correction."
              hint="Orders appear here when fulfillment sends them To CS with an internal note."
            />
          ) : (
            <div className="staff-tablewrap">
              <table className="staff-table">
                <thead>
                  <tr>
                    <th>Order</th>
                    <th>Status</th>
                    <th>County</th>
                    <th>Requestor</th>
                    <th>Owner</th>
                    <th>Open</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => (
                    <tr key={o.id}>
                      <td>
                        <strong>{o.publicNumber}</strong>{" "}
                        {o.rush ? <span className="staff-pill amber">RUSH</span> : null}
                        <br />
                        <span style={{ color: "var(--muted-text)" }}>
                          {o.stateCode} {o.certificate}
                        </span>
                      </td>
                      <td>{o.status}</td>
                      <td>{o.county || "—"}</td>
                      <td>{o.requestor}</td>
                      <td>{o.assignedName ?? "Unassigned"}</td>
                      <td style={{ whiteSpace: "nowrap" }}>
                        {!o.assignedName ? (
                          <button
                            type="button"
                            className="staff-btn"
                            onClick={() => void claim(o.id, o.publicNumber)}
                          >
                            Take Ownership
                          </button>
                        ) : (
                          <Link href={`/staff/cs/edit/${o.id}`}>Open</Link>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
