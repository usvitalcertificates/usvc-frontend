"use client";

import { use, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { staffData, staffId, staffJson, staffRole } from "@/lib/staff-client";
import { useInactivitySignout, useRequireStaffAuth } from "@/lib/staff-auth-hook";
import { BackLink, PageBand, StatusPill, Toast } from "@/components/staff/ui";
import { DateInput } from "@/components/DateInput";
import { ApplicationSections } from "@/components/staff/ApplicationSections";
import { APPLICATION_LABELS, type ApplicationField } from "@/lib/form-config";
import { CopyButton } from "@/components/staff/CopyButton";

interface EditOrder {
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
  destinationType?: string;
  status: string;
  substatus?: string | null;
  assignedTo: string | null;
  assignedName: string | null;
  pricing?: { serviceCents: number; rushCents: number; totalCents: number };
  amountCents?: number;
  notes: { authorId?: string; body: string; createdAt?: string }[];
  createdAt: string;
}

interface Addr {
  firstName: string;
  lastName: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

interface EditForm {
  applicant: {
    relationship: string;
    relationshipOther: string;
    firstName: string;
    middleName: string;
    lastName: string;
    suffix: string;
    dateOfBirth: string;
    phone: string;
    email: string;
  };
  subject: Record<string, string>;
  family: Record<string, string>;
  addresses: { home: Addr; shipping: Addr; billing: Addr };
  county: string;
  city: string;
  reason: string;
  reasonOther: string;
  deliveryMethod: string;
  destinationType: string;
  ssn: string;
  cardNumber: string;
  cardExpiry: string;
  cardCvc: string;
  note: string;
}

const ADDR_KEYS: (keyof Addr)[] = [
  "firstName",
  "lastName",
  "line1",
  "line2",
  "city",
  "state",
  "postalCode",
  "country",
];

function emptyAddr(): Addr {
  return {
    firstName: "",
    lastName: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
  };
}

function addrFrom(source: Record<string, string> | undefined): Addr {
  const base = emptyAddr();
  for (const key of ADDR_KEYS) base[key] = source?.[key] ?? "";
  return base;
}

const digitsOnly = (value: string) => value.replace(/\D/g, "");

/** Live SSN mask: digits capped at 9, hyphens inserted as XXX-XX-XXXX. */
function formatSsnInput(value: string): string {
  const digits = digitsOnly(value).slice(0, 9);
  const parts = [digits.slice(0, 3), digits.slice(3, 5), digits.slice(5, 9)].filter(
    (part) => part !== "",
  );
  return parts.join("-");
}

/** Live card mask: digits capped at 16, grouped XXXX XXXX XXXX XXXX. */
function formatCardInput(value: string): string {
  return digitsOnly(value)
    .slice(0, 16)
    .replace(/(\d{4})(?=\d)/g, "$1 ");
}

/** Live expiry mask: digits capped at 4, slash inserted as MM/YY. */
function formatExpiryInput(value: string): string {
  const digits = digitsOnly(value).slice(0, 4);
  return digits.length <= 2 ? digits : `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

function cardBrandOf(value: string): "visa" | "mastercard" | null {
  const digits = digitsOnly(value);
  if (!digits) return null;
  if (digits[0] === "4") return "visa";
  if (digits[0] === "5") return "mastercard";
  return null;
}

function isPlausibleExpiryMonth(value: string): boolean {
  const digits = digitsOnly(value);
  if (digits.length < 2) return true;
  const month = Number(digits.slice(0, 2));
  return month >= 1 && month <= 12;
}

function formFromOrder(order: EditOrder): EditForm {
  const get = (obj: Record<string, string> | undefined, key: string) => obj?.[key] ?? "";
  return {
    applicant: {
      relationship: get(order.applicant, "relationship"),
      relationshipOther: get(order.applicant, "relationshipOther"),
      firstName: get(order.applicant, "firstName"),
      middleName: get(order.applicant, "middleName"),
      lastName: get(order.applicant, "lastName"),
      suffix: get(order.applicant, "suffix"),
      dateOfBirth: get(order.applicant, "dateOfBirth"),
      phone: get(order.applicant, "phone"),
      email: get(order.applicant, "email"),
    },
    subject: { ...(order.subject ?? {}) },
    family: { ...(order.family ?? {}) },
    addresses: {
      home: addrFrom(order.addresses?.home),
      shipping: addrFrom(order.addresses?.shipping),
      billing: addrFrom(order.addresses?.billing),
    },
    county: order.geo?.county ?? "",
    city: order.geo?.city ?? "",
    reason: order.reason ?? "",
    reasonOther: order.reasonOther ?? "",
    deliveryMethod: order.deliveryMethod ?? "regular",
    destinationType: order.destinationType === "international" ? "international" : "domestic",
    ssn: "",
    cardNumber: "",
    cardExpiry: "",
    cardCvc: "",
    note: "",
  };
}

function Field({
  label,
  error,
  required,
  children,
}: {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label style={{ display: "block" }}>
      <span style={{ fontWeight: 600, display: "block", marginBottom: "6px" }}>
        {label}
        {required ? <span style={{ color: "#b91c1c" }}> *</span> : null}
      </span>
      {children}
      {error ? (
        <small className="application-error" role="alert" style={{ display: "block" }}>
          {error}
        </small>
      ) : null}
    </label>
  );
}

const inputStyle: React.CSSProperties = { width: "100%" };

export default function CsEditOrder({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  useRequireStaffAuth();
  useInactivitySignout();
  const [allowed, setAllowed] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [myId, setMyId] = useState<string | null>(null);
  const [order, setOrder] = useState<EditOrder | null>(null);
  const [form, setForm] = useState<EditForm | null>(null);
  const [initial, setInitial] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [busy, setBusy] = useState(false);
  const applicationRef = useRef<HTMLDivElement>(null);
  const [gtgOpen, setGtgOpen] = useState(false);
  const [revealedSsn, setRevealedSsn] = useState<string | null>(null);
  const [revealedCard, setRevealedCard] = useState<{
    number: string;
    expiry: string;
    securityCode: string;
  } | null>(null);
  const [revealFor, setRevealFor] = useState<"ssn" | "card" | null>(null);
  const [revealReason, setRevealReason] = useState("CS correction compare");
  const [revealBusy, setRevealBusy] = useState(false);
  const [revealError, setRevealError] = useState("");

  // Revealed secrets auto-hide after 30s and are never logged or stored.
  useEffect(() => {
    if (!revealedSsn && !revealedCard) return;
    const timer = window.setTimeout(() => {
      setRevealedSsn(null);
      setRevealedCard(null);
    }, 30000);
    return () => window.clearTimeout(timer);
  }, [revealedSsn, revealedCard]);

  const doReveal = async (field: "ssn" | "card") => {
    const reason = revealReason.trim() || "CS correction compare";
    setRevealBusy(true);
    setRevealError("");
    try {
      const data = await staffJson<{
        field: string;
        ssn?: string;
        card?: { number: string; expiry: string; securityCode: string };
      }>(`/orders/${id}/reveal`, { method: "POST", body: JSON.stringify({ field, reason }) });
      if (field === "ssn") setRevealedSsn(data.ssn ?? "");
      else setRevealedCard(data.card ?? null);
      setRevealFor(null);
    } catch (e) {
      setRevealError(e instanceof Error ? e.message : "Could not reveal value");
    } finally {
      setRevealBusy(false);
    }
  };

  const load = useCallback(async () => {
    setError("");
    try {
      const detail = await staffJson<EditOrder>(`/staff/orders/${id}`);
      setOrder(detail);
      const next = formFromOrder(detail);
      setForm(next);
      setInitial(
        JSON.stringify({ ...next, ssn: "", cardNumber: "", cardExpiry: "", cardCvc: "", note: "" }),
      );
      setErrors({});
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load this order");
    }
  }, [id]);

  useEffect(() => {
    const role = staffRole();
    const ok = role === "ADMIN" || role === "CS";
    setAllowed(ok);
    setIsAdmin(role === "ADMIN");
    setMyId(staffId());
    if (ok) void load();
  }, [load]);

  const dirty = useMemo(() => {
    if (!form) return false;
    // `initial` was snapshotted with ssn/card/note blanked, so any filled
    // secret/note or changed field flips dirty.
    return JSON.stringify(form) !== initial;
  }, [form, initial]);

  if (!allowed) {
    return (
      <>
        <BackLink href="/staff/cs">← Back to Corrections inbox</BackLink>
        <p role="alert" className="staff-alert error">
          Order editing is restricted to CS and ADMIN roles.
        </p>
      </>
    );
  }
  if (error && !order) {
    return (
      <>
        <BackLink href="/staff/cs">← Back to Corrections inbox</BackLink>
        <p role="alert" className="staff-alert error">
          {error}
        </p>
      </>
    );
  }
  if (!order || !form) {
    return (
      <div className="staff-panel">
        <div className="staff-panel-body">Loading the order form…</div>
      </div>
    );
  }

  const mine = !!order.assignedTo && order.assignedTo === myId;
  const canEdit = isAdmin || mine;

  const claimHere = async () => {
    setBusy(true);
    setError("");
    try {
      await staffJson(`/staff/orders/${id}/claim`, { method: "POST", body: "{}" });
      setToast("You took ownership — correct the form below.");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not take ownership");
    } finally {
      setBusy(false);
    }
  };

  if (!canEdit) {
    return (
      <>
        <BackLink href="/staff/cs">← Back to Corrections inbox</BackLink>
        <PageBand
          eyebrow={`CS correction — ${order.publicNumber}`}
          title="Edit order form"
          subtitle={<StatusPill status={order.status} />}
        />
        {toast ? <Toast message={toast} onDone={() => setToast("")} /> : null}
        {error ? (
          <p role="alert" className="staff-alert error">
            {error}
          </p>
        ) : null}
        <div className="staff-panel">
          <div className="staff-panel-body">
            {order.assignedTo ? (
              <p style={{ marginBottom: 0 }}>
                Claimed by <strong>{order.assignedName ?? "another agent"}</strong> — editing is
                limited to the owner. Ask an ADMIN to reassign it if you need to take over.
              </p>
            ) : (
              <>
                <p>Take ownership of this order to correct its form.</p>
                <button
                  type="button"
                  className="staff-btn"
                  disabled={busy}
                  onClick={() => void claimHere()}
                >
                  {busy ? "Please wait…" : "Take Ownership"}
                </button>
              </>
            )}
          </div>
        </div>
      </>
    );
  }

  const setTop = <K extends keyof EditForm>(key: K, value: EditForm[K]) => {
    setForm((f) => (f ? { ...f, [key]: value } : f));
    setErrors((prev) => {
      if (!(key in prev)) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };
  const setApplicant = (key: keyof EditForm["applicant"], value: string) => {
    setForm((f) => (f ? { ...f, applicant: { ...f.applicant, [key]: value } } : f));
    const errKey = `applicant.${key}`;
    setErrors((prev) => {
      if (!prev[errKey]) return prev;
      const next = { ...prev };
      delete next[errKey];
      return next;
    });
  };
  const setRecord = (group: "subject" | "family", key: string, value: string) => {
    setForm((f) => (f ? { ...f, [group]: { ...f[group], [key]: value } } : f));
    const errKey = `${group}.${key}`;
    setErrors((prev) => {
      if (!prev[errKey]) return prev;
      const next = { ...prev };
      delete next[errKey];
      return next;
    });
  };
  const setAddr = (kind: keyof EditForm["addresses"], key: keyof Addr, value: string) => {
    setForm((f) =>
      f
        ? { ...f, addresses: { ...f.addresses, [kind]: { ...f.addresses[kind], [key]: value } } }
        : f,
    );
    const errKey = `addresses.${kind}.${key}`;
    setErrors((prev) => {
      if (!prev[errKey]) return prev;
      const next = { ...prev };
      delete next[errKey];
      return next;
    });
  };

  const flaggedNote = order.status === "TO_CS" ? (order.notes ?? []).at(-1)?.body : null;
  const notesNewest = [...(order.notes ?? [])].reverse();
  const latestNote = notesNewest[0] ?? null;
  const previousNotes = notesNewest.slice(1, 5);
  const errorCount = Object.keys(errors).length;
  const closed = order.status === "SUBMITTED" || order.status === "CANCELLED";

  const save = async () => {
    if (!form) return;
    const invalidDate = applicationRef.current?.querySelector<HTMLInputElement>(
      ".usvc-date > input:invalid",
    );
    if (invalidDate) {
      invalidDate.reportValidity();
      invalidDate.focus();
      return;
    }
    if (
      (form.cardNumber.trim() || form.cardExpiry.trim() || form.cardCvc.trim()) &&
      (!form.cardNumber.trim() || !form.cardExpiry.trim() || !form.cardCvc.trim())
    ) {
      setErrors((prev) => ({
        ...prev,
        "paymentCard.number":
          "Enter all three card fields, or leave all three blank to keep the stored card.",
      }));
      setError("Card replacement needs number, expiry, and CVC together.");
      return;
    }
    setBusy(true);
    setError("");
    setErrors({});
    try {
      const body: Record<string, unknown> = {
        applicant: { ...form.applicant },
        subject: { ...form.subject },
        family: { ...form.family },
        addresses: {
          home: { ...form.addresses.home },
          shipping: { ...form.addresses.shipping },
          billing: { ...form.addresses.billing },
        },
        geo: { county: form.county, city: form.city },
        reason: form.reason,
        reasonOther: form.reasonOther,
        deliveryMethod: form.deliveryMethod,
        destinationType: form.destinationType,
      };
      if (form.ssn.trim()) body.requestorSsn = form.ssn.trim();
      if (form.cardNumber.trim())
        body.paymentCard = {
          number: form.cardNumber.trim(),
          expiry: form.cardExpiry.trim(),
          securityCode: form.cardCvc.trim(),
        };
      if (form.note.trim()) body.note = form.note.trim();
      const { response, data } = await staffData<{
        message?: string;
        errors?: Record<string, string>;
      }>(`/staff/orders/${id}/correction`, { method: "PATCH", body: JSON.stringify(body) });
      if (!response.ok) {
        if (data.errors && typeof data.errors === "object") setErrors(data.errors);
        throw new Error(data.message || "Could not save corrections");
      }
      setToast("Corrections saved.");
      setRevealedSsn(null);
      setRevealedCard(null);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not save corrections");
    } finally {
      setBusy(false);
    }
  };

  const markGtg = async () => {
    setBusy(true);
    setError("");
    try {
      const { response, data } = await staffData<{ message?: string }>(`/orders/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({
          status: "GTG",
          ...(form.note.trim() ? { note: form.note.trim() } : {}),
        }),
      });
      if (!response.ok) throw new Error(data.message || "Could not mark GTG");
      setToast("Marked GTG — fulfillment can continue.");
      router.replace("/staff/cs");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not mark GTG");
    } finally {
      setBusy(false);
    }
  };

  const saveNote = async () => {
    if (!form.note.trim()) return;
    setBusy(true);
    setError("");
    try {
      const { response, data } = await staffData<{ message?: string }>(
        `/staff/orders/${id}/notes`,
        { method: "POST", body: JSON.stringify({ body: form.note.trim() }) },
      );
      if (!response.ok) throw new Error(data.message || "Could not save note");
      setTop("note", "");
      setToast("Note added.");
      // Refresh order context (flagged note, rail) without touching form edits.
      const detail = await staffJson<EditOrder>(`/staff/orders/${id}`);
      setOrder(detail);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not save note");
    } finally {
      setBusy(false);
    }
  };

  const money = (cents: number) => `$${(cents / 100).toFixed(2)}`;

  const applicationData = {
    ...order,
    applicant: form.applicant,
    subject: form.subject,
    family: form.family,
    addresses: Object.fromEntries(
      Object.entries(form.addresses).map(([kind, addr]) => [
        kind,
        { ...order.addresses?.[kind], ...addr },
      ]),
    ),
    geo: { county: form.county, city: form.city },
    reason: form.reason,
    reasonOther: form.reasonOther,
    deliveryMethod: form.deliveryMethod,
    destinationType: form.destinationType,
  };
  const renderApplicationField = (field: ApplicationField) => {
    const update = (value: string) => {
      const [group, key, addressKey] = field.path.split(".");
      if (group === "applicant") setApplicant(key as keyof EditForm["applicant"], value);
      else if (group === "subject" || group === "family") setRecord(group, key, value);
      else if (group === "addresses" && addressKey === "addressType") {
        const destination = value.startsWith("International") ? "international" : "domestic";
        setTop("destinationType", destination);
        if (destination === "domestic") setAddr("shipping", "country", "United States");
        else if (form.addresses.shipping.country === "United States")
          setAddr("shipping", "country", "");
      } else if (group === "addresses")
        setAddr(key as keyof EditForm["addresses"], addressKey as keyof Addr, value);
      else if (group === "geo") setTop(key as "county" | "city", value);
      else setTop(group as "reason" | "reasonOther" | "deliveryMethod", value);
    };
    const errorKey = field.path.startsWith("geo.") ? field.path.slice(4) : field.path;
    const options = field.options ?? [];
    return (
      <Field label={field.label} required={field.required} error={errors[errorKey]}>
        {field.locked ? (
          <p>{field.value || "—"}</p>
        ) : field.type === "select" ? (
          <select
            style={inputStyle}
            value={field.value}
            onChange={(event) => update(event.target.value)}
          >
            <option value="">Please select…</option>
            {field.value && !options.includes(field.value) ? (
              <option value={field.value}>{field.value}</option>
            ) : null}
            {options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        ) : field.type === "date" ? (
          <DateInput
            style={inputStyle}
            value={field.value}
            onValueChange={update}
            aria-label={field.label}
          />
        ) : (
          <input
            style={inputStyle}
            type={field.path === "applicant.email" ? "email" : "text"}
            value={field.value}
            onChange={(event) => update(event.target.value)}
            maxLength={500}
            autoComplete="off"
          />
        )}
      </Field>
    );
  };
  const renderSensitive = (field: "ssn" | "card") => (
    <div className="staff-sensitive-correction">
      <p>
        Stored values are encrypted. Leave replacement fields blank to keep them. Reveals are logged
        and auto-hide in 30 seconds.
      </p>
      <div className="staff-sensitive-actions">
        {field === "ssn" ? (
          <>
            {revealedSsn ? (
              <>
                <code style={{ fontSize: "0.95rem", fontWeight: 700 }}>{revealedSsn}</code>
                <button
                  type="button"
                  className="staff-btn secondary"
                  style={{ minWidth: "150px", height: "36px" }}
                  onClick={() => setRevealedSsn(null)}
                >
                  <EyeOff aria-hidden style={{ width: 15, height: 15 }} /> Hide SSN
                </button>
              </>
            ) : revealFor === "ssn" ? (
              <>
                <input
                  style={{ ...inputStyle, background: "#fff", maxWidth: "280px" }}
                  value={revealReason}
                  onChange={(e) => setRevealReason(e.target.value)}
                  maxLength={500}
                  autoComplete="off"
                  placeholder="Reason (required, logged)"
                  aria-label="Reason for revealing SSN"
                />
                <button
                  type="button"
                  className="staff-btn secondary"
                  disabled={revealBusy}
                  onClick={() => void doReveal("ssn")}
                >
                  {revealBusy ? "Revealing…" : "Confirm reveal"}
                </button>
                <button
                  type="button"
                  className="staff-btn secondary"
                  onClick={() => setRevealFor(null)}
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                type="button"
                className="staff-btn secondary"
                onClick={() => {
                  setRevealError("");
                  setRevealFor("ssn");
                }}
              >
                <Eye aria-hidden style={{ width: 15, height: 15 }} /> Reveal stored SSN
              </button>
            )}
          </>
        ) : (
          <>
            {revealedCard ? (
              <>
                <code style={{ fontSize: "0.95rem", fontWeight: 700 }}>
                  {revealedCard.number} · {revealedCard.expiry} · {revealedCard.securityCode}
                </code>
                <button
                  type="button"
                  className="staff-btn secondary"
                  style={{ minWidth: "150px", height: "36px" }}
                  onClick={() => setRevealedCard(null)}
                >
                  <EyeOff aria-hidden style={{ width: 15, height: 15 }} /> Hide card
                </button>
              </>
            ) : revealFor === "card" ? (
              <>
                <input
                  style={{ ...inputStyle, background: "#fff", maxWidth: "280px" }}
                  value={revealReason}
                  onChange={(e) => setRevealReason(e.target.value)}
                  maxLength={500}
                  autoComplete="off"
                  placeholder="Reason (required, logged)"
                  aria-label="Reason for revealing card"
                />
                <button
                  type="button"
                  className="staff-btn secondary"
                  disabled={revealBusy}
                  onClick={() => void doReveal("card")}
                >
                  {revealBusy ? "Revealing…" : "Confirm reveal"}
                </button>
                <button
                  type="button"
                  className="staff-btn secondary"
                  onClick={() => setRevealFor(null)}
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                type="button"
                className="staff-btn secondary"
                onClick={() => {
                  setRevealError("");
                  setRevealFor("card");
                }}
              >
                <Eye aria-hidden style={{ width: 15, height: 15 }} /> Reveal stored card
              </button>
            )}
          </>
        )}
      </div>
      {revealError ? (
        <p role="alert" className="staff-alert error">
          {revealError}
        </p>
      ) : null}
      {field === "ssn" ? (
        <>
          <Field label={APPLICATION_LABELS.ssn} error={errors["requestorSsn"]}>
            <input
              style={{ ...inputStyle, background: "#fff" }}
              value={form.ssn}
              onChange={(e) => setTop("ssn", formatSsnInput(e.target.value))}
              maxLength={11}
              inputMode="numeric"
              autoComplete="off"
              placeholder="XXX-XX-XXXX"
            />
            {(() => {
              const digits = digitsOnly(form.ssn).length;
              return digits > 0 && digits < 9 ? (
                <small className="application-error" role="alert" style={{ display: "block" }}>
                  Enter all 9 digits ({digits}/9).
                </small>
              ) : null;
            })()}
          </Field>
        </>
      ) : (
        <>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
              gap: "10px",
            }}
          >
            <Field label={APPLICATION_LABELS.cardNumber} error={errors["paymentCard.number"]}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <input
                  style={{ ...inputStyle, background: "#fff" }}
                  value={form.cardNumber}
                  onChange={(e) => setTop("cardNumber", formatCardInput(e.target.value))}
                  maxLength={19}
                  inputMode="numeric"
                  autoComplete="off"
                  placeholder="4111 1111 1111 1111"
                />
                {(() => {
                  const brand = cardBrandOf(form.cardNumber);
                  return brand ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={brand === "visa" ? "/assets/visa.svg" : "/assets/mastercard.svg"}
                      alt={brand === "visa" ? "Visa" : "Mastercard"}
                      width={36}
                      height={22}
                      style={{ flexShrink: 0 }}
                    />
                  ) : null;
                })()}
              </div>
              {(() => {
                const digits = digitsOnly(form.cardNumber).length;
                return digits > 0 && digits < 16 ? (
                  <small className="application-error" role="alert" style={{ display: "block" }}>
                    Enter all 16 digits ({digits}/16).
                  </small>
                ) : null;
              })()}
            </Field>
            <Field label={APPLICATION_LABELS.cardExpiry} error={errors["paymentCard.expiry"]}>
              <input
                style={{ ...inputStyle, background: "#fff" }}
                value={form.cardExpiry}
                onChange={(e) => setTop("cardExpiry", formatExpiryInput(e.target.value))}
                maxLength={5}
                inputMode="numeric"
                autoComplete="off"
                placeholder="MM/YY"
              />
              {!isPlausibleExpiryMonth(form.cardExpiry) ? (
                <small className="application-error" role="alert" style={{ display: "block" }}>
                  Use MM/YY with a month from 01 to 12.
                </small>
              ) : null}
            </Field>
            <Field label={APPLICATION_LABELS.cardCvc} error={errors["paymentCard.securityCode"]}>
              <input
                style={{ ...inputStyle, background: "#fff" }}
                value={form.cardCvc}
                onChange={(e) => setTop("cardCvc", digitsOnly(e.target.value).slice(0, 3))}
                maxLength={3}
                inputMode="numeric"
                autoComplete="off"
                placeholder="•••"
              />
            </Field>
          </div>
        </>
      )}
    </div>
  );

  return (
    <>
      <BackLink href="/staff/cs">← Back to Corrections inbox</BackLink>
      <PageBand
        eyebrow="CS correction"
        title="Edit order form"
        subtitle={
          <span className="staff-csedit-head">
            <span className="staff-csedit-order">
              <span className="staff-csedit-orderlabel">Order #</span>
              <strong>{order.publicNumber}</strong>
              <CopyButton value={order.publicNumber} label="Order number" />
            </span>
            <span className="staff-csedit-badges">
              <StatusPill status={order.status} />
              {order.rush ? <span className="staff-pill amber">RUSH</span> : null}
            </span>
            <span className="staff-csedit-meta">
              {order.stateCode} {order.certificate}
            </span>
            <span className="staff-csedit-owner">Owner: {order.assignedName ?? "Unassigned"}</span>
          </span>
        }
      />
      {toast ? <Toast message={toast} onDone={() => setToast("")} /> : null}
      {error ? (
        <p role="alert" className="staff-alert error">
          {error}
          {errorCount > 0
            ? ` (${errorCount} field${errorCount === 1 ? "" : "s"} highlighted below)`
            : ""}
        </p>
      ) : null}
      {flaggedNote ? (
        <p
          role="note"
          style={{
            background: "#fef2f2",
            border: "1px solid #fecaca",
            borderRadius: "8px",
            padding: "10px 12px",
            fontSize: "0.9rem",
          }}
        >
          <strong style={{ color: "#b91c1c" }}>Fulfillment flagged Notes: </strong>
          {flaggedNote}
          {order.substatus ? (
            <span style={{ display: "block", marginTop: "6px" }}>
              <strong style={{ color: "#b91c1c" }}>Substatus: </strong>
              {order.substatus}
            </span>
          ) : null}
        </p>
      ) : null}

      <div className="staff-grid-2">
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div ref={applicationRef}>
            <ApplicationSections
              data={applicationData}
              renderField={renderApplicationField}
              renderSensitive={renderSensitive}
            />
          </div>
          <div className="staff-panel" style={{ background: "#eef2ff", borderColor: "#c7d2fe" }}>
            <h2 style={{ color: "#312e81" }}>GTG Submit Notes (Optional)</h2>
            <div className="staff-panel-body" style={{ display: "grid", gap: "10px" }}>
              <Field label="Note" error={errors["note"]}>
                <textarea
                  style={{
                    ...inputStyle,
                    minHeight: "72px",
                    resize: "vertical",
                    background: "#fff",
                  }}
                  rows={3}
                  value={form.note}
                  onChange={(e) => setTop("note", e.target.value)}
                  maxLength={2000}
                  autoComplete="off"
                  placeholder="What was checked or fixed?…"
                />
              </Field>
              <div>
                <button
                  type="button"
                  className="staff-btn secondary"
                  disabled={busy || closed || !form.note.trim()}
                  onClick={() => void saveNote()}
                >
                  {busy ? "Saving…" : "Save Note"}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="staff-rail">
          <div className="staff-panel">
            <h3>Locked recap</h3>
            <div className="staff-panel-body">
              <dl className="staff-deflist">
                <div>
                  <dt>Certificate</dt>
                  <dd>
                    {order.stateCode} {order.certificate}
                  </dd>
                </div>
                <div>
                  <dt>Copies</dt>
                  <dd>{order.copies}</dd>
                </div>
                <div>
                  <dt>Rush</dt>
                  <dd>{order.rush ? "Yes" : "No"}</dd>
                </div>
                {order.pricing && order.amountCents !== undefined ? (
                  <div>
                    <dt>Total paid</dt>
                    <dd>{money(order.amountCents)}</dd>
                  </div>
                ) : null}
              </dl>
              <p style={{ fontSize: "0.85rem", color: "var(--muted-text)", marginBottom: 0 }}>
                Certificate, state, copies, rush, and payment can&apos;t change here — payment was
                already taken.
              </p>
            </div>
          </div>
          <div className="staff-panel">
            <h3>Finish checklist</h3>
            <div className="staff-panel-body">
              <ol style={{ margin: 0, paddingLeft: "20px", display: "grid", gap: "6px" }}>
                <li>Read the flagged note above.</li>
                <li>Fix every wrong field below.</li>
                <li>Save corrections.</li>
                <li>Mark GTG so fulfillment can continue.</li>
              </ol>
            </div>
          </div>
          <div className="staff-panel" style={{ background: "#fffbeb", borderColor: "#fde68a" }}>
            <h3 style={{ color: "#78350f" }}>Recent notes</h3>
            <div className="staff-panel-body">
              {order.status === "TO_CS" && order.substatus ? (
                <p
                  style={{
                    margin: "0 0 4px",
                    fontSize: "0.9rem",
                    background: "#fef2f2",
                    border: "1px solid #fecaca",
                    borderRadius: "8px",
                    padding: "8px 12px",
                  }}
                >
                  <strong style={{ color: "#b91c1c" }}>Substatus: </strong>
                  {order.substatus}
                </p>
              ) : null}
              {latestNote ? (
                <>
                  <h4 style={{ color: "#78350f", fontSize: "0.85rem", margin: "12px 0 6px" }}>
                    Fulfillment flagged Notes:
                  </h4>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "0.9rem",
                      whiteSpace: "pre-wrap",
                      background: "#fff",
                      border: "1px solid #fde68a",
                      borderRadius: "8px",
                      padding: "8px 12px",
                    }}
                  >
                    {latestNote.body}
                  </p>
                </>
              ) : (
                <p style={{ color: "var(--muted-text)" }}>No internal notes yet.</p>
              )}
              {previousNotes.length > 0 ? (
                <>
                  <h4 style={{ color: "#78350f", fontSize: "0.85rem", margin: "12px 0 6px" }}>
                    Previous notes
                  </h4>
                  <ul style={{ margin: 0, paddingLeft: "18px", display: "grid", gap: "8px" }}>
                    {previousNotes.map((n, i) => (
                      <li key={i} style={{ fontSize: "0.9rem", whiteSpace: "pre-wrap" }}>
                        {n.body}
                      </li>
                    ))}
                  </ul>
                </>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          position: "sticky",
          bottom: "12px",
          background: "#fff",
          border: "1px solid var(--border)",
          borderRadius: "12px",
          boxShadow: "0 4px 16px rgba(15, 23, 42, 0.08)",
          padding: "12px 16px",
          marginTop: "16px",
          display: "flex",
          gap: "12px",
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <button
          type="button"
          className="staff-btn"
          style={{ minWidth: "220px", height: "48px", fontSize: "1rem" }}
          disabled={busy || !dirty || closed}
          onClick={() => void save()}
        >
          {busy ? "Saving…" : "Save corrections"}
        </button>
        {!dirty && !busy ? (
          <span style={{ fontSize: "0.9rem", color: "var(--muted-text)" }}>
            No unsaved changes.
          </span>
        ) : null}
        {closed ? (
          <span style={{ fontSize: "0.9rem", color: "var(--muted-text)" }}>
            Closed orders are read-only.
          </span>
        ) : null}
        {order.status === "TO_CS" ? (
          <span
            style={{
              marginLeft: "auto",
              display: "inline-flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <span style={{ fontSize: "0.78rem", color: "var(--muted-text)", textAlign: "center" }}>
              Updates status → GTG
            </span>
            <button
              type="button"
              className="staff-btn green"
              style={{ minWidth: "200px", height: "38px" }}
              disabled={busy}
              onClick={() => setGtgOpen(true)}
              title="Updates order status to GTG"
            >
              Mark GTG
            </button>
          </span>
        ) : null}
      </div>

      {gtgOpen ? (
        <div className="staff-modal-backdrop" onClick={() => setGtgOpen(false)}>
          <div
            className="staff-modal"
            role="dialog"
            aria-label="Confirm Mark GTG"
            onClick={(e) => e.stopPropagation()}
          >
            <h2>Mark GTG?</h2>
            <p style={{ color: "var(--muted-text)" }}>
              This will change order status to GTG and fulfillment will continue and also your
              ownership will be dropped.
            </p>
            <div style={{ display: "flex", gap: "10px", marginTop: "14px" }}>
              <button
                type="button"
                className="staff-btn green"
                style={{ minWidth: "170px", height: "38px" }}
                disabled={busy}
                onClick={() => {
                  setGtgOpen(false);
                  void markGtg();
                }}
              >
                {busy ? "Please wait…" : "Mark GTG"}
              </button>
              <button
                type="button"
                className="staff-btn secondary"
                style={{ minWidth: "170px", height: "38px" }}
                onClick={() => setGtgOpen(false)}
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
