import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { hasLocale, type Locale } from "@/lib/i18n";
import { SiteHeader } from "@/components/site/header";
import { SiteFooter } from "@/components/site/footer";
import { UtilityBar } from "@/components/site/utility-bar";

export function generateStaticParams() {
  return [{ locale: "ko" }, { locale: "en" }];
}

export default async function MarketingLayout({
  children,
  params,
}: Readonly<{
  children: ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();

  return (
    <>
      <UtilityBar locale={locale as Locale} />
      <SiteHeader locale={locale as Locale} />
      <main className="flex-1">{children}</main>
      <SiteFooter locale={locale as Locale} />
    </>
  );
}
