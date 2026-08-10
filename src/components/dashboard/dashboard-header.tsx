import Link from "next/link";
import { Container } from "@/components/site/container";
import { siteConfig } from "@/lib/site-config";
import { signOutAction } from "@/lib/auth/actions";
import type { Role } from "@/lib/supabase/types";

export function DashboardHeader({ email, role }: { email: string; role: Role }) {
  const isParent = role === "parent";
  return (
    <header className="border-b border-navy-100 bg-white print:hidden">
      <Container>
        <div className="flex h-14 items-center justify-between gap-2">
          <Link href="/dashboard" className="flex min-w-0 items-baseline gap-2">
            <span className="truncate text-base font-bold tracking-tight text-navy-900">
              {siteConfig.name}
            </span>
            {isParent ? (
              <span className="hidden text-xs text-navy-600 sm:inline">Dashboard</span>
            ) : (
              <span className="hidden text-xs text-navy-600 sm:inline font-ko" lang="ko">
                대시보드
              </span>
            )}
          </Link>
          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <span className="hidden text-xs text-navy-600 sm:inline">{email}</span>
            <Link
              href="/"
              className="rounded-md border border-navy-200 px-2.5 py-1.5 text-xs font-medium text-navy-700 hover:bg-navy-50 sm:px-3"
            >
              {isParent ? "Home" : "홈페이지"}
            </Link>
            <form action={signOutAction}>
              <button
                type="submit"
                className="rounded-md border border-navy-200 px-2.5 py-1.5 text-xs font-medium text-navy-700 hover:bg-navy-50 sm:px-3"
              >
                {isParent ? "Log Out" : "로그아웃"}
              </button>
            </form>
          </div>
        </div>
      </Container>
    </header>
  );
}
