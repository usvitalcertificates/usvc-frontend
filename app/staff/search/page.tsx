"use client";

import Link from "next/link";
import { Suspense, useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { FolderOpen, Inbox, Search as SearchIcon, X } from "lucide-react";
import { staffData, staffRole } from "@/lib/staff-client";
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

/** Bold-highlights a case-insensitive match inside text. */
function Highlight({ text, term }: { text: string; term: string }) {
  const query = term.trim();
  if (!query) return <>{text}</>;
  const index = text.toLowerCase().indexOf(query.toLowerCase());
  if (index < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, index)}
      <mark>{text.slice(index, index + query.length)}</mark>
      {text.slice(index + query.length)}
    </>
  );
}

function SearchView() {
  useRequireStaffAuth();
  useInactivitySignout();
  const params = useSearchParams();
  const initial = params.get("q") ?? "";
  const [term, setTerm] = useState(initial);
  const [certificate, setCertificate] = useState("");
  const [activeQuery, setActiveQuery] = useState("");
  const [results, setResults] = useState<Result[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    setIsAdmin(staffRole() === "ADMIN");
  }, []);

  const run = useCallback(async (query: string, cert: string) => {
    if (!query.trim() && !cert) {
      setResults(null);
      setActiveQuery("");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const search = new URLSearchParams({ page: "1", assigned: "all" });
      if (query.trim()) search.set("search", query.trim());
      if (cert) search.set("certificate", cert);
      const { response, data } = await staffData<{ orders: Result[]; message?: string }>(
        `/staff/orders?${search.toString()}`,
      );
      if (!response.ok) throw new Error(data.message || "Search failed");
      setResults(data.orders);
      setActiveQuery(query.trim());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Search failed");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (initial) void run(initial, "");
  }, [initial, run]);

  const clear = () => {
    setTerm("");
    setCertificate("");
    setResults(null);
    setActiveQuery("");
    setError("");
  };

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
            <input
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              placeholder="USCA-BT-…"
              autoComplete="off"
              spellCheck={false}
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
          <div style={{ display: "flex", alignItems: "flex-end", gap: "8px" }}>
            <button type="submit" className="staff-btn navy">
              <SearchIcon aria-hidden style={{ width: 16, height: 16 }} /> Search
            </button>
            {results !== null || term || certificate ? (
              <button type="button" className="staff-btn secondary" onClick={clear}>
                Clear
              </button>
            ) : null}
          </div>
        </form>
      </div>

      <div className="staff-panel">
        {loading ? (
          <SkeletonRows rows={4} />
        ) : results === null ? (
          <EmptyState
            title="Search for an order to begin."
            hint="Enter an order number, requestor name, or email above."
          />
        ) : (
          <>
            <div className="staff-results-head">
              <h2>Results ({results.length})</h2>
              {activeQuery ? (
                <button
                  type="button"
                  className="staff-query-chip"
                  onClick={clear}
                  aria-label="Clear search"
                  title="Clear search"
                >
                  “{activeQuery}” <X aria-hidden style={{ width: 13, height: 13 }} />
                </button>
              ) : null}
            </div>
            {results.length === 0 ? (
              <EmptyState
                title={activeQuery ? `No orders found for “${activeQuery}”.` : "No orders found."}
                hint="Check the number or widen the search."
                action={
                  <button
                    type="button"
                    className="staff-btn secondary"
                    onClick={clear}
                    style={{ marginTop: "12px" }}
                  >
                    Clear search
                  </button>
                }
              />
            ) : (
              <div className="staff-tablewrap">
                <table className="staff-table staff-cards-fallback staff-search-table">
                  <thead>
                    <tr>
                      <th>Order #</th>
                      <th>Certificate</th>
                      <th>Status</th>
                      <th>Owner</th>
                      <th>Requestor</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((order) => (
                      <tr key={order.id}>
                        <td className="staff-search-order">
                          <strong>
                            <Highlight text={order.publicNumber} term={activeQuery} />
                          </strong>
                        </td>
                        <td>
                          {order.stateCode}{" "}
                          {order.certificate.charAt(0) + order.certificate.slice(1).toLowerCase()}
                          <br />
                          <span className="staff-row-meta">{order.county || "—"}</span>
                        </td>
                        <td>
                          <StatusPill status={order.status} />
                        </td>
                        <td>{order.assignedName ?? "Unassigned"}</td>
                        <td>{order.requestor}</td>
                        <td className="staff-search-action">
                          {order.assignedToMe || isAdmin ? (
                            <Link className="staff-btn green" href={`/staff/${order.id}`}>
                              <FolderOpen aria-hidden style={{ width: 15, height: 15 }} /> Open
                              Order
                            </Link>
                          ) : order.assignedName ? (
                            <button
                              type="button"
                              className="staff-btn green"
                              disabled
                              title={`Claimed by ${order.assignedName} — only the owner can open it`}
                            >
                              <FolderOpen aria-hidden style={{ width: 15, height: 15 }} /> Open
                              Order
                            </button>
                          ) : (
                            <Link className="staff-btn secondary" href="/staff">
                              <Inbox aria-hidden style={{ width: 15, height: 15 }} /> Open queue
                            </Link>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
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
