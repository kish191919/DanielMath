import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, CheckCircle, Info } from "lucide-react";
import { Container } from "@/components/site/container";
import { Section, SectionHeader } from "@/components/site/section";
import { grades } from "@/lib/curriculum-data";
import { hasLocale, localePath, type Locale } from "@/lib/i18n";
import { pageAlternates } from "@/lib/seo";

const gradeConfig: Record<number, {
  accent: string; border: string; hoverBorder: string;
  enSummary: string; koSummary: string;
}> = {
  0: { accent: "bg-violet-600", border: "border-violet-100", hoverBorder: "hover:border-violet-300", enSummary: "Counting, shapes & patterns", koSummary: "수 세기, 도형과 패턴" },
  1: { accent: "bg-sky-600",    border: "border-sky-100",    hoverBorder: "hover:border-sky-300",    enSummary: "Place value & basic operations",  koSummary: "자릿값과 기본 연산" },
  2: { accent: "bg-teal-600",   border: "border-teal-100",   hoverBorder: "hover:border-teal-300",   enSummary: "Two-digit math & measurement",    koSummary: "두 자리 연산과 측정" },
  3: { accent: "bg-green-600",  border: "border-green-100",  hoverBorder: "hover:border-green-300",  enSummary: "Multiplication, fractions & geometry", koSummary: "곱셈, 분수와 도형" },
  4: { accent: "bg-orange-500", border: "border-orange-100", hoverBorder: "hover:border-orange-300", enSummary: "Multi-digit ops & fractions",      koSummary: "다자리 연산과 분수" },
  5: { accent: "bg-rose-600",   border: "border-rose-100",   hoverBorder: "hover:border-rose-300",   enSummary: "Fractions, decimals & algebra",   koSummary: "분수, 소수와 대수" },
  6: { accent: "bg-navy-700",   border: "border-navy-200",   hoverBorder: "hover:border-navy-400",   enSummary: "Ratios, integers & pre-algebra",  koSummary: "비율, 정수와 예비대수" },
};

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(locale)) return {};
  const alt = pageAlternates(locale, "/resources/curriculum");
  return locale === "ko"
    ? { title: "FCPS 초등 수학 커리큘럼", description: "Fairfax County 초등학교 수학 프로그램 전체 안내. 유치원~6학년 일반·심화(AAP) 수학 트랙을 한국어로 설명합니다.", alternates: alt }
    : { title: "FCPS Elementary Math Curriculum", description: "A complete guide to Fairfax County elementary math. Compare Standard and Advanced (AAP) tracks for grades K–6, quarter by quarter.", alternates: alt };
}

export default async function CurriculumOverviewPage({ params }: Props) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();
  const lp = (path: string) => localePath(locale as Locale, path);
  const isKo = locale === "ko";

  const t = isKo ? {
    back: "자료 센터로 돌아가기",
    title: "FCPS 초등 수학 커리큘럼",
    subtitle: "유치원 ~ 6학년 전체 안내",
    desc: "FCPS(Fairfax County Public Schools)는 모든 초등학년에 두 가지 수학 트랙을 운영합니다. 아래에서 각 학년을 선택해 일반 수학과 심화 수학의 분기별 학습 내용을 비교해보세요.",
    tracks: {
      eyebrow: "두 가지 트랙",
      title: "일반 수학 vs. 심화 수학",
      titleKo: undefined,
      desc: "FCPS는 같은 학년이라도 두 가지 다른 수준의 수학 과정을 제공합니다.",
      items: [
        {
          label: "일반 수학 (Standard Math)", sublabel: "Grade-level curriculum", color: "navy" as const,
          points: ["해당 학년의 Virginia SOL 기준을 따름", "버지니아 주 공인 교과서 사용", "모든 학생이 기본적으로 수강", "학년 말 SOL 시험으로 성취도 확인"],
        },
        {
          label: "심화 수학 (Advanced / AAP Math)", sublabel: "One grade level above", color: "gold" as const,
          points: ["한 학년 높은 Virginia SOL 내용을 배움", "예: 3학년 심화반 → 4학년 SOL 내용", "AAP 스크리닝 통과 학생 대상", "더 깊은 개념 이해와 추론 중심"],
        },
      ],
      note: "K~2학년은 담임 선생님이 수업 중 학생 수준을 관찰하여 트랙을 배치합니다. 3학년부터는 AAP 공식 스크리닝(CogAT/NNAT) 결과로 Full-Time AAP 배치가 결정됩니다.",
    },
    grades: {
      eyebrow: "학년 선택",
      title: "학년별 자세히 보기",
      titleKo: undefined,
    },
    progression: {
      eyebrow: "수준 비교",
      title: "학년별 수준 한눈에 보기",
      titleKo: undefined,
      ths: ["학년", "일반 수학", "심화 수학 (AAP)"],
      rows: [
        { grade: "K", standard: "K 수준", advanced: "1학년 수준" },
        { grade: "1학년", standard: "1학년 수준", advanced: "2학년 수준" },
        { grade: "2학년", standard: "2학년 수준", advanced: "3학년 수준" },
        { grade: "3학년", standard: "3학년 수준 (SOL 3)", advanced: "4학년 수준 (SOL 4)" },
        { grade: "4학년", standard: "4학년 수준 (SOL 4)", advanced: "5학년 수준 (SOL 5)" },
        { grade: "5학년", standard: "5학년 수준 (SOL 5)", advanced: "6학년 수준 (SOL 6)" },
        { grade: "6학년", standard: "6학년 수준 (SOL 6)", advanced: "7학년 / Pre-Algebra" },
      ],
      note: "심화반 6학년이 Pre-Algebra까지 마치면 중학교 1학년(7학년)에서 Algebra I를 바로 시작할 수 있습니다.",
    },
  } : {
    back: "Back to Resources",
    title: "FCPS Elementary Math Curriculum",
    subtitle: "Kindergarten – Grade 6 Overview",
    desc: "Fairfax County Public Schools (FCPS) runs two math tracks at every elementary grade. Select a grade below to compare Standard and Advanced (AAP) math content, quarter by quarter.",
    tracks: {
      eyebrow: "Two Tracks",
      title: "Standard Math vs. Advanced Math",
      titleKo: undefined,
      desc: "FCPS offers two different math levels at the same grade.",
      items: [
        {
          label: "Standard Math", sublabel: "Grade-level curriculum", color: "navy" as const,
          points: ["Follows grade-level Virginia SOL standards", "Uses FCPS-adopted textbooks (e.g., Envisions Math)", "All students are enrolled by default", "Assessed by the SOL test at end of year"],
        },
        {
          label: "Advanced Math (AAP)", sublabel: "One grade level above", color: "gold" as const,
          points: ["Covers content one grade above Virginia SOL", "E.g., 3rd-grade AAP → 4th-grade SOL content", "Requires AAP screening (CogAT/NNAT) for Full-Time", "Deeper conceptual understanding and reasoning"],
        },
      ],
      note: "For K–2, the homeroom teacher observes and assigns tracks during instruction. Starting in Grade 3, Full-Time AAP placement is determined by the official AAP screening (CogAT/NNAT) results.",
    },
    grades: {
      eyebrow: "Select a Grade",
      title: "Explore by Grade",
      titleKo: undefined,
    },
    progression: {
      eyebrow: "Track Overview",
      title: "Grade Equivalents at a Glance",
      titleKo: undefined,
      ths: ["Grade", "Standard Math", "Advanced Math (AAP)"],
      rows: [
        { grade: "K", standard: "Kindergarten level", advanced: "Grade 1 level" },
        { grade: "Grade 1", standard: "Grade 1 level", advanced: "Grade 2 level" },
        { grade: "Grade 2", standard: "Grade 2 level", advanced: "Grade 3 level" },
        { grade: "Grade 3", standard: "Grade 3 level (SOL 3)", advanced: "Grade 4 level (SOL 4)" },
        { grade: "Grade 4", standard: "Grade 4 level (SOL 4)", advanced: "Grade 5 level (SOL 5)" },
        { grade: "Grade 5", standard: "Grade 5 level (SOL 5)", advanced: "Grade 6 level (SOL 6)" },
        { grade: "Grade 6", standard: "Grade 6 level (SOL 6)", advanced: "Grade 7 / Pre-Algebra" },
      ],
      note: "Advanced 6th graders who complete Pre-Algebra can start Algebra I in 7th grade — paving the path to AP Calculus AB/BC in high school.",
    },
  };

  return (
    <>
      <section className="relative isolate overflow-hidden bg-navy-900 py-14 sm:py-20">
        <Image
          src="/hero/student-2.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="absolute inset-0 -z-20 object-cover object-center opacity-30"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-navy-950/60 via-navy-900/70 to-navy-950/80" />
        <Container>
          <Link href={lp("/resources")} className={`inline-flex w-fit items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-medium text-white/80 shadow-sm transition hover:border-white/40 hover:text-white${isKo ? " font-ko" : ""}`}>
            <ArrowLeft className="h-3.5 w-3.5 shrink-0" />
            {t.back}
          </Link>
          <div className="mx-auto max-w-3xl text-center">
            <h1 className={`mt-6 text-4xl font-bold tracking-tight text-white sm:text-5xl${isKo ? " font-ko" : ""}`}>
              {t.title}
            </h1>
            <p className={`mt-2 text-xl font-semibold text-white/80${isKo ? " font-ko" : ""}`}>
              {t.subtitle}
            </p>
            <p className={`mx-auto mt-5 max-w-2xl text-sm leading-7 text-white/70${isKo ? " font-ko" : ""}`}>
              {t.desc}
            </p>
          </div>
        </Container>
      </section>

      <Section className="bg-white border-t border-navy-100">
        <Container>
          <SectionHeader
            eyebrow={t.tracks.eyebrow}
            title={t.tracks.title}
            titleKo={t.tracks.titleKo}
            description={t.tracks.desc}
          />
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {t.tracks.items.map((tr) => (
              <div
                key={tr.label}
                className={
                  tr.color === "gold"
                    ? "rounded-2xl border border-gold-400/50 bg-amber-50 p-7"
                    : "rounded-2xl border border-navy-200 bg-white p-7 shadow-sm"
                }
              >
                <p className={tr.color === "gold" ? "text-xs font-semibold uppercase tracking-wider text-gold-600" : "text-xs font-semibold uppercase tracking-wider text-navy-500"}>
                  {tr.sublabel}
                </p>
                <h3 className={`mt-1 text-lg font-bold text-navy-900${isKo ? " font-ko" : ""}`}>{tr.label}</h3>
                <ul className="mt-4 space-y-2">
                  {tr.points.map((p) => (
                    <li key={p} className={`flex items-start gap-2.5 text-sm text-navy-800${isKo ? " font-ko" : ""}`}>
                      <CheckCircle className={tr.color === "gold" ? "mt-0.5 h-4 w-4 shrink-0 text-gold-500" : "mt-0.5 h-4 w-4 shrink-0 text-navy-500"} />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-5 flex items-start gap-3 rounded-xl border border-navy-200 bg-white px-5 py-4 text-sm text-navy-700">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-navy-400" />
            <p className={`leading-6${isKo ? " font-ko" : ""}`}>{t.tracks.note}</p>
          </div>
        </Container>
      </Section>

      <Section className="bg-navy-50 border-t border-navy-100">
        <Container>
          <SectionHeader
            eyebrow={t.grades.eyebrow}
            title={t.grades.title}
            titleKo={t.grades.titleKo}
          />
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-7">
            {grades.map((g) => {
              const cfg = gradeConfig[g.gradeNum];
              return (
                <Link
                  key={g.slug}
                  href={lp(`/resources/curriculum/${g.slug}`)}
                  className={`group flex flex-col items-center rounded-2xl border ${cfg.border} ${cfg.hoverBorder} bg-white p-5 text-center shadow-sm transition hover:-translate-y-0.5 hover:shadow-md`}
                >
                  <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${cfg.accent} text-xl font-bold text-white`}>
                    {g.gradeNum === 0 ? "K" : g.gradeNum}
                  </div>
                  <span className={`mt-2 text-xs font-semibold text-navy-900${isKo && g.gradeNum === 0 ? " font-ko" : ""}`}>
                    {isKo
                      ? (g.gradeNum === 0 ? "유치원" : `${g.gradeNum}학년`)
                      : (g.gradeNum === 0 ? "Kinder" : `Grade ${g.gradeNum}`)
                    }
                  </span>
                  <p className={`mt-2 text-xs leading-snug text-navy-500${isKo ? " font-ko" : ""}`}>
                    {isKo ? cfg.koSummary : cfg.enSummary}
                  </p>
                </Link>
              );
            })}
          </div>
        </Container>
      </Section>

      <Section className="bg-amber-50/40 border-t border-navy-100">
        <Container>
          <SectionHeader
            eyebrow={t.progression.eyebrow}
            title={t.progression.title}
            titleKo={t.progression.titleKo}
          />
          <div className="mx-auto mt-10 max-w-2xl overflow-x-auto rounded-2xl border border-navy-100 bg-white shadow-sm">
            <table className="w-full text-sm">
              <thead className="border-b border-navy-100">
                <tr>
                  {t.progression.ths.map((th, i) => (
                    <th key={i} className={`px-5 py-3.5 text-left font-semibold${i === 2 ? " bg-amber-50 text-gold-600" : " text-navy-900"}${isKo ? " font-ko" : ""}`}>
                      {th}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-50">
                {t.progression.rows.map((r) => (
                  <tr key={r.grade} className="hover:bg-navy-50/40">
                    <td className={`px-5 py-3 font-bold text-navy-900${isKo ? " font-ko" : ""}`}>{r.grade}</td>
                    <td className={`px-5 py-3 text-navy-700${isKo ? " font-ko" : ""}`}>{r.standard}</td>
                    <td className={`px-5 py-3 font-medium text-gold-600${isKo ? " font-ko" : ""}`}>{r.advanced}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className={`mx-auto mt-4 max-w-2xl text-center text-xs text-navy-500${isKo ? " font-ko" : ""}`}>
            {t.progression.note}
          </p>
        </Container>
      </Section>
    </>
  );
}
