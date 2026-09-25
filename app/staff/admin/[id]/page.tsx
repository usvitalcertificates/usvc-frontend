import { redirect } from "next/navigation";

export default async function LegacyStaffAnalyticsDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/staff/admin/staff-analytics/${id}`);
}
