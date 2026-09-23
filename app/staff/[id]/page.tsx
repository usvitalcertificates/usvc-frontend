"use client";

import { use, useCallback, useEffect, useRef, useState } from "react";
import { CopyButton } from "@/components/staff/CopyButton";
import { staffFetch, staffJson, staffRole } from "@/lib/staff-client";
import { useInactivitySignout, useRequireStaffAuth } from "@/lib/staff-auth-hook";
import {
  BackLink,
  PageBand,
  STATUS_LABELS,
  StatusPill,
  Stepper,
  Toast,
  dayKey,
} from "@/components/staff/ui";

const NEXT_STATUS: Record<string, string[]> = {
  PAID: ["IN_REVIEW"],
  IN_REVIEW: ["SUBMITTED", "ON_HOLD", "NEED_INFO"],
  ON_HOLD: ["IN_REVIEW"],
  NEED_INFO: ["IN_REVIEW"],
  SUBMITTED: [],
};

interface OrderDetail {
  _id: string;
  publicNumber: string;
  certificate: string;
  stateName: string;
  stateCode: string;
  geo: { county: string; city: string };
  reason: string;
  reasonOther?: string;
  applicant: Record<string, string>;
  subject: Record<string, string>;
  family: Record<string, string>;
  addresses: Record<string, Record<string, string>>;
  copies: number;
  rush: boolean;
  deliveryMethod: string;
  status: string;
  paymentStatus: string;
  assignedName: string | null;
  pricing: { serviceCents: number; rushCents: number; totalCents: number };
  amountCents: number;
  notes: { authorId?: string; body: string; createdAt?: string }[];
  createdAt: string;
}

interface AuditEntry {
  actorId?: string;
  action?: string;
  metadata?: Record<string, unknown>;
  createdAt?: string;
}

const AUDIT_LABELS: Record<string, string> = {
  order_created: "Order created",
  payment_confirmed: "Payment confirmed",
  order_claimed: "Order claimed",
  order_released: "Ownership released",
  order_reassigned: "Order reassigned",
  fulfillment_status_updated: "Status updated",
  internal_note_added: "Internal note added",
  sensitive_reveal: "Sensitive data revealed",
  confirmation_email_sent: "Confirmation email sent",
};

function auditLabel(entry: AuditEntry): string {
  const base = AUDIT_LABELS[entry.action ?? ""] ?? entry.action ?? "Activity";
  const status = (entry.metadata as { status?: string } | undefined)?.status;
  const field = (entry.metadata as { field?: string } | undefined)?.field;
  if (status) return `${base} → ${STATUS_LABELS[status] ?? status}`;
  if (field) return `${base} (${field === "ssn" ? "SSN" : "card"})`;
  return base;
}

function Field({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <p style={{ margin: "0.25rem 0" }}>
      <strong>{label}:</strong> {value}
      <CopyButton value={value} label={label} />
    </p>
  );
}

function RevealCard({
  orderId,
  field,
  title,
  onReveal,
}: {
  orderId: string;
  field: "ssn" | "card";
  title: string;
  onReveal: () => void;
}) {
  const [reason, setReason] = useState("Govt submission");
  const [other, setOther] = useState("");
  const [value, setValue] = useState<string | null>(null);
  const [seconds, setSeconds] = useState(0);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const wipe = useCallback(() => {
    if (timer.current) clearInterval(timer.current);
    timer.current = null;
    setValue(null);
    setSeconds(0);
  }, []);

  useEffect(() => {
    const hide = () => wipe();
    document.addEventListener("visibilitychange", hide);
    window.addEventListener("beforeunload", hide);
    return () => {
      document.removeEventListener("visibilitychange", hide);
      window.removeEventListener("beforeunload", hide);
      if (timer.current) clearInterval(timer.current);
    };
  }, [wipe]);

  const reveal = async () => {
    setBusy(true);
    setError("");
    try {
      const finalReason = reason === "Other" ? other.trim() : reason;
      if (!finalReason) throw new Error("A reason is required.");
      const data = await staffJson<{
        ssn?: string;
        card?: { number: string; expiry: string; securityCode: string };
      }>(`/orders/${orderId}/reveal`, {
        method: "POST",
        body: JSON.stringify({ field, reason: finalReason }),
      });
      const shown =
        field === "ssn"
          ? (data.ssn ?? "")
          : [data.card?.number, data.card?.expiry, data.card?.securityCode]
              .filter(Boolean)
              .join(" · ");
      setValue(shown);
      setSeconds(30);
      if (timer.current) clearInterval(timer.current);
      timer.current = setInterval(() => {
        setSeconds((s) => {
          if (s <= 1) {
            wipe();
            return 0;
          }
          return s - 1;
        });
      }, 1000);
      onReveal();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Reveal failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="staff-panel">
      <h3>{title}</h3>
      <div className="staff-panel-body">
        {value ? (
          <>
            <p style={{ fontSize: "1.2rem", fontWeight: 700, letterSpacing: "0.04em" }}>
              {value}
              <CopyButton value={value} label={title} />
            </p>
            <div className="staff-countdown" aria-hidden>
              <div style={{ width: `${(seconds / 30) * 100}%` }} />
            </div>
            <p role="status" style={{ color: "var(--red)", fontWeight: 700, marginBottom: "8px" }}>
              Auto-masks in {seconds}s. Do not store or photograph this value.
            </p>
            <button type="button" className="staff-btn secondary" onClick={wipe}>
              Mask now
            </button>
          </>
        ) : (
          <>
            <p>
              <code>*********</code>
            </p>
            <label>
              Reason (recorded in the audit trail)
              <select value={reason} onChange={(e) => setReason(e.target.value)}>
                <option>Govt submission</option>
                <option>Verification</option>
                <option>Other</option>
              </select>
            </label>
            {reason === "Other" ? (
              <input
                value={other}
                onChange={(e) => setOther(e.target.value)}
                placeholder="Describe the reason"
                maxLength={200}
              />
            ) : null}
            {error ? (
              <p role="alert" className="staff-alert error">
                {error}
              </p>
            ) : null}
            <button
              type="button"
              className="staff-btn"
              disabled={busy}
              onClick={() => void reveal()}
            >
              {busy ? "Revealing…" : `Reveal ${title}`}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

type Tab = "summary" | "application" | "notes";

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  useRequireStaffAuth();
  useInactivitySignout();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [audit, setAudit] = useState<AuditEntry[]>([]);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [note, setNote] = useState("");
  const [statusNote, setStatusNote] = useState("");
  const [moveTo, setMoveTo] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [tab, setTab] = useState<Tab>("summary");
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    setIsAdmin(staffRole() === "ADMIN");
  }, []);

  const load = useCallback(async () => {
    setError("");
    try {
      const [detail, history] = await Promise.all([
        staffJson<OrderDetail>(`/staff/orders/${id}`),
        staffJson<{ auditEvents: AuditEntry[] }>(`/orders/${id}/audit`),
      ]);
      setOrder(detail);
      setAudit(history.auditEvents ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load this order");
    }
  }, [id]);

  useEffect(() => {
    void load();
  }, [load]);

  const postAction = async (
    path: string,
    body: unknown,
    method: "POST" | "PATCH",
    success: string,
  ) => {
    setBusy(true);
    setError("");
    try {
      await staffJson(path, { method, body: JSON.stringify(body ?? {}) });
      setNote("");
      setStatusNote("");
      setMoveTo(null);
      setToast(success);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Action failed");
    } finally {
      setBusy(false);
    }
  };

  const releaseOrder = () => {
    if (!window.confirm("Release this order back to the queue? You will lose ownership.")) return;
    void postAction(
      `/staff/orders/${id}/release`,
      {},
      "POST",
      "You have dropped ownership of this order.",
    );
  };

  const goWorkflow = () => {
    setTab("summary");
    window.setTimeout(() => {
      document.getElementById("workflow")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 60);
  };

  if (error && !order) {
    return (
      <>
        <BackLink href="/staff">← Back to Open Orders</BackLink>
        <p role="alert" className="staff-alert error">
          {error}
        </p>
      </>
    );
  }
  if (!order) {
    return (
      <div className="staff-panel">
        <div className="staff-panel-body">Loading the order record…</div>
      </div>
    );
  }

  const next = NEXT_STATUS[order.status] ?? [];
  const money = (cents: number) => `$${(cents / 100).toFixed(2)}`;
  const closed = order.status === "SUBMITTED";
  const effectiveMoveTo = moveTo ?? next[0] ?? "";
  const exceptionMove = effectiveMoveTo === "ON_HOLD" || effectiveMoveTo === "NEED_INFO";
  const requestorName =
    `${order.applicant.firstName ?? ""} ${order.applicant.lastName ?? ""}`.trim() || "—";
  const certName = `${order.stateCode} ${order.certificate.charAt(0) + order.certificate.slice(1).toLowerCase()} Certificate`;

  const days: { day: string; entries: AuditEntry[] }[] = [];
  for (const entry of [...audit].reverse()) {
    const day = dayKey(entry.createdAt ? new Date(entry.createdAt) : new Date());
    const group = days.find((g) => g.day === day);
    if (group) group.entries.push(entry);
    else days.push({ day, entries: [entry] });
  }

  const sensitiveWarning =
    /(\b\d{3}[- ]?\d{2}[- ]?\d{4}\b|\b\d{13,19}\b)/.test(note) &&
    "This looks like an SSN or card number — notes are internal but never store sensitive values here.";

  return (
    <>
      <BackLink href="/staff">← Back to Open Orders</BackLink>
      <PageBand
        eyebrow={closed ? "Closed order — read only" : "Internal order record — access is logged"}
        title={
          <>
            Order #{order.publicNumber}{" "}
            <CopyButton value={order.publicNumber} label="Order number" />
          </>
        }
        subtitle={`${order.certificate.charAt(0) + order.certificate.slice(1).toLowerCase()} · ${order.stateName} (${order.geo.county}, ${order.geo.city}) · Submitted ${new Date(order.createdAt).toLocaleString("en-US")}`}
        actions={
          <>
            <StatusPill status={order.status} />
            {order.rush ? <span className="staff-pill red">RUSH</span> : null}
          </>
        }
      />
      {toast ? <Toast message={toast} onDone={() => setToast("")} /> : null}
      {error ? (
        <p role="alert" className="staff-alert error">
          {error}
        </p>
      ) : null}

      <div className="staff-stickybar" aria-label="Order actions">
        <strong className="staff-stickybar-id">{order.publicNumber}</strong>
        <StatusPill status={order.status} />
        {order.rush ? <span className="staff-pill red">RUSH</span> : null}
        <span className="staff-stickybar-spacer" />
        <CopyButton value={order.publicNumber} label="Order number" />
        {!closed ? (
          <>
            <button type="button" className="staff-btn secondary" onClick={goWorkflow}>
              Update status
            </button>
            <button
              type="button"
              className="staff-btn danger"
              disabled={busy}
              onClick={releaseOrder}
            >
              Drop Ownership
            </button>
          </>
        ) : null}
      </div>

      <div className="staff-tabs" role="tablist" aria-label="Order sections">
        {(
          [
            ["summary", "Summary"],
            ["application", "Application (Owners only)"],
            ["notes", "Notes & History"],
          ] as [Tab, string][]
        ).map(([value, label]) => (
          <button
            key={value}
            type="button"
            role="tab"
            aria-selected={tab === value}
            onClick={() => setTab(value)}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "summary" ? (
        <>
          <div className="staff-panel" id="workflow">
            <h2>Workflow</h2>
            <div className="staff-panel-body">
              <Stepper status={order.status} />
              {!closed ? (
                <div style={{ marginTop: "16px" }}>
                  <label>
                    Move to
                    <select value={effectiveMoveTo} onChange={(e) => setMoveTo(e.target.value)}>
                      {next.map((s) => (
                        <option key={s} value={s}>
                          {STATUS_LABELS[s] ?? s}
                        </option>
                      ))}
                    </select>
                  </label>
                  {exceptionMove ? (
                    <label>
                      Internal note (required for On Hold / Need Customer Information)
                      <input
                        value={statusNote}
                        onChange={(e) => setStatusNote(e.target.value)}
                        maxLength={2000}
                        placeholder="What does this order need before it can continue?…"
                        autoComplete="off"
                      />
                    </label>
                  ) : null}
                  <div
                    style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "10px" }}
                  >
                    <button
                      type="button"
                      className="staff-btn"
                      disabled={busy}
                      onClick={() => {
                        void postAction(
                          `/orders/${id}/status`,
                          {
                            status: effectiveMoveTo,
                            ...(exceptionMove && statusNote.trim()
                              ? { note: statusNote.trim() }
                              : {}),
                          },
                          "PATCH",
                          "The order status has been changed for this order.",
                        );
                      }}
                    >
                      Update status
                    </button>
                  </div>
                </div>
              ) : (
                <p>This order is closed (submitted to the government agency).</p>
              )}
            </div>
          </div>

          <div className="staff-grid-2">
            <div className="staff-panel">
              <h2>Order Summary</h2>
              <div className="staff-panel-body">
                <h3>Order</h3>
                <dl className="staff-deflist">
                  <div>
                    <dt>Type</dt>
                    <dd>{certName}</dd>
                  </div>
                  <div>
                    <dt>Reason</dt>
                    <dd>
                      {order.reason === "Other" ? (order.reasonOther ?? "Other") : order.reason}
                    </dd>
                  </div>
                  <div>
                    <dt>Submitted</dt>
                    <dd>{new Date(order.createdAt).toLocaleString("en-US")}</dd>
                  </div>
                </dl>
                <h3>Requestor</h3>
                <dl className="staff-deflist">
                  <div>
                    <dt>Name</dt>
                    <dd>{requestorName}</dd>
                  </div>
                  {order.applicant.email ? (
                    <div>
                      <dt>Email</dt>
                      <dd>{order.applicant.email}</dd>
                    </div>
                  ) : null}
                  {order.applicant.phone ? (
                    <div>
                      <dt>Phone</dt>
                      <dd>{order.applicant.phone}</dd>
                    </div>
                  ) : null}
                </dl>
                <h3>Fulfillment</h3>
                <dl className="staff-deflist">
                  <div>
                    <dt>Copies</dt>
                    <dd>{order.copies}</dd>
                  </div>
                  <div>
                    <dt>Rush</dt>
                    <dd>{order.rush ? "Yes" : "No"}</dd>
                  </div>
                  <div>
                    <dt>Delivery</dt>
                    <dd>{order.deliveryMethod}</dd>
                  </div>
                </dl>
              </div>
            </div>
            <div className="staff-rail">
              <div className="staff-panel">
                <h3>Ownership</h3>
                <div className="staff-panel-body">
                  <p style={{ marginTop: 0 }}>
                    <strong>{order.assignedName ?? "Unassigned"}</strong>
                  </p>
                  {!closed && isAdmin ? (
                    <ReassignControl
                      orderId={id}
                      onDone={(msg) => {
                        setToast(msg);
                        void load();
                      }}
                      onError={setError}
                    />
                  ) : null}
                </div>
              </div>
              <div className="staff-panel">
                <h3>Products</h3>
                <div className="staff-panel-body">
                  <p>
                    <strong>
                      Certified copy of{" "}
                      {order.certificate.charAt(0) + order.certificate.slice(1).toLowerCase()}{" "}
                      Certificate
                    </strong>
                    <br />
                    Qty: {order.copies} Certificate(s)
                  </p>
                  <p>
                    <strong>Online Processing Fee</strong>
                    <br />
                    {money(order.pricing.serviceCents)}
                    {order.pricing.rushCents > 0 ? (
                      <>
                        <br />
                        <strong>Rush Processing</strong>
                        <br />
                        {money(order.pricing.rushCents)}
                      </>
                    ) : null}
                  </p>
                  <p style={{ fontSize: "1.1rem" }}>
                    <strong>Total Paid: {money(order.amountCents)}</strong>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : null}

      {tab === "application" ? (
        <>
          <div className="staff-panel">
            <h2>Application</h2>
            <div className="staff-panel-body">
              <h3>Requestor &amp; contact</h3>
              {Object.entries(order.applicant ?? {}).map(([key, val]) => (
                <Field key={key} label={key} value={String(val)} />
              ))}
              {Object.keys(order.subject ?? {}).length > 0 ? (
                <>
                  <h3>Subject</h3>
                  {Object.entries(order.subject).map(([key, val]) => (
                    <Field key={key} label={key} value={String(val)} />
                  ))}
                </>
              ) : null}
              {Object.keys(order.family ?? {}).length > 0 ? (
                <>
                  <h3>Family</h3>
                  {Object.entries(order.family).map(([key, val]) => (
                    <Field key={key} label={key} value={String(val)} />
                  ))}
                </>
              ) : null}
              {Object.entries(order.addresses ?? {}).map(([kind, addr]) => (
                <div key={kind}>
                  <h3>{kind} address</h3>
                  {Object.entries(addr ?? {}).map(([key, val]) => (
                    <Field key={`${kind}-${key}`} label={key} value={String(val)} />
                  ))}
                </div>
              ))}
            </div>
          </div>
          <RevealCard orderId={id} field="ssn" title="SSN" onReveal={() => void load()} />
          <RevealCard orderId={id} field="card" title="Payment card" onReveal={() => void load()} />
        </>
      ) : null}

      {tab === "notes" ? (
        <>
          <div className="staff-panel">
            <h2>Order Notes</h2>
            <div className="staff-panel-body">
              <p style={{ fontSize: "0.9rem", color: "var(--muted-text)", marginTop: 0 }}>
                Notes are internal only and never shown to the customer.
              </p>
              {!closed ? (
                <>
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    rows={3}
                    maxLength={2000}
                    aria-label="New internal note"
                  />
                  {sensitiveWarning ? (
                    <p role="alert" className="staff-alert error">
                      {sensitiveWarning}
                    </p>
                  ) : null}
                  <button
                    type="button"
                    className="staff-btn"
                    disabled={busy || !note.trim()}
                    onClick={() =>
                      void postAction(
                        `/staff/orders/${id}/notes`,
                        { body: note.trim() },
                        "POST",
                        "Note added.",
                      )
                    }
                    style={{ marginTop: "8px" }}
                  >
                    Submit
                  </button>
                </>
              ) : null}
              <ul className="staff-timeline" style={{ marginTop: "18px" }}>
                {(order.notes ?? []).map((n, i) => (
                  <li key={i}>
                    <p style={{ margin: 0, whiteSpace: "pre-wrap" }}>{n.body}</p>
                    <p className="t-date" style={{ margin: 0 }}>
                      {n.createdAt ? new Date(n.createdAt).toLocaleString("en-US") : ""}
                    </p>
                  </li>
                ))}
                {(order.notes ?? []).length === 0 ? <li>No notes yet.</li> : null}
              </ul>
            </div>
          </div>
          <div className="staff-panel">
            <h2>Order History</h2>
            <div className="staff-panel-body">
              <p style={{ fontSize: "0.9rem", color: "var(--muted-text)", marginTop: 0 }}>
                Who accessed or changed this order. Values are never stored in the log.
              </p>
              {days.map((group) => (
                <div key={group.day}>
                  <p className="staff-day">{group.day}</p>
                  <ul className="staff-timeline">
                    {group.entries.map((entry, i) => (
                      <li key={i}>
                        <p style={{ margin: 0 }}>
                          {entry.createdAt
                            ? new Date(entry.createdAt).toLocaleTimeString("en-US", {
                                hour: "numeric",
                                minute: "2-digit",
                                second: "2-digit",
                              })
                            : ""}
                          : <strong>{auditLabel(entry)}</strong>
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              {audit.length === 0 ? <p>No activity recorded yet.</p> : null}
            </div>
          </div>
        </>
      ) : null}
    </>
  );
}

function ReassignControl({
  orderId,
  onDone,
  onError,
}: {
  orderId: string;
  onDone: (msg: string) => void;
  onError: (msg: string) => void;
}) {
  const [staff, setStaff] = useState<{ id: string; fullName: string; email: string }[]>([]);
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    staffFetch("/admin/staff")
      .then((r) => r.json())
      .then((data) => setStaff(data.staff ?? []))
      .catch(() => setStaff([]));
  }, []);
  return (
    <label>
      Reassign to
      <select
        defaultValue=""
        disabled={busy}
        onChange={async (e) => {
          const staffId = e.target.value;
          if (!staffId) return;
          setBusy(true);
          try {
            await staffJson(`/staff/orders/${orderId}/reassign`, {
              method: "POST",
              body: JSON.stringify({ staffId }),
            });
            onDone("Order reassigned.");
          } catch (err) {
            onError(err instanceof Error ? err.message : "Reassign failed");
          } finally {
            setBusy(false);
          }
        }}
      >
        <option value="">Select agent…</option>
        {staff
          .filter((m) => m.email)
          .map((m) => (
            <option key={m.id} value={m.id}>
              {m.fullName || m.email}
            </option>
          ))}
      </select>
    </label>
  );
}
