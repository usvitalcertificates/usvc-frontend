import { redirect } from "next/navigation";

export default async function LegacyOrderActivityDetail() {
  redirect("/staff/admin/orders-analytics");
}
