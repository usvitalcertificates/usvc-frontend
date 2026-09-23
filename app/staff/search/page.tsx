"use client";

import Link from "next/link";
import { Suspense, useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { staffFetch } from "@/lib/staff-client";
import { useInactivitySignout, useRequireStaffAuth } from "@/lib/staff-auth-hook";
import { EmptyState, PageBand, SkeletonRows, StatusPill } from "@/components/staff/ui";

interface Result {
  id: string;
  publicNumber: string;
  certificate: string;
  stateCode: string;
  county: string;
  requestor: string;
  status: string;
  assignedName: string | null;
  assignedToMe: boolean;
}

function SearchView() {
  useRequireStaffAuth();
  useInactivitySignout();
  const params = useSearchParams();
  const initial = params.get("q") ?? "";
  const [term, setTerm] = useState(initial);
  const [certificate, setCertificate] = useState("");
  const [results, setResults] = useState<Result[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const run = useCallback(async (query: string, cert: string) => {
    if (!query.trim() && !cert) {
      setResults(null);
      return;
    }
    setLoading(true);
    setError("");
    try {
      const search = new URLSearchParams({ page: "1", assigned: "all" });
      if (query.trim()) search.set("search", query.trim());
      if (cert) search.set("certificate", cert);
      const response = await staffFetch(`/staff/orders?${search.toString()}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Search failed");
      setResults(data.orders);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Search failed");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (initial) void run(initial, "");
  }, [initial, run]);

  return (
    <>
      <PageBand
        eyebrow="Internal — Authorized staff only"
        title="Order Search"
        subtitle="Look up any order by number, requestor name, or email. Unclaimed orders show masked rows until you claim them."
      />
      {error ? (
        <p role="alert" className="staff-alert error">
          {error}
        </p>
      ) : null}
      <div className="staff-panel">
        <form
          className="staff-filters"
          role="search"
          onSubmit={(e) => {
            e.preventDefault();
            void run(term, certificate);
          }}
        >
          <label className="search">
            Order number, name, or email
            <input value={term} onChange={(e) => setTerm(e.target.value)} placeholder="USCA-BT-…" />
          </label>
          <label>
            Order Type
            <select value={certificate} onChange={(e) => setCertificate(e.target.value)}>
              <option value="">All Order Types</option>
              <option value="BIRTH">Birth</option>
              <option value="DEATH">Death</option>
              <option value="MARRIAGE">Marriage</option>
              <option value="DIVORCE">Divorce</option>
            </select>
          </label>
          <div style={{ display: "flex", alignItems: "flex-end" }}>
            <button type="submit" className="staff-btn navy">
              Search
            </button>
          </div>
        </form>
        {loading ? (
          <SkeletonRows rows={4} />
        ) : results === null ? (
          <EmptyState title="Enter a search above." />
        ) : results.length === 0 ? (
          <EmptyState title="No orders found." hint="Check the number or widen the search." />
        ) : (
          <div className="staff-tablewrap">
            <table className="staff-table staff-cards-fallback">
              <thead>
                <tr>
                  <th>Order #</th>
                  <th>Certificate</th>
                  <th>Substatus</th>
                  <th>Owner</th>
                  <th>Requestor</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {results.map((order) => (
                  <tr key={order.id}>
                    <td>
                      <strong>{order.publicNumber}</strong>
                    </td>
                    <td>
                      {order.stateCode}{" "}
                      {order.certificate.charAt(0) + order.certificate.slice(1).toLowerCase()}
                    </td>
                    <td>
                      <StatusPill status={order.status} />
                    </td>
                    <td>{order.assignedName ?? "Unassigned"}</td>
                    <td>{order.requestor}</td>
                    <td>
                      {order.assignedToMe || order.assignedName ? (
                        <Link className="staff-btn secondary" href={`/staff/${order.id}`}>
                          Open
                        </Link>
                      ) : (
                        <Link className="staff-btn secondary" href="/staff">
                          Claim from queue
                        </Link>
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

export default function OrderSearch() {
  return (
    <Suspense>
      <SearchView />
    </Suspense>
  );
}
