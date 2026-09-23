"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { staffJson, staffRole } from "@/lib/staff-client";
import { useInactivitySignout, useRequireStaffAuth } from "@/lib/staff-auth-hook";
import { BackLink, EmptyState, PageBand, StatCard, Toast } from "@/components/staff/ui";
import {
  activityCategory,
  dayKey,
  fullTime,
  humanizeActivity,
  relTime,
} from "@/components/staff/activity";

interface StaffMember {
  id: string;
  fullName: string;
  email: string;
  role: string;
  accountStatus: string;
  mfaEnabled: boolean;
  lastLoginAt: string | null;
  lastActivityAt: string | null;
  activeOrders: number;
}

interface ActivityEntry {
  at: string;
  actorEmail: string;
  action: string;
  orderNumber?: string;
  detail?: Record<string, unknown>;
}

function initials(name: string, email: string): string {
  const source = name.trim() || email;
  const parts = source.split(/[\s@.]+/).filter(Boolean);
  return ((parts[0]?.[0] ?? "?") + (parts[1]?.[0] ?? "")).toUpperCase();
}

export default function StaffAdmin() {
  useRequireStaffAuth();
  useInactivitySignout();
  const [isAdmin, setIsAdmin] = useState(false);
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [activity, setActivity] = useState<ActivityEntry[]>([]);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [tab, setTab] = useState<"staff" | "activity">("staff");
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteName, setInviteName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteLink, setInviteLink] = useState("");
  const [inviteEmailed, setInviteEmailed] = useState(false);
  const [activityFilter, setActivityFilter] = useState("");
  const [activityLimit, setActivityLimit] = useState(20);

  const load = useCallback(async () => {
    setError("");
    try {
      const [roster, feed] = await Promise.all([
        staffJson<{ staff: StaffMember[] }>("/admin/staff"),
        staffJson<{ activity: ActivityEntry[] }>("/admin/activity?limit=200"),
      ]);
      setStaff(roster.staff);
      setActivity(feed.activity);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load administration");
    }
  }, []);

  useEffect(() => {
    setIsAdmin(staffRole() === "ADMIN");
    void load();
  }, [load]);

  const invite = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setInviteLink("");
    setInviteEmailed(false);
    try {
      const data = await staffJson<{ setupToken?: string; emailed?: boolean }>("/auth/invite", {
        method: "POST",
        body: JSON.stringify({ fullName: inviteName.trim(), email: inviteEmail.trim() }),
      });
      if (data.emailed) {
        setInviteEmailed(true);
        setToast(`Invitation emailed to ${inviteEmail.trim()} — valid 48h.`);
      } else if (data.setupToken) {
        setInviteLink(`${window.location.origin}/auth?setup=${data.setupToken}`);
        setToast("Invitation created — email is disabled, share the setup link manually.");
      }
      setInviteName("");
      setInviteEmail("");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Invitation failed");
    }
  };

  const resend = async (id: string, email: string) => {
    setError("");
    try {
      const data = await staffJson<{ setupToken?: string; emailed?: boolean }>(
        `/auth/invite/${id}/resend`,
        {
          method: "POST",
          body: "{}",
        },
      );
      if (data.emailed) setToast(`Invitation re-sent to ${email}.`);
      else if (data.setupToken) {
        setInviteLink(`${window.location.origin}/auth?setup=${data.setupToken}`);
        setToast("New setup link created — email is disabled, share it manually.");
      }
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Re-send failed");
    }
  };

  const act = async (
    id: string,
    action: "revoke" | "mfa-reset" | "disable" | "enable",
    label: string,
  ) => {
    if (!window.confirm(`${label}?`)) return;
    setError("");
    try {
      if (action === "disable" || action === "enable") {
        await staffJson(`/admin/staff/${id}`, {
          method: "PATCH",
          body: JSON.stringify({ accountStatus: action === "enable" ? "active" : "disabled" }),
        });
      } else {
        await staffJson(`/admin/staff/${id}/${action}`, { method: "POST", body: "{}" });
      }
      setToast("Done.");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Action failed");
    }
  };

  if (!isAdmin) {
    return (
      <>
        <BackLink href="/staff">← Back to Open Orders</BackLink>
        <p role="alert" className="staff-alert error">
          Administration is restricted to the super-admin.
        </p>
      </>
    );
  }

  const pending = staff.filter((m) => m.accountStatus === "pending").length;
  const activeOrders = staff.reduce((sum, m) => sum + m.activeOrders, 0);
  const filteredActivity = activityFilter
    ? activity.filter((a) => a.action === activityFilter)
    : activity;
  const actionOptions = [...new Set(activity.map((a) => a.action))].sort();
  const shownActivity = filteredActivity.slice(0, activityLimit);

  const days: { day: string; entries: ActivityEntry[] }[] = [];
  for (const entry of shownActivity) {
    const day = dayKey(entry.at);
    const group = days.find((g) => g.day === day);
    if (group) group.entries.push(entry);
    else days.push({ day, entries: [entry] });
  }

  return (
    <>
      <PageBand
        eyebrow="Internal — access control"
        title="Administration"
        subtitle="Staff accounts, invitations, sessions, and the complete audit history. Every change is recorded."
        actions={
          <button type="button" className="staff-btn" onClick={() => setInviteOpen(true)}>
            <Plus aria-hidden style={{ width: 16, height: 16 }} /> Invite staff member
          </button>
        }
      />
      {toast ? <Toast message={toast} onDone={() => setToast("")} /> : null}
      {error ? (
        <p role="alert" className="staff-alert error">
          {error}
        </p>
      ) : null}

      <div className="staff-stats">
        <StatCard value={staff.length} label="Staff accounts" />
        <StatCard value={activeOrders} label="Active orders" />
        <StatCard value={pending} label="Invitations pending" />
        <StatCard value={activity.length} label="Recent events" />
      </div>

      <div className="staff-tabs" role="tablist" aria-label="Administration sections">
        {(
          [
            ["staff", "Staff"],
            ["activity", "Activity"],
          ] as ["staff" | "activity", string][]
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

      {tab === "staff" ? (
        <div className="staff-panel">
          <div className="staff-tablewrap">
            <table className="staff-table staff-cards-fallback">
              <thead>
                <tr>
                  <th>Staff</th>
                  <th>Status</th>
                  <th>2-step</th>
                  <th>Active orders</th>
                  <th>Last activity</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {staff.map((member) => (
                  <tr key={member.id}>
                    <td>
                      <span className="staff-avatar" aria-hidden>
                        {initials(member.fullName, member.email)}
                      </span>
                      <strong>{member.fullName || "—"}</strong>
                      {member.role === "ADMIN" ? (
                        <span className="staff-pill navy">ADMIN</span>
                      ) : null}
                      <br />
                      <span style={{ fontSize: "0.85rem", color: "var(--muted-text)" }}>
                        {member.email}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`staff-pill ${member.accountStatus === "active" ? "green" : member.accountStatus === "pending" ? "navy" : "red"}`}
                      >
                        {member.accountStatus}
                      </span>
                    </td>
                    <td>{member.mfaEnabled ? "Enrolled" : "Not enrolled"}</td>
                    <td className="num">{member.activeOrders}</td>
                    <td style={{ whiteSpace: "nowrap" }}>
                      {member.lastActivityAt
                        ? new Date(member.lastActivityAt).toLocaleString("en-US")
                        : "—"}
                    </td>
                    <td>
                      {member.role === "ADMIN" ? (
                        <span style={{ fontSize: "0.85rem", color: "var(--muted-text)" }}>
                          Owner
                        </span>
                      ) : (
                        <span style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                          {member.accountStatus === "pending" ? (
                            <button
                              type="button"
                              className="staff-btn secondary"
                              onClick={() => void resend(member.id, member.email)}
                            >
                              Re-send invite
                            </button>
                          ) : null}
                          <button
                            type="button"
                            className="staff-btn secondary"
                            onClick={() =>
                              void act(member.id, "revoke", "Revoke all sessions for this account")
                            }
                          >
                            Revoke sessions
                          </button>
                          <button
                            type="button"
                            className="staff-btn secondary"
                            onClick={() =>
                              void act(
                                member.id,
                                "mfa-reset",
                                "Reset this person's authenticator? They must re-enroll and all sessions are revoked",
                              )
                            }
                          >
                            Reset 2-step
                          </button>
                          {member.accountStatus === "active" ? (
                            <button
                              type="button"
                              className="staff-btn danger"
                              onClick={() =>
                                void act(
                                  member.id,
                                  "disable",
                                  "Deactivate this account immediately",
                                )
                              }
                            >
                              Deactivate
                            </button>
                          ) : member.accountStatus === "disabled" ? (
                            <button
                              type="button"
                              className="staff-btn secondary"
                              onClick={() =>
                                void act(member.id, "enable", "Reactivate this account")
                              }
                            >
                              Reactivate
                            </button>
                          ) : null}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="staff-panel">
          <div className="staff-filters">
            <label>
              Event type
              <select value={activityFilter} onChange={(e) => setActivityFilter(e.target.value)}>
                <option value="">All events</option>
                {actionOptions.map((a) => (
                  <option key={a} value={a}>
                    {humanizeActivity({ action: a })}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="staff-panel-body">
            <p style={{ fontSize: "0.9rem", color: "var(--flow-secondary)", marginTop: 0 }}>
              Showing {shownActivity.length} of {filteredActivity.length}.
            </p>
            {filteredActivity.length === 0 ? (
              <EmptyState title="No activity recorded yet." />
            ) : (
              days.map((group) => (
                <div key={group.day}>
                  <p className="staff-day">{group.day}</p>
                  <ul className="staff-timeline">
                    {group.entries.map((entry, i) => (
                      <li key={i} className={`cat-${activityCategory(entry.action)}`}>
                        <p style={{ margin: 0 }}>
                          <span className="t-date" title={fullTime(entry.at)}>
                            {relTime(entry.at)}
                          </span>
                          : <strong>{humanizeActivity(entry)}</strong> — {entry.actorEmail}
                          {entry.orderNumber ? ` · ${entry.orderNumber}` : ""}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              ))
            )}
            {filteredActivity.length > shownActivity.length ? (
              <button
                type="button"
                className="staff-btn secondary"
                onClick={() => setActivityLimit((n) => n + 20)}
              >
                Show more ({filteredActivity.length - shownActivity.length} older)
              </button>
            ) : null}
            {activityLimit > 20 &&
            filteredActivity.length <= shownActivity.length &&
            filteredActivity.length > 0 ? (
              <button
                type="button"
                className="staff-btn secondary"
                onClick={() => setActivityLimit(20)}
              >
                Show less
              </button>
            ) : null}
          </div>
        </div>
      )}

      {inviteOpen ? (
        <div className="staff-modal-backdrop" onClick={() => setInviteOpen(false)}>
          <div
            className="staff-modal"
            role="dialog"
            aria-label="Invite staff member"
            onClick={(e) => e.stopPropagation()}
          >
            <h2>Invite staff member</h2>
            <p style={{ color: "var(--muted-text)" }}>
              They set their own password and pair their own authenticator. Credentials are never
              shared.
            </p>
            <form onSubmit={invite} style={{ marginTop: 0, maxWidth: "none" }}>
              <label>
                Full name
                <input
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  required
                />
              </label>
              <label>
                Work email
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  required
                />
              </label>
              <div style={{ display: "flex", gap: "10px", marginTop: "14px" }}>
                <button type="submit" className="staff-btn">
                  Send invitation
                </button>
                <button
                  type="button"
                  className="staff-btn secondary"
                  onClick={() => setInviteOpen(false)}
                >
                  Close
                </button>
              </div>
            </form>
            {inviteEmailed ? (
              <p role="status" className="staff-alert success">
                Invitation emailed — valid 48h.
              </p>
            ) : null}
            {inviteLink ? (
              <p>
                Email is disabled in this environment. Share this setup link securely (valid 48h):
                <br />
                <code style={{ wordBreak: "break-all" }}>{inviteLink}</code>
              </p>
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  );
}
