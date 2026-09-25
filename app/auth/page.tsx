"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { saveStaffTokens } from "@/lib/staff-client";

type Step =
  | { name: "login" }
  | { name: "enroll"; mfaToken: string; qr: string; secret: string }
  | { name: "verify"; mfaToken: string };

async function post(path: string, body: unknown) {
  const response = await fetch(`/api/backend${path}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || "Request failed");
  return data;
}

function AuthForm() {
  const router = useRouter();
  const params = useSearchParams();
  const setupToken = params.get("setup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<Step>({ name: "login" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const finish = (data: { accessToken: string; refreshToken: string }) => {
    saveStaffTokens(data.accessToken, data.refreshToken);
    router.replace("/staff");
  };

  const submitLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      if (setupToken) {
        const data = await post("/auth/setup", { token: setupToken, password });
        const enroll = await post("/auth/mfa/enroll", { mfaToken: data.mfaToken });
        setStep({
          name: "enroll",
          mfaToken: data.mfaToken,
          qr: enroll.qrDataUrl,
          secret: enroll.secret,
        });
      } else {
        const data = await post("/auth/login", { email, password });
        if (data.enroll) {
          const enroll = await post("/auth/mfa/enroll", { mfaToken: data.mfaToken });
          setStep({
            name: "enroll",
            mfaToken: data.mfaToken,
            qr: enroll.qrDataUrl,
            secret: enroll.secret,
          });
        } else {
          setStep({ name: "verify", mfaToken: data.mfaToken });
        }
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Sign in failed");
    } finally {
      setBusy(false);
    }
  };

  const submitCode = async (event: React.FormEvent) => {
    event.preventDefault();
    if (step.name !== "enroll" && step.name !== "verify") return;
    setBusy(true);
    setError("");
    try {
      const path = step.name === "enroll" ? "/auth/mfa/confirm" : "/auth/mfa/verify";
      finish(await post(path, { mfaToken: step.mfaToken, code }));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Verification failed");
      setCode("");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="staff-auth-wrap">
      <div className="staff-auth-card">
        <div className="staff-auth-brandmark">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/usvc-logo-light.png" alt="USVC" width={44} height={44} />
          <span>
            <strong>USVC Flow</strong>
            <span>Fulfillment Center</span>
          </span>
        </div>
        <p className="staff-eyebrow">Internal — Authorized staff only</p>
        <h1 style={{ marginTop: "4px" }}>{setupToken ? "Set up your account" : "Staff sign in"}</h1>
        {params.get("reason") === "inactivity" ? (
          <p role="status">You were signed out after 30 minutes of inactivity.</p>
        ) : null}

        {step.name === "login" ? (
          <form onSubmit={submitLogin} style={{ marginTop: 0, maxWidth: "none" }}>
            {setupToken ? (
              <p>
                Create your own password (8+ characters). You will pair your authenticator app next.
              </p>
            ) : (
              <>
                <label htmlFor="staff-email">Work email</label>
                <input
                  id="staff-email"
                  type="email"
                  autoComplete="username"
                  spellCheck={false}
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </>
            )}
            <label htmlFor="staff-password">{setupToken ? "Create password" : "Password"}</label>
            <input
              id="staff-password"
              type="password"
              autoComplete={setupToken ? "new-password" : "current-password"}
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {error ? (
              <p role="alert" className="staff-alert error">
                {error}
              </p>
            ) : null}
            <button
              type="submit"
              className="staff-btn"
              disabled={busy}
              style={{ marginTop: "1rem", width: "100%" }}
            >
              {busy ? "Please wait…" : "Continue"}
            </button>
          </form>
        ) : (
          <form onSubmit={submitCode} style={{ marginTop: 0, maxWidth: "none" }}>
            {step.name === "enroll" ? (
              <>
                <p>
                  Scan this code with Google Authenticator, Microsoft Authenticator, or any
                  compatible app, then enter the 6-digit code below.
                </p>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={step.qr}
                  alt="Authenticator app setup QR code"
                  width={200}
                  height={200}
                  style={{ border: "1px solid var(--border)", borderRadius: "8px" }}
                />
                <p style={{ fontSize: "0.9rem" }}>
                  Can&apos;t scan? Enter this key manually: <code>{step.secret}</code>
                </p>
              </>
            ) : (
              <p>Enter the current 6-digit code from your authenticator app.</p>
            )}
            <label htmlFor="staff-code">6-digit code</label>
            <input
              id="staff-code"
              inputMode="numeric"
              autoComplete="one-time-code"
              spellCheck={false}
              required
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
            />
            {error ? (
              <p role="alert" className="staff-alert error">
                {error}
              </p>
            ) : null}
            <button
              type="submit"
              className="staff-btn"
              disabled={busy || code.length !== 6}
              style={{ marginTop: "1rem", width: "100%" }}
            >
              {busy
                ? "Verifying…"
                : step.name === "enroll"
                  ? "Complete setup"
                  : "Verify and continue"}
            </button>
          </form>
        )}
        <p style={{ fontSize: "0.9rem", color: "var(--muted-text)", marginBottom: 0 }}>
          Lost your authenticator device? Contact the super-admin — only they can reset your
          pairing.
        </p>
      </div>
    </div>
  );
}

export default function StaffAuth() {
  return (
    <Suspense>
      <AuthForm />
    </Suspense>
  );
}
