"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { staffJson, staffLogout } from "@/lib/staff-client";
import { useInactivitySignout, useRequireStaffAuth } from "@/lib/staff-auth-hook";
import { PageBand } from "@/components/staff/ui";

export default function StaffSettings() {
  useRequireStaffAuth();
  useInactivitySignout();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  useEffect(() => {
    try {
      const token = sessionStorage.getItem("usvc-staff-access");
      if (token) {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setEmail(payload.email ?? "");
        setRole(payload.role ?? "");
      }
    } catch {
      setEmail("");
    }
  }, []);

  const isAdmin = role === "ADMIN";
  const mismatch = newPassword !== "" && confirmPassword !== "" && newPassword !== confirmPassword;
  const tooShort = newPassword !== "" && newPassword.length < 8;

  const changePassword = async (event: React.FormEvent) => {
    event.preventDefault();
    if (mismatch || tooShort) return;
    setSaving(true);
    setError("");
    try {
      await staffJson("/auth/password", {
        method: "POST",
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      setToast("Password changed. Sign in again with your new password.");
      await staffLogout();
      window.setTimeout(() => router.replace("/auth"), 1200);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Password change failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <PageBand
        eyebrow="Internal — Authorized staff only"
        title="Settings"
        subtitle="Your session and security controls."
      />
      <div className="staff-panel">
        <h2>Session</h2>
        <div className="staff-panel-body">
          <p>
            <strong>Signed in as:</strong> {email || "—"}
          </p>
          <p>
            <strong>Role:</strong> {role || "—"}
          </p>
          <p style={{ color: "var(--muted-text)" }}>
            Sessions expire after 30 minutes of inactivity and are revoked immediately if the
            super-admin resets your authenticator, revokes your sessions, or deactivates your
            account.
          </p>
          <button
            type="button"
            className="staff-btn"
            onClick={async () => {
              await staffLogout();
              window.location.href = "/auth";
            }}
          >
            Sign out everywhere on this device
          </button>
        </div>
      </div>
      <div className="staff-panel">
        <h2>Security controls</h2>
        <div className="staff-panel-body">
          <ul>
            <li>Every sign-in requires your password plus a 6-digit authenticator code.</li>
            <li>Lost your authenticator device? Only the super-admin can reset your pairing.</li>
            {isAdmin ? (
              <li>ADMINs change their own password with the form below.</li>
            ) : (
              <li>
                Forgotten password or new device? Ask the super-admin for a password reset — you
                will get a fresh 48-hour setup link.
              </li>
            )}
            <li>
              Sensitive values auto-mask after 30 seconds and are never stored on this device.
            </li>
          </ul>
        </div>
      </div>
      {isAdmin ? (
        <div className="staff-panel">
          <h2>Change password</h2>
          <div className="staff-panel-body">
            <p style={{ color: "var(--muted-text)", marginTop: 0 }}>
              For ADMIN accounts only. All sessions, including this one, are signed out — sign back
              in with the new password.
            </p>
            {toast ? (
              <p role="status" className="staff-alert success">
                {toast}
              </p>
            ) : null}
            {error ? (
              <p role="alert" className="staff-alert error">
                {error}
              </p>
            ) : null}
            <form onSubmit={changePassword} style={{ marginTop: 0, maxWidth: "420px" }}>
              <label>
                Current password
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
              </label>
              <label>
                New password (8+ characters)
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  autoComplete="new-password"
                  required
                />
              </label>
              <label>
                Confirm new password
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                  required
                />
              </label>
              {mismatch ? (
                <p role="alert" className="staff-alert error">
                  The new passwords do not match.
                </p>
              ) : null}
              {tooShort ? (
                <p role="alert" className="staff-alert error">
                  The new password needs at least 8 characters.
                </p>
              ) : null}
              <button
                type="submit"
                className="staff-btn"
                disabled={saving || mismatch || tooShort}
                style={{ marginTop: "14px" }}
              >
                {saving ? "Changing…" : "Change password"}
              </button>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}
