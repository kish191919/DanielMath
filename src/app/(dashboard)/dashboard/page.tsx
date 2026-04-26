import { redirect } from "next/navigation";
import { requireSession } from "@/lib/dal";

export default async function DashboardIndex() {
  const session = await requireSession();
  if (session.profile.role === "principal") redirect("/dashboard/principal");
  redirect("/dashboard/parent");
}
