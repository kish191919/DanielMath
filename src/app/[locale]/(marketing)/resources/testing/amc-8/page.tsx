import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Trophy, Clock, ListChecks, ShieldCheck, CheckCircle, Award, BookOpen, Info, Milestone, ExternalLink } from "lucide-react";
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
  const alt = pageAlternates(locale, "/resources/testing/amc-8");
  return locale === "ko"
    ? {
        title: "AMC 8란 무엇인가요? 학부모 가이드",
        description: "응시 자격, 시험 형식, 등록 일정, 채점 및 시상 내역까지 — 학부모를 위한 AMC 8 완전 가이드.",
        alternates: alt,
      }
    : {
        title: "What Is AMC 8? A Parent's Guide",
        description: "Eligibility, exam format, registration dates, scoring, and awards — everything parents need to know about the AMC 8.",
        alternates: alt,
      };
}

const formatStats = [
  {
    icon: ListChecks,
    value: "25",
    label: "Questions",
    labelKo: "문항 수",
    desc: "25 multiple-choice questions covering middle-school-level math topics.",
    descKo: "중학교 수준의 수학 개념을 다루는 25개의 객관식 문항으로 구성됩니다.",
  },
  {
    icon: Clock,
    value: "40",
    label: "Minutes",
    labelKo: "제한시간(분)",
    desc: "Students have 40 minutes to work through all 25 questions.",
    descKo: "25문항을 모두 푸는 데 주어지는 시간은 40분입니다.",
  },
  {
    icon: ShieldCheck,
    value: "0",
    label: "Penalty for Wrong Answers",
    labelKo: "오답 감점",
    desc: "There is no penalty for incorrect or blank answers, so it's worth attempting every question.",
    descKo: "오답이나 무응답에 대한 감점이 없어 부담 없이 모든 문제에 도전할 수 있습니다.",
  },
];

const eligibility = [
  {
    en: "Open to any student in grade 8 or below who is under 15.5 years old on the day of the competition.",
    ko: "8학년 이하이면서 시험 당일 기준 만 15.5세 미만인 학생이라면 누구나 응시할 수 있습니다.",
  },
  {
    en: "Younger students (K–6) are welcome to try it — there is no minimum grade or age requirement.",
    ko: "유치원~6학년 등 더 어린 학생도 도전할 수 있으며, 별도의 최소 학년·연령 기준은 없습니다.",
  },
  {
    en: "Students register through a school or organization that serves as an official testing center — individual students cannot register directly with the MAA.",
    ko: "학생은 공식 시험장으로 등록된 학교나 기관을 통해 응시 신청을 합니다. 학생 개인이 MAA에 직접 등록할 수는 없습니다.",
  },
];

const scheduleRows = [
  {
    item: "Competition Window",
    itemKo: "시험 응시 기간",
    detail: "January 21 – 27, 2027 (exact day set by the school)",
    detailKo: "2027년 1월 21일 – 1월 27일 (구체적인 날짜는 학교에서 지정)",
  },
  {
    item: "Regular Registration Deadline",
    itemKo: "정규 등록 마감",
    detail: "January 5, 2027",
    detailKo: "2027년 1월 5일",
  },
  {
    item: "Late Registration Deadline",
    itemKo: "지연 등록 마감",
    detail: "January 14, 2027 (late fee applies)",
    detailKo: "2027년 1월 14일 (지연 등록 수수료 발생)",
  },
];

const rules = [
  {
    en: "No calculators, phones, or other electronic aids are permitted — only pencils, scratch paper, a ruler, and an eraser.",
    ko: "계산기, 휴대폰 등 전자기기는 일절 사용할 수 없습니다. 연필, 연습장, 자, 지우개만 허용됩니다.",
  },
  {
    en: "For digital administration, students may use a laptop or tablet with a single tab open to the competition.",
    ko: "온라인(디지털) 응시의 경우, 노트북이나 태블릿에서 시험 화면 탭 하나만 열어둔 상태로 응시합니다.",
  },
  {
    en: "No problem requires a calculator — the AMC 8 is designed to test reasoning and creative problem-solving, not computational speed.",
    ko: "계산기가 필요한 문제는 출제되지 않습니다. AMC 8은 빠른 계산이 아니라 논리적 사고력과 창의적 문제 해결력을 평가하기 위해 설계되었습니다.",
  },
  {
    en: "The exact test date and location within the window are set by the school's AMC Competition Manager.",
    ko: "응시 기간 내 정확한 시험 날짜와 장소는 학교의 AMC 담당 교사(Competition Manager)가 정합니다.",
  },
];

const scoring = [
  {
    en: "One point for each correct answer; no points are subtracted for wrong or blank answers.",
    ko: "정답 하나당 1점이며, 오답이나 무응답에 대한 감점은 없습니다.",
  },
  {
    en: "Final score ranges from 0 to 25.",
    ko: "최종 점수는 0점에서 25점 사이입니다.",
  },
];

const awards = [
  { en: "All students receive an official certificate of participation.", ko: "전체 참가 학생에게 공식 참가 인증서가 주어집니다." },
  { en: "Honor Roll recognizes roughly the top 5% of scorers (historically around 17–19 points).", ko: "상위 약 5%에 해당하는 학생에게 Honor Roll이 주어집니다 (통상 17~19점 내외)." },
  { en: "Distinguished Honor Roll (Distinction) recognizes roughly the top 1% of scorers (historically around 21–23 points).", ko: "상위 약 1%에 해당하는 학생에게는 Distinguished Honor Roll(Distinction)이 주어집니다 (통상 21~23점 내외)." },
  { en: "Achievement Honor Roll recognizes students below grade 6 who score 15 or higher — special recognition for young problem solvers.", ko: "6학년 미만 학생 중 15점 이상을 받은 경우 Achievement Honor Roll로 별도 인정받습니다." },
  { en: "A perfect score of 25 is recognized separately each year.", ko: "만점(25점)을 받은 학생은 매년 별도로 발표됩니다." },
];

const pathway = [
  {
    icon: Milestone,
    title: "AMC 10 / AMC 12",
    titleKo: "AMC 10 / AMC 12",
    desc: "Students in grade 9 and up move on to the AMC 10 or AMC 12, which lead to AIME and, for top scorers, the USAMO.",
    descKo: "9학년 이상이 되면 AMC 10 또는 AMC 12에 응시하게 되며, 이는 AIME, 그리고 상위권 학생의 경우 USAMO로 이어집니다.",
  },
  {
    icon: Trophy,
    title: "MATHCOUNTS",
    titleKo: "MATHCOUNTS",
    desc: "Many AMC 8 participants also compete in MATHCOUNTS, a middle-school competition with a similar problem-solving style.",
    descKo: "많은 AMC 8 참가자들이 비슷한 문제 해결 스타일을 가진 중학생 대상 대회인 MATHCOUNTS에도 함께 참가합니다.",
  },
];

const sampleTests = [
  {
    key: "2025",
    href: "https://live.poshenloh.com/images/past-contests/pdf/amc8-2025-exam.pdf",
    title: "2025 AMC 8",
    label: "Full exam PDF, 25 problems",
    labelKo: "전체 시험지 PDF, 25문항",
    featured: true,
  },
  {
    key: "2024",
    href: "https://live.poshenloh.com/images/past-contests/pdf/amc8-2024-exam.pdf",
    title: "2024 AMC 8",
    label: "Full exam PDF, 25 problems",
    labelKo: "전체 시험지 PDF, 25문항",
    featured: false,
  },
];

const solutionResources = [
  {
    key: "solutions",
    href: "https://live.poshenloh.com/past-contests",
    label: "Past Exams with Video & Written Solutions (1985–present)",
    labelKo: "역대 기출문제 + 동영상·서술형 해설 (1985년~현재)",
    featured: true,
  },
  {
    key: "aops",
    href: "https://artofproblemsolving.com/wiki/index.php/AMC_8_Problems_and_Solutions",
    label: "AoPS Wiki — AMC 8 Problems and Solutions Archive",
    labelKo: "AoPS 위키 — AMC 8 기출문제 및 해설 아카이브",
    featured: false,
  },
];

export default async function Amc8Page({ params }: Props) {
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
              {isKo ? "AMC 8란 무엇인가요?" : "What Is AMC 8?"}
            </h1>
            <p className="mt-1 text-sm text-navy-500">
              American Mathematics Competitions 8
            </p>
          </div>
        </Container>
      </section>

      {/* Overview */}
      <Section>
        <Container>
          <SectionHeader
            eyebrow={isKo ? "대회 소개" : "About the Competition"}
            title={isKo ? "미국수학협회(MAA)가 주관하는 대표 경시대회" : "A Flagship Competition from the MAA"}
            isKo={isKo}
          />
          <div className="mx-auto mt-8 max-w-2xl space-y-4">
            <p className={`text-sm leading-7 text-navy-700${isKo ? " font-ko" : ""}`}>
              {isKo
                ? "AMC 8은 미국수학협회(Mathematical Association of America, MAA)가 매년 주관하는 25문항, 40분 분량의 객관식 수학 경시대회입니다. 8학년 이하 학생이라면 누구나 응시할 수 있어, 처음 수학 경시대회를 접하는 학생에게 특히 좋은 시작점이 됩니다."
                : "The AMC 8 is a 25-question, 40-minute multiple-choice math exam held annually by the Mathematical Association of America (MAA). It's open to any student in grade 8 or below, making it an excellent first competition for students who are new to contest math."}
            </p>
            <p className={`text-sm leading-7 text-navy-700${isKo ? " font-ko" : ""}`}>
              {isKo
                ? "단순 연산 속도가 아니라 논리적 사고와 창의적인 문제 해결 능력을 평가하도록 설계되었으며, 오답에 대한 감점이 없어 부담 없이 도전할 수 있습니다."
                : "It's designed to test logical reasoning and creative problem-solving rather than raw calculation speed, and since there's no penalty for wrong answers, students can approach every question without fear of losing points."}
            </p>
          </div>
        </Container>
      </Section>

      {/* Format */}
      <Section className="bg-navy-50/50">
        <Container>
          <SectionHeader
            eyebrow={isKo ? "시험 형식" : "Exam Format"}
            title={isKo ? "25문제, 40분" : "25 Questions, 40 Minutes"}
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

      {/* Eligibility */}
      <Section>
        <Container>
          <SectionHeader
            eyebrow={isKo ? "응시 자격" : "Eligibility"}
            title={isKo ? "누가 응시할 수 있나요?" : "Who Can Take the AMC 8?"}
            isKo={isKo}
          />
          <ul className="mx-auto mt-8 max-w-2xl space-y-3">
            {eligibility.map((e) => (
              <li key={e.en} className="flex items-start gap-3 rounded-xl border border-navy-100 bg-white px-5 py-4 text-sm shadow-sm">
                <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-purple-600" />
                <span className={`leading-6 text-navy-700${isKo ? " font-ko" : ""}`}>{isKo ? e.ko : e.en}</span>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* Sample problems */}
      <Section className="bg-navy-50/50">
        <Container>
          <SectionHeader
            eyebrow={isKo ? "직접 풀어보기" : "Try It Yourself"}
            title={isKo ? "실제 AMC 8 기출문제 풀어보기" : "Try Real AMC 8 Problems"}
            isKo={isKo}
          />
          <p className={`mx-auto mt-5 max-w-2xl text-center text-sm leading-7 text-navy-700${isKo ? " font-ko" : ""}`}>
            {isKo
              ? "MAA의 공식 허가를 받아 무료로 제공되는 실제 AMC 8 기출문제지입니다. 실전과 동일한 형식으로 미리 풀어볼 수 있습니다."
              : "These are real past AMC 8 exams, hosted free of charge with official permission from the MAA — the same format students see on test day."}
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
                    {isKo ? "기출문제 다운로드" : "Download Exam"} — {t.title}
                  </p>
                  <p className={`mt-0.5 text-xs text-navy-600${isKo ? " font-ko" : ""}`}>
                    {isKo ? t.labelKo : t.label}
                  </p>
                </div>
              </a>
            ))}
          </div>
          <div className="mx-auto mt-4 grid max-w-2xl gap-4 sm:grid-cols-2">
            {solutionResources.map((s) => (
              <a
                key={s.key}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "flex items-center gap-3 rounded-2xl border p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md",
                  s.featured ? "border-purple-300 bg-purple-50" : "border-navy-100 bg-white",
                )}
              >
                <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white", s.featured ? "bg-purple-600" : "bg-navy-700")}>
                  <BookOpen className="h-4.5 w-4.5" />
                </div>
                <div>
                  <p className={`text-sm font-bold text-navy-900${isKo ? " font-ko" : ""}`}>
                    {isKo ? s.labelKo : s.label}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </Container>
      </Section>

      {/* Schedule & registration */}
      <Section>
        <Container>
          <SectionHeader
            eyebrow={isKo ? "시험 & 등록 일정" : "Schedule & Registration"}
            title={isKo ? "2026–2027 시즌 일정" : "2026–2027 Season Schedule"}
            isKo={isKo}
          />
          <div className="mx-auto mt-8 max-w-3xl overflow-x-auto rounded-2xl border border-navy-100 bg-white shadow-sm touch-pan-x">
            <table className="w-full text-sm">
              <thead className="border-b border-navy-100 bg-navy-50">
                <tr>
                  <th className={`px-5 py-3.5 text-left font-semibold text-navy-900${isKo ? " font-ko" : ""}`}>
                    {isKo ? "구분" : "Item"}
                  </th>
                  <th className={`px-5 py-3.5 text-left font-semibold text-navy-900${isKo ? " font-ko" : ""}`}>
                    {isKo ? "일정" : "Date"}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-50">
                {scheduleRows.map((r) => (
                  <tr key={r.item} className="hover:bg-navy-50/40">
                    <td className={`px-5 py-4 font-bold text-navy-900${isKo ? " font-ko" : ""}`}>{isKo ? r.itemKo : r.item}</td>
                    <td className={`px-5 py-4 text-navy-700${isKo ? " font-ko" : ""}`}>{isKo ? r.detailKo : r.detail}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mx-auto mt-6 flex max-w-3xl items-start gap-3 rounded-xl border border-navy-200 bg-white px-5 py-4 text-sm text-navy-700">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-navy-400" />
            <p className={`leading-6${isKo ? " font-ko" : ""}`}>
              {isKo ? (
                <>
                  정확한 일정, 등록 비용, 시험장 안내 등 최신 정보는{" "}
                  <a
                    href="https://maa.org/student-programs/amc/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold underline underline-offset-2"
                  >
                    AMC 공식 홈페이지
                  </a>
                  와{" "}
                  <a
                    href="https://maa.org/amcreg/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold underline underline-offset-2"
                  >
                    등록 안내 페이지
                  </a>
                  에서 확인하세요.
                </>
              ) : (
                <>
                  For exact dates, registration fees, and testing centers, check the{" "}
                  <a
                    href="https://maa.org/student-programs/amc/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold underline underline-offset-2"
                  >
                    official AMC website
                  </a>{" "}
                  and the{" "}
                  <a
                    href="https://maa.org/amcreg/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold underline underline-offset-2"
                  >
                    registration page
                  </a>
                  .
                </>
              )}
            </p>
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
            title={isKo ? "정답 1점, 오답 0점" : "1 Point per Correct Answer"}
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

      {/* Pathway */}
      <Section className="bg-navy-50/50">
        <Container>
          <SectionHeader
            eyebrow={isKo ? "다음 단계" : "What Comes Next"}
            title={isKo ? "상위 대회로 가는 첫걸음" : "The First Step Toward Higher Competitions"}
            isKo={isKo}
          />
          <div className="mx-auto mt-8 grid max-w-2xl gap-4 sm:grid-cols-2">
            {pathway.map((p) => (
              <div key={p.title} className="flex items-start gap-3 rounded-2xl border border-navy-100 bg-white p-5 shadow-sm">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-navy-700 text-white">
                  <p.icon className="h-4.5 w-4.5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-navy-900">{isKo ? p.titleKo : p.title}</p>
                  <p className={`mt-1 text-xs leading-5 text-navy-700${isKo ? " font-ko" : ""}`}>
                    {isKo ? p.descKo : p.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* How to prepare */}
      <Section>
        <Container>
          <SectionHeader
            eyebrow={isKo ? "준비 방법" : "How to Prepare"}
            title={isKo ? "꾸준한 연습이 핵심입니다" : "Consistent Practice Is Key"}
            isKo={isKo}
          />
          <div className="mx-auto mt-8 max-w-2xl rounded-2xl border border-navy-100 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex items-start gap-3">
              <BookOpen className="mt-0.5 h-5 w-5 shrink-0 text-purple-600" />
              <p className={`text-sm leading-7 text-navy-700${isKo ? " font-ko" : ""}`}>
                {isKo
                  ? "AMC 8을 준비하는 가장 좋은 방법은 지난 기출문제를 꾸준히 풀어보는 것입니다. 아래 자료를 참고해 실전 감각을 익혀보세요:"
                  : "The best way to prepare for the AMC 8 is steady practice with past exams. These resources are a great place to start:"}
              </p>
            </div>
            <ul className="mt-4 space-y-2 pl-8 text-sm text-navy-700">
              <li className={`list-disc leading-6${isKo ? " font-ko" : ""}`}>
                {isKo ? "역대 AMC 8 기출문제와 정답·해설 (Art of Problem Solving 무료 아카이브)" : "Past AMC 8 exams with solutions, freely archived by Art of Problem Solving"}
              </li>
              <li className={`list-disc leading-6${isKo ? " font-ko" : ""}`}>
                {isKo ? "문제 유형별(대수, 기하, 정수론, 조합론) 개념 정리" : "Topic-by-topic review of algebra, geometry, number theory, and combinatorics"}
              </li>
              <li className={`list-disc leading-6${isKo ? " font-ko" : ""}`}>
                {isKo ? "40분 실전 모의고사를 통한 시간 관리 훈련" : "Timed 40-minute mock exams to build pacing and time-management skills"}
              </li>
            </ul>
          </div>
        </Container>
      </Section>

      {/* CTA */}
      <Section className="bg-navy-50/50">
        <Container>
          <div className="mx-auto max-w-2xl rounded-2xl border border-navy-100 bg-white p-8 text-center shadow-sm">
            <h2 className={`text-xl font-bold text-navy-900${isKo ? " font-ko" : ""}`}>
              {isKo ? "AMC 8 준비, Daniel Math Academy와 함께하세요" : "Prepare for AMC 8 with Daniel Math Academy"}
            </h2>
            <p className={`mx-auto mt-3 max-w-lg text-sm leading-7 text-navy-700${isKo ? " font-ko" : ""}`}>
              {isKo
                ? "문제 풀이 전략부터 실전 감각까지, 아이의 수준에 맞춰 AMC 8 준비를 도와드립니다."
                : "From problem-solving strategies to contest-day readiness, we help students prepare for the AMC 8 at their own level."}
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
