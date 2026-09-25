"use client";

import { STATUS_LABELS } from "@/components/staff/ui";

export interface ActivityEntryLike {
  action?: string;
  metadata?: Record<string, unknown>;
  detail?: Record<string, unknown>;
  createdAt?: string;
  at?: string;
  actorEmail?: string;
  orderNumber?: string;
}

const ORDER_LABELS: Record<string, string> = {
  order_created: "Order created",
  payment_confirmed: "Payment confirmed",
  order_claimed: "Order claimed",
  order_released: "Ownership released",
  order_reassigned: "Order reassigned",
  form_corrected: "Application form corrected",
  fulfillment_status_updated: "Status updated",
  internal_note_added: "Internal note added",
  sensitive_reveal: "Sensitive data revealed",
  confirmation_email_sent: "Confirmation email sent",
  confirmation_email_failed: "Confirmation email failed",
  submission_email_sent: "Submission email sent",
  submission_email_failed: "Submission email failed",
};

const STAFF_LABELS: Record<string, string> = {
  staff_invited: "Staff invited",
  invitation_accepted: "Invitation accepted",
  invitation_emailed: "Invitation emailed",
  "invitation_re-sent": "Invitation re-sent",
  login_success: "Signed in",
  login_failure: "Failed sign-in attempt",
  mfa_enrolled: "Authenticator paired",
  mfa_reset: "Authenticator reset",
  mfa_failure: "Verification failed",
  sessions_revoked: "Sessions revoked",
};

/** Human sentence for any audit/activity action. Never exposes raw codes. */
export function humanizeActivity(entry: ActivityEntryLike): string {
  const action = entry.action ?? "Activity";
  if (action === "staff_updated") {
    const detail = entry.detail ?? entry.metadata;
    if (detail?.accountStatus === "disabled") return "Staff deactivated";
    if (detail?.accountStatus === "active") return "Staff reactivated";
    return "Staff updated";
  }
  const base = ORDER_LABELS[action] ?? STAFF_LABELS[action] ?? action;
  const meta = (entry.metadata ?? entry.detail ?? {}) as {
    status?: string;
    field?: string;
    substatus?: string;
  };
  if (meta.status) {
    const label = `${base} → ${STATUS_LABELS[meta.status] ?? meta.status}`;
    return typeof meta.substatus === "string" && meta.substatus
      ? `${label} · ${meta.substatus}`
      : label;
  }
  if (meta.field) return `${base} (${meta.field === "ssn" ? "SSN" : "card"})`;
  return base;
}

/** Timeline dot category for any audit/activity action. */
export function activityCategory(action?: string): string {
  if (action === "sensitive_reveal") return "reveal";
  if (
    action === "sessions_revoked" ||
    action === "mfa_reset" ||
    action === "login_failure" ||
    action === "mfa_failure"
  )
    return "security";
  if (action === "fulfillment_status_updated") return "status";
  if (action === "internal_note_added") return "note";
  if (action === "order_claimed" || action === "order_reassigned" || action === "order_released")
    return "claim";
  if (action && (action in STAFF_LABELS || action === "staff_updated")) return "access";
  return "other";
}

/** "2h ago" with full timestamp available via title attribute. */
export function relTime(value?: string): string {
  if (!value) return "";
  const diff = Date.now() - new Date(value).getTime();
  if (diff < 0) return "just now";
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(value).toLocaleDateString("en-US");
}

export function fullTime(value?: string): string {
  return value ? new Date(value).toLocaleString("en-US") : "";
}

export function dayKey(value: string | Date): string {
  const date = value instanceof Date ? value : new Date(value);
  return date.toLocaleDateString("en-US", { year: "numeric", month: "2-digit", day: "2-digit" });
}
