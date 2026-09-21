"use client";

import { PaymentElement, useCheckout } from "@stripe/react-stripe-js/checkout";
import type { Appearance } from "@stripe/stripe-js";
import Link from "next/link";
import { useState } from "react";

export const STRIPE_APPEARANCE: Appearance = {
  theme: "flat",
  variables: {
    fontFamily: '"Times New Roman", Times, serif',
    colorPrimary: "#b22234",
    colorText: "#000000",
    colorBackground: "#ffffff",
    colorDanger: "#b22234",
    borderRadius: "6px",
    fontSizeBase: "17px",
    spacingUnit: "5px",
  },
  rules: {
    ".Label": { color: "#3c3b6e", fontWeight: "700" },
    ".Input": { border: "1px solid #c9c9c9", boxShadow: "none", padding: "10px 12px" },
    ".Input:focus": { border: "1px solid #3c3b6e", outline: "2px solid #3c3b6e" },
    ".Input--invalid": { border: "1px solid #b22234", color: "#000000" },
    ".Tab--selected": { borderColor: "#3c3b6e", color: "#3c3b6e" },
  },
};

function formatUSD(cents: number): string {
  return (cents / 100).toLocaleString("en-US", { style: "currency", currency: "USD" });
}

export function StripeCheckoutForm({
  amountCents,
  onPaid,
}: {
  amountCents: number;
  onPaid: (input: { sessionId: string }) => Promise<void>;
}) {
  const checkout = useCheckout();
  const [authorized, setAuthorized] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (checkout.type === "loading") {
    return <p className="checkout-loading">Loading secure payment fields…</p>;
  }

  if (checkout.type === "error") {
    return (
      <div role="alert" className="checkout-alert">
        <p>
          <strong>Payment Could Not Be Started</strong>
        </p>
        <p>{checkout.error.message}</p>
      </div>
    );
  }

  const session = checkout.checkout;

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (processing || checkout.type !== "success") return;
    if (!authorized) {
      setError("Please authorize the charge to continue.");
      return;
    }
    setProcessing(true);
    setError(null);
    try {
      const validation = await checkout.checkout.validateElements();
      if (validation.type === "error") {
        setError(validation.error.message);
        setProcessing(false);
        return;
      }
      const result = await checkout.checkout.confirm();
      if (result.type === "error") {
        setError(result.error.message);
        setProcessing(false);
        return;
      }
      await onPaid({ sessionId: result.session.id });
    } catch {
      setError(
        "Your order information has been saved. Please check your card details or try another payment method.",
      );
      setProcessing(false);
    }
  }

  return (
    <>
      {error ? (
        <div role="alert" className="checkout-alert checkout-alert-spaced">
          <p>
            <strong>Payment Could Not Be Completed</strong>
          </p>
          <p>{error}</p>
        </div>
      ) : null}
      <form onSubmit={handleSubmit} className="checkout-form" noValidate>
        <div>
          <h2>Payment Information</h2>
          <p>Enter your card information below to securely pay your online processing fees.</p>
        </div>
        <PaymentElement options={{ layout: "tabs" }} />
        <div className="secure-payment-note">
          <p>
            <strong>One secure payment</strong>
          </p>
          <p>
            Your complete order total is processed through Stripe. USVC never stores your full card
            number, expiration date, or security code.
          </p>
        </div>
        <label className="checkout-authorize">
          <input
            type="checkbox"
            checked={authorized}
            onChange={(event) => setAuthorized(event.target.checked)}
          />
          <span>
            I authorize USVC to charge the complete total of {formatUSD(amountCents)}, and I have
            read the <Link href="/terms-of-service">Refund &amp; Cancellation Policy</Link>.
          </span>
        </label>
        <button
          type="submit"
          className="button button-primary button-full"
          disabled={processing || !session.canConfirm}
        >
          {processing ? "Processing your payment…" : `Pay ${formatUSD(amountCents)}`}
        </button>
        <p aria-live="polite" className="sr-only">
          {processing ? "Processing your payment, please wait." : ""}
        </p>
      </form>
    </>
  );
}
