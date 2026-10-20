import { UnpaidOrderDetail } from "@/components/staff/UnpaidOrderDetail";
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <UnpaidOrderDetail id={id} />;
}
