"use client";
import { useEffect, useState, type FormEvent } from "react";
import { recoveryJson, recoveryDraft, type RecoveryApplication } from "@/lib/recovery-client";
import { OrderForm } from "@/app/state/[state]/[certificate]/order-form";
export default function ResumePage() {
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
            setOrders(v.applications);
            setNextCursor(v.nextCursor);
          }
        })
        .catch(() => {});
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
  async function verify(event: FormEvent) {
    event.preventDefault();
    await act(async () => {
      await recoveryJson("/verify", { method: "POST", body: JSON.stringify({ token, code }) });
      setToken("");
      setCode("");
      const result = await recoveryJson<{
        applications: RecoveryApplication[];
        nextCursor: string | null;
      }>("/applications");
      setOrders(result.applications);
      setNextCursor(result.nextCursor);
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
        {selected ? (
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
          <section className="recovery-card">
            <h2>Saved applications</h2>
            {orders.length ? (
              orders.map((order) => (
                <article className="recovery-order" key={order.id}>
                  <div>
                    <h3>{order.publicNumber}</h3>
                    <p>
                      {order.stateName} · {order.certificate.toLowerCase()} certificate
                    </p>
                    <p>
                      {new Date(order.createdAt).toLocaleDateString()} ·{" "}
                      {(order.amountCents / 100).toLocaleString("en-US", {
                        style: "currency",
                        currency: order.currency,
                      })}{" "}
                      ·{" "}
                      {order.processing
                        ? "payment needs checking"
                        : order.paymentStatus.toLowerCase()}
                    </p>
                  </div>
                  <div className="button-row">
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
                          Complete payment
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
            <p>Links expire in 7 days. Access expires 30 minutes after email verification.</p>
          </section>
        )}
      </div>
    </main>
  );
}
