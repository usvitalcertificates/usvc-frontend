"use client";

import Link from "next/link";
import { use, useCallback, useEffect, useState } from "react";
import { CheckCircle2, ClipboardCheck, Files, Send } from "lucide-react";
import { staffJson, staffRole } from "@/lib/staff-client";
import { useInactivitySignout, useRequireStaffAuth } from "@/lib/staff-auth-hook";
import {
  BackLink,
  EmptyState,
  PageBand,
  Pagination,
  SkeletonRows,
  StatCard,
  StatusPill,
} from "@/components/staff/ui";

type Workflow = "all" | "processing" | "to_cs" | "submitted";
type Preset = "7d" | "30d" | "month" | "all" | "custom";

interface AnalyticsResponse {
  staff: { id: string; fullName: string; email: string; role: string; accountStatus: string };
  metrics: {
    ownershipTaken: number;
    sentToCs: number;
    submittedToAgency: number;
    totalFormsHandled: number;
  };
  orders: {
    id: string;
    publicNumber: string;
    certificate: string;
    stateCode: string;
    county: string;
    rush: boolean;
    status: string;
    latestActivityAt: string;
    canOpen?: boolean;
  }[];
  total: number;
  page: number;
  pages: number;
}

function dateValue(date: Date): string {
  const offset = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 10);
}

function presetRange(preset: Preset): { from: string; to: string } {
  if (preset === "all") return { from: "", to: "" };
  const end = new Date();
  const start = new Date(end);
  if (preset === "7d") start.setDate(start.getDate() - 6);
  if (preset === "30d") start.setDate(start.getDate() - 29);
  if (preset === "month") start.setDate(1);
  return { from: dateValue(start), to: dateValue(end) };
}

export default function StaffAnalyticsPage({
  params,
  selfMode = false,
}: {
  params: Promise<{ id: string }>;
  selfMode?: boolean;
}) {
  const { id } = use(params);
  useRequireStaffAuth();
  useInactivitySignout();
  const initialRange = presetRange("30d");
  const [allowed, setAllowed] = useState(false);
  const [preset, setPreset] = useState<Preset>("30d");
  const [from, setFrom] = useState(initialRange.from);
  const [to, setTo] = useState(initialRange.to);
  const [workflow, setWorkflow] = useState<Workflow>("all");
  const [page, setPage] = useState(1);
  const [data, setData] = useState<AnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const invalidRange = Boolean(from && to && from > to);

  const load = useCallback(async () => {
    if (invalidRange) return;
    setLoading(true);
    setError("");
    try {
      const search = new URLSearchParams({ status: workflow, page: String(page), limit: "20" });
      if (from) search.set("from", from);
      if (to) search.set("to", to);
      const endpoint = selfMode ? "/staff/analytics" : `/admin/staff/${id}/analytics`;
      setData(await staffJson<AnalyticsResponse>(`${endpoint}?${search}`));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load staff analytics");
    } finally {
      setLoading(false);
    }
  }, [from, id, invalidRange, page, selfMode, to, workflow]);

  useEffect(() => {
    const role = staffRole();
    const canView = selfMode ? Boolean(role) : role === "ADMIN";
    setAllowed(canView);
    if (canView) void load();
    else setLoading(false);
  }, [load]);

  const choosePreset = (next: Preset) => {
    setPreset(next);
    setPage(1);
    if (next !== "custom") {
      const range = presetRange(next);
      setFrom(range.from);
      setTo(range.to);
    }
  };

  if (!allowed && !loading) {
    return <p className="staff-alert error">Analytics are available after staff sign-in.</p>;
  }

  return (
    <>
      {!selfMode ? <BackLink href="/staff/admin">← Back to Administration</BackLink> : null}
      <PageBand
        eyebrow={selfMode ? "My performance — analytics" : "Administration — staff analytics"}
        title={data?.staff.fullName || (selfMode ? "My analytics" : "Staff performance")}
        subtitle={
          data
            ? `${data.staff.email} · ${data.staff.role} · ${data.staff.accountStatus}`
            : "Audit-derived operational performance and form history."
        }
      />

      {error ? <p className="staff-alert error">{error}</p> : null}
      {invalidRange ? (
        <p className="staff-alert error">From date must be on or before the to date.</p>
      ) : null}

      <div className="staff-stats staff-analytics-stats">
        <StatCard
          value={data?.metrics.ownershipTaken ?? "—"}
          label="Ownership taken"
          icon={<ClipboardCheck aria-hidden />}
          tone="blue"
        />
        <StatCard
          value={data?.metrics.sentToCs ?? "—"}
          label="Sent to CS"
          icon={<Send aria-hidden />}
          tone="rose"
        />
        <StatCard
          value={data?.metrics.submittedToAgency ?? "—"}
          label="Submitted to agency"
          icon={<CheckCircle2 aria-hidden />}
          tone="green"
        />
        <StatCard
          value={data?.metrics.totalFormsHandled ?? "—"}
          label="Total forms handled"
          icon={<Files aria-hidden />}
          tone="lavender"
        />
      </div>

      <div className="staff-panel">
        <div className="staff-analytics-toolbar">
          <div className="staff-chips" role="group" aria-label="Date range presets">
            {(
              [
                ["7d", "7 days"],
                ["30d", "30 days"],
                ["month", "This month"],
                ["all", "All time"],
                ["custom", "Custom"],
              ] as [Preset, string][]
            ).map(([value, label]) => (
              <button
                key={value}
                type="button"
                aria-pressed={preset === value}
                onClick={() => choosePreset(value)}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="staff-analytics-dates">
            <label>
              From
              <input
                type="date"
                value={from}
                onChange={(event) => {
                  setPreset("custom");
                  setFrom(event.target.value);
                  setPage(1);
                }}
              />
            </label>
            <label>
              To
              <input
                type="date"
                value={to}
                onChange={(event) => {
                  setPreset("custom");
                  setTo(event.target.value);
                  setPage(1);
                }}
              />
            </label>
          </div>
        </div>
        <div className="staff-chips staff-analytics-workflows" role="group" aria-label="Workflow">
          {(
            [
              ["all", "All forms"],
              ["processing", "Order Processing"],
              ["to_cs", "Sent To CS"],
              ["submitted", "Submitted to Govt Agency"],
            ] as [Workflow, string][]
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              aria-pressed={workflow === value}
              onClick={() => {
                setWorkflow(value);
                setPage(1);
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {loading ? (
          <SkeletonRows rows={6} />
        ) : !data || data.orders.length === 0 ? (
          <EmptyState
            title="No matching staff activity."
            hint="Try a wider date range or another workflow filter."
          />
        ) : (
          <div className="staff-tablewrap">
            <table className="staff-table staff-cards-fallback staff-analytics-table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Certificate</th>
                  <th>Current status</th>
                  <th>Latest staff activity</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {data.orders.map((order) => (
                  <tr key={order.id}>
                    <td>
                      <strong>{order.publicNumber}</strong>
                      {order.rush ? <span className="staff-pill amber">RUSH</span> : null}
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
                    <td className="staff-analytics-date">
                      {new Date(order.latestActivityAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                      <span>
                        {new Date(order.latestActivityAt).toLocaleTimeString("en-US", {
                          hour: "numeric",
                          minute: "2-digit",
                        })}
                      </span>
                    </td>
                    <td>
                      {!selfMode || order.canOpen ? (
                        <Link className="staff-btn secondary" href={`/staff/${order.id}`}>
                          Open order
                        </Link>
                      ) : (
                        <button
                          type="button"
                          className="staff-btn secondary"
                          disabled
                          title="This order is no longer assigned to you"
                        >
                          Not assigned
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
      <Pagination page={data?.page ?? page} pages={data?.pages ?? 1} onChange={setPage} />
      {data ? (
        <p className="staff-results-count">
          Showing {data.orders.length} of {data.total} forms.
        </p>
      ) : null}
    </>
  );
}
