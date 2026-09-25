"use client";

import StaffAnalyticsPage from "@/app/staff/admin/[id]/page";

const SELF_PARAMS = Promise.resolve({ id: "self" });

export default function MyAnalyticsPage() {
  return <StaffAnalyticsPage params={SELF_PARAMS} selfMode />;
}
