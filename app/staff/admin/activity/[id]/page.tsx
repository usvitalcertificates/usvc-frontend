import { redirect } from "next/navigation";

export default async function LegacyOrderActivityDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/staff/admin/orders-analytics/${id}`);
}
