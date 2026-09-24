"use client";

import { use, useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { CopyButton } from "@/components/staff/CopyButton";
import { staffData, staffJson, staffRole } from "@/lib/staff-client";
import { useInactivitySignout, useRequireStaffAuth } from "@/lib/staff-auth-hook";
import { BackLink, STATUS_LABELS, StatusPill, Stepper, Toast } from "@/components/staff/ui";
import {
  activityCategory,
  dayKey,
  fullTime,
  humanizeActivity,
  relTime,
} from "@/components/staff/activity";

const NEXT_STATUS: Record<string, string[]> = {
  PAID: ["IN_REVIEW"],
  IN_REVIEW: ["SUBMITTED", "TO_CS"],
  TO_CS: ["GTG"],
  GTG: ["IN_REVIEW"],
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
  pricing?: { serviceCents: number; rushCents: number; totalCents: number };
  amountCents?: number;
  notes: { authorId?: string; body: string; createdAt?: string }[];
  createdAt: string;
}

interface AuditEntry {
  actorId?: string;
  action?: string;
  metadata?: Record<string, unknown>;
  createdAt?: string;
}

function auditLabel(entry: AuditEntry): string {
  return humanizeActivity(entry);
}

/** firstName → First name, dateOfBirth → Date of birth. */
function prettyLabel(key: string): string {
  const spaced = key
    .replace(/([A-Z])/g, " $1")
    .replace(/[_-]+/g, " ")
    .trim();
  return spaced.charAt(0).toUpperCase() + spaced.slice(1).toLowerCase();
}

function sectionText(entries: [string, unknown][]): string {
  return entries
    .filter(([, val]) => val !== "" && val !== undefined && val !== null)
    .map(([key, val]) => `${prettyLabel(key)}: ${String(val)}`)
    .join("\n");
}

/**
 * One striped-table section (Requestor, Subject, address…) with a header
 * Copy-all button for pasting the whole block onto government forms.
 */
function FieldSection({ title, entries }: { title: string; entries: [string, unknown][] }) {
  const visible = entries.filter(([, val]) => val !== "" && val !== undefined && val !== null);
  if (visible.length === 0) return null;
  return (
    <section aria-label={title} style={{ marginBottom: "6px" }}>
      <div className="staff-secthead">
        <h3>{title}</h3>
        <CopyButton value={sectionText(visible)} label={`${title} section`} />
      </div>
      <dl className="staff-deflist">
        {visible.map(([key, val]) => {
          const label = prettyLabel(key);
          const text = String(val);
          return (
            <div key={key}>
              <dt>{label}</dt>
              <dd>
                <CopyButton value={text} label={label} position="left" />
                <span>{text}</span>
              </dd>
            </div>
          );
        })}
      </dl>
    </section>
  );
}

const SENSITIVE_NOTICE: Record<"ssn" | "card", string> = {
  ssn: "Sensitive — handle with care. Use this Social Security number only where the agency form requires it for this order. Never paste it into chats, emails, notes, or any other website. Every reveal is logged under your name.",
  card: "Sensitive — handle with care. Use these card details only on this order's official government payment page. Never paste them into chats, emails, notes, or any other website. Every reveal is logged under your name.",
};

function cardBrand(number: string): string {
  if (number.startsWith("4")) return "Visa";
  if (number.startsWith("5")) return "Mastercard";
  return "Card";
}

function groupCardNumber(number: string): string {
  return number.replace(/(\d{4})(?=\d)/g, "$1 ");
}

function RevealCard({
  orderId,
  field,
  title,
  shortTitle,
  onReveal,
}: {
  orderId: string;
  field: "ssn" | "card";
  title: string;
  shortTitle?: string;
  onReveal: () => void;
}) {
  const [reason, setReason] = useState("Govt submission");
  const [other, setOther] = useState("");
  const [ssn, setSsn] = useState<string | null>(null);
  const [card, setCard] = useState<{ number: string; expiry: string; securityCode: string } | null>(
    null,
  );
  const [seconds, setSeconds] = useState(0);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const wipe = useCallback(() => {
    if (timer.current) clearInterval(timer.current);
    timer.current = null;
    setSsn(null);
    setCard(null);
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
      if (field === "ssn") setSsn(data.ssn ?? "");
      else
        setCard({
          number: data.card?.number ?? "",
          expiry: data.card?.expiry ?? "",
          securityCode: data.card?.securityCode ?? "",
        });
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

  const revealed = field === "ssn" ? ssn !== null : card !== null;

  return (
    <div className="staff-panel">
      <h3>{title}</h3>
      <div className="staff-panel-body">
        <p role="note" className="staff-alert warning">
          {SENSITIVE_NOTICE[field]}
        </p>
        {revealed ? (
          <>
            {field === "ssn" && ssn !== null ? (
              <p style={{ fontSize: "1.4rem", fontWeight: 800, letterSpacing: "0.06em" }}>
                <CopyButton value={ssn} label="SSN" position="left" />
                <span>{ssn}</span>
              </p>
            ) : null}
            {field === "card" && card !== null ? (
              <div className="staff-paycard" aria-label="Revealed payment card">
                <div className="staff-paycard-top">
                  <span className="staff-paycard-chip" aria-hidden>
                    <span />
                    <span />
                  </span>
                  <span className="staff-paycard-brand">{cardBrand(card.number)}</span>
                </div>
                <p className="staff-paycard-number">
                  <CopyButton value={card.number} label="Card number" position="left" />
                  <span>{groupCardNumber(card.number)}</span>
                </p>
                <div className="staff-paycard-row">
                  <span>
                    <span className="staff-paycard-caption">Expiry</span>
                    <span className="staff-paycard-value">
                      <CopyButton value={card.expiry} label="Card expiry" position="left" />
                      <span>{card.expiry}</span>
                    </span>
                  </span>
                  <span>
                    <span className="staff-paycard-caption">CVC</span>
                    <span className="staff-paycard-value">
                      <CopyButton value={card.securityCode} label="Card CVC" position="left" />
                      <span>{card.securityCode}</span>
                    </span>
                  </span>
                </div>
                <div className="staff-paycard-foot">
                  <div className="staff-countdown" aria-hidden>
                    <div style={{ width: `${(seconds / 30) * 100}%` }} />
                  </div>
                  <p role="status">
                    Auto-masks in {seconds}s. Do not store or photograph this value.
                  </p>
                  <button type="button" className="staff-btn light" onClick={wipe}>
                    Mask now
                  </button>
                </div>
              </div>
            ) : null}
            {field === "ssn" ? (
              <>
                <div className="staff-countdown" aria-hidden>
                  <div style={{ width: `${(seconds / 30) * 100}%` }} />
                </div>
                <p role="status" style={{ color: "#b91c1c", fontWeight: 700, marginBottom: "8px" }}>
                  Auto-masks in {seconds}s. Do not store or photograph this value.
                </p>
                <button type="button" className="staff-btn secondary" onClick={wipe}>
                  Mask now
                </button>
              </>
            ) : null}
          </>
        ) : (
          <div className="staff-reveal-form">
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
            <div>
              <button
                type="button"
                className="staff-btn danger"
                disabled={busy}
                onClick={() => void reveal()}
              >
                {busy ? "Revealing…" : `Reveal ${shortTitle ?? title}`}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

type Tab = "summary" | "application" | "notes";

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
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
  const [toCsOpen, setToCsOpen] = useState(false);
  const [tab, setTab] = useState<Tab>("summary");
  const [isAdmin, setIsAdmin] = useState(false);
  const [canSeePricing, setCanSeePricing] = useState(false);
  const [canCorrect, setCanCorrect] = useState(false);
  const [histLimit, setHistLimit] = useState(10);
  const [noteLimit, setNoteLimit] = useState(10);

  useEffect(() => {
    const role = staffRole();
    setIsAdmin(role === "ADMIN");
    setCanSeePricing(role === "ADMIN" || role === "CS");
    setCanCorrect(role === "ADMIN" || role === "CS");
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

  const confirmToCs = async () => {
    setBusy(true);
    setError("");
    try {
      await staffJson(`/orders/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: "TO_CS", note: statusNote.trim() }),
      });
      setToCsOpen(false);
      router.replace("/staff");
    } catch (e) {
      setToCsOpen(false);
      setError(e instanceof Error ? e.message : "Could not send to CS");
    } finally {
      setBusy(false);
    }
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
  const exceptionMove = effectiveMoveTo === "TO_CS";
  const gtgMove = effectiveMoveTo === "GTG";
  // TO_CS is locked: only CS/ADMIN (canCorrect) may move it — and only to GTG.
  const toCsLocked = order.status === "TO_CS" && !canCorrect;
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
  // Newest-first flat list for paging; day headers regrouped on render.
  const flatHist: { day: string; entry: AuditEntry }[] = [];
  for (const group of days)
    for (const entry of group.entries) flatHist.push({ day: group.day, entry });
  const shownHist = flatHist.slice(0, histLimit);
  const shownHistDays: { day: string; entries: AuditEntry[] }[] = [];
  for (const { day, entry } of shownHist) {
    const group = shownHistDays.find((g) => g.day === day);
    if (group) group.entries.push(entry);
    else shownHistDays.push({ day, entries: [entry] });
  }
  const notesNewest = [...(order.notes ?? [])].reverse();
  const shownNotes = notesNewest.slice(0, noteLimit);

  const sensitiveWarning =
    /(\b\d{3}[- ]?\d{2}[- ]?\d{4}\b|\b\d{13,19}\b)/.test(note) &&
    "This looks like an SSN or card number — notes are internal but never store sensitive values here.";

  return (
    <>
      <BackLink href="/staff">← Back to Open Orders</BackLink>
      <div className="staff-orderbar">
        <div className="staff-orderbar-id">
          <p className="staff-orderbar-eyebrow">
            {closed ? "Closed order — read only" : "Internal order record — access is logged"}
          </p>
          <h1>
            Order #{order.publicNumber}{" "}
            <CopyButton value={order.publicNumber} label="Order number" />
          </h1>
          <p className="staff-orderbar-sub">
            {`${order.certificate.charAt(0) + order.certificate.slice(1).toLowerCase()} · ${order.stateName} (${order.geo.county}, ${order.geo.city}) · Submitted ${new Date(order.createdAt).toLocaleString("en-US")}`}
          </p>
          <p className="staff-orderbar-pills">
            <StatusPill status={order.status} />
            {order.rush ? <span className="staff-pill amber">RUSH</span> : null}
          </p>
        </div>
        {!closed ? (
          <div className="staff-orderbar-actions">
            <button type="button" className="staff-btn light" onClick={goWorkflow}>
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
          </div>
        ) : null}
      </div>
      {toast ? <Toast message={toast} onDone={() => setToast("")} /> : null}
      {error ? (
        <p role="alert" className="staff-alert error">
          {error}
        </p>
      ) : null}

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
              <Stepper
                status={order.status}
                submittedAt={
                  [...audit]
                    .reverse()
                    .find(
                      (e) =>
                        e.action === "fulfillment_status_updated" &&
                        (e.metadata as { status?: string } | undefined)?.status === "SUBMITTED",
                    )?.createdAt ?? null
                }
                parkedNote={
                  order.status === "TO_CS"
                    ? ((order.notes ?? []).at(-1)?.body.slice(0, 140) ?? null)
                    : null
                }
              />
              {!closed ? (
                toCsLocked ? (
                  <div
                    role="status"
                    style={{
                      background: "#fef2f2",
                      border: "1px solid #fecaca",
                      borderRadius: "8px",
                      padding: "12px 14px",
                      marginTop: "16px",
                    }}
                  >
                    <p style={{ color: "#b91c1c", fontWeight: 700, margin: "0 0 4px" }}>
                      CS is looking into it.
                    </p>
                    <p style={{ margin: 0, fontSize: "0.9rem", color: "#7f1d1d" }}>
                      Submit is blocked until CS or ADMIN marks this order GTG. It will then return
                      to the queue so you can continue.
                    </p>
                  </div>
                ) : (
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
                        Internal note (required for To CS)
                        <textarea
                          value={statusNote}
                          onChange={(e) => setStatusNote(e.target.value)}
                          rows={4}
                          maxLength={2000}
                          placeholder="What does this order need before it can continue?…"
                          autoComplete="off"
                          style={{ width: "100%", minHeight: "88px", resize: "vertical" }}
                        />
                      </label>
                    ) : null}
                    {gtgMove ? (
                      <label>
                        Completion note (optional)
                        <input
                          value={statusNote}
                          onChange={(e) => setStatusNote(e.target.value)}
                          maxLength={2000}
                          placeholder="What was fixed?…"
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
                        disabled={busy || (exceptionMove && !statusNote.trim())}
                        onClick={() => {
                          if (exceptionMove) {
                            setToCsOpen(true);
                            return;
                          }
                          void postAction(
                            `/orders/${id}/status`,
                            {
                              status: effectiveMoveTo,
                              ...(gtgMove && statusNote.trim() ? { note: statusNote.trim() } : {}),
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
                )
              ) : (
                <p style={{ color: "var(--flow-secondary)", marginBottom: 0 }}>
                  No further actions — the submission record above is final.
                </p>
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
                  <div className="staff-owner">
                    <span className="staff-owner-avatar" aria-hidden>
                      {(order.assignedName?.trim()[0] ?? "?").toUpperCase()}
                    </span>
                    <span>
                      <strong className="staff-owner-name">
                        {order.assignedName ?? "Unassigned"}
                      </strong>
                      <span className="staff-owner-role">
                        {order.assignedName ? "Assigned agent" : "Waiting in queue"}
                      </span>
                    </span>
                  </div>
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
              {canSeePricing && order.pricing && order.amountCents !== undefined ? (
                <div className="staff-panel">
                  <h3>Products</h3>
                  <div className="staff-panel-body">
                    <dl className="staff-lines">
                      <div>
                        <dt>
                          Certified copy of{" "}
                          {order.certificate.charAt(0) + order.certificate.slice(1).toLowerCase()}{" "}
                          Certificate
                          <span className="staff-lines-sub">
                            Online Processing Fee · Qty: {order.copies} Certificate(s)
                          </span>
                        </dt>
                        <dd>{money(order.pricing.serviceCents)}</dd>
                      </div>
                      {order.pricing.rushCents > 0 ? (
                        <div>
                          <dt>Rush Processing</dt>
                          <dd>{money(order.pricing.rushCents)}</dd>
                        </div>
                      ) : null}
                      <div className="staff-lines-total">
                        <dt>Total Paid</dt>
                        <dd>{money(order.amountCents)}</dd>
                      </div>
                    </dl>
                    <p className="staff-lines-note">Processing fee collected at checkout.</p>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </>
      ) : null}

      {tab === "application" ? (
        <>
          <div className="staff-panel">
            <h2>Application</h2>
            <div className="staff-panel-body">
              <FieldSection
                title="Requestor & contact"
                entries={Object.entries(order.applicant ?? {})}
              />
              {Object.keys(order.subject ?? {}).length > 0 ? (
                <FieldSection title="Subject" entries={Object.entries(order.subject)} />
              ) : null}
              {Object.keys(order.family ?? {}).length > 0 ? (
                <FieldSection title="Family" entries={Object.entries(order.family)} />
              ) : null}
              {Object.entries(order.addresses ?? {}).map(([kind, addr]) => (
                <FieldSection
                  key={kind}
                  title={`${kind.charAt(0).toUpperCase() + kind.slice(1)} address`}
                  entries={Object.entries(addr ?? {})}
                />
              ))}
            </div>
          </div>
          <RevealCard
            orderId={id}
            field="ssn"
            title="Social Security Number (SSN)"
            shortTitle="SSN"
            onReveal={() => void load()}
          />
          <RevealCard orderId={id} field="card" title="Payment card" onReveal={() => void load()} />
          {canCorrect && !closed && (order.status === "TO_CS" || order.status === "GTG") ? (
            <p style={{ fontSize: "0.9rem", color: "var(--muted-text)" }}>
              CS edits this order in the dedicated editor:{" "}
              <a href={`/staff/cs/edit/${id}`}>Open in CS editor →</a>
            </p>
          ) : null}
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
                {shownNotes.map((n, i) => (
                  <li key={i} className="cat-note">
                    <div className="staff-note-card">
                      <p style={{ margin: 0, whiteSpace: "pre-wrap" }}>{n.body}</p>
                      <p
                        className="t-date"
                        style={{ margin: "6px 0 0" }}
                        title={fullTime(n.createdAt)}
                      >
                        {relTime(n.createdAt)}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
              {(order.notes ?? []).length === 0 ? (
                <p style={{ color: "var(--flow-secondary)" }}>
                  No notes yet — add the first one above.
                </p>
              ) : null}
              {(order.notes ?? []).length > shownNotes.length ? (
                <button
                  type="button"
                  className="staff-btn secondary"
                  onClick={() => setNoteLimit((n) => n + 10)}
                >
                  Show more ({(order.notes ?? []).length - shownNotes.length} older)
                </button>
              ) : null}
              {noteLimit > 10 && (order.notes ?? []).length <= shownNotes.length ? (
                <button
                  type="button"
                  className="staff-btn secondary"
                  onClick={() => setNoteLimit(10)}
                >
                  Show less
                </button>
              ) : null}
            </div>
          </div>
          <div className="staff-panel">
            <h2>Order History</h2>
            <div className="staff-panel-body">
              <p style={{ fontSize: "0.9rem", color: "var(--muted-text)", marginTop: 0 }}>
                Who accessed or changed this order. Values are never stored in the log. Showing{" "}
                {shownHist.length} of {flatHist.length}.
              </p>
              {shownHistDays.map((group) => (
                <div key={group.day}>
                  <p className="staff-day">{group.day}</p>
                  <ul className="staff-timeline">
                    {group.entries.map((entry, i) => (
                      <li key={i} className={`cat-${activityCategory(entry.action)}`}>
                        <p style={{ margin: 0 }}>
                          <span className="t-date" title={fullTime(entry.createdAt)}>
                            {relTime(entry.createdAt)}
                          </span>
                          : <strong>{auditLabel(entry)}</strong>
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              {audit.length === 0 ? <p>No activity recorded yet.</p> : null}
              {flatHist.length > shownHist.length ? (
                <button
                  type="button"
                  className="staff-btn secondary"
                  onClick={() => setHistLimit((n) => n + 10)}
                >
                  Show more ({flatHist.length - shownHist.length} older)
                </button>
              ) : null}
              {histLimit > 10 && flatHist.length <= shownHist.length && flatHist.length > 0 ? (
                <button
                  type="button"
                  className="staff-btn secondary"
                  onClick={() => setHistLimit(10)}
                >
                  Show less
                </button>
              ) : null}
            </div>
          </div>
        </>
      ) : null}

      {toCsOpen && order ? (
        <div className="staff-modal-backdrop" onClick={() => setToCsOpen(false)}>
          <div
            className="staff-modal"
            role="dialog"
            aria-label="Confirm send To CS"
            onClick={(e) => e.stopPropagation()}
          >
            <h2>Send To CS?</h2>
            <p style={{ color: "var(--muted-text)" }}>
              This will send order to CS for review and your ownership will drop automatically.
            </p>
            <p
              role="note"
              style={{
                background: "#fef2f2",
                border: "1px solid #fecaca",
                borderRadius: "8px",
                padding: "10px 12px",
                fontSize: "0.9rem",
                whiteSpace: "pre-wrap",
                maxHeight: "180px",
                overflowY: "auto",
              }}
            >
              <strong style={{ color: "#b91c1c" }}>Note to CS: </strong>
              <p>{statusNote.trim()}</p>
            </p>
            <div style={{ display: "flex", gap: "10px", marginTop: "14px" }}>
              <button
                type="button"
                className="staff-btn"
                disabled={busy}
                onClick={() => void confirmToCs()}
              >
                {busy ? "Sending…" : "Send To CS"}
              </button>
              <button
                type="button"
                className="staff-btn secondary"
                onClick={() => setToCsOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
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
    staffData<{ staff?: { id: string; fullName: string; email: string }[] }>("/admin/staff")
      .then(({ data }) => setStaff(data.staff ?? []))
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
