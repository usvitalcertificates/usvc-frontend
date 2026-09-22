"use client";

import { useState } from "react";
import { trackOrder } from "@/lib/api";
import { PageHeader } from "../usvc-ui";
import { trackAnalytics } from "../analytics";

type TrackingResult = {
  publicNumber: string;
  status: string;
  paymentStatus: string;
  certificate: string;
  stateCode: string;
};

export default function TrackOrder() {
  const [result, setResult] = useState<TrackingResult | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setError("");
    setResult(null);
    setLoading(true);
    try {
      setResult(await trackOrder(String(form.get("orderNumber")), String(form.get("email"))));
      trackAnalytics("track_order_submitted");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to track order");
    } finally {
      setLoading(false);
    }
  }
  return (
    <main>
      <PageHeader
        eyebrow="Order status"
        title="Track Your Order"
        subtitle="Enter the order number from your confirmation email along with the email address used on the order."
      />
      <section className="page-section track-page">
        <div className="container track-grid">
          <form className="track-form" onSubmit={submit}>
            <div>
              <label htmlFor="order-number">
                Order number <span>*</span>
              </label>
              <input
                id="order-number"
                name="orderNumber"
                placeholder="USVC-BT-08242026-000008"
                required
              />
            </div>
            <div>
              <label htmlFor="order-email">
                Email address <span>*</span>
              </label>
              <input id="order-email" name="email" type="email" required />
            </div>
            <button className="button button-primary" type="submit" disabled={loading}>
              {loading ? "Checking Status…" : "Check Status"}
            </button>
            <p>
              Lost your order number? Email support@usvitalcertificates.org and we will look it up
              for you.
            </p>
          </form>
          <div className="track-result">
            {error ? (
              <p className="track-error" role="alert">
                {error}
              </p>
            ) : null}
            {result ? (
              <div className="track-card">
                <h2>Order {result.publicNumber}</h2>
                <p>
                  {result.certificate} certificate · {result.stateCode}
                </p>
                <p>
                  <strong>Current Status: {result.status.replaceAll("_", " ")}</strong>
                </p>
                <p>Payment: {result.paymentStatus}</p>
              </div>
            ) : null}
            {!result && !error ? (
              <div className="track-info">
                <h2>What you will see</h2>
                <p>
                  Once your order number is verified, this panel shows your current status, the full
                  history of updates, and whether we need anything else from you.
                </p>
              </div>
            ) : null}
          </div>
        </div>
      </section>
    </main>
  );
}
