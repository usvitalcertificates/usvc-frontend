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
import {
  CHART_CERT_COLORS,
  CHART_CERT_LABELS,
  CHART_STATUS_COLORS,
  CHART_STATUS_LABELS,
  ChartCard,
  ChartTooltip,
  chartColor,
  formatMoney,
  formatMoneyTick,
} from "@/components/staff/charts-theme";

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

const CERT_CODES = Object.keys(CHART_CERT_LABELS);

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

function certLabel(code: string): string {
  return CHART_CERT_LABELS[code] ?? code;
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
      (data?.certificates ?? []).map((slice, index) => ({
        ...slice,
        name: certLabel(slice.certificate),
        fill: chartColor(slice.certificate, index),
      })),
    [data],
  );

  const topStates = useMemo(() => {
    const rows = data?.states ?? [];
    const top = rows.slice(0, 10).map((row, index) => ({
      ...row,
      fill: chartColor(row.stateCode, index),
    }));
    const rest = rows.slice(10);
    const restOrders = rest.reduce((sum, row) => sum + row.orders, 0);
    const restRevenue = rest.reduce((sum, row) => sum + row.revenueCents, 0);
    return restOrders > 0
      ? [
          ...top,
          { stateCode: "Other", orders: restOrders, revenueCents: restRevenue, fill: "#94A3B8" },
        ]
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
        name: CHART_STATUS_LABELS[slice.status] ?? slice.status,
        fill: CHART_STATUS_COLORS[slice.status] ?? "#64748B",
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
      topStates.map((row, index) => ({
        stateCode: row.stateCode,
        revenue: Math.round(row.revenueCents / 100),
        fill: chartColor(row.stateCode, index),
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

          <div className="staff-chart-grid">
            <ChartCard title="Orders by form type" hint="Which certificates customers file most.">
              <ResponsiveContainer width="100%" height={340}>
                <PieChart>
                  <Pie
                    data={certificates}
                    dataKey="orders"
                    nameKey="name"
                    innerRadius={80}
                    outerRadius={125}
                    paddingAngle={3}
                    strokeWidth={2}
                    stroke="#ffffff"
                  >
                    {certificates.map((slice) => (
                      <Cell key={slice.certificate} fill={slice.fill} />
                    ))}
                  </Pie>
                  <Tooltip content={<ChartTooltip />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard wide title="Orders by state" hint="Top 10 states plus all others combined.">
              <ResponsiveContainer width="100%" height={440}>
                <BarChart data={topStates} layout="vertical" margin={{ left: 24, right: 32 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#DCE4EF" />
                  <XAxis type="number" tick={{ fontSize: 12 }} />
                  <YAxis type="category" dataKey="stateCode" tick={{ fontSize: 12 }} width={70} />
                  <Tooltip content={<ChartTooltip />} />
                  <Bar dataKey="orders" radius={[0, 8, 8, 0]}>
                    {topStates.map((row) => (
                      <Cell key={row.stateCode} fill={row.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard
              wide
              title="Form mix by top state"
              hint="Certificate mix inside the six busiest states."
            >
              <ResponsiveContainer width="100%" height={380}>
                <BarChart data={stackedStates} margin={{ left: 8, right: 32 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#DCE4EF" />
                  <XAxis dataKey="stateCode" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip content={<ChartTooltip />} />
                  <Legend formatter={(value) => certLabel(String(value))} />
                  {CERT_CODES.map((code) => (
                    <Bar
                      key={code}
                      dataKey={code}
                      stackId="forms"
                      fill={CHART_CERT_COLORS[code]}
                      radius={[0, 0, 0, 0]}
                    />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Revenue by form type" hint="Charged dollars per certificate (USD).">
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={revenueByForm} margin={{ left: 8, right: 32 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#DCE4EF" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} tickFormatter={formatMoneyTick} />
                  <Tooltip content={<ChartTooltip money />} />
                  <Bar dataKey="revenue" radius={[8, 8, 0, 0]}>
                    {revenueByForm.map((row) => (
                      <Cell key={row.name} fill={row.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Revenue by state" hint="Charged dollars, Top 10 plus others (USD).">
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={revenueByState} layout="vertical" margin={{ left: 24, right: 32 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#DCE4EF" />
                  <XAxis type="number" tick={{ fontSize: 12 }} tickFormatter={formatMoneyTick} />
                  <YAxis type="category" dataKey="stateCode" tick={{ fontSize: 12 }} width={70} />
                  <Tooltip content={<ChartTooltip money />} />
                  <Bar dataKey="revenue" radius={[0, 8, 8, 0]}>
                    {revenueByState.map((row) => (
                      <Cell key={row.stateCode} fill={row.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Orders by status" hint="Where paid orders sit in fulfillment.">
              <ResponsiveContainer width="100%" height={340}>
                <BarChart data={statuses} layout="vertical" margin={{ left: 24, right: 32 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#DCE4EF" />
                  <XAxis type="number" tick={{ fontSize: 12 }} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} width={180} />
                  <Tooltip content={<ChartTooltip />} />
                  <Bar dataKey="orders" radius={[0, 8, 8, 0]}>
                    {statuses.map((slice) => (
                      <Cell key={slice.status} fill={slice.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>
        </>
      )}
    </>
  );
}
