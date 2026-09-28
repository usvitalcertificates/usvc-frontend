"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { staffJson, staffRole } from "@/lib/staff-client";
import { useInactivitySignout, useRequireStaffAuth } from "@/lib/staff-auth-hook";
import { BackLink, EmptyState, PageBand, SkeletonRows, StatCard } from "@/components/staff/ui";

type Preset = "today" | "7d" | "30d" | "3mo" | "6mo" | "1yr" | "all" | "custom";

interface CertificateSlice {
  certificate: string;
  orders: number;
  revenueCents: number;
}

interface StateSlice {
  stateCode: string;
  orders: number;
  revenueCents: number;
}

interface CertificateStateSlice {
  certificate: string;
  stateCode: string;
  orders: number;
  revenueCents: number;
}

interface StatusSlice {
  status: string;
  orders: number;
}

interface OrdersSummary {
  range: { from: string | null; to: string | null };
  certificates: CertificateSlice[];
  states: StateSlice[];
  matrix: CertificateStateSlice[];
  statuses: StatusSlice[];
  totals: { orders: number; revenueCents: number; rushOrders: number };
}

const PRESETS: [Preset, string][] = [
  ["today", "Today"],
  ["7d", "7 days"],
  ["30d", "30 days"],
  ["3mo", "3 months"],
  ["6mo", "6 months"],
  ["1yr", "1 year"],
  ["all", "All time"],
  ["custom", "Custom"],
];

const CERT_LABELS: Record<string, string> = {
  BIRTH: "Birth",
  DEATH: "Death",
  MARRIAGE: "Marriage",
  DIVORCE: "Divorce",
};

const CERT_COLORS: Record<string, string> = {
  BIRTH: "#1D4ED8",
  DEATH: "#0B2545",
  MARRIAGE: "#16A34A",
  DIVORCE: "#B22234",
};

const STATUS_LABELS: Record<string, string> = {
  PAID: "Paid",
  IN_REVIEW: "In Review",
  TO_CS: "To CS",
  GTG: "Marked GTG",
  SUBMITTED: "Sent to Government Agency",
};

function dateValue(date: Date): string {
  const offset = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 10);
}

function presetRange(preset: Preset): { from: string; to: string } {
  if (preset === "all" || preset === "custom") return { from: "", to: "" };
  const end = new Date();
  const start = new Date(end);
  if (preset === "7d") start.setDate(start.getDate() - 6);
  if (preset === "30d") start.setDate(start.getDate() - 29);
  if (preset === "3mo") start.setMonth(start.getMonth() - 3);
  if (preset === "6mo") start.setMonth(start.getMonth() - 6);
  if (preset === "1yr") start.setFullYear(start.getFullYear() - 1);
  return { from: dateValue(start), to: dateValue(end) };
}

function formatMoney(cents: number): string {
  return `$${(cents / 100).toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
}

function certLabel(code: string): string {
  return CERT_LABELS[code] ?? code;
}

export default function OrdersAnalyticsDashboard() {
  useRequireStaffAuth();
  useInactivitySignout();
  const [isAdmin, setIsAdmin] = useState(false);
  const initialRange = useMemo(() => presetRange("30d"), []);
  const [preset, setPreset] = useState<Preset>("30d");
  const [from, setFrom] = useState(initialRange.from);
  const [to, setTo] = useState(initialRange.to);
  const [data, setData] = useState<OrdersSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const invalidRange = Boolean(from && to && from > to);

  const load = useCallback(async () => {
    if (invalidRange) return;
    setLoading(true);
    setError("");
    try {
      const search = new URLSearchParams();
      if (from) search.set("from", from);
      if (to) search.set("to", to);
      setData(await staffJson<OrdersSummary>(`/admin/orders-summary?${search}`));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load orders summary");
    } finally {
      setLoading(false);
    }
  }, [from, invalidRange, to]);

  useEffect(() => {
    setIsAdmin(staffRole() === "ADMIN");
  }, []);

  useEffect(() => {
    if (isAdmin) void load();
  }, [isAdmin, load]);

  const choosePreset = (next: Preset) => {
    setPreset(next);
    if (next !== "custom") {
      const range = presetRange(next);
      setFrom(range.from);
      setTo(range.to);
    }
  };

  const certificates = useMemo(
    () =>
      (data?.certificates ?? []).map((slice) => ({
        ...slice,
        name: certLabel(slice.certificate),
        fill: CERT_COLORS[slice.certificate] ?? "#8DA9C4",
      })),
    [data],
  );

  const topStates = useMemo(() => {
    const rows = data?.states ?? [];
    const top = rows.slice(0, 10);
    const rest = rows.slice(10);
    const restOrders = rest.reduce((sum, row) => sum + row.orders, 0);
    const restRevenue = rest.reduce((sum, row) => sum + row.revenueCents, 0);
    return restOrders > 0
      ? [...top, { stateCode: "Other", orders: restOrders, revenueCents: restRevenue }]
      : top;
  }, [data]);

  const stackedStates = useMemo(() => {
    const states = (data?.states ?? []).slice(0, 6).map((row) => row.stateCode);
    return states.map((stateCode) => {
      const entry: Record<string, string | number> = { stateCode };
      for (const slice of data?.matrix ?? []) {
        if (slice.stateCode === stateCode) entry[slice.certificate] = slice.orders;
      }
      return entry;
    });
  }, [data]);

  const statuses = useMemo(
    () =>
      (data?.statuses ?? []).map((slice) => ({
        ...slice,
        name: STATUS_LABELS[slice.status] ?? slice.status,
      })),
    [data],
  );

  const revenueByForm = useMemo(
    () =>
      certificates.map((slice) => ({
        name: slice.name,
        revenue: Math.round(slice.revenueCents / 100),
        fill: slice.fill,
      })),
    [certificates],
  );

  const revenueByState = useMemo(
    () =>
      topStates.map((row) => ({
        stateCode: row.stateCode,
        revenue: Math.round(row.revenueCents / 100),
      })),
    [topStates],
  );

  const totals = data?.totals ?? { orders: 0, revenueCents: 0, rushOrders: 0 };
  const rushShare =
    totals.orders > 0 ? `${Math.round((totals.rushOrders / totals.orders) * 100)}%` : "—";

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
        subtitle="Paid-order trends by form type, state, and status — pick a range to explore."
      />
      {error ? (
        <p role="alert" className="staff-alert error">
          {error}
        </p>
      ) : null}
      {invalidRange ? (
        <p role="alert" className="staff-alert error">
          From date must be on or before to date.
        </p>
      ) : null}

      <div className="staff-panel">
        <div className="staff-analytics-toolbar">
          <div className="staff-chips" role="group" aria-label="Date range presets">
            {PRESETS.map(([value, label]) => (
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
                }}
              />
            </label>
          </div>
        </div>
      </div>

      {loading ? (
        <SkeletonRows rows={6} />
      ) : totals.orders === 0 ? (
        <EmptyState
          title="No paid orders in this range."
          hint="Widen the range or check back after checkout volume arrives."
        />
      ) : (
        <>
          <div className="staff-stats">
            <StatCard value={totals.orders.toLocaleString()} label="Paid orders" tone="blue" />
            <StatCard value={formatMoney(totals.revenueCents)} label="Revenue" tone="green" />
            <StatCard value={rushShare} label="Rush share" tone="amber" />
          </div>

          <div className="staff-panel">
            <h2 className="staff-chart-title">Orders by form type</h2>
            <p className="staff-chart-hint">Which certificates customers file most.</p>
            <div className="staff-chart-body">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={certificates}
                    dataKey="orders"
                    nameKey="name"
                    innerRadius={70}
                    outerRadius={110}
                    paddingAngle={2}
                  >
                    {certificates.map((slice) => (
                      <Cell key={slice.certificate} fill={slice.fill} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} orders`, "Orders"]} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="staff-panel">
            <h2 className="staff-chart-title">Orders by state</h2>
            <p className="staff-chart-hint">Top 10 states plus all others combined.</p>
            <div className="staff-chart-body">
              <ResponsiveContainer width="100%" height={Math.max(260, topStates.length * 36)}>
                <BarChart data={topStates} layout="vertical" margin={{ left: 24, right: 24 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#DCE4EF" />
                  <XAxis type="number" tick={{ fontSize: 12 }} />
                  <YAxis type="category" dataKey="stateCode" tick={{ fontSize: 12 }} width={70} />
                  <Tooltip formatter={(value) => [`${value} orders`, "Orders"]} />
                  <Bar dataKey="orders" fill="#1D4ED8" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="staff-panel">
            <h2 className="staff-chart-title">Form mix by top state</h2>
            <p className="staff-chart-hint">Certificate mix inside the six busiest states.</p>
            <div className="staff-chart-body">
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={stackedStates} margin={{ left: 8, right: 24 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#DCE4EF" />
                  <XAxis dataKey="stateCode" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Legend formatter={(value) => certLabel(String(value))} />
                  {(Object.keys(CERT_LABELS) as string[]).map((code) => (
                    <Bar key={code} dataKey={code} stackId="forms" fill={CERT_COLORS[code]} />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="staff-panel">
            <h2 className="staff-chart-title">Orders by status</h2>
            <p className="staff-chart-hint">Where paid orders sit in the fulfillment flow.</p>
            <div className="staff-chart-body">
              <ResponsiveContainer width="100%" height={Math.max(220, statuses.length * 44)}>
                <BarChart data={statuses} layout="vertical" margin={{ left: 24, right: 24 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#DCE4EF" />
                  <XAxis type="number" tick={{ fontSize: 12 }} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} width={180} />
                  <Tooltip formatter={(value) => [`${value} orders`, "Orders"]} />
                  <Bar dataKey="orders" fill="#0B2545" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="staff-panel">
            <h2 className="staff-chart-title">Revenue by form type</h2>
            <p className="staff-chart-hint">Charged dollars per certificate (USD).</p>
            <div className="staff-chart-body">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={revenueByForm} margin={{ left: 8, right: 24 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#DCE4EF" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) =>
                      `$${Number(value) >= 1000 ? `${Math.round(Number(value) / 100) / 10}k` : value}`
                    }
                  />
                  <Tooltip
                    formatter={(value) => [`$${Number(value).toLocaleString()}`, "Revenue"]}
                  />
                  <Bar dataKey="revenue" radius={[6, 6, 0, 0]}>
                    {revenueByForm.map((row) => (
                      <Cell key={row.name} fill={row.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="staff-panel">
            <h2 className="staff-chart-title">Revenue by state</h2>
            <p className="staff-chart-hint">Charged dollars per state, Top 10 plus others (USD).</p>
            <div className="staff-chart-body">
              <ResponsiveContainer width="100%" height={Math.max(260, revenueByState.length * 36)}>
                <BarChart data={revenueByState} layout="vertical" margin={{ left: 24, right: 24 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#DCE4EF" />
                  <XAxis type="number" tick={{ fontSize: 12 }} />
                  <YAxis type="category" dataKey="stateCode" tick={{ fontSize: 12 }} width={70} />
                  <Tooltip
                    formatter={(value) => [`$${Number(value).toLocaleString()}`, "Revenue"]}
                  />
                  <Bar dataKey="revenue" fill="#16A34A" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </>
  );
}
