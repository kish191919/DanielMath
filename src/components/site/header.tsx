"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Container } from "./container";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/site-config";
import { localePath, type Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function SiteHeader({ locale }: { locale: Locale }) {
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();
  const isKo = locale === "ko";
  const lp = (path: string) => localePath(locale, path);

  const altHref = isKo
    ? `/en${pathname === "/" ? "" : pathname}`
    : pathname.replace(/^\/en/, "") || "/";

  return (
    <header className="sticky top-0 z-40 w-full border-b border-navy-100 bg-white/85 backdrop-blur supports-[backdrop-filter]:bg-white/70">
      <Container>
        <div className="flex h-16 items-center justify-between">
          <Link href={lp("/")} className="flex items-baseline gap-2">
            <span className="text-lg font-bold tracking-tight text-navy-900" lang={isKo ? "ko" : undefined}>
              {isKo ? siteConfig.nameKo : siteConfig.name}
            </span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {siteConfig.nav.map((item) => (
              <Link
                key={item.href}
                href={lp(item.href)}
                className="rounded-md px-3 py-2 text-sm font-medium text-navy-700 hover:bg-navy-50 hover:text-navy-900"
                lang={isKo ? "ko" : undefined}
              >
                {isKo ? item.labelKo : item.label}
              </Link>
            ))}
            <Link
              href={altHref}
              className="rounded-md px-2.5 py-1.5 text-xs font-medium text-navy-500 hover:bg-navy-50 hover:text-navy-900"
            >
              {isKo ? "English" : "한국어"}
            </Link>
            <div className="ml-3">
              <Button href="/login" size="md">
                {isKo ? "로그인 / Login" : "Login"}
              </Button>
            </div>
          </nav>

          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="inline-flex h-10 w-10 items-center justify-center rounded-md text-navy-900 hover:bg-navy-50 md:hidden"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </Container>

      <div
        className={cn(
          "border-t border-navy-100 bg-white md:hidden",
          open ? "block" : "hidden",
        )}
      >
        <Container className="py-3">
          <nav className="flex flex-col gap-1">
            {siteConfig.nav.map((item) => (
              <Link
                key={item.href}
                href={lp(item.href)}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2.5 text-base font-medium text-navy-800 hover:bg-navy-50"
                lang={isKo ? "ko" : undefined}
              >
                {isKo ? item.labelKo : item.label}
              </Link>
            ))}
            <Link
              href={altHref}
              onClick={() => setOpen(false)}
              className="rounded-md px-3 py-2.5 text-sm font-medium text-navy-600 hover:bg-navy-50"
            >
              {isKo ? "English version" : "한국어 버전"}
            </Link>
            <div className="mt-2">
              <Button href="/login" size="lg" className="w-full">
                {isKo ? "로그인 / Login" : "Login"}
              </Button>
            </div>
          </nav>
        </Container>
      </div>
    </header>
  );
}
