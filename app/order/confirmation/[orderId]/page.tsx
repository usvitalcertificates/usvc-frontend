"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

import { trackGoogleAdsPurchase } from "../../../analytics";
import { trackOpenAIOrderCreated } from "../../../openai-analytics";

const api = "/api/backend";

function formatUSD(cents: number): string {
  return (cents / 100).toLocaleString("en-US", { style: "currency", currency: "USD" });
}

function ConfirmationBody({ orderId }: { orderId: string }) {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [state, setState] = useState<"verifying" | "paid" | "unverified">("verifying");
  const [receipt, setReceipt] = useState<{ publicNumber: string; amountCents: number } | null>(
    null,
  );

  useEffect(() => {
    // Straight-through flow: no session_id — resolve the paid receipt by order id.
    if (!sessionId) {
      if (!orderId) return;
      let cancelled = false;
      (async () => {
        try {
          const res = await fetch(`${api}/orders/${orderId}/summary`);
          const body = (await res.json()) as {
            paid?: boolean;
            paymentStatus?: string;
            publicNumber?: string;
            amountCents?: number;
          };
          if (cancelled) return;
          const paid = body.paid === true || body.paymentStatus?.toLowerCase() === "paid";
          if (res.ok && paid) {
            setReceipt({
              publicNumber: body.publicNumber ?? orderId,
              amountCents: body.amountCents ?? 0,
            });
            setState("paid");
          } else {
            setState("unverified");
          }
        } catch {
          if (!cancelled) setState("unverified");
        }
      })();
      return () => {
        cancelled = true;
      };
    }
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`${api}/orders/checkout-session/confirm`, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ sessionId }),
        });
        const body = (await res.json()) as {
          paid?: boolean;
          publicNumber?: string;
          amountCents?: number;
        };
        if (cancelled) return;
        if (res.ok && body.paid) {
          setReceipt({
            publicNumber: body.publicNumber ?? orderId,
            amountCents: body.amountCents ?? 0,
          });
          setState("paid");
        } else {
          setState("unverified");
        }
      } catch {
        if (!cancelled) setState("unverified");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [sessionId, orderId]);

  useEffect(() => {
    if (state === "paid" && receipt && orderId) {
      trackGoogleAdsPurchase(receipt.publicNumber, receipt.amountCents);
      let eventId: string | undefined;
      try {
        eventId = sessionStorage.getItem(`usvc:oaiq:event-id:${orderId}`) ?? undefined;
      } catch {
        eventId = undefined;
      }
      trackOpenAIOrderCreated(orderId, receipt.amountCents, eventId);
    }
  }, [state, receipt, orderId]);

  return (
    <main>
      <section className="page-section">
        <div className="container confirmation-wrap">
          {state === "verifying" ? (
            <>
              <h1>Verifying your payment…</h1>
              <p>Please wait while we confirm your payment with our payment provider.</p>
            </>
          ) : state === "paid" && receipt ? (
            <>
              <p className="eyebrow">Order {receipt.publicNumber}</p>
              <h1>Thank you for your order</h1>
              <p>
                Your payment of {formatUSD(receipt.amountCents)} is confirmed. USVC will review your
                submitted information before it is forwarded for processing.
              </p>
              <p>Reference: {receipt.publicNumber}</p>
              <div className="button-row">
                <Link className="button button-primary" href="/track-order">
                  Track your order
                </Link>
              </div>
            </>
          ) : (
            <>
              <h1>Thank you for your order</h1>
              <p>
                Your payment is being verified. We’ll email your order number and tracking link when
                verification is complete.
              </p>
              <p className="notice">Your payment is being verified.</p>
              <Link className="button" href="/track-order">
                Track an order
              </Link>
              <p>Reference: {orderId}</p>
            </>
          )}
        </div>
      </section>
    </main>
  );
}

export default function Confirmation({ params }: { params: Promise<{ orderId: string }> }) {
  const [orderId, setOrderId] = useState("");
  useEffect(() => {
    params.then(({ orderId: id }) => setOrderId(id)).catch(() => undefined);
  }, [params]);
  return (
    <Suspense>
      <ConfirmationBody orderId={orderId} />
    </Suspense>
  );
}
