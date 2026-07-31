import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ClipboardCheck, CalendarRange, Target, Award, CheckCircle, BookOpen, ExternalLink, Info, GraduationCap } from "lucide-react";
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
  const alt = pageAlternates(locale, "/resources/testing/virginia-sol");
  return locale === "ko"
    ? {
        title: "Virginia SOL 시험이란? 학부모 가이드",
        description: "시험 일정, 과목, 채점 기준, 기출문제까지 — 학부모를 위한 Virginia SOL(Standards of Learning) 시험 완전 가이드.",
        alternates: alt,
      }
    : {
        title: "What Is the Virginia SOL Test? A Parent's Guide",
        description: "Schedule, subjects, scoring, and past exams — everything parents need to know about the Virginia Standards of Learning (SOL) test.",
        alternates: alt,
      };
}

const formatStats = [
  {
    icon: CalendarRange,
    value: "3–8",
    label: "Grades Tested",
    labelKo: "응시 학년",
    desc: "Every student in Virginia public schools, grades 3 through 8, takes SOL tests each spring.",
    descKo: "버지니아 공립학교 3~8학년 전체 학생이 매년 봄 SOL 시험에 응시합니다.",
  },
  {
    icon: Target,
    value: "600",
    label: "Pass (Proficient)",
    labelKo: "Pass 기준 점수",
    desc: "A scaled score of 600 or higher (out of 800) is reported as Pass (Proficient).",
    descKo: "800점 만점 중 600점 이상이면 Pass(Proficient)로 보고됩니다.",
  },
  {
    icon: Award,
    value: "700",
    label: "Pass (Advanced)",
    labelKo: "Advanced 기준 점수",
    desc: "A scaled score of 700 or higher indicates Pass (Advanced Proficient) — mastery beyond grade level.",
    descKo: "700점 이상이면 Pass(Advanced Proficient)로, 학년 수준을 넘어선 이해도를 의미합니다.",
  },
];

const scheduleRows = [
  {
    grade: "Grade 3",
    gradeKo: "3학년",
    subjects: "Math, Reading",
    subjectsKo: "수학, 읽기",
  },
  {
    grade: "Grade 4",
    gradeKo: "4학년",
    subjects: "Math, Reading",
    subjectsKo: "수학, 읽기",
  },
  {
    grade: "Grade 5",
    gradeKo: "5학년",
    subjects: "Math, Reading, Science",
    subjectsKo: "수학, 읽기, 과학",
  },
  {
    grade: "Grade 6",
    gradeKo: "6학년",
    subjects: "Math, Reading",
    subjectsKo: "수학, 읽기",
  },
];

const whyItMatters = [
  {
    en: "Results feed into each school's state accreditation rating — a measure families and school boards use to gauge school performance.",
    ko: "시험 결과는 각 학교의 주 인증(accreditation) 등급에 반영되며, 이는 학부모와 교육위원회가 학교의 성과를 판단하는 지표로 활용됩니다.",
  },
  {
    en: "In some grades and subjects, scores are one factor schools consider for promotion decisions, alongside classroom grades and teacher input.",
    ko: "일부 학년·과목에서는 시험 점수가 성적, 교사 의견과 함께 진급 결정에 참고되는 요소 중 하나로 사용됩니다.",
  },
  {
    en: "SOL results help teachers and parents see, subject by subject, which grade-level standards a student has mastered and which need more practice.",
    ko: "SOL 결과는 학생이 어떤 학년 수준의 성취 기준을 이미 익혔고, 어떤 부분을 더 연습해야 하는지 과목별로 확인할 수 있게 해줍니다.",
  },
];

const practiceResources = [
  {
    key: "practice-items",
    href: "https://www.doe.virginia.gov/teaching-learning-assessment/student-assessment/sol-practice-items-all-subjects",
    label: "SOL Practice Items (Official VDOE)",
    labelKo: "SOL 연습문제 (VDOE 공식)",
    desc: "Downloadable practice items in the same online format students see on test day, including technology-enhanced items.",
    descKo: "실제 시험 화면과 동일한 형식의 연습문제로, 온라인 시험에서 나오는 기술 활용형(TEI) 문항도 포함됩니다.",
    featured: true,
  },
  {
    key: "released-tests",
    href: "https://www.doe.virginia.gov/teaching-learning-assessment/student-assessment/sol-practice-items-all-subjects/released-tests-item-sets-all-subjects",
    label: "Released Tests & Item Sets (Official VDOE)",
    labelKo: "역대 기출문제 & 문항 세트 (VDOE 공식)",
    desc: "Actual SOL tests from previous years, released by VDOE so families can see real past questions.",
    descKo: "VDOE가 공개한 이전 연도의 실제 SOL 기출문제로, 실전 문제 유형을 그대로 확인할 수 있습니다.",
    featured: false,
  },
];

export default async function VirginiaSolPage({ params }: Props) {
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
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-navy-900 text-white">
              <ClipboardCheck className="h-8 w-8" />
            </div>
            <h1 className={`mt-4 text-3xl font-bold tracking-tight text-navy-900 sm:text-4xl${isKo ? " font-ko" : ""}`}>
              {isKo ? "Virginia SOL 시험이란?" : "What Is the Virginia SOL Test?"}
            </h1>
            <p className="mt-1 text-sm text-navy-500">
              Virginia Standards of Learning Assessment
            </p>
          </div>
        </Container>
      </section>

      {/* Overview */}
      <Section>
        <Container>
          <SectionHeader
            eyebrow={isKo ? "시험 소개" : "About the Test"}
            title={isKo ? "버지니아 공교육의 핵심 평가" : "Virginia's Core Statewide Assessment"}
            isKo={isKo}
          />
          <div className="mx-auto mt-8 max-w-2xl space-y-4">
            <p className={`text-sm leading-7 text-navy-700${isKo ? " font-ko" : ""}`}>
              {isKo
                ? "Virginia SOL(Standards of Learning) 시험은 버지니아 주 교육부(VDOE)가 매년 봄에 실시하는 학년별 학업 성취도 평가입니다. 학생이 그 학년의 교육과정(SOL)을 얼마나 충실히 익혔는지를 측정하며, 버지니아 공립학교에 재학 중인 3~8학년 학생은 모두 응시 대상입니다."
                : "The Virginia Standards of Learning (SOL) test is a statewide assessment administered each spring by the Virginia Department of Education (VDOE). It measures how well a student has mastered that grade's SOL curriculum, and every student in grades 3–8 at a Virginia public school is required to take it."}
            </p>
            <p className={`text-sm leading-7 text-navy-700${isKo ? " font-ko" : ""}`}>
              {isKo
                ? "FCPS를 포함한 모든 버지니아 공립학교는 SOL을 기준으로 수업을 설계하기 때문에, SOL 시험은 학교 수업 내용을 그대로 반영합니다. 시험은 온라인으로 진행되며, 객관식 문항과 함께 드래그 앤 드롭, 빈칸 채우기 등 기술 활용형(technology-enhanced) 문항도 포함됩니다."
                : "FCPS and every other Virginia public school builds instruction around the SOL, so the test closely reflects what students already learn in class. It's administered online and includes multiple-choice questions along with technology-enhanced items like drag-and-drop and fill-in-the-blank."}
            </p>
          </div>
        </Container>
      </Section>

      {/* Format / key facts */}
      <Section className="bg-navy-50/50">
        <Container>
          <SectionHeader
            eyebrow={isKo ? "핵심 정보" : "Key Facts"}
            title={isKo ? "학년, 채점 기준 한눈에 보기" : "Grades and Scoring at a Glance"}
            isKo={isKo}
          />
          <div className="mt-10 grid gap-5 sm:grid-cols-3">
            {formatStats.map((s) => (
              <div key={s.label} className="rounded-2xl border border-navy-200 bg-white p-6 text-center shadow-sm">
                <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-navy-900 text-white">
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

      {/* Schedule table */}
      <Section>
        <Container>
          <SectionHeader
            eyebrow={isKo ? "학년별 응시 과목" : "Subjects by Grade"}
            title={isKo ? "초등 학년별 SOL 응시 과목" : "Elementary Grade Subject Schedule"}
            isKo={isKo}
          />
          <div className="mx-auto mt-8 max-w-2xl overflow-x-auto rounded-2xl border border-navy-100 bg-white shadow-sm touch-pan-x">
            <table className="w-full text-sm">
              <thead className="border-b border-navy-100 bg-navy-50">
                <tr>
                  <th className={`px-5 py-3.5 text-left font-semibold text-navy-900${isKo ? " font-ko" : ""}`}>
                    {isKo ? "학년" : "Grade"}
                  </th>
                  <th className={`px-5 py-3.5 text-left font-semibold text-navy-900${isKo ? " font-ko" : ""}`}>
                    {isKo ? "응시 과목" : "Subjects Tested"}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-50">
                {scheduleRows.map((r) => (
                  <tr key={r.grade} className="hover:bg-navy-50/40">
                    <td className={`px-5 py-4 font-bold text-navy-900${isKo ? " font-ko" : ""}`}>{isKo ? r.gradeKo : r.grade}</td>
                    <td className={`px-5 py-4 text-navy-700${isKo ? " font-ko" : ""}`}>{isKo ? r.subjectsKo : r.subjects}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mx-auto mt-6 flex max-w-2xl items-start gap-3 rounded-xl border border-navy-200 bg-white px-5 py-4 text-sm text-navy-700">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-navy-400" />
            <p className={`leading-6${isKo ? " font-ko" : ""}`}>
              {isKo
                ? "시험은 매년 4월 말부터 6월 초 사이에 진행되며, 정확한 날짜는 학교별로 다릅니다. 7~8학년을 포함한 전체 학년의 최신 일정은 아래 VDOE 공식 페이지에서 확인하세요."
                : "Testing takes place between late April and early June each year; exact dates vary by school. For the latest schedule across all grades, including 7–8, check the official VDOE page below."}
            </p>
          </div>
        </Container>
      </Section>

      {/* Sample tests / 기출문제 */}
      <Section className="bg-navy-50/50">
        <Container>
          <SectionHeader
            eyebrow={isKo ? "직접 풀어보기" : "Try It Yourself"}
            title={isKo ? "실제 SOL 기출문제 풀어보기" : "Try Real SOL Practice Items & Past Exams"}
            isKo={isKo}
          />
          <p className={`mx-auto mt-5 max-w-2xl text-center text-sm leading-7 text-navy-700${isKo ? " font-ko" : ""}`}>
            {isKo
              ? "버지니아 주 교육부(VDOE)가 공식적으로 제공하는 연습문제와 기출문제입니다. 실제 시험과 동일한 형식으로 미리 연습해볼 수 있습니다."
              : "These are official practice items and released past exams published directly by the Virginia Department of Education (VDOE) — the same format students see on test day."}
          </p>
          <div className="mx-auto mt-8 grid max-w-2xl gap-4 sm:grid-cols-1">
            {practiceResources.map((r) => (
              <a
                key={r.key}
                href={r.href}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "flex items-start gap-3 rounded-2xl border p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md",
                  r.featured ? "border-navy-300 bg-navy-50" : "border-navy-100 bg-white",
                )}
              >
                <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white", r.featured ? "bg-navy-900" : "bg-navy-700")}>
                  <ExternalLink className="h-4.5 w-4.5" />
                </div>
                <div>
                  <p className={`text-sm font-bold text-navy-900${isKo ? " font-ko" : ""}`}>
                    {isKo ? r.labelKo : r.label}
                  </p>
                  <p className={`mt-1 text-xs leading-5 text-navy-600${isKo ? " font-ko" : ""}`}>
                    {isKo ? r.descKo : r.desc}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </Container>
      </Section>

      {/* Why it matters */}
      <Section>
        <Container>
          <SectionHeader
            eyebrow={isKo ? "왜 중요한가요" : "Why It Matters"}
            title={isKo ? "SOL 점수가 사용되는 곳" : "How SOL Results Are Used"}
            isKo={isKo}
          />
          <ul className="mx-auto mt-8 max-w-2xl space-y-3">
            {whyItMatters.map((w) => (
              <li key={w.en} className="flex items-start gap-3 rounded-xl border border-navy-100 bg-white px-5 py-4 text-sm shadow-sm">
                <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-navy-600" />
                <span className={`leading-6 text-navy-700${isKo ? " font-ko" : ""}`}>{isKo ? w.ko : w.en}</span>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* How to prepare + cross-link */}
      <Section className="bg-navy-50/50">
        <Container>
          <SectionHeader
            eyebrow={isKo ? "준비 방법" : "How to Prepare"}
            title={isKo ? "학년별 성취 기준부터 확인하세요" : "Start With the Grade-Level Standards"}
            isKo={isKo}
          />
          <div className="mx-auto mt-8 max-w-2xl rounded-2xl border border-navy-100 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex items-start gap-3">
              <BookOpen className="mt-0.5 h-5 w-5 shrink-0 text-navy-600" />
              <p className={`text-sm leading-7 text-navy-700${isKo ? " font-ko" : ""}`}>
                {isKo
                  ? "SOL 시험을 준비하는 가장 효과적인 방법은 위의 공식 연습문제·기출문제를 꾸준히 풀어보면서, 아직 익히지 못한 학년별 성취 기준(SOL)을 파악해 보완하는 것입니다."
                  : "The most effective way to prepare is to work through the official practice items and past exams above, then identify which grade-level standards still need reinforcement."}
              </p>
            </div>
            <div className="mt-6">
              <Link
                href={lp("/resources/sol")}
                className={`inline-flex items-center gap-2 rounded-xl border border-navy-200 bg-navy-50 px-5 py-2.5 text-sm font-semibold text-navy-800 shadow-sm hover:bg-navy-100${isKo ? " font-ko" : ""}`}
              >
                <GraduationCap className="h-4 w-4" />
                {isKo ? "학년별 SOL 수학 기준 자세히 보기" : "View Grade-by-Grade SOL Math Standards"}
              </Link>
            </div>
          </div>
        </Container>
      </Section>

      {/* CTA */}
      <Section>
        <Container>
          <div className="mx-auto max-w-2xl rounded-2xl border border-navy-100 bg-white p-8 text-center shadow-sm">
            <h2 className={`text-xl font-bold text-navy-900${isKo ? " font-ko" : ""}`}>
              {isKo ? "SOL 시험 준비, Daniel Math Academy와 함께하세요" : "Prepare for the SOL Test with Daniel Math Academy"}
            </h2>
            <p className={`mx-auto mt-3 max-w-lg text-sm leading-7 text-navy-700${isKo ? " font-ko" : ""}`}>
              {isKo
                ? "학년별 SOL 성취 기준에 맞춰 부족한 개념을 채우고, 실전 문제 유형에 익숙해지도록 도와드립니다."
                : "We help students fill gaps against grade-level SOL standards and build familiarity with real test-item formats."}
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
