import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { CalendarDays, Info } from "lucide-react";
import { Container } from "@/components/site/container";
import { Section, SectionHeader } from "@/components/site/section";
import { testEvents } from "@/lib/curriculum-data";
import { hasLocale, localePath, type Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

type Props = { params: Promise<{ locale: string }> };

const colorMap = {
  navy: "border-navy-300 bg-navy-50",
  gold: "border-gold-400/60 bg-amber-50",
  green: "border-emerald-300 bg-emerald-50",
  purple: "border-purple-300 bg-purple-50",
};
const badgeMap = {
  navy: "bg-navy-900 text-white",
  gold: "bg-gold-500 text-white",
  green: "bg-emerald-600 text-white",
  purple: "bg-purple-600 text-white",
};

const aapTimeline = [
  { step: "01", when: "Oct", whenKo: "10월 초", title: "Referral Window Opens", titleKo: "AAP 의뢰 접수 시작", desc: "Parents, teachers, or students may submit an AAP screening referral. Contact your school's AAP coordinator.", descKo: "학부모, 교사, 학생 본인이 AAP 스크리닝 의뢰서를 제출할 수 있습니다. 각 학교 AAP 담당자에게 문의하세요.", color: "navy" as const },
  { step: "02", when: "Dec", whenKo: "12월 초", title: "Referral Window Closes", titleKo: "AAP 의뢰 접수 마감", desc: "After the deadline it is difficult to participate in that year's screening. Submit on time.", descKo: "마감일 이후에는 당해 연도 스크리닝에 참여하기 어렵습니다. 늦지 않게 제출하세요.", color: "navy" as const },
  { step: "03", when: "Jan–Feb", whenKo: "1~2월", title: "Ability Testing (CogAT + NNAT)", titleKo: "능력 검사 시행", desc: "The school administers CogAT (verbal, quantitative, nonverbal reasoning) and NNAT (nonverbal) tests.", descKo: "학교에서 CogAT(언어·수리·비언어 추론)와 NNAT(비언어적 추론) 검사가 진행됩니다.", color: "gold" as const },
  { step: "04", when: "Feb–Mar", whenKo: "2~3월", title: "Portfolio Review", titleKo: "포트폴리오 & 추가 자료 제출", desc: "Report cards, work samples, and teacher evaluations are submitted to the selection committee.", descKo: "성적표, 작품 샘플, 교사 평가서 등 학생의 학업 역량을 보여주는 자료가 평가위원회에 제출됩니다.", color: "gold" as const },
  { step: "05", when: "Apr", whenKo: "4월", title: "Placement Notification", titleKo: "배치 결과 통보", desc: "FCPS mails placement letters to families. Full-Time AAP starts at a designated center school the following year.", descKo: "FCPS가 가정에 배치 결과 서한을 발송합니다. Full-Time AAP는 다음 학년부터 지정 센터 학교에서 시작됩니다.", color: "green" as const },
  { step: "06", when: "Sep (next yr)", whenKo: "다음 학년 9월", title: "AAP Program Begins", titleKo: "AAP 프로그램 시작", desc: "Full-Time AAP students transfer to their assigned center school. Part-Time (Level III) students remain at their home school.", descKo: "Full-Time AAP 학생은 배정된 AAP 센터 학교로 이동합니다. Part-Time(Level III)은 현재 학교에서 수업을 받습니다.", color: "green" as const },
];

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(locale)) return {};
  return locale === "ko"
    ? { title: "시험 & 대회 일정", description: "Fairfax County AAP 스크리닝 (CogAT/NNAT), Virginia SOL 시험, MOEMS 등 수학 관련 시험과 대회 일정을 한국어로 안내합니다." }
    : { title: "Test & Competition Calendar", description: "AAP screening (CogAT/NNAT), Virginia SOL tests, MOEMS, and more — all test and competition calendars for Fairfax County students." };
}

export default async function TestingPage({ params }: Props) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();
  const lp = (path: string) => localePath(locale as Locale, path);
  const isKo = locale === "ko";

  return (
    <>
      {/* Hero */}
      <section className="border-b border-navy-100 bg-white py-14 sm:py-20">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <Link href={lp("/resources")} className={`text-sm text-navy-500 hover:text-navy-700${isKo ? " font-ko" : ""}`}>
              {isKo ? "← 자료 센터로 돌아가기" : "← Back to Resources"}
            </Link>
            <h1 className={`mt-4 text-4xl font-bold tracking-tight text-navy-900 sm:text-5xl${isKo ? " font-ko" : ""}`}>
              {isKo ? "시험 & 대회 일정" : "Test & Competition Calendar"}
            </h1>
            <p className={`mx-auto mt-5 max-w-2xl text-sm leading-7 text-navy-700${isKo ? " font-ko" : ""}`}>
              {isKo
                ? "Fairfax County 학생들이 알아야 할 주요 수학 관련 시험과 대회 일정을 정리했습니다. AAP 스크리닝부터 SOL 시험까지 한 곳에서 확인하세요."
                : "Key math tests and competitions for Fairfax County students — from AAP screening to SOL tests, all in one place."}
            </p>
          </div>
        </Container>
      </section>

      {/* AAP Timeline */}
      <Section className="bg-navy-50/50">
        <Container>
          <SectionHeader
            eyebrow={isKo ? "가장 중요한 일정" : "Most Important Timeline"}
            title={isKo ? "AAP 스크리닝 & 배치 전체 흐름" : "AAP Screening & Placement Process"}
            titleKo={isKo ? "단계별로 알아보는 AAP 과정" : undefined}
            description={isKo
              ? "처음이라면 이 과정이 낯설 수 있습니다. 10월부터 다음 해 9월까지 이어지는 전체 과정을 아래에서 확인하세요."
              : "New to AAP? The process runs from October through September of the following year. Here's every step."}
          />
          <div className="relative mt-12">
            <div className="absolute left-[22px] top-0 h-full w-0.5 bg-navy-200 sm:left-[38px]" />
            <div className="space-y-6">
              {aapTimeline.map((step) => (
                <div key={step.step} className="relative flex gap-5 sm:gap-7">
                  <div
                    className={cn(
                      "relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white sm:h-[4.5rem] sm:w-[4.5rem]",
                      step.color === "green" ? "bg-emerald-600" : step.color === "gold" ? "bg-gold-500" : "bg-navy-900",
                    )}
                  >
                    {step.step}
                  </div>
                  <div className={cn("flex-1 rounded-2xl border p-5 shadow-sm", colorMap[step.color])}>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-bold", badgeMap[step.color])}>
                        {isKo ? step.whenKo : step.when}
                      </span>
                      <h3 className={`text-sm font-bold text-navy-900${isKo ? " font-ko" : ""}`}>
                        {isKo ? step.titleKo : step.title}
                      </h3>
                    </div>
                    <p className={`mt-2 text-sm leading-6 text-navy-700${isKo ? " font-ko" : ""}`}>
                      {isKo ? step.descKo : step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-8 flex items-start gap-3 rounded-xl border border-navy-200 bg-white px-5 py-4 text-sm text-navy-700">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-navy-400" />
            <p className={`leading-6${isKo ? " font-ko" : ""}`}>
              {isKo
                ? <>정확한 일정은 매 학년도마다 달라질 수 있습니다. 학교 공지와 <a href="https://www.fcps.edu/academics/academic-overview/advanced-academics" target="_blank" rel="noopener noreferrer" className="font-semibold underline underline-offset-2">FCPS 공식 페이지</a>를 함께 확인하세요.</>
                : <>Exact dates vary each school year. Always confirm with your school and the <a href="https://www.fcps.edu/academics/academic-overview/advanced-academics" target="_blank" rel="noopener noreferrer" className="font-semibold underline underline-offset-2">FCPS official AAP page</a>.</>
              }
            </p>
          </div>
        </Container>
      </Section>

      {/* All Tests */}
      <Section>
        <Container>
          <SectionHeader
            eyebrow={isKo ? "전체 시험 & 대회" : "All Tests & Competitions"}
            title={isKo ? "시험별 일정 & 특징" : "Test Calendar & Details"}
          />
          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            {testEvents.map((ev) => (
              <div
                key={ev.name}
                className={cn("rounded-2xl border p-6 shadow-sm", colorMap[ev.color])}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 text-navy-500" />
                    <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-bold", badgeMap[ev.color])}>
                      {isKo ? ev.whenKo : ev.when}
                    </span>
                  </div>
                  <span className="rounded-full border border-navy-200 bg-white px-2 py-0.5 text-xs font-semibold text-navy-600">
                    {isKo ? ev.gradesKo : ev.grades}
                  </span>
                </div>
                <h3 className="mt-3 text-base font-bold text-navy-900">{ev.name}</h3>
                {isKo && (
                  <p className="mt-0.5 text-sm font-semibold text-navy-700 font-ko" lang="ko">
                    {ev.nameKo}
                  </p>
                )}
                <p className="mt-2 text-sm leading-6 text-navy-700">
                  {ev.description}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Prep CTA */}
      <Section className="bg-navy-50/60">
        <Container>
          <div className="mx-auto max-w-2xl rounded-2xl border border-navy-100 bg-white p-8 text-center shadow-sm">
            <h2 className={`text-xl font-bold text-navy-900${isKo ? " font-ko" : ""}`}>
              {isKo ? "시험 준비, Daniel Math Academy와 함께하세요" : "Prepare for These Tests with Daniel Math Academy"}
            </h2>
            <p className={`mx-auto mt-3 max-w-lg text-sm leading-7 text-navy-700${isKo ? " font-ko" : ""}`}>
              {isKo
                ? "AAP 스크리닝(CogAT/NNAT), SOL 시험 — 모든 시험에 맞춘 커리큘럼을 개인별로 설계합니다."
                : "AAP screening (CogAT/NNAT), SOL tests — we build a curriculum tailored to each student's test goals."}
            </p>
            <Link
              href={lp("/inquire")}
              className={`mt-6 inline-flex items-center gap-2 rounded-xl bg-navy-900 px-6 py-3 text-sm font-semibold text-white hover:bg-navy-700${isKo ? " font-ko" : ""}`}
            >
              {isKo ? "무료 상담 신청 →" : "Schedule a Free Consult →"}
            </Link>
          </div>
        </Container>
      </Section>
    </>
  );
}
