import Link from "next/link";
import { Container } from "./container";
import { siteConfig } from "@/lib/site-config";

export function SiteFooter() {
  return (
    <footer className="border-t border-navy-100 bg-navy-50">
      <Container className="py-12">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <Link href="/" className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-navy-900">
                {siteConfig.name}
              </span>
              <span className="text-sm text-navy-600 font-ko" lang="ko">
                {siteConfig.nameKo}
              </span>
            </Link>
            <p className="mt-3 max-w-sm text-sm leading-6 text-navy-700 font-ko" lang="ko">
              북버지니아 한인 K-6 학생을 위한 영재 수학 공부방.
              AAP·CogAT·AMC 8 통합 커리큘럼.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-navy-900">
              Quick Links
            </h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link href="/programs" className="text-navy-700 hover:text-navy-900">
                  Program / 프로그램
                </Link>
              </li>
              <li>
                <Link href="/tuition" className="text-navy-700 hover:text-navy-900">
                  Tuition / 수업료
                </Link>
              </li>
              <li>
                <Link href="/inquire" className="text-navy-700 hover:text-navy-900">
                  Inquire / 상담 신청
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-navy-900">
              Contact
            </h3>
            <ul className="mt-4 space-y-2 text-sm text-navy-700">
              <li>
                <a href={`mailto:${siteConfig.contactEmail}`} className="hover:text-navy-900">
                  {siteConfig.contactEmail}
                </a>
              </li>
              <li className="font-ko" lang="ko">
                {siteConfig.region} 일대 (정확한 주소는 상담 시 안내)
              </li>
              <li>
                <Link href="/inquire" className="font-medium text-navy-900 hover:underline">
                  상담 신청 →
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-navy-200 pt-6 text-xs text-navy-600 sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} {siteConfig.name}. All rights reserved.</p>
          <p className="font-ko" lang="ko">
            본 사이트는 13세 미만 학생의 개인정보를 직접 수집하지 않습니다 (COPPA 준수).
          </p>
        </div>
      </Container>
    </footer>
  );
}
