"use client";

import * as React from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Container } from "./container";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const [open, setOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-navy-100 bg-white/85 backdrop-blur supports-[backdrop-filter]:bg-white/70">
      <Container>
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-baseline gap-2">
            <span className="text-lg font-bold tracking-tight text-navy-900">
              {siteConfig.name}
            </span>
            <span className="hidden text-sm text-navy-600 sm:inline font-ko" lang="ko">
              {siteConfig.nameKo}
            </span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {siteConfig.nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-md px-3 py-2 text-sm font-medium text-navy-700 hover:bg-navy-50 hover:text-navy-900"
              >
                <span>{item.label}</span>
                <span className="ml-1.5 text-navy-500" lang="ko">
                  {item.labelKo}
                </span>
              </Link>
            ))}
            <div className="ml-3">
              <Button href="/inquire" size="md">
                상담 신청
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
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2.5 text-base font-medium text-navy-800 hover:bg-navy-50"
              >
                {item.label}
                <span className="ml-2 text-navy-500" lang="ko">
                  {item.labelKo}
                </span>
              </Link>
            ))}
            <div className="mt-2">
              <Button href="/inquire" size="lg" className="w-full">
                상담 신청 / Inquire
              </Button>
            </div>
          </nav>
        </Container>
      </div>
    </header>
  );
}
