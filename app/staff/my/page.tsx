"use client";

import { QueueView } from "@/components/staff/QueueView";

export default function MyWork() {
  return (
    <QueueView
      title="My Work"
      subtitle="Orders claimed by you. Advance each one to Submitted, then pick another from the queue."
      preset={{ assigned: "mine" }}
    />
  );
}
