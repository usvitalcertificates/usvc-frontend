"use client";

import { CheckoutElementsProvider } from "@stripe/react-stripe-js/checkout";
import { loadStripe, type Stripe } from "@stripe/stripe-js";
import { Lock, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { PageHeader } from "../../usvc-ui";
import { STRIPE_APPEARANCE, StripeCheckoutForm } from "./stripe-checkout-form";

const api = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
const SUPPORT_EMAIL = "support@usvitalcertificates.org";

function formatUSD(cents: number): string {
  return (cents / 100).toLocaleString("en-US", { style: "currency", currency: "USD" });
}

const CERT_NAMES: Record<string, string> = {
  BIRTH: "Birth Certificate",
  DEATH: "Death Certificate",
  MARRIAGE: "Marriage Certificate",
  DIVORCE: "Divorce Certificate",
};

interface Summary {
  _id: string;
  publicNumber: string;
  stateName: string;
  certificate: string;
  copies: number;
  rush: boolean;
  destinationType: "domestic" | "international";
  pricing: { serviceCents: number; bundleCents: number; rushCents: number; totalCents: number };
  amountCents: number;
  paymentStatus: string;
}

export default function Checkout({ params }: { params: Promise<{ orderId: string }> }) {
  const router = useRouter();
  const [orderId, setOrderId] = useState("");
  const [order, setOrder] = useState<Summary | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [stripe, setStripe] = useState<Stripe | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [setupError, setSetupError] = useState<string | null>(null);
  const finalizing = useRef(false);

  useEffect(() => {
    params.then(({ orderId: id }) => setOrderId(id)).catch(() => undefined);
  }, [params]);

  useEffect(() => {
    if (!orderId) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`${api}/orders/${orderId}/summary`);
        if (!res.ok) throw new Error("missing");
        const summary = (await res.json()) as Summary;
        if (cancelled) return;
        setOrder(summary);
        const [configRes, sessionRes] = await Promise.all([
          fetch(`${api}/orders/checkout-config`),
          fetch(`${api}/orders/${orderId}/checkout-session`, { method: "POST" }),
        ]);
        if (!configRes.ok || !sessionRes.ok) throw new Error("setup");
        const { publishableKey } = (await configRes.json()) as { publishableKey: string };
        const session = (await sessionRes.json()) as {
          alreadyPaid?: boolean;
          clientSecret: string | null;
          amountCents: number;
        };
        if (cancelled) return;
        if (session.alreadyPaid) {
          router.replace(`/order/confirmation/${orderId}`);
          return;
        }
        if (!session.clientSecret) throw new Error("setup");
        const stripeInstance = await loadStripe(publishableKey);
        if (cancelled) return;
        setStripe(stripeInstance);
        setClientSecret(session.clientSecret);
      } catch {
        if (!cancelled) {
          setSetupError(
            `We could not start the payment for this order. Please contact ${SUPPORT_EMAIL}.`,
          );
        }
      } finally {
        if (!cancelled) setLoaded(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [orderId, router]);

  async function handlePaid({ sessionId }: { sessionId: string }) {
    if (!order || finalizing.current) return;
    finalizing.current = true;
    try {
      const res = await fetch(`${api}/orders/checkout-session/confirm`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ sessionId }),
      });
      const verified = (await res.json()) as { paid?: boolean };
      if (!res.ok || !verified.paid) throw new Error("Payment was not completed.");
      router.push(`/order/confirmation/${orderId}?session_id=${sessionId}`);
    } catch {
      finalizing.current = false;
      throw new Error("Payment was not completed.");
    }
  }

  if (!loaded) {
    return (
      <main>
        <section className="page-section">
          <div className="container">
            <p>Loading your order…</p>
          </div>
        </section>
      </main>
    );
  }

  if (!order) {
    return (
      <main>
        <PageHeader
          eyebrow="Checkout"
          title="Secure Checkout"
          subtitle="Review your totals and authorize payment."
        />
        <section className="page-section">
          <div className="container">
            <h2>We could not find that order</h2>
            <p>
              This checkout link is no longer available on this device. Start a new request, or
              contact {SUPPORT_EMAIL} for help.
            </p>
            <Link href="/find-your-state" className="button button-primary">
              Start a New Request
            </Link>
          </div>
        </section>
      </main>
    );
  }

  const certName = CERT_NAMES[order.certificate] ?? "Certificate";
  const perCopy = order.copies > 0 ? Math.round(order.pricing.serviceCents / order.copies) : 0;

  return (
    <main>
      <PageHeader
        eyebrow={`Order ${order.publicNumber}`}
        title="Secure Checkout"
        subtitle="Review your totals and authorize payment. Your certificate request is forwarded for processing after payment is confirmed."
      />
      <section className="page-section">
        <div className="container checkout-grid">
          <div>
            <div className="trust-badges">
              <span>
                <Lock aria-hidden="true" /> Encrypted submission
              </span>
              <span>
                <ShieldCheck aria-hidden="true" /> Card data is never stored by USVC
              </span>
            </div>
            <div className="all-inclusive-note">
              <p>
                <strong>One all-inclusive payment</strong>
              </p>
              <p>
                The total shown includes USVC processing, the Government / Agency Fee &amp; Shipping
                bundle, and Rush Processing when selected. No second customer payment is required
                for this order.
              </p>
            </div>
            {setupError ? (
              <div role="alert" className="checkout-alert checkout-alert-spaced">
                <p>
                  <strong>Payment Could Not Be Started</strong>
                </p>
                <p>{setupError}</p>
              </div>
            ) : null}
            {!setupError && clientSecret && stripe ? (
              <CheckoutElementsProvider
                stripe={stripe}
                options={{ clientSecret, elementsOptions: { appearance: STRIPE_APPEARANCE } }}
              >
                <StripeCheckoutForm amountCents={order.amountCents} onPaid={handlePaid} />
              </CheckoutElementsProvider>
            ) : null}
            {!setupError && !clientSecret ? (
              <p className="checkout-loading">Preparing secure payment…</p>
            ) : null}
          </div>
          <div aria-label="Order summary" className="checkout-summary">
            <p>
              <strong>
                {order.stateName} {certName}
              </strong>
            </p>
            <p className="muted">
              Number of copies: {order.copies} certified {order.copies === 1 ? "copy" : "copies"}
            </p>
            <ul>
              <li>
                <div>
                  <span>Online Processing Fee</span>
                  <span>
                    <strong>{formatUSD(order.pricing.serviceCents)}</strong>
                  </span>
                </div>
                <p className="muted">
                  {formatUSD(perCopy)} per copy × {order.copies}
                </p>
              </li>
              {order.pricing.rushCents > 0 ? (
                <li>
                  <div>
                    <span>Rush Processing</span>
                    <span>
                      <strong>{formatUSD(order.pricing.rushCents)}</strong>
                    </span>
                  </div>
                </li>
              ) : null}
              <li>
                <div>
                  <span>Government / Agency Fee &amp; Shipping</span>
                  <span>
                    <strong>{formatUSD(order.pricing.bundleCents)}</strong>
                  </span>
                </div>
                <p className="muted">
                  {order.destinationType === "international" ? "International" : "Domestic"} bundle
                  × {order.copies}
                </p>
              </li>
              <li className="total-row">
                <div>
                  <span>
                    <strong>TOTAL</strong>
                  </span>
                  <span className="total-amount">
                    <strong>{formatUSD(order.amountCents)}</strong>
                  </span>
                </div>
              </li>
            </ul>
            <p className="disclosure">
              This total includes the USVC Processing Fee, the Government / Agency Fee &amp;
              Shipping bundle, and Rush Processing when selected.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
