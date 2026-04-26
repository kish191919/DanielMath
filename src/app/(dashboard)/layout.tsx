import type { Metadata } from "next";
import { requireSession } from "@/lib/dal";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardNav } from "@/components/dashboard/dashboard-nav";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireSession();

  return (
    <>
      <DashboardHeader email={session.email} />
      <DashboardNav role={session.profile.role} />
      <main className="flex-1 bg-navy-50/30">{children}</main>
    </>
  );
}
