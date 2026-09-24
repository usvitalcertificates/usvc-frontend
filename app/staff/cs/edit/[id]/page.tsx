"use client";

import { use, useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { staffData, staffId, staffJson, staffRole } from "@/lib/staff-client";
import { useInactivitySignout, useRequireStaffAuth } from "@/lib/staff-auth-hook";
import { BackLink, PageBand, StatusPill, Toast } from "@/components/staff/ui";
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

const REQUIRED_SUBJECT: Record<string, string[]> = {
  BIRTH: ["firstName", "lastName", "eventDate"],
  DEATH: ["firstName", "lastName", "eventDate"],
  MARRIAGE: ["firstName", "lastName", "eventDate"],
  DIVORCE: ["firstName", "lastName"],
};

const REQUIRED_FAMILY: Record<string, string[]> = {
  BIRTH: ["motherFirstName", "motherCurrentLastName", "motherLastName"],
  DEATH: [],
  MARRIAGE: ["spouseFirstName", "spouseLastName"],
  DIVORCE: ["spouseFirstName", "spouseLastName"],
};

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

/** firstName → First name, dateOfBirth → Date of birth. */
function prettyLabel(key: string): string {
  const spaced = key
    .replace(/([A-Z])/g, " $1")
    .replace(/[_-]+/g, " ")
    .trim();
  return spaced.charAt(0).toUpperCase() + spaced.slice(1).toLowerCase();
}

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
  const [gtgOpen, setGtgOpen] = useState(false);

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
  const requiredSubject = REQUIRED_SUBJECT[order.certificate] ?? [];
  const requiredFamily = REQUIRED_FAMILY[order.certificate] ?? [];
  const errorCount = Object.keys(errors).length;
  const closed = order.status === "SUBMITTED" || order.status === "CANCELLED";

  const save = async () => {
    if (!form) return;
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
  const subjectKeys = Object.keys(form.subject);
  const familyKeys = Object.keys(form.family);

  return (
    <>
      <BackLink href="/staff/cs">← Back to Corrections inbox</BackLink>
      <PageBand
        eyebrow={`CS correction — ${order.publicNumber}`}
        title="Edit order form"
        subtitle={
          <span style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
            <StatusPill status={order.status} />
            <span style={{ color: "#cbd5e1", fontWeight: 600 }}>
              {order.stateCode} {order.certificate} · Owner: {order.assignedName ?? "Unassigned"}
            </span>
            <CopyButton value={order.publicNumber} label="Order number" />
            {order.rush ? (
              <span style={{ marginLeft: "auto" }}>
                <span className="staff-pill amber">RUSH</span>
              </span>
            ) : null}
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
          <strong style={{ color: "#b91c1c" }}>Fulfillment flagged: </strong>
          {flaggedNote}
        </p>
      ) : null}

      <div className="staff-grid-2">
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div className="staff-panel">
            <h2>1 · Requestor &amp; contact</h2>
            <div className="staff-panel-body" style={{ display: "grid", gap: "10px" }}>
              <Field label="Relationship" error={errors["applicant.relationship"]} required>
                <input
                  style={inputStyle}
                  value={form.applicant.relationship}
                  onChange={(e) => setApplicant("relationship", e.target.value)}
                  maxLength={120}
                  autoComplete="off"
                />
              </Field>
              {form.applicant.relationship === "Other" ? (
                <Field
                  label="Relationship detail"
                  error={errors["applicant.relationshipOther"]}
                  required
                >
                  <input
                    style={inputStyle}
                    value={form.applicant.relationshipOther}
                    onChange={(e) => setApplicant("relationshipOther", e.target.value)}
                    maxLength={120}
                    autoComplete="off"
                  />
                </Field>
              ) : null}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" }}>
                <Field label="First name" error={errors["applicant.firstName"]} required>
                  <input
                    style={inputStyle}
                    value={form.applicant.firstName}
                    onChange={(e) => setApplicant("firstName", e.target.value)}
                    maxLength={120}
                    autoComplete="off"
                  />
                </Field>
                <Field label="Middle name" error={errors["applicant.middleName"]}>
                  <input
                    style={inputStyle}
                    value={form.applicant.middleName}
                    onChange={(e) => setApplicant("middleName", e.target.value)}
                    maxLength={120}
                    autoComplete="off"
                  />
                </Field>
                <Field label="Last name" error={errors["applicant.lastName"]} required>
                  <input
                    style={inputStyle}
                    value={form.applicant.lastName}
                    onChange={(e) => setApplicant("lastName", e.target.value)}
                    maxLength={120}
                    autoComplete="off"
                  />
                </Field>
              </div>
              <Field label="Date of birth (YYYY-MM-DD)" error={errors["applicant.dateOfBirth"]}>
                <input
                  style={inputStyle}
                  value={form.applicant.dateOfBirth}
                  onChange={(e) => setApplicant("dateOfBirth", e.target.value)}
                  maxLength={20}
                  autoComplete="off"
                  placeholder="1990-01-15"
                />
              </Field>
              <Field label="Phone (E.164)" error={errors["applicant.phone"]} required>
                <input
                  style={inputStyle}
                  value={form.applicant.phone}
                  onChange={(e) => setApplicant("phone", e.target.value)}
                  maxLength={40}
                  autoComplete="off"
                  placeholder="+15551234567"
                />
              </Field>
              <Field label="Email" error={errors["applicant.email"]} required>
                <input
                  style={inputStyle}
                  type="email"
                  value={form.applicant.email}
                  onChange={(e) => setApplicant("email", e.target.value)}
                  maxLength={200}
                  autoComplete="off"
                />
              </Field>
            </div>
          </div>

          <div className="staff-panel">
            <h2>2 · Subject ({order.certificate})</h2>
            <div className="staff-panel-body" style={{ display: "grid", gap: "10px" }}>
              {subjectKeys.length === 0 ? (
                <p style={{ color: "var(--muted-text)" }}>No subject fields stored.</p>
              ) : null}
              {subjectKeys.map((key) => (
                <Field
                  key={key}
                  label={prettyLabel(key)}
                  error={errors[`subject.${key}`]}
                  required={requiredSubject.includes(key)}
                >
                  <input
                    style={inputStyle}
                    value={form.subject[key] ?? ""}
                    onChange={(e) => setRecord("subject", key, e.target.value)}
                    maxLength={500}
                    autoComplete="off"
                  />
                </Field>
              ))}
            </div>
          </div>

          <div className="staff-panel">
            <h2>3 · Family</h2>
            <div className="staff-panel-body" style={{ display: "grid", gap: "10px" }}>
              {familyKeys.length === 0 ? (
                <p style={{ color: "var(--muted-text)" }}>No family fields stored.</p>
              ) : null}
              {familyKeys.map((key) => (
                <Field
                  key={key}
                  label={prettyLabel(key)}
                  error={errors[`family.${key}`]}
                  required={requiredFamily.includes(key)}
                >
                  <input
                    style={inputStyle}
                    value={form.family[key] ?? ""}
                    onChange={(e) => setRecord("family", key, e.target.value)}
                    maxLength={500}
                    autoComplete="off"
                  />
                </Field>
              ))}
            </div>
          </div>

          {(["home", "shipping", "billing"] as const).map((kind, i) => (
            <div className="staff-panel" key={kind}>
              <h2>
                {4 + i} · {kind.charAt(0).toUpperCase() + kind.slice(1)} address
              </h2>
              <div className="staff-panel-body" style={{ display: "grid", gap: "10px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                  <Field label="First name" error={errors[`addresses.${kind}.firstName`]}>
                    <input
                      style={inputStyle}
                      value={form.addresses[kind].firstName}
                      onChange={(e) => setAddr(kind, "firstName", e.target.value)}
                      maxLength={120}
                      autoComplete="off"
                    />
                  </Field>
                  <Field label="Last name" error={errors[`addresses.${kind}.lastName`]}>
                    <input
                      style={inputStyle}
                      value={form.addresses[kind].lastName}
                      onChange={(e) => setAddr(kind, "lastName", e.target.value)}
                      maxLength={120}
                      autoComplete="off"
                    />
                  </Field>
                </div>
                <Field label="Street address" error={errors[`addresses.${kind}.line1`]}>
                  <input
                    style={inputStyle}
                    value={form.addresses[kind].line1}
                    onChange={(e) => setAddr(kind, "line1", e.target.value)}
                    maxLength={200}
                    autoComplete="off"
                  />
                </Field>
                <Field label="Apt / suite" error={errors[`addresses.${kind}.line2`]}>
                  <input
                    style={inputStyle}
                    value={form.addresses[kind].line2}
                    onChange={(e) => setAddr(kind, "line2", e.target.value)}
                    maxLength={200}
                    autoComplete="off"
                  />
                </Field>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" }}>
                  <Field label="City" error={errors[`addresses.${kind}.city`]}>
                    <input
                      style={inputStyle}
                      value={form.addresses[kind].city}
                      onChange={(e) => setAddr(kind, "city", e.target.value)}
                      maxLength={120}
                      autoComplete="off"
                    />
                  </Field>
                  <Field label="State" error={errors[`addresses.${kind}.state`]}>
                    <input
                      style={inputStyle}
                      value={form.addresses[kind].state}
                      onChange={(e) => setAddr(kind, "state", e.target.value)}
                      maxLength={120}
                      autoComplete="off"
                    />
                  </Field>
                  <Field label="ZIP" error={errors[`addresses.${kind}.postalCode`]}>
                    <input
                      style={inputStyle}
                      value={form.addresses[kind].postalCode}
                      onChange={(e) => setAddr(kind, "postalCode", e.target.value)}
                      maxLength={20}
                      autoComplete="off"
                    />
                  </Field>
                </div>
              </div>
            </div>
          ))}

          <div className="staff-panel">
            <h2>7 · County, reason &amp; delivery</h2>
            <div className="staff-panel-body" style={{ display: "grid", gap: "10px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <Field label={`County (${order.stateCode})`} error={errors["county"]} required>
                  <input
                    style={inputStyle}
                    value={form.county}
                    onChange={(e) => setTop("county", e.target.value)}
                    maxLength={120}
                    autoComplete="off"
                  />
                </Field>
                <Field label="City" error={errors["city"]}>
                  <input
                    style={inputStyle}
                    value={form.city}
                    onChange={(e) => setTop("city", e.target.value)}
                    maxLength={120}
                    autoComplete="off"
                  />
                </Field>
              </div>
              <Field label="Reason" error={errors["reason"]} required>
                <input
                  style={inputStyle}
                  value={form.reason}
                  onChange={(e) => setTop("reason", e.target.value)}
                  maxLength={200}
                  autoComplete="off"
                />
              </Field>
              {form.reason === "Other" ? (
                <Field label="Reason detail" error={errors["reasonOther"]} required>
                  <input
                    style={inputStyle}
                    value={form.reasonOther}
                    onChange={(e) => setTop("reasonOther", e.target.value)}
                    maxLength={200}
                    autoComplete="off"
                  />
                </Field>
              ) : null}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <Field label="Delivery method" error={errors["deliveryMethod"]}>
                  <input
                    style={inputStyle}
                    value={form.deliveryMethod}
                    onChange={(e) => setTop("deliveryMethod", e.target.value)}
                    maxLength={80}
                    autoComplete="off"
                  />
                </Field>
                <Field label="Destination" error={errors["destinationType"]}>
                  <select
                    style={inputStyle}
                    value={form.destinationType}
                    onChange={(e) => setTop("destinationType", e.target.value)}
                  >
                    <option value="domestic">Domestic</option>
                    <option value="international">International</option>
                  </select>
                </Field>
              </div>
            </div>
          </div>

          <div className="staff-panel" style={{ background: "#fffbeb", borderColor: "#fde68a" }}>
            <h2 style={{ color: "#78350f" }}>8 · SSN &amp; payment card</h2>
            <div className="staff-panel-body" style={{ display: "grid", gap: "12px" }}>
              <p style={{ fontSize: "0.9rem", color: "#92400e", margin: 0 }}>
                Confidential — stored values are encrypted and never shown. Leave blank to keep them
                — fill to replace. Replacements are encrypted before storage and never logged.
              </p>
              <Field label="SSN (stored: •••••, encrypted)" error={errors["requestorSsn"]}>
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
              <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: "10px" }}>
                <Field
                  label="Card number (stored: ••••, encrypted)"
                  error={errors["paymentCard.number"]}
                >
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
                      <small
                        className="application-error"
                        role="alert"
                        style={{ display: "block" }}
                      >
                        Enter all 16 digits ({digits}/16).
                      </small>
                    ) : null;
                  })()}
                </Field>
                <Field label="Expiry MM/YY" error={errors["paymentCard.expiry"]}>
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
                <Field label="CVC" error={errors["paymentCard.securityCode"]}>
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
            </div>
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
          <div className="staff-panel">
            <h3>Recent notes</h3>
            <div className="staff-panel-body">
              {(order.notes ?? []).length === 0 ? (
                <p style={{ color: "var(--muted-text)" }}>No internal notes yet.</p>
              ) : (
                <ul style={{ margin: 0, paddingLeft: "18px", display: "grid", gap: "8px" }}>
                  {[...order.notes]
                    .reverse()
                    .slice(0, 5)
                    .map((n, i) => (
                      <li key={i} style={{ fontSize: "0.9rem", whiteSpace: "pre-wrap" }}>
                        {n.body}
                      </li>
                    ))}
                </ul>
              )}
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
              alignItems: "flex-end",
              gap: "2px",
            }}
          >
            <button
              type="button"
              className="staff-btn green"
              disabled={busy}
              onClick={() => setGtgOpen(true)}
              title="Updates order status to GTG"
            >
              Mark GTG
            </button>
            <span style={{ fontSize: "0.75rem", color: "var(--muted-text)" }}>
              Updates status → GTG
            </span>
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
