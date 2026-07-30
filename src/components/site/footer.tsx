import Link from "next/link";
import Image from "next/image";
import { Mail, MapPin, Clock, Phone } from "lucide-react";
import { Container } from "./container";
import { siteConfig } from "@/lib/site-config";
import { localePath, type Locale } from "@/lib/i18n";

export function SiteFooter({ locale }: { locale: Locale }) {
  const isKo = locale === "ko";
  const lp = (path: string) => localePath(locale, path);

  const navLinks = [
    { href: "/programs", label: "Programs", labelKo: "프로그램" },
    { href: "/resources", label: "Math Curriculum", labelKo: "수학 교육과정" },
    { href: "/school-calendar", label: "School Calendar", labelKo: "학교 캘린더" },
    { href: "/blog", label: "Blog", labelKo: "블로그" },
  ];

  const resourceLinks = [
    { href: "/resources/curriculum", label: "Curriculum by Grade", labelKo: "학년별 커리큘럼" },
    { href: "/resources/sol", label: "Virginia SOL Standards", labelKo: "Virginia SOL 기준" },
    { href: "/resources/testing", label: "Test & Competition Calendar", labelKo: "시험 & 대회 일정" },
  ];

  return (
    <footer className="border-t border-navy-100 bg-navy-50">
      <Container className="py-12">
        <div className="grid grid-cols-2 gap-x-6 gap-y-8 sm:gap-10 lg:grid-cols-[2fr_1fr_1fr_1.2fr]">

          {/* Brand */}
          <div className="col-span-2 lg:col-span-1">
            <Link href={lp("/")} className="flex items-center gap-2">
              <Image
                src="/brand/daniel-math-academy-logo.png"
                alt={siteConfig.name}
                width={44}
                height={44}
                className="h-11 w-11 rounded-full"
              />
              <span className="text-lg font-bold text-navy-900">{siteConfig.name}</span>
              {isKo && (
                <span className="text-sm text-navy-600 font-ko" lang="ko">
                  {siteConfig.nameKo}
                </span>
              )}
            </Link>
            <p
              className={`mt-3 max-w-xs text-sm leading-6 text-navy-600${isKo ? " font-ko" : ""}`}
              lang={isKo ? "ko" : undefined}
            >
              {isKo
                ? "북버지니아 한인 3–6학년을 위한 영재 수학 아카데미. AAP·CogAT 통합 커리큘럼, 4명 소수 정예."
                : "A gifted math academy for Korean-American families in Northern Virginia, grades 3–6. Integrated AAP & CogAT curriculum, small groups of 4."}
            </p>
            <p className={`mt-3 flex items-center gap-1.5 text-xs text-navy-500${isKo ? " font-ko" : ""}`}>
              <Clock className="h-3.5 w-3.5 shrink-0" />
              {isKo ? siteConfig.hoursKo : siteConfig.hours}
            </p>
          </div>

          {/* Site Navigation */}
          <div className="border-t border-navy-100 pt-6 lg:border-t-0 lg:pt-0">
            <h3 className={`text-xs font-semibold uppercase tracking-wider text-navy-900${isKo ? " font-ko" : ""}`}>
              {isKo ? "메뉴" : "Site"}
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {navLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={lp(item.href)}
                    className={`text-navy-600 hover:text-navy-900 transition-colors${isKo ? " font-ko" : ""}`}
                    lang={isKo ? "ko" : undefined}
                  >
                    {isKo ? item.labelKo : item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Math Resources */}
          <div className="border-t border-navy-100 pt-6 lg:border-t-0 lg:pt-0">
            <h3 className={`text-xs font-semibold uppercase tracking-wider text-navy-900${isKo ? " font-ko" : ""}`}>
              {isKo ? "수학 자료" : "Resources"}
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm" lang={isKo ? "ko" : undefined}>
              {resourceLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={lp(item.href)}
                    className={`text-navy-600 hover:text-navy-900 transition-colors${isKo ? " font-ko" : ""}`}
                  >
                    {isKo ? item.labelKo : item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="col-span-2 border-t border-navy-100 pt-6 lg:col-span-1 lg:border-t-0 lg:pt-0">
            <h3 className={`text-xs font-semibold uppercase tracking-wider text-navy-900${isKo ? " font-ko" : ""}`}>
              {isKo ? "연락처" : "Contact"}
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm text-navy-600">
              <li>
                <a
                  href={`mailto:${siteConfig.contactEmail}`}
                  className="flex items-center gap-1.5 hover:text-navy-900 transition-colors"
                >
                  <Mail className="h-3.5 w-3.5 shrink-0" />
                  {siteConfig.contactEmail}
                </a>
              </li>
              <li>
                <a
                  href={`tel:+1${siteConfig.telephone.replace(/\D/g, "")}`}
                  className="flex items-center gap-1.5 hover:text-navy-900 transition-colors"
                >
                  <Phone className="h-3.5 w-3.5 shrink-0" />
                  {siteConfig.telephone}
                </a>
              </li>
              <li className={`flex items-start gap-1.5${isKo ? " font-ko" : ""}`} lang={isKo ? "ko" : undefined}>
                <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                <span className="whitespace-pre-line">
                  {isKo
                    ? `${siteConfig.region} 일대\n(정확한 주소는 상담 시 안내)`
                    : `${siteConfig.region}\n(location shared upon inquiry)`}
                </span>
              </li>
            </ul>
            <Link
              href={lp("/inquire")}
              className={`mt-5 flex w-full items-center justify-center rounded-md bg-navy-900 px-4 py-2 text-center text-sm font-medium text-white hover:bg-navy-700 transition-colors sm:inline-flex sm:w-auto${isKo ? " font-ko" : ""}`}
            >
              {isKo ? "상담 신청" : "Inquire Now"}
            </Link>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-navy-200 pt-6 text-xs text-navy-500 sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} {siteConfig.name}. All rights reserved.</p>
          <Link href={lp("/privacy")} className="underline underline-offset-2 hover:text-navy-900">
            Privacy Policy
          </Link>
          <p>We do not directly collect personal data from children under 13 (COPPA compliant).</p>
          <p>{siteConfig.name} is operated by {siteConfig.legalName}.</p>
        </div>
      </Container>
    </footer>
  );
}
