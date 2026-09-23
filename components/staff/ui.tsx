"use client";

import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";

export const STATUS_LABELS: Record<string, string> = {
  PAID: "Payment Successful",
  IN_REVIEW: "Order Processing",
  ON_HOLD: "On Hold",
  NEED_INFO: "Need Customer Information",
  SUBMITTED: "Submitted to Govt Agency",
  CANCELLED: "Cancelled",
};

const STATUS_TONE: Record<string, "navy" | "red" | "gray" | "green"> = {
  PAID: "navy",
  IN_REVIEW: "navy",
  ON_HOLD: "red",
  NEED_INFO: "red",
  SUBMITTED: "green",
  CANCELLED: "gray",
};

export function StatusPill({ status }: { status: string }) {
  return (
    <span className={`staff-pill ${STATUS_TONE[status] ?? "gray"}`}>
      {STATUS_LABELS[status] ?? status}
    </span>
  );
}

export function PageBand({
  eyebrow,
  title,
  subtitle,
  actions,
}: {
  eyebrow: string;
  title: ReactNode;
  subtitle?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <div className="staff-band">
      <p className="staff-eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      {subtitle ? <p>{subtitle}</p> : null}
      {actions ? (
        <div style={{ marginTop: "14px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
          {actions}
        </div>
      ) : null}
    </div>
  );
}

export function StatCard({
  value,
  label,
  icon,
}: {
  value: ReactNode;
  label: string;
  icon?: ReactNode;
}) {
  return (
    <div className="staff-stat">
      {icon}
      <div>
        <strong>{value}</strong>
        <span>{label}</span>
      </div>
    </div>
  );
}

export function EmptyState({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="staff-panel-body" style={{ textAlign: "center", padding: "36px 20px" }}>
      <p style={{ fontWeight: 700, fontSize: "1.1rem", color: "var(--navy)" }}>{title}</p>
      {hint ? <p style={{ color: "var(--muted-text)" }}>{hint}</p> : null}
    </div>
  );
}

export function SkeletonRows({ rows = 5 }: { rows?: number }) {
  return (
    <div
      className="staff-panel-body"
      style={{ display: "flex", flexDirection: "column", gap: "10px" }}
    >
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="staff-skeleton" style={{ height: "22px" }} />
      ))}
    </div>
  );
}

/** Success toast banner (MILES-style). Auto-dismisses after 6s. */
export function Toast({ message, onDone }: { message: string; onDone: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onDone, 6000);
    return () => clearTimeout(timer);
  }, [onDone]);
  return (
    <p role="status" className="staff-alert success">
      {message}
    </p>
  );
}

/** Numbered pagination (MILES-style with ellipsis). */
export function Pagination({
  page,
  pages,
  onChange,
}: {
  page: number;
  pages: number;
  onChange: (page: number) => void;
}) {
  if (pages <= 1) return null;
  const numbers: (number | "…")[] = [];
  const candidates = [1, page - 1, page, page + 1, pages];
  const unique = [...new Set(candidates.filter((n) => n >= 1 && n <= pages))].sort((a, b) => a - b);
  let previous = 0;
  for (const n of unique) {
    if (n - previous > 1) numbers.push("…");
    numbers.push(n);
    previous = n;
  }
  const btn: React.CSSProperties = {
    background: "#fff",
    border: "1px solid var(--border)",
    borderRadius: "6px",
    padding: "6px 12px",
    cursor: "pointer",
  };
  return (
    <nav
      aria-label="Pagination"
      style={{
        display: "flex",
        gap: "6px",
        flexWrap: "wrap",
        marginTop: "16px",
        alignItems: "center",
      }}
    >
      <button type="button" style={btn} disabled={page <= 1} onClick={() => onChange(page - 1)}>
        « Previous
      </button>
      {numbers.map((n, i) =>
        n === "…" ? (
          <span key={`e${i}`} style={{ padding: "0 4px", color: "var(--muted-text)" }}>
            …
          </span>
        ) : (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            aria-current={n === page ? "page" : undefined}
            style={{
              ...btn,
              ...(n === page ? { background: "var(--navy)", color: "#fff", fontWeight: 700 } : {}),
            }}
          >
            {n}
          </button>
        ),
      )}
      <button type="button" style={btn} disabled={page >= pages} onClick={() => onChange(page + 1)}>
        Next »
      </button>
    </nav>
  );
}

/** Fulfillment stepper: PAID → IN_REVIEW → SUBMITTED, exceptions as red branch. */
const STEP_ORDER = ["PAID", "IN_REVIEW", "SUBMITTED"];
const STEP_SHORT = ["Payment Successful", "Order Processing", "Submitted"];

export function Stepper({ status }: { status: string }) {
  const isException = status === "ON_HOLD" || status === "NEED_INFO";
  const index = isException ? 1 : Math.max(0, STEP_ORDER.indexOf(status));
  return (
    <div>
      <div
        className="staff-stepper"
        aria-label={`Order status: ${STATUS_LABELS[status] ?? status}`}
      >
        {STEP_ORDER.map((step, i) => (
          <span key={step} style={{ display: "contents" }}>
            {i > 0 ? <span className="staff-step-link" aria-hidden /> : null}
            <span className={`staff-step ${i < index ? "done" : ""} ${i === index ? "now" : ""}`}>
              <span className="dot" aria-hidden>
                {i < index ? "✓" : i + 1}
              </span>
              {STEP_SHORT[i]}
            </span>
          </span>
        ))}
      </div>
      {isException ? (
        <p style={{ margin: "8px 0 0" }}>
          <StatusPill status={status} />{" "}
          <span style={{ fontSize: "0.9rem", color: "var(--muted-text)" }}>
            Parked — resume to Order Processing to continue.
          </span>
        </p>
      ) : null}
    </div>
  );
}

/** Groups timestamped entries under day headers (MILES-style order history). */
export function dayKey(value: string | Date): string {
  const date = value instanceof Date ? value : new Date(value);
  return date.toLocaleDateString("en-US", { year: "numeric", month: "2-digit", day: "2-digit" });
}

export function BackLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <p style={{ margin: "0 0 14px" }}>
      <Link href={href} style={{ color: "var(--navy)", fontWeight: 700 }}>
        {children}
      </Link>
    </p>
  );
}
