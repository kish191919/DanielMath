import Link from "next/link";
import { Container } from "@/components/site/container";
import { siteConfig } from "@/lib/site-config";
import { signOutAction } from "@/lib/auth/actions";

export function DashboardHeader({ email }: { email: string }) {
  return (
    <header className="border-b border-navy-100 bg-white print:hidden">
      <Container>
        <div className="flex h-14 items-center justify-between">
          <Link href="/dashboard" className="flex items-baseline gap-2">
            <span className="text-base font-bold tracking-tight text-navy-900">
              {siteConfig.name}
            </span>
            <span className="hidden text-xs text-navy-600 sm:inline font-ko" lang="ko">
              대시보드
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="hidden text-xs text-navy-600 sm:inline">{email}</span>
            <Link
              href="/"
              className="rounded-md border border-navy-200 px-3 py-1.5 text-xs font-medium text-navy-700 hover:bg-navy-50"
            >
              홈페이지
            </Link>
            <form action={signOutAction}>
              <button
                type="submit"
                className="rounded-md border border-navy-200 px-3 py-1.5 text-xs font-medium text-navy-700 hover:bg-navy-50"
              >
                로그아웃
              </button>
            </form>
          </div>
        </div>
      </Container>
    </header>
  );
}
