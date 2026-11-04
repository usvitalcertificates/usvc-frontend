"use client";

import { QueueView } from "@/components/staff/QueueView";

export default function ClosedOrders() {
  return (
    <QueueView
      title="Closed Orders"
      subtitle="Sent to the government agency — view history, replace PDFs, and add internal notes."
      preset={{ status: "SUBMITTED", hideAssignment: true }}
      empty={{
        title: "No submitted orders yet.",
        hint: "Closed orders appear here after submission to the agency.",
      }}
    />
  );
}
