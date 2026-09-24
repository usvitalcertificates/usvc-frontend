"use client";

import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";

export const STATUS_LABELS: Record<string, string> = {
  PAID: "Payment Successful",
  IN_REVIEW: "Order Processing",
  TO_CS: "To CS",
  GTG: "GTG",
  SUBMITTED: "Submitted to Govt Agency",
  CANCELLED: "Cancelled",
};

const STATUS_TONE: Record<string, "navy" | "red" | "gray" | "green"> = {
  PAID: "navy",
  IN_REVIEW: "navy",
  TO_CS: "red",
  GTG: "green",
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

export function EmptyState({
  title,
  hint,
  action,
}: {
  title: string;
  hint?: string;
  action?: ReactNode;
}) {
  return (
    <div className="staff-panel-body" style={{ textAlign: "center", padding: "36px 20px" }}>
      <p style={{ fontWeight: 700, fontSize: "1.1rem", color: "var(--flow-ink)" }}>{title}</p>
      {hint ? <p style={{ color: "var(--flow-secondary)" }}>{hint}</p> : null}
      {action}
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
export function Toast({
  message,
  action,
  onDone,
}: {
  message: string;
  action?: ReactNode;
  onDone: () => void;
}) {
  useEffect(() => {
    const timer = setTimeout(onDone, 6000);
    return () => clearTimeout(timer);
  }, [onDone]);
  return (
    <p role="status" className="staff-alert success">
      {message}
      {action ? <span style={{ marginLeft: "12px" }}>{action}</span> : null}
    </p>
  );
}

/** Styled confirmation popup. Use this instead of window.confirm everywhere. */
export function ConfirmModal({
  title,
  body,
  confirmLabel,
  danger,
  busy,
  onCancel,
  onConfirm,
}: {
  title: string;
  body: string;
  confirmLabel: string;
  danger?: boolean;
  busy?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="staff-modal-backdrop" onClick={onCancel}>
      <div
        className="staff-modal"
        role="dialog"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
      >
        <h2>{title}</h2>
        <p style={{ color: "var(--muted-text)" }}>{body}</p>
        <div style={{ display: "flex", gap: "10px", marginTop: "14px" }}>
          <button
            type="button"
            className={`staff-btn${danger ? " danger" : ""}`}
            disabled={busy}
            onClick={onConfirm}
          >
            {busy ? "Please wait…" : confirmLabel}
          </button>
          <button type="button" className="staff-btn secondary" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Centered success popup (pastel green) with a countdown auto-dismiss.
 * Backdrop click counts as skip. Parent should key it by order id so
 * re-claims reset the timer.
 */
export function TimedActionModal({
  title,
  orderNumber,
  primaryLabel,
  primaryHref,
  seconds = 10,
  onClose,
}: {
  title: string;
  orderNumber: string;
  primaryLabel: string;
  primaryHref: string;
  seconds?: number;
  onClose: () => void;
}) {
  const [left, setLeft] = useState(seconds);
  useEffect(() => {
    setLeft(seconds);
    const timer = setInterval(() => {
      setLeft((n) => (n <= 1 ? 0 : n - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [seconds]);
  useEffect(() => {
    if (left <= 0) onClose();
  }, [left, onClose]);
  return (
    <div className="staff-modal-backdrop" onClick={onClose}>
      <div
        className="staff-modal"
        role="dialog"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
        style={{ background: "var(--flow-success-bg)", borderColor: "#bbf7d0" }}
      >
        <h2 style={{ color: "#15803d" }}>{title}</h2>
        <p style={{ fontSize: "0.95rem" }}>
          You have taken ownership of order number <br />
          <strong className="py-1">{orderNumber}</strong>.
        </p>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "14px" }}>
          <Link
            href={primaryHref}
            className="staff-btn green"
            style={{ textDecoration: "none" }}
            onClick={onClose}
          >
            {primaryLabel}
          </Link>
          <button type="button" className="staff-btn secondary" onClick={onClose}>
            Skip now
          </button>
          <span
            style={{
              marginLeft: "auto",
              alignSelf: "center",
              fontSize: "0.78rem",
              color: "var(--muted-text)",
            }}
          >
            Closing in {left}s
          </span>
        </div>
        <div
          aria-hidden
          style={{
            marginTop: "12px",
            height: "4px",
            borderRadius: "999px",
            background: "#bbf7d0",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${(left / seconds) * 100}%`,
              background: "#16a34a",
              borderRadius: "999px",
            }}
          />
        </div>
      </div>
    </div>
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

/**
 * Agent-centric stepper: Claimed → Order Processing → Submitted.
 * Payment is a precondition chip (only paid orders reach agents), and
 * TO_CS parks as a red branch off Processing.
 */
const AGENT_STEPS = [
  { key: "claimed", label: "Took Ownership", caption: "Order is yours, work not started." },
  { key: "processing", label: "Order Processing", caption: "You're working this order now." },
  { key: "submitted", label: "Submitted", caption: "Sent to the government agency." },
];

function agentStepIndex(status: string): number {
  if (status === "SUBMITTED") return 2;
  if (status === "IN_REVIEW" || status === "TO_CS" || status === "GTG") return 1;
  return 0;
}

export function Stepper({
  status,
  submittedAt,
  parkedNote,
}: {
  status: string;
  submittedAt?: string | null;
  parkedNote?: string | null;
}) {
  const isParked = status === "TO_CS";
  const isReady = status === "GTG";
  const index = agentStepIndex(status);
  const done = status === "SUBMITTED";
  return (
    <div>
      <p style={{ margin: "0 0 10px" }}>
        <span className="staff-pill gray">Paid ✓</span>{" "}
        <span style={{ fontSize: "0.85rem", color: "var(--flow-secondary)" }}>
          Processing fee collected — this order is ready for fulfillment.
        </span>
      </p>
      <div
        className="staff-stepper"
        aria-label={`Order status: ${STATUS_LABELS[status] ?? status}`}
      >
        {AGENT_STEPS.map((step, i) => {
          const isDone = i < index || done;
          const isNow = i === index && !done;
          const isNext = i === index + 1 && !done;
          const isTerminal = done && i === AGENT_STEPS.length - 1;
          return (
            <span key={step.key} style={{ display: "contents" }}>
              {i > 0 ? <span className="staff-step-link" aria-hidden /> : null}
              <span
                className={`staff-step${isDone ? " done" : ""}${isNow ? " now" : ""}${isNext ? " next" : ""}${isTerminal ? " terminal" : ""}`}
              >
                <span className="dot" aria-hidden>
                  {isDone || isNow ? "✓" : i + 1}
                </span>
                <span>
                  {step.label}
                  {isNext ? <span className="staff-upnext">Up next</span> : null}
                  <span className="staff-step-caption">{step.caption}</span>
                </span>
              </span>
            </span>
          );
        })}
      </div>
      {isParked && parkedNote ? (
        <p style={{ margin: "8px 0 0" }}>
          <StatusPill status={status} />{" "}
          <span style={{ fontSize: "0.9rem", color: "var(--flow-secondary)" }}>
            Latest note: “{parkedNote}”
          </span>
        </p>
      ) : null}
      {isReady ? (
        <p style={{ margin: "8px 0 0" }}>
          <StatusPill status={status} />{" "}
          <span style={{ fontSize: "0.9rem", color: "#15803d", fontWeight: 700 }}>
            This form is now correct and can continue — move it back to Order Processing.
          </span>
        </p>
      ) : null}
      {done ? (
        <div className="staff-closed-panel" role="status">
          <p className="staff-closed-title">
            <span aria-hidden>✓ </span>This order is closed — submitted to the government agency.
          </p>
          {submittedAt ? (
            <p className="staff-closed-sub">
              Submitted {new Date(submittedAt).toLocaleString("en-US")}.
            </p>
          ) : null}
        </div>
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
