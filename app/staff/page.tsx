"use client";

import { QueueView } from "@/components/staff/QueueView";

export default function StaffQueue() {
  return (
    <QueueView
      title="Open Orders"
      subtitle="Paid orders ready for review and processing. Claim an order to see its full details — every access is logged."
      preset={{ openOnly: true }}
      showKpis
    />
  );
}
