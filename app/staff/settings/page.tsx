"use client";

import { useEffect, useState } from "react";
import { staffLogout } from "@/lib/staff-client";
import { useInactivitySignout, useRequireStaffAuth } from "@/lib/staff-auth-hook";
import { PageBand } from "@/components/staff/ui";

export default function StaffSettings() {
  useRequireStaffAuth();
  useInactivitySignout();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
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
            <li>
              Password changes and MFA resets are performed by the super-admin — ask them directly.
            </li>
            <li>
              Sensitive values auto-mask after 30 seconds and are never stored on this device.
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
