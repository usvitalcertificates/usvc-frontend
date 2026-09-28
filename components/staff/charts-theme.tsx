"use client";

import type { ReactNode } from "react";

/** Chart.js classic slots: solid fill + darker edge (colorblind-sensible order). */
const PASTEL_SLOTS: [fill: string, edge: string][] = [
  ["#FF6384", "#D14D6B"],
  ["#36A2EB", "#2B86C5"],
  ["#FF9F40", "#D98A36"],
  ["#FFCD56", "#D9AE45"],
  ["#4BC0C0", "#3AA3A3"],
  ["#9966FF", "#7A4FD6"],
  ["#C9CBCE", "#9AA0A8"],
  ["#34D399", "#1FA97A"],
  ["#FB7185", "#D14D6B"],
  ["#60A5FA", "#2B86C5"],
  ["#FBBF24", "#D98A36"],
  ["#2DD4BF", "#3AA3A3"],
];

/** Vibrant categorical palette for charts (colorblind-sensible order). */
export const CHART_PALETTE = PASTEL_SLOTS.map(([, edge]) => edge);

/** Certificate colors: Chart.js classic set. */
export const CHART_CERT_COLORS: Record<string, string> = {
  BIRTH: "#FF6384",
  DEATH: "#36A2EB",
  MARRIAGE: "#FF9F40",
  DIVORCE: "#4BC0C0",
};

export const CHART_CERT_EDGES: Record<string, string> = {
  BIRTH: "#D14D6B",
  DEATH: "#2B86C5",
  MARRIAGE: "#D98A36",
  DIVORCE: "#3AA3A3",
};

export const CHART_CERT_LABELS: Record<string, string> = {
  BIRTH: "Birth",
  DEATH: "Death",
  MARRIAGE: "Marriage",
  DIVORCE: "Divorce",
};

/** Fulfillment status tones: Chart.js-style solid fills, semantic hues. */
export const CHART_STATUS_COLORS: Record<string, string> = {
  PAID: "#36A2EB",
  IN_REVIEW: "#9966FF",
  TO_CS: "#FF9F40",
  GTG: "#4BC0C0",
  SUBMITTED: "#C9CBCE",
};

export const CHART_STATUS_EDGES: Record<string, string> = {
  PAID: "#2B86C5",
  IN_REVIEW: "#7A4FD6",
  TO_CS: "#D98A36",
  GTG: "#3AA3A3",
  SUBMITTED: "#9AA0A8",
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
