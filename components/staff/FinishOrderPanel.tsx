"use client";

import { CheckCircle2, Circle, Send } from "lucide-react";
import { formatDateTimeUS } from "@/lib/date-format";

export function FinishOrderPanel({
  status,
  isAdmin,
  hasDocument,
  noteCount,
  submittedAt,
  busy,
  onSubmit,
}: {
  status: string;
  isAdmin: boolean;
  hasDocument: boolean;
  noteCount: number;
  submittedAt: string | null;
  busy: boolean;
  onSubmit: () => void;
}) {
  if (status === "SUBMITTED") {
    return (
      <section className="staff-panel staff-finish-panel is-closed" role="status">
        <div className="staff-finish-body">
          <span className="staff-finish-icon" aria-hidden>
            <CheckCircle2 />
          </span>
          <div className="staff-finish-copy">
            <h2>Order closed</h2>
            <p>
              Sent to the Government Agency
              {submittedAt ? ` on ${formatDateTimeUS(submittedAt)}` : ""}. This order is now
              read-only.
            </p>
          </div>
        </div>
      </section>
    );
  }

  const statusBlocked = status !== "IN_REVIEW";
  const missingPackage = !isAdmin && (!hasDocument || noteCount === 0);
  let hint = "";
  if (status === "PAID") hint = "Start Order Processing on the Summary tab first.";
  else if (status === "TO_CS") hint = "Submission is blocked while CS reviews this order.";
  else if (status === "GTG") hint = "Resume Order Processing on the Application tab first.";
  else if (isAdmin && (!hasDocument || noteCount === 0))
    hint = "Admin override — you can submit without the completion package.";
  else if (!hasDocument && noteCount === 0)
    hint = "Upload the completion PDF and add at least one internal note above.";
  else if (!hasDocument) hint = "Upload the completion PDF above.";
  else if (noteCount === 0) hint = "Add at least one internal note above.";

  return (
    <section className="staff-panel staff-finish-panel" aria-labelledby="finish-order-title">
      <div className="staff-finish-body">
        <span className="staff-finish-icon" aria-hidden>
          <Send />
        </span>
        <div className="staff-finish-copy">
          <p className="staff-finish-eyebrow">Final step</p>
          <h2 id="finish-order-title">Finish and close this order</h2>
          <p>
            Submitting records the order as sent to the government agency, updates customer tracking
            and may notify the customer.
          </p>
        </div>
        <div className="staff-finish-side">
          <ul className="staff-finish-checks" aria-label="Submission requirements">
            <li className={hasDocument ? "is-done" : ""}>
              {hasDocument ? <CheckCircle2 aria-hidden /> : <Circle aria-hidden />}
              Completion PDF attached
            </li>
            <li className={noteCount > 0 ? "is-done" : ""}>
              {noteCount > 0 ? <CheckCircle2 aria-hidden /> : <Circle aria-hidden />}
              Internal note added
            </li>
          </ul>
          {hint ? (
            <p className="staff-finish-hint" role="status">
              {hint}
            </p>
          ) : null}
          <button
            type="button"
            className="staff-btn"
            disabled={busy || statusBlocked || missingPackage}
            onClick={onSubmit}
          >
            <Send aria-hidden />
            Submit to Government Agency
          </button>
        </div>
      </div>
    </section>
  );
}
