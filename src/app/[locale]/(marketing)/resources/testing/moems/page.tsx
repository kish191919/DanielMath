import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Trophy, CalendarClock, ListChecks, Users, CheckCircle, Award, BookOpen, ExternalLink } from "lucide-react";
import { Container } from "@/components/site/container";
import { Section, SectionHeader } from "@/components/site/section";
import { hasLocale, localePath, type Locale } from "@/lib/i18n";
import { pageAlternates } from "@/lib/seo";
import { cn } from "@/lib/utils";

type Props = { params: Promise<{ locale: string }> };

export function generateStaticParams() {
  return [{ locale: "ko" }, { locale: "en" }];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(locale)) return {};
  const alt = pageAlternates(locale, "/resources/testing/moems");
  return locale === "ko"
    ? {
        title: "MOEMS 수학 올림피아드란? 학부모 가이드",
        description: "대회 방식, 응시 규정, 채점, 시상 내역까지 — 학부모를 위한 MOEMS(초·중등 수학 올림피아드) 완전 가이드.",
        alternates: alt,
      }
    : {
        title: "What Is MOEMS? A Parent's Guide",
        description: "Format, test-day rules, scoring, and awards — everything parents need to know about the Math Olympiads for Elementary and Middle Schools (MOEMS).",
        alternates: alt,
      };
}

const formatStats = [
  {
    icon: CalendarClock,
    value: "5",
    label: "Contests",
    labelKo: "회의 대회",
    desc: "Held roughly once a month from November through March.",
    descKo: "11월부터 3월까지 매달 한 번씩, 총 5회에 걸쳐 진행됩니다.",
  },
  {
    icon: ListChecks,
    value: "5 / 30",
    label: "Problems · Minutes",
    labelKo: "문제 수 · 제한시간(분)",
    desc: "Each contest is a single paper test with 5 problems to solve in 30 minutes.",
    descKo: "매 대회는 문제 5개로 구성된 시험지 한 장이며, 제한시간은 30분입니다.",
  },
  {
    icon: Users,
    value: "35",
    label: "Max Team Size",
    labelKo: "팀 최대 인원",
    desc: "Schools may enter a team of up to 35 students.",
    descKo: "학교별로 최대 35명까지 팀을 구성해 참가할 수 있습니다.",
  },
];

const rules = [
  {
    en: "All students take every test on the same day, at the same time, in the same place — the exact schedule is set by the school's Olympiad coordinator.",
    ko: "모든 참가 학생은 같은 날짜, 같은 시간, 같은 장소에서 시험을 봅니다. 정확한 일정은 학교의 대회 담당 선생님(PICO)이 정합니다.",
  },
  {
    en: "A missed test cannot be made up later, and there is no partial refund for a missed contest.",
    ko: "시험을 놓치면 나중에 다시 볼 수 없으며, 결시에 대한 부분 환불도 제공되지 않습니다.",
  },
  {
    en: "Tests are administered after school, in a quiet setting.",
    ko: "시험은 방과 후, 조용한 장소에서 진행됩니다.",
  },
  {
    en: "Students work alone and receive only the question sheet, a pencil, and one sheet of scrap paper — calculators, rulers, graph paper, and other aids are not permitted.",
    ko: "학생은 혼자 문제를 풀며, 문제지·연필·연습장 한 장만 주어집니다. 계산기, 자, 모눈종이 등 다른 도구는 사용할 수 없습니다.",
  },
  {
    en: "Parents may attend, but may not interact with their child in any way until the contest has concluded.",
    ko: "학부모님은 참관하실 수 있지만, 시험이 끝날 때까지는 아이와 어떤 방식으로도 소통할 수 없습니다.",
  },
  {
    en: "Problems that introduce more advanced concepts include all the definitions students need — no outside knowledge is assumed.",
    ko: "더 어려운 개념이 등장하는 문제라도 필요한 정의는 문제 안에 함께 제공되므로, 별도의 배경지식이 없어도 풀이가 가능합니다.",
  },
];

const scoring = [
  {
    en: "One point for each correct answer.",
    ko: "맞은 문제 하나당 1점입니다.",
  },
  {
    en: "Student Score (0–25): once all 5 contests are complete, each student's score is the total number of problems answered correctly across the whole season.",
    ko: "개인 점수(0~25점): 5회 대회가 모두 끝나면, 시즌 전체에서 맞힌 문제 수를 합산한 개인 점수가 나옵니다.",
  },
  {
    en: "Team Score (0–250): the sum of a school's ten highest student scores after the fifth contest.",
    ko: "팀 점수(0~250점): 5회차 대회 이후, 학교에서 가장 높은 점수를 받은 10명의 점수를 합산한 값입니다.",
  },
];

const sampleTests = [
  {
    key: "divisionE",
    href: "https://drive.google.com/file/d/1w8AkMWqMAHPidIEfAs9044xp-bjRSTHT/view",
    title: "Division E",
    label: "Grades 4–6 (Elementary)",
    labelKo: "초등 4~6학년",
    featured: true,
  },
  {
    key: "divisionM",
    href: "https://drive.google.com/file/d/1ODkoRxVl1YZl9dFQ8zALe92uR-KLs8a4/view",
    title: "Division M",
    label: "Grades 6–8 (Middle School)",
    labelKo: "중학교 6~8학년",
    featured: false,
  },
];

const awards = [
  { en: "All students receive a certificate of participation.", ko: "전체 참가 학생에게 참가 인증서가 주어집니다." },
  { en: "The highest individual scorer at each school receives a medal.", ko: "학교별 최고 득점자에게는 메달 1개가 수여됩니다." },
  { en: "Roughly the top 50% of participating students receive an award patch.", ko: "전체 참가 학생 중 상위 약 50%에게는 어워드 패치가 주어집니다." },
  { en: "The top 10% of scores receive a silver pin; the top 2% receive a gold pin.", ko: "상위 10%에게는 실버 핀, 상위 2%에게는 골드 핀이 수여됩니다." },
  { en: "A perfect score of 25 earns the George Lenchner Medallion.", ko: "만점(25점)을 받은 학생에게는 특별한 George Lenchner 메달리온이 주어집니다." },
];

export default async function MoemsPage({ params }: Props) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();
  const lp = (path: string) => localePath(locale as Locale, path);
  const isKo = locale === "ko";

  return (
    <>
      {/* Header */}
      <section className="border-b border-navy-100 bg-white py-12 sm:py-16">
        <Container>
          <Link
            href={lp("/resources/testing")}
            className={`inline-flex items-center gap-1.5 rounded-full border border-navy-200 bg-white px-4 py-1.5 text-sm font-medium text-navy-600 shadow-sm transition hover:border-navy-400 hover:text-navy-900 hover:shadow${isKo ? " font-ko" : ""}`}
          >
            <ArrowLeft className="h-3.5 w-3.5 shrink-0" />
            {isKo ? "시험 & 대회 일정으로 돌아가기" : "Back to Test Calendar"}
          </Link>
          <div className="mt-6 text-center">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-600 text-white">
              <Trophy className="h-8 w-8" />
            </div>
            <h1 className={`mt-4 text-3xl font-bold tracking-tight text-navy-900 sm:text-4xl${isKo ? " font-ko" : ""}`}>
              {isKo ? "MOEMS란 무엇인가요?" : "What Is MOEMS?"}
            </h1>
            <p className="mt-1 text-sm text-navy-500">
              Math Olympiads for Elementary and Middle Schools
            </p>
          </div>
        </Container>
      </section>

      {/* Overview */}
      <Section>
        <Container>
          <SectionHeader
            eyebrow={isKo ? "대회 소개" : "About the Competition"}
            title={isKo ? "전 세계가 함께 푸는 수학 올림피아드" : "A Math Olympiad Students Take Worldwide"}
            isKo={isKo}
          />
          <div className="mx-auto mt-8 max-w-2xl space-y-4">
            <p className={`text-sm leading-7 text-navy-700${isKo ? " font-ko" : ""}`}>
              {isKo
                ? "MOEMS는 미국을 비롯해 전 세계 39개국, 12만 명이 넘는 학생이 참가하는 대표적인 초·중등 수학 경시대회입니다. 단순히 빠르게 계산하는 능력이 아니라, 다양한 전략으로 스스로 생각해 문제를 해결하는 힘을 키우는 데 목적이 있습니다."
                : "MOEMS is one of the most widely recognized elementary and middle school math competitions, with over 120,000 students participating across 39 countries. Rather than testing fast calculation, it's designed to build creative, out-of-the-box problem-solving skills."}
            </p>
            <p className={`text-sm leading-7 text-navy-700${isKo ? " font-ko" : ""}`}>
              {isKo
                ? "여러 전략을 배우고, 그 전략들을 상황에 맞게 유연하게 적용하는 연습을 통해 아이들은 수학적 창의성과 사고의 유연함을 기를 수 있습니다."
                : "By learning multiple problem-solving strategies and practicing when to apply each one, students build mathematical flexibility, creativity, and ingenuity."}
            </p>
          </div>
        </Container>
      </Section>

      {/* Format */}
      <Section className="bg-navy-50/50">
        <Container>
          <SectionHeader
            eyebrow={isKo ? "대회 진행 방식" : "Competition Format"}
            title={isKo ? "5번의 대회, 각 30분" : "5 Contests, 30 Minutes Each"}
            isKo={isKo}
          />
          <div className="mt-10 grid gap-5 sm:grid-cols-3">
            {formatStats.map((s) => (
              <div key={s.label} className="rounded-2xl border border-purple-200 bg-purple-50 p-6 text-center shadow-sm">
                <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-purple-600 text-white">
                  <s.icon className="h-5 w-5" />
                </div>
                <p className="mt-3 text-2xl font-bold text-navy-900">{s.value}</p>
                <p className={`text-xs font-semibold text-navy-600${isKo ? " font-ko" : ""}`}>
                  {isKo ? s.labelKo : s.label}
                </p>
                <p className={`mt-2 text-xs leading-5 text-navy-700${isKo ? " font-ko" : ""}`}>
                  {isKo ? s.descKo : s.desc}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Test day rules */}
      <Section>
        <Container>
          <SectionHeader
            eyebrow={isKo ? "응시 규정" : "Test-Day Rules"}
            title={isKo ? "시험 당일, 이렇게 진행됩니다" : "How Test Day Works"}
            isKo={isKo}
          />
          <ul className="mx-auto mt-8 max-w-2xl space-y-3">
            {rules.map((r) => (
              <li key={r.en} className="flex items-start gap-3 rounded-xl border border-navy-100 bg-white px-5 py-4 text-sm shadow-sm">
                <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-purple-600" />
                <span className={`leading-6 text-navy-700${isKo ? " font-ko" : ""}`}>{isKo ? r.ko : r.en}</span>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* Scoring */}
      <Section className="bg-navy-50/50">
        <Container>
          <SectionHeader
            eyebrow={isKo ? "채점 방식" : "Scoring"}
            title={isKo ? "개인 점수와 팀 점수" : "Student Score & Team Score"}
            isKo={isKo}
          />
          <ul className="mx-auto mt-8 max-w-2xl space-y-3">
            {scoring.map((s) => (
              <li key={s.en} className="flex items-start gap-3 rounded-xl border border-navy-100 bg-white px-5 py-4 text-sm shadow-sm">
                <ListChecks className="mt-0.5 h-4 w-4 shrink-0 text-purple-600" />
                <span className={`leading-6 text-navy-700${isKo ? " font-ko" : ""}`}>{isKo ? s.ko : s.en}</span>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* Awards */}
      <Section>
        <Container>
          <SectionHeader
            eyebrow={isKo ? "시상 내역" : "Awards"}
            title={isKo ? "대회가 끝나면 받게 되는 상" : "What Students Earn"}
            isKo={isKo}
          />
          <ul className="mx-auto mt-8 max-w-2xl space-y-3">
            {awards.map((a) => (
              <li key={a.en} className="flex items-start gap-3 rounded-xl border border-navy-100 bg-white px-5 py-4 text-sm shadow-sm">
                <Award className="mt-0.5 h-4 w-4 shrink-0 text-purple-600" />
                <span className={`leading-6 text-navy-700${isKo ? " font-ko" : ""}`}>{isKo ? a.ko : a.en}</span>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* Sample problems */}
      <Section>
        <Container>
          <SectionHeader
            eyebrow={isKo ? "직접 풀어보기" : "Try It Yourself"}
            title={isKo ? "샘플 문제 풀어보기" : "Try Sample Problems"}
            isKo={isKo}
          />
          <p className={`mx-auto mt-5 max-w-2xl text-center text-sm leading-7 text-navy-700${isKo ? " font-ko" : ""}`}>
            {isKo
              ? "MOEMS에서 공식적으로 제공하는 무료 샘플 콘테스트로, 실제 대회와 동일한 형식의 문제를 미리 풀어볼 수 있습니다."
              : "These are official, free sample contests provided directly by MOEMS — the same format as the real thing."}
          </p>
          <div className="mx-auto mt-8 grid max-w-2xl gap-4 sm:grid-cols-2">
            {sampleTests.map((t) => (
              <a
                key={t.key}
                href={t.href}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "flex items-center gap-3 rounded-2xl border p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md",
                  t.featured ? "border-purple-300 bg-purple-50" : "border-navy-100 bg-white",
                )}
              >
                <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white", t.featured ? "bg-purple-600" : "bg-navy-700")}>
                  <ExternalLink className="h-4.5 w-4.5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-navy-900">
                    {isKo ? "샘플 문제 다운로드" : "Download Sample"} — {t.title}
                  </p>
                  <p className={`mt-0.5 text-xs text-navy-600${isKo ? " font-ko" : ""}`}>
                    {isKo ? t.labelKo : t.label}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </Container>
      </Section>

      {/* Study materials */}
      <Section className="bg-navy-50/50">
        <Container>
          <SectionHeader
            eyebrow={isKo ? "준비 방법" : "How to Prepare"}
            title={isKo ? "주 1시간이면 충분합니다" : "One Hour a Week Is Enough"}
            isKo={isKo}
          />
          <div className="mx-auto mt-8 max-w-2xl rounded-2xl border border-navy-100 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex items-start gap-3">
              <BookOpen className="mt-0.5 h-5 w-5 shrink-0 text-purple-600" />
              <p className={`text-sm leading-7 text-navy-700${isKo ? " font-ko" : ""}`}>
                {isKo
                  ? "대회를 준비하는 학생은 보통 매주 1시간 정도 꾸준히 연습하는 것으로 충분합니다. 등록 시 아래와 같은 학습 자료가 함께 제공됩니다:"
                  : "Students who register typically only need about one hour of practice each week. The following study materials are provided along the way:"}
              </p>
            </div>
            <ul className="mt-4 space-y-2 pl-8 text-sm text-navy-700">
              <li className={`list-disc leading-6${isKo ? " font-ko" : ""}`}>
                {isKo ? "최근 2년간 출제된 문제 50개와 상세 해설" : "50 problems with detailed solutions from the previous two years"}
              </li>
              <li className={`list-disc leading-6${isKo ? " font-ko" : ""}`}>
                {isKo ? "매주 제공되는 Problem of the Week" : "A weekly \"Problem of the Week\""}
              </li>
              <li className={`list-disc leading-6${isKo ? " font-ko" : ""}`}>
                {isKo ? "MOEMS에서 별도로 구매한 추가 연습문제" : "Supplemental practice problems purchased from MOEMS"}
              </li>
              <li className={`list-disc leading-6${isKo ? " font-ko" : ""}`}>
                {isKo ? "참고 도서 \"What Every Young Mathlete Should Know\"" : "The reference book \"What Every Young Mathlete Should Know\""}
              </li>
            </ul>
          </div>
        </Container>
      </Section>

      {/* CTA */}
      <Section>
        <Container>
          <div className="mx-auto max-w-2xl rounded-2xl border border-navy-100 bg-white p-8 text-center shadow-sm">
            <h2 className={`text-xl font-bold text-navy-900${isKo ? " font-ko" : ""}`}>
              {isKo ? "MOEMS 준비, Daniel Math Academy와 함께하세요" : "Prepare for MOEMS with Daniel Math Academy"}
            </h2>
            <p className={`mx-auto mt-3 max-w-lg text-sm leading-7 text-navy-700${isKo ? " font-ko" : ""}`}>
              {isKo
                ? "문제 풀이 전략부터 실전 감각까지, 아이의 수준에 맞춰 MOEMS 준비를 도와드립니다."
                : "From problem-solving strategies to contest-day readiness, we help students prepare for MOEMS at their own level."}
            </p>
            <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href={lp("/inquire")}
                className={`inline-flex items-center gap-2 rounded-xl bg-navy-900 px-6 py-3 text-sm font-semibold text-white hover:bg-navy-700${isKo ? " font-ko" : ""}`}
              >
                {isKo ? "무료 상담 신청" : "Schedule a Free Consult"}
              </Link>
              <Link
                href={lp("/resources/testing")}
                className={`inline-flex items-center gap-2 rounded-xl border border-navy-200 px-6 py-3 text-sm font-semibold text-navy-700 hover:bg-navy-50${isKo ? " font-ko" : ""}`}
              >
                {isKo ? "다른 시험 보기" : "Other Tests & Competitions"}
              </Link>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
