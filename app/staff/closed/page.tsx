"use client";

import { QueueView } from "@/components/staff/QueueView";

export default function ClosedOrders() {
  return (
    <QueueView
      title="Closed Orders"
      subtitle="Submitted to the government agency. Read-only history — reopen from the queue only by release and re-claim."
      preset={{ status: "SUBMITTED" }}
    />
  );
}
