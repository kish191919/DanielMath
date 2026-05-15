import Link from "next/link";
import { Container } from "./container";
import { siteConfig } from "@/lib/site-config";
import { localePath, type Locale } from "@/lib/i18n";

export function SiteFooter({ locale }: { locale: Locale }) {
  const isKo = locale === "ko";
  const lp = (path: string) => localePath(locale, path);

  return (
    <footer className="border-t border-navy-100 bg-navy-50">
      <Container className="py-12">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <Link href={lp("/")} className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-navy-900">
                {siteConfig.name}
              </span>
              {isKo && (
                <span className="text-sm text-navy-600 font-ko" lang="ko">
                  {siteConfig.nameKo}
                </span>
              )}
            </Link>
            <p
              className={`mt-3 max-w-sm text-sm leading-6 text-navy-700${isKo ? " font-ko" : ""}`}
              lang={isKo ? "ko" : undefined}
            >
              {isKo
                ? "북버지니아 한인 3-6학년 학생을 위한 영재 수학 아카데미. AAP·CogAT 통합 커리큘럼."
                : "A boutique math studio for 3rd–6th grade students in Northern Virginia. AAP and CogAT curriculum."}
            </p>
          </div>

          <div>
            <h3 className={`text-sm font-semibold uppercase tracking-wider text-navy-900${isKo ? " font-ko" : ""}`}>
              {isKo ? "바로가기" : "Quick Links"}
            </h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link href={lp("/programs")} className={`text-navy-700 hover:text-navy-900${isKo ? " font-ko" : ""}`}>
                  {isKo ? "프로그램" : "Programs"}
                </Link>
              </li>
              <li>
                <Link href={lp("/resources")} className={`text-navy-700 hover:text-navy-900${isKo ? " font-ko" : ""}`}>
                  {isKo ? "수학 자료" : "Resources"}
                </Link>
              </li>
              <li>
                <Link href={lp("/inquire")} className={`text-navy-700 hover:text-navy-900${isKo ? " font-ko" : ""}`}>
                  {isKo ? "상담 신청" : "Inquire"}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3
              className={`text-sm font-semibold uppercase tracking-wider text-navy-900${isKo ? " font-ko" : ""}`}
            >
              {isKo ? "수학 자료" : "Math Resources"}
            </h3>
            <ul
              className={`mt-4 space-y-2 text-sm${isKo ? " font-ko" : ""}`}
              lang={isKo ? "ko" : undefined}
            >
              <li>
                <Link href={lp("/resources/curriculum")} className="text-navy-700 hover:text-navy-900">
                  {isKo ? "학년별 커리큘럼" : "Curriculum by Grade"}
                </Link>
              </li>
              <li>
                <Link href={lp("/resources/sol")} className="text-navy-700 hover:text-navy-900">
                  {isKo ? "Virginia SOL 기준" : "Virginia SOL Standards"}
                </Link>
              </li>
              <li>
                <Link href={lp("/resources/testing")} className="text-navy-700 hover:text-navy-900">
                  {isKo ? "시험 & 대회 일정" : "Test & Competition Calendar"}
                </Link>
              </li>
              <li>
                <Link href={lp("/school-calendar")} className="text-navy-700 hover:text-navy-900">
                  {isKo ? "학교 캘린더" : "School Calendar"}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className={`text-sm font-semibold uppercase tracking-wider text-navy-900${isKo ? " font-ko" : ""}`}>
              {isKo ? "연락처" : "Contact"}
            </h3>
            <ul className="mt-4 space-y-2 text-sm text-navy-700">
              <li>
                <a href={`mailto:${siteConfig.contactEmail}`} className="hover:text-navy-900">
                  {siteConfig.contactEmail}
                </a>
              </li>
              <li className={isKo ? "font-ko" : ""} lang={isKo ? "ko" : undefined}>
                {isKo
                  ? `${siteConfig.region} 일대 (정확한 주소는 상담 시 안내)`
                  : `${siteConfig.region} (exact location shared upon inquiry)`}
              </li>
              <li>
                <Link href={lp("/inquire")} className={`font-medium text-navy-900 hover:underline${isKo ? " font-ko" : ""}`}>
                  {isKo ? "상담 신청 →" : "Get in touch →"}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-navy-200 pt-6 text-xs text-navy-600 sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} {siteConfig.name}. All rights reserved.</p>
          <p className={isKo ? "font-ko" : ""} lang={isKo ? "ko" : undefined}>
            {isKo
              ? "본 사이트는 13세 미만 학생의 개인정보를 직접 수집하지 않습니다 (COPPA 준수)."
              : "This site does not directly collect personal information from children under 13 (COPPA compliant)."}
          </p>
        </div>
      </Container>
    </footer>
  );
}
