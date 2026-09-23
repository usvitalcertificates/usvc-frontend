"use client";

import { QueueView } from "@/components/staff/QueueView";

export default function ClosedOrders() {
  return (
    <QueueView
      title="Closed Orders"
      subtitle="Submitted to the government agency — read-only history."
      preset={{ status: "SUBMITTED", hideAssignment: true }}
      empty={{
        title: "No submitted orders yet.",
        hint: "Closed orders appear here after submission to the agency.",
      }}
    />
  );
}
