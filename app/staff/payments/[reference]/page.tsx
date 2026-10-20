import { StripePaymentDetail } from "@/components/staff/StripePaymentDetail";
export default async function Page({ params }: { params: Promise<{ reference: string }> }) {
  const { reference } = await params;
  return <StripePaymentDetail reference={reference} />;
}
