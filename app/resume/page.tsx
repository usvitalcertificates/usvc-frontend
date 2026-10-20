"use client";
import { FileText, CalendarDays, ShieldCheck, ArrowRight } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { recoveryJson, recoveryDraft, type RecoveryApplication } from "@/lib/recovery-client";
import { OrderForm } from "@/app/state/[state]/[certificate]/order-form";
export default function ResumePage() {
  const [loadingApplications, setLoadingApplications] = useState(true);
  const [verified, setVerified] = useState(false);
  const [token, setToken] = useState("");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [orders, setOrders] = useState<RecoveryApplication[] | null>(null);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [selected, setSelected] = useState<RecoveryApplication | null>(null);
  const [paymentOnly, setPaymentOnly] = useState(false);
  useEffect(() => {
    const controller = new AbortController();
    let linkOpened = false;
    function consumeLink() {
      const secret = window.location.hash.slice(1);
      if (!secret) return false;
      linkOpened = true;
      window.history.replaceState(null, "", window.location.pathname);
      setLoadingApplications(false);
      setVerified(false);
      setToken(secret);
      setOrders(null);
      setSelected(null);
      setCode("");
      setSent(false);
      setNotice("");
      setError("");
      return true;
    }
    if (!consumeLink())
      recoveryJson<{ applications: RecoveryApplication[]; nextCursor: string | null }>(
        "/applications",
        {
          signal: controller.signal,
        },
      )
        .then((v) => {
          if (!linkOpened) {
            setVerified(true);
            setOrders(v.applications);
            setNextCursor(v.nextCursor);
          }
        })
        .catch((e) => {
          if (!linkOpened && !controller.signal.aborted && e.status !== 401) {
            setVerified(true);
            setError("We couldn’t load your saved applications. Please try again.");
          }
        })
        .finally(() => {
          if (!linkOpened && !controller.signal.aborted) setLoadingApplications(false);
        });
    window.addEventListener("hashchange", consumeLink);
    return () => {
      controller.abort();
      window.removeEventListener("hashchange", consumeLink);
    };
  }, []);
  async function act(work: () => Promise<void>) {
    if (busy) return;
    setBusy(true);
    setError("");
    setNotice("");
    try {
      await work();
    } catch (e) {
      if ((e as { status?: number }).status === 401) {
        setVerified(false);
        setOrders(null);
      }
      setError(e instanceof Error ? e.message : "Please try again.");
    } finally {
      setBusy(false);
    }
  }
  async function request(event: FormEvent) {
    event.preventDefault();
    await act(async () => {
      const result = await recoveryJson<{ message: string }>("/request", {
        method: "POST",
        body: JSON.stringify({ email }),
      });
      setNotice(result.message);
    });
  }
  async function sendCode() {
    await act(async () => {
      const result = await recoveryJson<{ message: string }>("/code", {
        method: "POST",
        body: JSON.stringify({ token }),
      });
      setSent(true);
      setNotice(result.message);
    });
  }
  async function loadApplications() {
    const result = await recoveryJson<{
      applications: RecoveryApplication[];
      nextCursor: string | null;
    }>("/applications");
    setOrders(result.applications);
    setNextCursor(result.nextCursor);
  }
  async function verify(event: FormEvent) {
    event.preventDefault();
    await act(async () => {
      await recoveryJson("/verify", { method: "POST", body: JSON.stringify({ token, code }) });
      setVerified(true);
      setLoadingApplications(true);
      setToken("");
      setCode("");
      try {
        await loadApplications();
      } finally {
        setLoadingApplications(false);
      }
    });
  }
  async function open(order: RecoveryApplication, payment: boolean) {
    await act(async () => {
      const current = await recoveryJson<RecoveryApplication>(`/applications/${order.id}`);
      if (current.paymentStatus === "PAID") {
        window.location.assign(`/order/confirmation/${current.id}`);
        return;
      }
      setPaymentOnly(payment);
      setSelected(current);
    });
  }
  return (
    <main className="page-section">
      <div className="container recovery-wrap">
        <div className="recovery-heading">
          <p className="eyebrow">Continue where you left off</p>
          <h1>Resume your application</h1>
          <p>
            Your saved application stays with the same order. Verify your email to review details or
            complete payment.
          </p>
        </div>
        {error ? (
          <p className="recovery-alert" role="alert">
            {error} <a href="/resume">Request a new recovery link</a>
          </p>
        ) : null}
        {notice ? (
          <p className="recovery-notice" role="status">
            {notice}
          </p>
        ) : null}
        {loadingApplications ? (
          <section
            className="recovery-card recovery-loading"
            role="status"
            aria-live="polite"
            aria-busy="true"
          >
            <span className="recovery-loading-spinner" aria-hidden />
            <div>
              <h2>Loading your saved applications…</h2>
              <p>Please wait while we securely retrieve your application details.</p>
            </div>
          </section>
        ) : selected ? (
          <>
            <button
              className="button button-secondary"
              onClick={() => {
                setSelected(null);
                recoveryJson<{ applications: RecoveryApplication[]; nextCursor: string | null }>(
                  "/applications",
                )
                  .then((v) => {
                    setOrders(v.applications);
                    setNextCursor(v.nextCursor);
                  })
                  .catch((e) => setError(e.message));
              }}
            >
              Back to saved applications
            </button>
            <div className="recovery-card">
              <h2>Order {selected.publicNumber}</h2>
              <p>
                {selected.stateName} · {selected.certificate.toLowerCase()} certificate
              </p>
              <p>
                Certificate, state and email are fixed. Contact support if these need changing.
                Saved SSNs and card details are never displayed.
              </p>
            </div>
            <OrderForm
              key={`${selected.id}:${selected.revision}`}
              stateCode={selected.stateSlug}
              certificate={`${selected.certificate.toLowerCase()}-certificate`}
              recovery={{
                id: selected.id,
                revision: selected.revision,
                publicNumber: selected.publicNumber,
                hasStoredSsn: selected.hasStoredSsn,
                initialDraft: recoveryDraft(selected),
                paymentOnly,
                processing: selected.processing,
                onUpdated: (order) => {
                  setSelected(order);
                  setNotice("Application changes saved.");
                },
              }}
            />
          </>
        ) : orders ? (
          <section className="recovery-card recovery-saved-list">
            <div className="recovery-list-heading">
              <div>
                <h2>Saved applications</h2>
                <p>Choose an application to continue.</p>
              </div>
              <span className="recovery-private-label">
                <ShieldCheck aria-hidden /> Verified access
              </span>
            </div>
            {orders.length ? (
              orders.map((order) => (
                <article className="recovery-order" key={order.id}>
                  <div className="recovery-order-main">
                    <span className="recovery-document-icon">
                      <FileText aria-hidden />
                    </span>
                    <div className="recovery-order-info">
                      <span className="recovery-order-caption">Order reference</span>
                      <h3>{order.publicNumber}</h3>
                      <p>
                        {order.stateName} ·{" "}
                        {order.certificate.charAt(0) + order.certificate.slice(1).toLowerCase()}{" "}
                        certificate
                      </p>
                      <span className="recovery-order-date">
                        <CalendarDays aria-hidden /> Created{" "}
                        {new Date(order.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    <div className="recovery-order-payment">
                      <span className="recovery-order-caption">Order total</span>
                      <strong>
                        {(order.amountCents / 100).toLocaleString("en-US", {
                          style: "currency",
                          currency: order.currency,
                        })}
                      </strong>
                      <span
                        className={`recovery-payment-badge ${order.processing ? "checking" : order.paymentStatus === "PAID" ? "paid" : order.paymentStatus === "FAILED" ? "failed" : "pending"}`}
                      >
                        {order.processing
                          ? "Payment needs checking"
                          : order.paymentStatus === "FAILED"
                            ? "Payment unsuccessful"
                            : order.paymentStatus === "PAID"
                              ? "Paid"
                              : order.paymentStatus === "REFUNDED"
                                ? "Refunded"
                                : "Awaiting payment"}
                      </span>
                    </div>
                  </div>
                  <div className="button-row recovery-order-actions">
                    {order.paymentStatus === "PAID" ? (
                      <a className="button button-primary" href={`/order/confirmation/${order.id}`}>
                        View confirmation
                      </a>
                    ) : order.paymentStatus === "REFUNDED" ? (
                      <p>This refunded order cannot be reopened.</p>
                    ) : (
                      <>
                        <button
                          className="button button-primary"
                          disabled={busy}
                          onClick={() => open(order, true)}
                        >
                          Complete payment <ArrowRight aria-hidden />
                        </button>
                        <button
                          className="button button-secondary"
                          disabled={busy}
                          onClick={() => open(order, false)}
                        >
                          Review/edit application
                        </button>
                      </>
                    )}
                  </div>
                </article>
              ))
            ) : (
              <p>
                No applications are currently available to resume. If you completed payment, check
                your confirmation email or contact support.
              </p>
            )}
            {nextCursor ? (
              <button
                className="button button-secondary"
                disabled={busy}
                onClick={() =>
                  act(async () => {
                    const result = await recoveryJson<{
                      applications: RecoveryApplication[];
                      nextCursor: string | null;
                    }>(`/applications?after=${encodeURIComponent(nextCursor)}`);
                    setOrders((current) => [...(current ?? []), ...result.applications]);
                    setNextCursor(result.nextCursor);
                  })
                }
              >
                Load more applications
              </button>
            ) : null}
          </section>
        ) : verified ? (
          <section className="recovery-card">
            <h2>Saved applications couldn’t be loaded</h2>
            <p>Please try loading your saved applications again.</p>
            <button
              className="button button-primary"
              disabled={busy}
              onClick={() =>
                act(async () => {
                  setLoadingApplications(true);
                  try {
                    await loadApplications();
                  } finally {
                    setLoadingApplications(false);
                  }
                })
              }
            >
              Load saved applications
            </button>
          </section>
        ) : token ? (
          <section className="recovery-card">
            <h2>Verify your email</h2>
            <p>
              We’ll send a six-digit code to the email saved with this application. Opening this
              page does not send an email.
            </p>
            <button className="button button-secondary" disabled={busy} onClick={sendCode}>
              {sent ? "Resend code" : "Send verification code"}
            </button>
            {sent ? (
              <form onSubmit={verify}>
                <label>
                  Verification code
                  <input
                    autoComplete="one-time-code"
                    inputMode="numeric"
                    pattern="[0-9]{6}"
                    maxLength={6}
                    required
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                  />
                </label>
                <p>Codes expire in 10 minutes. Wait 60 seconds before resending.</p>
                <button className="button button-primary" disabled={busy}>
                  {busy ? "Verifying…" : "Verify and continue"}
                </button>
              </form>
            ) : null}
          </section>
        ) : (
          <section className="recovery-card">
            <h2>Find your saved application</h2>
            <p>Use the email you entered on your application. You don’t need your order number.</p>
            <form onSubmit={request}>
              <label>
                Email address
                <input
                  type="email"
                  autoComplete="email"
                  required
                  maxLength={254}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </label>
              <button className="button button-primary" disabled={busy}>
                {busy ? "Requesting…" : "Email me a recovery link"}
              </button>
            </form>
            <p>Links expire in 48 hours. Access expires 30 minutes after email verification.</p>
          </section>
        )}
      </div>
    </main>
  );
}
