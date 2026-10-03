"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

/**
 * Legacy checkout route (pre straight-through payment). Orders now pay on the
 * application form; any bookmarked/in-flight checkout link resolves on the
 * confirmation page, which verifies paid state by order id.
 */
export default function CheckoutRedirect({ params }: { params: Promise<{ orderId: string }> }) {
  const router = useRouter();
  const [orderId, setOrderId] = useState("");

  useEffect(() => {
    params.then(({ orderId: id }) => setOrderId(id)).catch(() => undefined);
  }, [params]);

  useEffect(() => {
    if (orderId) router.replace(`/order/confirmation/${orderId}`);
  }, [orderId, router]);

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
