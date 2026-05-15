import { SiteHeader } from "@/components/site/header";
import { SiteFooter } from "@/components/site/footer";
import { UtilityBar } from "@/components/site/utility-bar";

export default function MarketingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <UtilityBar />
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </>
  );
}
