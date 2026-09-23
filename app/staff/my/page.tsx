"use client";

import { QueueView } from "@/components/staff/QueueView";

export default function MyWork() {
  return (
    <QueueView
      title="My Work"
      subtitle="Your open claimed orders, most urgent first. Advance each one to Submitted, then pick another from the queue."
      preset={{ assigned: "mine", openOnly: true, attentionFirst: true }}
      empty={{
        title: "Your work is clear.",
        hint: "Claim your next order from the queue.",
        actionLabel: "Go to Open Orders",
        actionHref: "/staff",
      }}
    />
  );
}
