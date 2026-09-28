"use client";

import type { ReactNode } from "react";

/** Pastel categorical slots: soft fill + vivid edge (colorblind-sensible order). */
const PASTEL_SLOTS: [fill: string, edge: string][] = [
  ["#C7D2FE", "#6366F1"],
  ["#BBF7D0", "#10B981"],
  ["#FDE68A", "#F59E0B"],
  ["#FECDD3", "#F43F5E"],
  ["#A5F3FC", "#06B6D4"],
  ["#DDD6FE", "#8B5CF6"],
  ["#D9F99D", "#65A30D"],
  ["#FED7AA", "#FB923C"],
  ["#BAE6FD", "#0284C7"],
  ["#F5D0FE", "#D946EF"],
  ["#99F6E4", "#14B8A6"],
  ["#E2E8F0", "#64748B"],
];

/** Vibrant categorical palette for charts (colorblind-sensible order). */
export const CHART_PALETTE = PASTEL_SLOTS.map(([, edge]) => edge);

/** Certificate colors: pastel fill, vivid edge. */
export const CHART_CERT_COLORS: Record<string, string> = {
  BIRTH: "#C7D2FE",
  DEATH: "#A5F3FC",
  MARRIAGE: "#BBF7D0",
  DIVORCE: "#FECDD3",
};

export const CHART_CERT_EDGES: Record<string, string> = {
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

/** Fulfillment status tones: pastel fill, semantic vivid edge. */
export const CHART_STATUS_COLORS: Record<string, string> = {
  PAID: "#C7D2FE",
  IN_REVIEW: "#BAE6FD",
  TO_CS: "#FDE68A",
  GTG: "#BBF7D0",
  SUBMITTED: "#CBD5E1",
};

export const CHART_STATUS_EDGES: Record<string, string> = {
  PAID: "#6366F1",
  IN_REVIEW: "#0284C7",
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

/** Stable pastel fill per key (certificate code or state code). */
export function chartColor(key: string, index = 0): string {
  return CHART_CERT_COLORS[key] ?? PASTEL_SLOTS[index % PASTEL_SLOTS.length]![0];
}

/** Vivid edge matching chartColor, for strokes and dots. */
export function chartEdge(key: string, index = 0): string {
  return CHART_CERT_EDGES[key] ?? PASTEL_SLOTS[index % PASTEL_SLOTS.length]![1];
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
