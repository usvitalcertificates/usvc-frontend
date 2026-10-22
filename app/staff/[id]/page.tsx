"use client";

import { use, useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, FileText, Play, UploadCloud } from "lucide-react";
import { ApplicationSections } from "@/components/staff/ApplicationSections";
import { CsReviewSection } from "@/components/staff/CsReviewSection";
import { FinishOrderPanel } from "@/components/staff/FinishOrderPanel";
import { APPLICATION_LABELS } from "@/lib/form-config";
import { useConfirmation } from "@/components/staff/useConfirmation";
import { CopyButton } from "@/components/staff/CopyButton";
import { staffData, staffFetch, staffJson, staffRole } from "@/lib/staff-client";
import { useInactivitySignout, useRequireStaffAuth } from "@/lib/staff-auth-hook";
import {
  BackLink,
  ConfirmModal,
  STATUS_LABELS,
  StatusPill,
  Stepper,
  Toast,
} from "@/components/staff/ui";
import {
  activityCategory,
  dayKey,
  fullTime,
  humanizeActivity,
  relTime,
} from "@/components/staff/activity";
import { formatDateTimeUS } from "@/lib/date-format";

/** ADMIN-only rewinds. Mirrors the backend order-reopen transitions. */
const REOPEN_TARGETS: Record<string, ("PAID" | "IN_REVIEW")[]> = {
  SUBMITTED: ["IN_REVIEW", "PAID"],
  IN_REVIEW: ["PAID"],
  TO_CS: ["IN_REVIEW", "PAID"],
  GTG: ["IN_REVIEW", "PAID"],
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
  substatus?: string | null;
  document?: {
    name: string;
    size: number;
    uploadedBy: string;
    uploadedAt: string;
  } | null;
  paymentStatus: string;
  assignedName: string | null;
  cardLast4?: string;
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
  reference,
  onReveal,
}: {
  orderId: string;
  field: "ssn" | "card";
  title: string;
  shortTitle?: string;
  reference?: string;
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
                <p className="staff-paycard-caption">{APPLICATION_LABELS.cardNumber}</p>
                <p className="staff-paycard-number">
                  <CopyButton
                    value={card.number}
                    label={APPLICATION_LABELS.cardNumber}
                    position="left"
                  />
                  <span>{groupCardNumber(card.number)}</span>
                </p>
                <div className="staff-paycard-row">
                  <span>
                    <span className="staff-paycard-caption">{APPLICATION_LABELS.cardExpiry}</span>
                    <span className="staff-paycard-value">
                      <CopyButton
                        value={card.expiry}
                        label={APPLICATION_LABELS.cardExpiry}
                        position="left"
                      />
                      <span>{card.expiry}</span>
                    </span>
                  </span>
                  <span>
                    <span className="staff-paycard-caption">{APPLICATION_LABELS.cardCvc}</span>
                    <span className="staff-paycard-value">
                      <CopyButton
                        value={card.securityCode}
                        label={APPLICATION_LABELS.cardCvc}
                        position="left"
                      />
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
            {field === "card" ? (
              <dl className="staff-deflist">
                {[
                  APPLICATION_LABELS.cardNumber,
                  APPLICATION_LABELS.cardExpiry,
                  APPLICATION_LABELS.cardCvc,
                ].map((label) => (
                  <div key={label}>
                    <dt>{label}</dt>
                    <dd>*********</dd>
                  </div>
                ))}
              </dl>
            ) : (
              <p>
                <code>*********</code>
              </p>
            )}
            {reference ? (
              <p style={{ fontSize: "0.85rem", color: "var(--muted-text)" }}>{reference}</p>
            ) : null}
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
  const [csNote, setCsNote] = useState("");
  const [substatus, setSubstatus] = useState("");
  const [busy, setBusy] = useState(false);
  const [docDeleteOpen, setDocDeleteOpen] = useState(false);
  const [docBusy, setDocBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const [releaseOpen, setReleaseOpen] = useState(false);
  const [tab, setTab] = useState<Tab>("summary");
  const [isAdmin, setIsAdmin] = useState(false);
  const [isCs, setIsCs] = useState(false);
  const [canSeePricing, setCanSeePricing] = useState(false);
  const [canCorrect, setCanCorrect] = useState(false);
  const [histLimit, setHistLimit] = useState(10);
  const [noteLimit, setNoteLimit] = useState(10);
  const [reopenOpen, setReopenOpen] = useState(false);
  const [reopenTo, setReopenTo] = useState<"PAID" | "IN_REVIEW">("IN_REVIEW");
  const [reopenReason, setReopenReason] = useState("");
  const [reopenBusy, setReopenBusy] = useState(false);

  useEffect(() => {
    const role = staffRole();
    setIsAdmin(role === "ADMIN");
    setIsCs(role === "CS");
    setCanSeePricing(role === "ADMIN" || role === "CS");
    setCanCorrect(role === "ADMIN" || role === "CS");
  }, []);

  const orderScope = JSON.stringify([id, order, isAdmin]);
  const confirmation = useConfirmation(JSON.stringify([orderScope, csNote, substatus]));

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
      setToast(success);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Action failed");
    } finally {
      setBusy(false);
    }
  };

  const releaseOrder = async () => {
    setBusy(true);
    setError("");
    try {
      await staffJson(`/staff/orders/${id}/release`, { method: "POST", body: "{}" });
      router.replace("/staff");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not release this order");
      throw e;
    } finally {
      setBusy(false);
    }
  };

  const reopenOrder = async () => {
    if (!reopenReason.trim()) return false;
    setReopenBusy(true);
    setError("");
    try {
      await staffJson(`/orders/${id}/reopen`, {
        method: "PATCH",
        body: JSON.stringify({ status: reopenTo, reason: reopenReason.trim() }),
      });
      setReopenOpen(false);
      setReopenReason("");
      setToast("Order status restored.");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not reopen this order");
      throw e;
    } finally {
      setReopenBusy(false);
    }
  };

  const uploadDocument = async (file: File) => {
    setDocBusy(true);
    setError("");
    try {
      const form = new FormData();
      form.append("file", file);
      await staffJson(`/orders/${id}/document`, { method: "POST", body: form });
      setToast("Completion PDF uploaded.");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
      throw e;
    } finally {
      setDocBusy(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const downloadDocument = async () => {
    setError("");
    try {
      const response = await staffFetch(`/orders/${id}/document`);
      if (!response.ok) {
        let message = `Download failed (${response.status})`;
        try {
          const data = (await response.json()) as { message?: string };
          if (data.message) message = data.message;
        } catch {
          /* non-JSON error body */
        }
        throw new Error(message);
      }
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = order?.document?.name || "document.pdf";
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 5000);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Download failed");
    }
  };

  const deleteDocument = async () => {
    setDocBusy(true);
    setError("");
    try {
      await staffJson(`/orders/${id}/document`, { method: "DELETE", body: "{}" });
      setToast("Completion PDF deleted.");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Delete failed");
      throw e;
    } finally {
      setDocBusy(false);
    }
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

  const money = (cents: number) => `$${(cents / 100).toFixed(2)}`;
  const closed = order.status === "SUBMITTED";
  const reopenTargets = REOPEN_TARGETS[order.status] ?? [];
  const requestorName =
    `${order.applicant.firstName ?? ""} ${order.applicant.lastName ?? ""}`.trim() || "—";
  const certName = `${order.stateCode} ${order.certificate.charAt(0) + order.certificate.slice(1).toLowerCase()} Certificate`;
  const submittedAt =
    [...audit]
      .reverse()
      .find(
        (e) =>
          e.action === "fulfillment_status_updated" &&
          (e.metadata as { status?: string } | undefined)?.status === "SUBMITTED",
      )?.createdAt ?? null;
  const csSentAt =
    [...audit]
      .reverse()
      .find(
        (e) =>
          e.action === "fulfillment_status_updated" &&
          (e.metadata as { status?: string } | undefined)?.status === "TO_CS",
      )?.createdAt ?? null;
  const latestNote = (order.notes ?? []).at(-1)?.body ?? null;

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

  const goToTab = (value: Tab) => {
    setTab(value);
    window.setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 60);
  };

  const startProcessing = () => {
    confirmation.request({
      title: "Start Order Processing?",
      body: (
        <>
          <p>
            Order <strong>{order.publicNumber}</strong>: Took Ownership → Order Processing.
          </p>
          <p>This opens the Application tab so you can review the form.</p>
        </>
      ),
      confirmLabel: "Start Order Processing",
      run: async () => {
        if (order.status !== "PAID") throw new Error("This order can no longer be started.");
        setBusy(true);
        try {
          await staffJson(`/orders/${id}/status`, {
            method: "PATCH",
            body: JSON.stringify({ status: "IN_REVIEW" }),
          });
          setToast("Order processing started. Continue in the Application tab.");
          await load();
          goToTab("application");
        } finally {
          setBusy(false);
        }
      },
    });
  };

  const sendToCs = () => {
    const noteBody = csNote.trim();
    if (!noteBody) return;
    confirmation.request({
      title: "Send This Order to CS?",
      body: (
        <>
          <p>
            Order <strong>{order.publicNumber}</strong>: Order Processing → To CS.
          </p>
          <p>This releases your ownership and returns you to the queue for CS to review.</p>
          {substatus ? (
            <p>
              Substatus: <strong>{substatus}</strong>
            </p>
          ) : null}
          <p style={{ whiteSpace: "pre-wrap" }}>Note: {noteBody}</p>
        </>
      ),
      confirmLabel: "Send To CS",
      danger: true,
      run: async () => {
        if (order.status !== "IN_REVIEW")
          throw new Error("This order can no longer be sent to CS.");
        setBusy(true);
        try {
          await staffJson(`/orders/${id}/status`, {
            method: "PATCH",
            body: JSON.stringify({
              status: "TO_CS",
              note: noteBody,
              ...(substatus ? { substatus } : {}),
            }),
          });
          setCsNote("");
          setSubstatus("");
          router.replace("/staff");
        } finally {
          setBusy(false);
        }
      },
    });
  };

  const markGtg = () => {
    const noteBody = csNote.trim();
    confirmation.request({
      title: "Mark This Order GTG?",
      body: (
        <>
          <p>
            Order <strong>{order.publicNumber}</strong>: To CS → GTG.
          </p>
          <p>This returns the order to fulfillment and releases your ownership.</p>
          {noteBody ? <p style={{ whiteSpace: "pre-wrap" }}>Completion note: {noteBody}</p> : null}
        </>
      ),
      confirmLabel: "Mark GTG",
      run: async () => {
        if (order.status !== "TO_CS") throw new Error("This order is no longer waiting on CS.");
        setBusy(true);
        try {
          await staffJson(`/orders/${id}/status`, {
            method: "PATCH",
            body: JSON.stringify({ status: "GTG", ...(noteBody ? { note: noteBody } : {}) }),
          });
          setCsNote("");
          router.replace("/staff");
        } finally {
          setBusy(false);
        }
      },
    });
  };

  const resumeProcessing = () => {
    confirmation.request({
      title: "Resume Order Processing?",
      body: (
        <>
          <p>
            Order <strong>{order.publicNumber}</strong>: GTG → Order Processing.
          </p>
          <p>
            CS marked the application correct. Continue reviewing it, then proceed to the completion
            documents.
          </p>
        </>
      ),
      confirmLabel: "Resume Order Processing",
      run: async () => {
        if (order.status !== "GTG") throw new Error("This order is not ready to resume.");
        setBusy(true);
        try {
          await staffJson(`/orders/${id}/status`, {
            method: "PATCH",
            body: JSON.stringify({ status: "IN_REVIEW" }),
          });
          setToast("Order processing resumed.");
          await load();
        } finally {
          setBusy(false);
        }
      },
    });
  };

  const submitToAgency = () => {
    confirmation.request({
      title: "Submit to Government Agency?",
      body: (
        <>
          <p>
            Order <strong>{order.publicNumber}</strong>: Order Processing → Sent to Government
            Agency.
          </p>
          <p>
            This records the submitted status, updates customer tracking, may notify the customer,
            and closes the order. It does not file the application with the agency.
          </p>
        </>
      ),
      confirmLabel: "Close This Order",
      danger: true,
      run: async () => {
        if (order.status !== "IN_REVIEW") throw new Error("The order is not in processing.");
        if (!isAdmin && (!order.document || (order.notes ?? []).length === 0))
          throw new Error("Upload the completion PDF and add at least one note before submitting.");
        setBusy(true);
        try {
          await staffJson(`/orders/${id}/status`, {
            method: "PATCH",
            body: JSON.stringify({ status: "SUBMITTED" }),
          });
          setToast("The order was submitted and is now closed.");
          await load();
        } finally {
          setBusy(false);
        }
      },
    });
  };

  return (
    <>
      <BackLink href="/staff">← Back to Open Orders</BackLink>
      <div className="staff-orderbar">
        <div className="staff-orderbar-id">
          <h1>
            Order #{order.publicNumber}{" "}
            <CopyButton value={order.publicNumber} label="Order number" />
          </h1>
          <p className="staff-orderbar-sub">
            {`${order.certificate.charAt(0) + order.certificate.slice(1).toLowerCase()} · ${order.stateName} (${order.geo.county}, ${order.geo.city}) · Created ${formatDateTimeUS(order.createdAt)}`}
          </p>
          <div className="staff-orderbar-statuses">
            <StatusPill status={order.status} />
            {order.rush ? <span className="staff-pill amber">RUSH</span> : null}
          </div>
        </div>
        {!closed ? (
          <div className="staff-orderbar-side">
            <div className="staff-orderbar-actions">
              <button
                type="button"
                className="staff-btn danger"
                disabled={busy}
                onClick={() => setReleaseOpen(true)}
              >
                Drop Ownership
              </button>
            </div>
            <p className="staff-orderbar-audit">Internal order record — access is logged</p>
          </div>
        ) : (
          <p className="staff-orderbar-audit">Closed order — read only</p>
        )}
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
            ["notes", "Notes & Document Upload"],
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
                submittedAt={submittedAt}
                parkedNote={order.status === "TO_CS" ? (latestNote?.slice(0, 140) ?? null) : null}
              />
              {order.status === "PAID" ? (
                <div className="staff-next-step">
                  <span className="staff-next-step-icon" aria-hidden>
                    <Play />
                  </span>
                  <div className="staff-next-step-copy">
                    <strong>Next step</strong>
                    <span>
                      Start processing this order. The Application tab opens automatically so you
                      can review the form.
                    </span>
                  </div>
                  <button
                    type="button"
                    className="staff-btn"
                    disabled={busy}
                    onClick={startProcessing}
                  >
                    <Play aria-hidden />
                    Start Order Processing
                  </button>
                </div>
              ) : null}
              {order.status === "IN_REVIEW" ? (
                <p className="staff-workflow-hint">
                  Continue in the <strong>Application</strong> tab. Use Proceed there when you are
                  ready for the completion documents.
                </p>
              ) : null}
              {closed ? (
                <p style={{ color: "var(--flow-secondary)", marginBottom: 0 }}>
                  {isAdmin
                    ? "Submitted by mistake? Use the super-admin correction below to reopen it."
                    : "No further actions — the submission record above is final."}
                </p>
              ) : null}
            </div>
          </div>

          {isAdmin && reopenTargets.length > 0 ? (
            <div className="staff-panel" id="admin-reopen">
              <h2>Super-admin correction</h2>
              <div className="staff-panel-body">
                <p style={{ marginTop: 0, color: "var(--flow-secondary)" }}>
                  Accidentally moved this order forward? Restoring it rolls back the
                  customer-visible timeline and is recorded in the audit trail under your name.
                </p>
                <button
                  type="button"
                  className="staff-btn secondary"
                  disabled={busy}
                  onClick={() => {
                    setReopenTo(reopenTargets[0]);
                    setReopenReason("");
                    setReopenOpen(true);
                  }}
                >
                  Reopen order…
                </button>
              </div>
            </div>
          ) : null}

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
                    <dt>Sent to agency</dt>
                    <dd>{formatDateTimeUS(order.createdAt)}</dd>
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
                      publicNumber={order.publicNumber}
                      orderScope={orderScope}
                      onDone={(msg) => {
                        setToast(msg);
                        void load();
                      }}
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
              <ApplicationSections
                data={order}
                renderSensitive={(field) => (
                  <RevealCard
                    orderId={id}
                    field={field}
                    title={field === "ssn" ? APPLICATION_LABELS.ssn : "Credit Card Details"}
                    shortTitle={field === "ssn" ? "SSN" : undefined}
                    reference={
                      field === "card" && order.cardLast4
                        ? `Reference only — card ending ${order.cardLast4}. Full details are removed after submission.`
                        : undefined
                    }
                    onReveal={() => void load()}
                  />
                )}
              />
            </div>
          </div>
          <CsReviewSection
            status={order.status}
            isCs={isCs}
            canCorrect={canCorrect}
            busy={busy}
            note={csNote}
            substatus={substatus}
            savedSubstatus={order.substatus ?? ""}
            latestNote={latestNote}
            sentAt={csSentAt}
            csEditorHref={`/staff/cs/edit/${id}`}
            onNoteChange={setCsNote}
            onSubstatusChange={setSubstatus}
            onSendToCs={sendToCs}
            onMarkGtg={markGtg}
            onResume={resumeProcessing}
          />
          {!closed ? (
            <div className="staff-step-footer">
              <div>
                <strong>
                  {order.status === "IN_REVIEW"
                    ? "Application reviewed?"
                    : order.status === "TO_CS"
                      ? "CS review in progress"
                      : order.status === "GTG"
                        ? "CS marked this form ready"
                        : "Start processing first"}
                </strong>
                <p>
                  {order.status === "IN_REVIEW"
                    ? "No CS review needed? Continue to attach the completion PDF and add an internal note."
                    : order.status === "TO_CS"
                      ? "Continue once the order is marked GTG and processing resumes."
                      : order.status === "GTG"
                        ? "Resume Order Processing above before continuing."
                        : "Use the Summary tab to start Order Processing."}
                </p>
              </div>
              <button
                type="button"
                className="staff-btn"
                disabled={busy || order.status !== "IN_REVIEW"}
                onClick={() => goToTab("notes")}
              >
                Proceed to Notes &amp; Document Upload
                <ArrowRight aria-hidden />
              </button>
            </div>
          ) : null}
        </>
      ) : null}

      {tab === "notes" ? (
        <>
          <div className="staff-notes-grid">
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
                  {order.status === "TO_CS" && order.substatus ? (
                    <li className="cat-status">
                      <div
                        className="staff-note-card"
                        style={{
                          background: "#fef2f2",
                          border: "1px solid #fecaca",
                        }}
                      >
                        <p style={{ margin: 0 }}>
                          <strong style={{ color: "#b91c1c" }}>Substatus: </strong>
                          {order.substatus}
                        </p>
                      </div>
                    </li>
                  ) : null}
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
            <div className="staff-panel staff-package-panel">
              <div className="staff-package-heading">
                <div>
                  <h2>
                    Completion Document
                    <span className="staff-sr-only"> (required)</span>
                  </h2>

                  <p>Attach the final PDF before sending this order to the agency.</p>
                </div>

                <span className="staff-required-badge">
                  Required <span aria-hidden>*</span>
                </span>
              </div>

              <div className="staff-panel-body">
                {/* Keep the file input mounted at all times so Replace works */}
                <input
                  ref={fileRef}
                  type="file"
                  accept="application/pdf,.pdf"
                  hidden
                  disabled={docBusy}
                  onChange={(e) => {
                    const file = e.target.files?.[0];

                    if (file) {
                      confirmation.request({
                        title: order.document
                          ? "Replace Completion PDF?"
                          : "Upload Completion PDF?",
                        body: `Order ${order.publicNumber}: upload ${file.name} (${Math.ceil(file.size / 1024)} KB). ${order.document ? `This replaces ${order.document.name}.` : "This becomes the completion document for the order."}`,
                        confirmLabel: order.document ? "Replace PDF" : "Upload PDF",
                        danger: Boolean(order.document),
                        run: () => uploadDocument(file),
                      });
                    }

                    // Allow selecting the same file again
                    e.target.value = "";
                  }}
                />

                {order.document ? (
                  <div className="staff-doc-card">
                    <div className="staff-doc-main">
                      <span className="staff-doc-icon" aria-hidden>
                        <FileText />
                      </span>

                      <span className="staff-doc-info">
                        <strong>{order.document.name}</strong>

                        <span>
                          {(order.document.size / 1024).toFixed(0)} KB · uploaded{" "}
                          {formatDateTimeUS(order.document.uploadedAt)}
                        </span>
                      </span>
                    </div>

                    <div className="staff-doc-actions">
                      <button
                        type="button"
                        className="staff-doc-textbtn"
                        title="Download PDF"
                        onClick={() => void downloadDocument()}
                      >
                        Download
                      </button>

                      {!closed ? (
                        <>
                          <button
                            type="button"
                            className="staff-doc-textbtn"
                            title="Replace PDF"
                            disabled={docBusy}
                            onClick={() => fileRef.current?.click()}
                          >
                            Replace
                          </button>

                          <button
                            type="button"
                            className="staff-doc-textbtn danger"
                            title="Delete PDF"
                            disabled={docBusy}
                            onClick={() => setDocDeleteOpen(true)}
                          >
                            Delete
                          </button>
                        </>
                      ) : null}
                    </div>
                  </div>
                ) : !closed ? (
                  <button
                    type="button"
                    className="staff-doc-drop"
                    disabled={docBusy}
                    onClick={() => fileRef.current?.click()}
                  >
                    <UploadCloud aria-hidden />

                    <span className="staff-doc-drop-copy">
                      <strong>{docBusy ? "Uploading…" : "Choose completion PDF"}</strong>

                      <span>PDF only · up to 10 MB</span>
                    </span>
                  </button>
                ) : (
                  <p style={{ color: "var(--flow-secondary)" }}>No document attached.</p>
                )}
              </div>
            </div>
          </div>
          <FinishOrderPanel
            status={order.status}
            isAdmin={isAdmin}
            hasDocument={Boolean(order.document)}
            noteCount={(order.notes ?? []).length}
            submittedAt={submittedAt}
            busy={busy}
            onSubmit={submitToAgency}
          />
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

      {reopenOpen && order ? (
        <ConfirmModal
          title="Reopen Order"
          body={`Order ${order.publicNumber}: restore to ${STATUS_LABELS[reopenTo] ?? reopenTo}. This rolls back customer tracking and records the reason in the audit trail.`}
          confirmLabel="Restore status"
          scope={orderScope}
          busy={reopenBusy}
          confirmDisabled={!reopenReason.trim()}
          onCancel={() => setReopenOpen(false)}
          onConfirm={reopenOrder}
        >
          <label>
            Restore to
            <select
              disabled={reopenBusy}
              value={reopenTo}
              onChange={(e) => setReopenTo(e.target.value as "PAID" | "IN_REVIEW")}
            >
              {reopenTargets.map((s) => (
                <option key={s} value={s}>
                  {STATUS_LABELS[s] ?? s}
                </option>
              ))}
            </select>
          </label>
          <label>
            Reason (required, recorded in the audit trail)
            <textarea
              value={reopenReason}
              onChange={(e) => setReopenReason(e.target.value)}
              disabled={reopenBusy}
              rows={3}
              maxLength={500}
              placeholder="Accidentally clicked Submit to Govt Agency"
              style={{ width: "100%", resize: "vertical" }}
            />
          </label>
        </ConfirmModal>
      ) : null}

      {docDeleteOpen && order?.document ? (
        <ConfirmModal
          title="Delete Completion PDF?"
          scope={orderScope}
          busy={docBusy}
          body={`Order ${order.publicNumber}: delete ${order.document.name}? The order cannot be submitted until a new PDF is uploaded.`}
          confirmLabel="Delete"
          danger
          onCancel={() => setDocDeleteOpen(false)}
          onConfirm={deleteDocument}
        />
      ) : null}

      {releaseOpen && order ? (
        <ConfirmModal
          title="Drop Ownership?"
          scope={orderScope}
          body={`Release order ${order.publicNumber} back to the queue? You will lose ownership.`}
          confirmLabel="Drop Ownership"
          danger
          busy={busy}
          onCancel={() => setReleaseOpen(false)}
          onConfirm={releaseOrder}
        />
      ) : null}
      {confirmation.dialog}
    </>
  );
}

function ReassignControl({
  orderId,
  publicNumber,
  orderScope,
  onDone,
}: {
  orderId: string;
  publicNumber: string;
  orderScope: string;
  onDone: (msg: string) => void;
}) {
  const [staff, setStaff] = useState<{ id: string; fullName: string; email: string }[]>([]);
  const confirmation = useConfirmation(orderScope);
  useEffect(() => {
    staffData<{ staff?: { id: string; fullName: string; email: string }[] }>("/admin/staff")
      .then(({ data }) => setStaff(data.staff ?? []))
      .catch(() => setStaff([]));
  }, []);
  return (
    <>
      <label>
        Reassign to
        <select
          defaultValue=""
          disabled={confirmation.pending}
          onChange={(e) => {
            const staffId = e.target.value;
            e.target.value = "";
            const member = staff.find((person) => person.id === staffId);
            if (!member) return;
            confirmation.request({
              title: "Reassign Order?",
              body: `Reassign order ${publicNumber} to ${member.fullName || member.email}? The current owner loses ownership.`,
              confirmLabel: "Reassign order",
              danger: true,
              run: async () => {
                await staffJson(`/staff/orders/${orderId}/reassign`, {
                  method: "POST",
                  body: JSON.stringify({ staffId }),
                });
                onDone("Order reassigned.");
              },
            });
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
      {confirmation.dialog}
    </>
  );
}
