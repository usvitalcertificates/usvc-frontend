"use client";

import type { ReactNode } from "react";

/** Vibrant categorical palette for charts (colorblind-sensible order). */
export const CHART_PALETTE = [
  "#6366F1",
  "#10B981",
  "#F59E0B",
  "#F43F5E",
  "#06B6D4",
  "#8B5CF6",
  "#84CC16",
  "#FB923C",
  "#38BDF8",
  "#D946EF",
  "#2DD4BF",
  "#64748B",
] as const;

/** Certificate colors: vivid but harmonious with the staff theme. */
export const CHART_CERT_COLORS: Record<string, string> = {
  BIRTH: "#6366F1",
  DEATH: "#06B6D4",
  MARRIAGE: "#10B981",
  DIVORCE: "#F43F5E",
};

export const CHART_CERT_LABELS: Record<string, string> = {
  BIRTH: "Birth",
  DEATH: "Death",
  MARRIAGE: "Marriage",
  DIVORCE: "Divorce",
};

/** Fulfillment status tones (semantic, not categorical). */
export const CHART_STATUS_COLORS: Record<string, string> = {
  PAID: "#6366F1",
  IN_REVIEW: "#38BDF8",
  TO_CS: "#F59E0B",
  GTG: "#10B981",
  SUBMITTED: "#0B2545",
};

export const CHART_STATUS_LABELS: Record<string, string> = {
  PAID: "Paid",
  IN_REVIEW: "In Review",
  TO_CS: "To CS",
  GTG: "Marked GTG",
  SUBMITTED: "Sent to Government Agency",
};

/** Stable color per key (certificate code or state code). */
export function chartColor(key: string, index = 0): string {
  return CHART_CERT_COLORS[key] ?? CHART_PALETTE[index % CHART_PALETTE.length]!;
}

/** Gradient pair per palette slot for area/bar fills. */
export function chartGradient(index: number): [string, string] {
  const base = CHART_PALETTE[index % CHART_PALETTE.length]!;
  return [base, `${base}33`];
}

export function formatMoney(cents: number): string {
  return `$${(cents / 100).toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
}

export function formatMoneyTick(value: number | string): string {
  const amount = Number(value);
  if (!Number.isFinite(amount)) return String(value);
  if (amount >= 1000) return `$${Math.round(amount / 100) / 10}k`;
  return `$${amount}`;
}

interface ChartTooltipEntry {
  name?: string;
  value?: number | string;
  color?: string;
  payload?: { fill?: string };
}

/** Shared staff-styled tooltip card for all recharts visuals. */
export function ChartTooltip({
  active,
  payload,
  label,
  money = false,
}: {
  active?: boolean;
  payload?: ChartTooltipEntry[];
  label?: string | number;
  money?: boolean;
}) {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className="staff-chart-tip">
      {label !== undefined && label !== "" ? (
        <p className="staff-chart-tip-title">{label}</p>
      ) : null}
      {payload.map((entry, index) => {
        const raw = entry.value;
        const numeric = typeof raw === "number" ? raw : Number(raw);
        const text =
          money && Number.isFinite(numeric)
            ? `$${numeric.toLocaleString()}`
            : typeof raw === "number"
              ? raw.toLocaleString()
              : String(raw ?? "");
        return (
          <p key={index} className="staff-chart-tip-row">
            <span
              className="staff-chart-tip-dot"
              style={{ background: entry.payload?.fill ?? entry.color ?? "#6366F1" }}
            />
            <span>{entry.name}</span>
            <strong>{text}</strong>
          </p>
        );
      })}
    </div>
  );
}

/** Section heading block for chart cards (title + hint). */
export function ChartCardHead({ title, hint }: { title: string; hint: string }) {
  return (
    <>
      <h2 className="staff-chart-title">{title}</h2>
      <p className="staff-chart-hint">{hint}</p>
    </>
  );
}

export function ChartCard({
  title,
  hint,
  children,
  wide = false,
}: {
  title: string;
  hint: string;
  children: ReactNode;
  wide?: boolean;
}) {
  return (
    <section className={`staff-panel${wide ? " staff-chart-wide" : ""}`}>
      <ChartCardHead title={title} hint={hint} />
      <div className="staff-chart-body">{children}</div>
    </section>
  );
}
