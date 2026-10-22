"use client";

import { CheckCircle2, Flag, Play } from "lucide-react";
import { formatDateTimeUS } from "@/lib/date-format";
import { StatusPill, TO_CS_SUBSTATUSES } from "./ui";

export function CsReviewSection({
  status,
  isCs,
  canCorrect,
  busy,
  note,
  substatus,
  savedSubstatus,
  latestNote,
  sentAt,
  csEditorHref,
  onNoteChange,
  onSubstatusChange,
  onSendToCs,
  onMarkGtg,
  onResume,
}: {
  status: string;
  isCs: boolean;
  canCorrect: boolean;
  busy: boolean;
  note: string;
  substatus: string;
  savedSubstatus: string;
  latestNote: string | null;
  sentAt: string | null;
  csEditorHref: string;
  onNoteChange: (value: string) => void;
  onSubstatusChange: (value: string) => void;
  onSendToCs: () => void;
  onMarkGtg: () => void;
  onResume: () => void;
}) {
  if (status === "IN_REVIEW") {
    if (isCs) return null;
    return (
      <section className="staff-panel staff-cs-panel" aria-labelledby="cs-review-title">
        <div className="staff-cs-head">
          <span className="staff-cs-icon" aria-hidden>
            <Flag />
          </span>
          <div className="staff-cs-head-copy">
            <h2 id="cs-review-title">Need CS help with this form?</h2>
            <p>
              Use this if the application needs a correction from Customer Service. Sending it
              releases your ownership and returns you to the queue.
            </p>
          </div>
          <div className="staff-cs-badges">
            <span className="staff-pill gray">Optional</span>
          </div>
        </div>
        <div className="staff-cs-body">
          <div className="staff-cs-fields">
            <label>
              Note for CS (required)
              <textarea
                value={note}
                onChange={(e) => onNoteChange(e.target.value)}
                rows={3}
                maxLength={2000}
                placeholder="What needs to be reviewed or corrected?…"
                autoComplete="off"
              />
            </label>
            <label>
              Substatus (optional)
              <select value={substatus} onChange={(e) => onSubstatusChange(e.target.value)}>
                <option value="">No substatus</option>
                {TO_CS_SUBSTATUSES.map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="staff-cs-actions">
            {!note.trim() ? (
              <p className="staff-cs-hint">A note is required before sending.</p>
            ) : null}
            <button
              type="button"
              className="staff-btn danger"
              disabled={busy || !note.trim()}
              onClick={onSendToCs}
            >
              Send to CS
            </button>
          </div>
        </div>
      </section>
    );
  }

  if (status === "TO_CS") {
    return (
      <section className="staff-panel staff-cs-panel is-parked" aria-labelledby="cs-review-title">
        <div className="staff-cs-head">
          <span className="staff-cs-icon" aria-hidden>
            <Flag />
          </span>
          <div className="staff-cs-head-copy">
            <h2 id="cs-review-title">CS is reviewing this form</h2>
            <p>
              {sentAt ? `Sent ${formatDateTimeUS(sentAt)}. ` : ""}
              Ownership is with Customer Service until this order is marked GTG.
            </p>
          </div>
          <div className="staff-cs-badges">
            <StatusPill status="TO_CS" />
            {savedSubstatus ? <span className="staff-pill red">{savedSubstatus}</span> : null}
          </div>
        </div>
        <div className="staff-cs-body">
          {latestNote ? <blockquote className="staff-cs-note">{latestNote}</blockquote> : null}
          {canCorrect ? (
            <>
              <label>
                Completion note (optional)
                <textarea
                  value={note}
                  onChange={(e) => onNoteChange(e.target.value)}
                  rows={3}
                  maxLength={2000}
                  placeholder="What was corrected?…"
                  autoComplete="off"
                />
              </label>
              <div className="staff-cs-actions">
                <a className="staff-cs-editor" href={csEditorHref}>
                  Open in CS editor →
                </a>
                <button
                  type="button"
                  className="staff-btn green"
                  disabled={busy}
                  onClick={onMarkGtg}
                >
                  <CheckCircle2 aria-hidden />
                  Mark GTG
                </button>
              </div>
            </>
          ) : (
            <p className="staff-cs-wait">No action needed from you right now.</p>
          )}
        </div>
      </section>
    );
  }

  if (status === "GTG") {
    return (
      <section className="staff-panel staff-cs-panel is-ready" aria-labelledby="cs-review-title">
        <div className="staff-cs-head">
          <span className="staff-cs-icon" aria-hidden>
            <CheckCircle2 />
          </span>
          <div className="staff-cs-head-copy">
            <h2 id="cs-review-title">CS marked this form ready</h2>
            <p>
              The application was corrected. Resume processing to continue to the completion
              documents.
            </p>
          </div>
          <StatusPill status="GTG" />
        </div>
        <div className="staff-cs-body">
          {latestNote ? <blockquote className="staff-cs-note">{latestNote}</blockquote> : null}
          {!isCs ? (
            <div className="staff-cs-actions">
              {canCorrect ? (
                <a className="staff-cs-editor" href={csEditorHref}>
                  Open in CS editor →
                </a>
              ) : null}
              <button type="button" className="staff-btn" disabled={busy} onClick={onResume}>
                <Play aria-hidden />
                Resume Order Processing
              </button>
            </div>
          ) : null}
        </div>
      </section>
    );
  }

  return null;
}
