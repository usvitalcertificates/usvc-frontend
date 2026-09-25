"use client";

import { useCallback, useEffect, useState } from "react";
import {
  ClipboardList,
  Clock3,
  KeyRound,
  LogOut,
  Plus,
  Power,
  RotateCcw,
  UserRoundCheck,
} from "lucide-react";
import { staffId, staffJson, staffRole } from "@/lib/staff-client";
import { useInactivitySignout, useRequireStaffAuth } from "@/lib/staff-auth-hook";
import { BackLink, ConfirmModal, PageBand, StatCard, Toast } from "@/components/staff/ui";

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

function initials(name: string, email: string): string {
  const source = name.trim() || email;
  const parts = source.split(/[\s@.]+/).filter(Boolean);
  return ((parts[0]?.[0] ?? "?") + (parts[1]?.[0] ?? "")).toUpperCase();
}

export default function StaffAdmin() {
  useRequireStaffAuth();
  useInactivitySignout();
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentStaffId, setCurrentStaffId] = useState("");
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteName, setInviteName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("FULFILLMENT");
  const [inviteLink, setInviteLink] = useState("");
  const [inviteEmailed, setInviteEmailed] = useState(false);
  const [confirm, setConfirm] = useState<{
    title: string;
    body: string;
    confirmLabel: string;
    danger?: boolean;
    run: () => Promise<void>;
  } | null>(null);

  const loadRoster = useCallback(async () => {
    setError("");
    try {
      const roster = await staffJson<{ staff: StaffMember[] }>("/admin/staff");
      setStaff(roster.staff);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load administration");
    }
  }, []);

  useEffect(() => {
    setIsAdmin(staffRole() === "ADMIN");
    setCurrentStaffId(staffId() ?? "");
    void loadRoster();
  }, [loadRoster]);

  const invite = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setInviteLink("");
    setInviteEmailed(false);
    try {
      const data = await staffJson<{ setupToken?: string; emailed?: boolean }>("/auth/invite", {
        method: "POST",
        body: JSON.stringify({
          fullName: inviteName.trim(),
          email: inviteEmail.trim(),
          role: inviteRole,
        }),
      });
      if (data.emailed) {
        setInviteEmailed(true);
        setToast(`Invitation emailed to ${inviteEmail.trim()} as ${inviteRole} — valid 48h.`);
      } else if (data.setupToken) {
        setInviteLink(`${window.location.origin}/auth?setup=${data.setupToken}`);
        setToast("Invitation created — email is disabled, share the setup link manually.");
      }
      setInviteName("");
      setInviteEmail("");
      setInviteRole("FULFILLMENT");
      await loadRoster();
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
      await loadRoster();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Re-send failed");
    }
  };

  const act = async (
    id: string,
    action: "revoke" | "mfa-reset" | "disable" | "enable",
    label: string,
  ) => {
    const run = async () => {
      setConfirm(null);
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
        await loadRoster();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Action failed");
      }
    };
    const titles: Record<typeof action, string> = {
      revoke: "Revoke sessions?",
      "mfa-reset": "Reset 2-step?",
      disable: "Deactivate account?",
      enable: "Reactivate account?",
    };
    setConfirm({
      title: titles[action],
      body: `${label}?`,
      confirmLabel: action === "disable" ? "Deactivate" : "Confirm",
      danger: action === "disable",
      run,
    });
  };

  const changeRole = async (id: string, email: string, role: string) => {
    const run = async () => {
      setConfirm(null);
      setError("");
      try {
        await staffJson(`/admin/staff/${id}`, {
          method: "PATCH",
          body: JSON.stringify({ role }),
        });
        setToast(`${email} is now ${role}.`);
        await loadRoster();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Role change failed");
      }
    };
    setConfirm({
      title: "Change role?",
      body: `Change ${email} to role ${role}? They will be signed out.`,
      confirmLabel: "Change Role",
      run,
    });
  };

  if (!isAdmin) {
    return (
      <>
        <BackLink href="/staff">← Back to Open Orders</BackLink>
        <p role="alert" className="staff-alert error">
          Administration is restricted to ADMIN.
        </p>
      </>
    );
  }

  const pending = staff.filter((m) => m.accountStatus === "pending").length;
  const activeOrders = staff.reduce((sum, m) => sum + m.activeOrders, 0);

  return (
    <>
      <PageBand
        eyebrow="Internal — access control"
        title="Administration"
        subtitle="Manage staff access, security, and workload from one place."
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

      <div className="staff-stats staff-admin-stats">
        <StatCard
          value={staff.length}
          label="Staff accounts"
          icon={<UserRoundCheck aria-hidden />}
          tone="blue"
        />
        <StatCard
          value={activeOrders}
          label="Active orders"
          icon={<ClipboardList aria-hidden />}
          tone="green"
        />
        <StatCard
          value={pending}
          label="Invitations pending"
          icon={<Clock3 aria-hidden />}
          tone="amber"
        />
      </div>

      <div className="staff-panel">
        <div className="staff-tablewrap">
          <table className="staff-table staff-cards-fallback staff-admin-table">
            <thead>
              <tr>
                <th>Staff</th>
                <th>Role</th>
                <th>Assign role</th>
                <th>Status</th>
                <th>2-step</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {staff.map((member) => (
                <tr key={member.id}>
                  <td>
                    <span className="staff-staffcell">
                      <span className="staff-avatar" aria-hidden>
                        {initials(member.fullName, member.email)}
                      </span>
                      <span className="staff-staffmeta">
                        <span className="staff-staffname">
                          <strong>{member.fullName || "—"}</strong>
                        </span>
                        <span className="staff-staffemail" title={member.email || undefined}>
                          {member.email}
                        </span>
                      </span>
                    </span>
                  </td>
                  <td data-label="Role">
                    <span
                      className={`staff-pill ${member.role === "ADMIN" ? "navy" : member.role === "CS" ? "green" : "gray"}`}
                    >
                      {member.role}
                    </span>
                  </td>
                  <td data-label="Assign role">
                    <div className="staff-admin-role-select">
                      <select
                        aria-label={`Role for ${member.email}`}
                        value={member.role}
                        disabled={member.id === currentStaffId}
                        title={
                          member.id === currentStaffId
                            ? "You cannot change your own role"
                            : `Assign a role to ${member.fullName || member.email}`
                        }
                        onChange={(e) => void changeRole(member.id, member.email, e.target.value)}
                      >
                        {["ADMIN", "FULFILLMENT", "CS"].map((r) => (
                          <option key={r} value={r}>
                            {r}
                          </option>
                        ))}
                      </select>
                    </div>
                  </td>
                  <td>
                    <span
                      className={`staff-pill ${member.accountStatus === "active" ? "green" : member.accountStatus === "pending" ? "navy" : "red"}`}
                    >
                      {member.accountStatus}
                    </span>
                  </td>
                  <td>
                    {member.mfaEnabled ? (
                      <span className="staff-pill green">Enrolled</span>
                    ) : (
                      <span className="staff-pill gray">Not enrolled</span>
                    )}
                  </td>
                  <td>
                    <span className="staff-admin-actions">
                      {member.id === currentStaffId ? (
                        <span className="staff-current-account">Current account</span>
                      ) : (
                        <span className="staff-admin-icon-actions">
                          {member.accountStatus === "pending" ? (
                            <button
                              type="button"
                              className="staff-icon-btn"
                              aria-label={`Re-send invitation to ${member.email}`}
                              title="Re-send invitation"
                              onClick={() => void resend(member.id, member.email)}
                            >
                              <RotateCcw aria-hidden />
                            </button>
                          ) : null}
                          <button
                            type="button"
                            className="staff-icon-btn"
                            aria-label={`Revoke sessions for ${member.email}`}
                            title="Revoke all sessions"
                            onClick={() =>
                              void act(member.id, "revoke", "Revoke all sessions for this account")
                            }
                          >
                            <LogOut aria-hidden />
                          </button>
                          <button
                            type="button"
                            className="staff-icon-btn"
                            aria-label={`Reset 2-step for ${member.email}`}
                            title="Reset 2-step authentication"
                            onClick={() =>
                              void act(
                                member.id,
                                "mfa-reset",
                                "Reset this person's authenticator? They must re-enroll and all sessions are revoked",
                              )
                            }
                          >
                            <KeyRound aria-hidden />
                          </button>
                          {member.accountStatus === "active" ? (
                            <button
                              type="button"
                              className="staff-icon-btn danger"
                              aria-label={`Deactivate ${member.email}`}
                              title="Deactivate account"
                              onClick={() =>
                                void act(
                                  member.id,
                                  "disable",
                                  "Deactivate this account immediately",
                                )
                              }
                            >
                              <Power aria-hidden />
                            </button>
                          ) : member.accountStatus === "disabled" ? (
                            <button
                              type="button"
                              className="staff-icon-btn success"
                              aria-label={`Reactivate ${member.email}`}
                              title="Reactivate account"
                              onClick={() =>
                                void act(member.id, "enable", "Reactivate this account")
                              }
                            >
                              <Power aria-hidden />
                            </button>
                          ) : null}
                        </span>
                      )}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <p className="staff-results-count">Showing {staff.length} staff accounts.</p>

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
              <label>
                Role
                <select value={inviteRole} onChange={(e) => setInviteRole(e.target.value)}>
                  {["ADMIN", "FULFILLMENT", "CS"].map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
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

      {confirm ? (
        <ConfirmModal
          title={confirm.title}
          body={confirm.body}
          confirmLabel={confirm.confirmLabel}
          danger={confirm.danger}
          onCancel={() => setConfirm(null)}
          onConfirm={() => void confirm.run()}
        />
      ) : null}
    </>
  );
}
