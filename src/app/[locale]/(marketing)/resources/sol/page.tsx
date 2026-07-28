import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ExternalLink, Info, BookOpen } from "lucide-react";
import { Container } from "@/components/site/container";
import { Section, SectionHeader } from "@/components/site/section";
import { solGrades } from "@/lib/curriculum-data";
import { hasLocale, localePath, type Locale } from "@/lib/i18n";
import { pageAlternates } from "@/lib/seo";

type Props = { params: Promise<{ locale: string }> };

const strandColors: Record<string, string> = {
  "Number & Number Sense": "bg-blue-50 border-blue-200 text-blue-700",
  "Computation & Estimation": "bg-indigo-50 border-indigo-200 text-indigo-700",
  "Measurement & Geometry": "bg-emerald-50 border-emerald-200 text-emerald-700",
  "Probability & Statistics": "bg-purple-50 border-purple-200 text-purple-700",
  "Patterns, Functions & Algebra": "bg-amber-50 border-amber-200 text-amber-700",
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(locale)) return {};
  const alt = pageAlternates(locale, "/resources/sol");
  return locale === "ko"
    ? { title: "Virginia SOL 수학 기준", description: "버지니아 주 수학 성취 기준(SOL)을 유치원~6학년별로 한국어로 설명합니다.", alternates: alt }
    : { title: "Virginia SOL Math Standards", description: "Virginia Standards of Learning for math — explained grade by grade from kindergarten through 6th grade.", alternates: alt };
}

export default async function SolPage({ params }: Props) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();
  const lp = (path: string) => localePath(locale as Locale, path);
  const isKo = locale === "ko";

  const t = isKo ? {
    back: "자료 센터로 돌아가기",
    title: "Virginia SOL",
    subtitle: "수학 성취 기준 (Standards of Learning)",
    heroDesc: "버지니아 주 모든 공립학교는 주 교육부(VDOE)가 정한 SOL(Standards of Learning)을 기준으로 수업을 운영하고 평가합니다. 각 학년이 그 학년 말까지 반드시 알아야 할 내용이 정해져 있습니다.",
    whatIs: {
      eyebrow: "SOL 기초 이해",
      title: "SOL, 4가지만 알면 됩니다",
      titleKo: "Virginia Standards of Learning — 핵심 정리",
      points: [
        { title: "SOL이란?", body: "Virginia Standards of Learning(SOL)은 버지니아 주 교육부(VDOE)가 제정한 학년별 학업 성취 기준입니다. 수학, 읽기, 과학, 사회 등 주요 과목에 걸쳐 각 학년이 갖춰야 할 지식과 기술을 규정합니다." },
        { title: "SOL 시험은?", body: "매년 봄(4월 말 ~ 6월 초), 3~8학년 전체 학생이 해당 학년의 SOL 시험을 치릅니다. 수학은 3~8학년 모두 응시합니다. 결과는 학교 평가와 일부 진급 결정에 활용됩니다." },
        { title: "FCPS 커리큘럼과의 관계", body: "FCPS 일반 수학(Standard)은 해당 학년 SOL을 충실히 따릅니다. AAP 심화반은 한 학년 높은 SOL 내용을 미리 배웁니다. 따라서 심화반 학생은 다음 학년 SOL 시험 내용을 이미 익힌 상태로 진학합니다." },
        { title: "SOL 점수의 의미", body: "SOL 점수는 Pass/Fail로 보고됩니다. 'Pass (Proficient)'는 600점 이상, 'Pass (Advanced Proficient)'는 700점 이상(800점 만점)입니다. Advanced는 해당 학년보다 깊은 이해를 보여줍니다." },
      ],
    },
    grades: { eyebrow: "학년별 SOL", title: "유치원 ~ 6학년 수학 SOL 요약", titleKo: "각 학년에서 무엇을 배우나요?" },
    connection: {
      eyebrow: "SOL × FCPS 연결",
      title: "학년별 SOL 시험과 AAP의 관계",
      titleKo: "어느 학년에 무슨 시험이 있나요?",
      ths: ["학년", "SOL 시험 과목", "수학 핵심 포인트", "AAP 연결"],
      rows: [
        { grade: "3학년", test: "수학 + 읽기", tip: "처음으로 수학 SOL 시험을 치릅니다. 곱셈·나눗셈·분수가 핵심입니다.", aap: "3학년 말 AAP 스크리닝 결과 → 4학년부터 Full-Time 배치 가능" },
        { grade: "4학년", test: "수학 + 읽기", tip: "소수·분수 연산, 각도 측정이 새로 추가됩니다.", aap: "AAP반은 5학년 SOL 내용을 배웁니다." },
        { grade: "5학년", test: "수학 + 읽기 + 과학", tip: "과학 SOL도 추가됩니다. 수학은 소수·분수 사칙연산과 부피가 핵심입니다.", aap: "AAP반은 6학년 SOL(비율·정수·대수)을 배웁니다." },
        { grade: "6학년", test: "수학 + 읽기", tip: "초등 마지막 SOL. 비율·정수·방정식이 중심입니다. 중학교 Algebra 준비 단계.", aap: "AAP반은 Pre-Algebra(7학년 수준)를 배웁니다." },
      ],
    },
    solPageLink: "VDOE 공식 SOL 페이지",
    curriculumLink: "학년별 커리큘럼 보기",
    disclaimer: "위 내용은 Virginia 2023 Mathematics SOL을 바탕으로 작성되었습니다. 학년별 상세 기준은",
    disclaimerLink: "버지니아 주 교육부 공식 사이트",
    disclaimerSuffix: "에서 확인하세요.",
  } : {
    back: "Back to Resources",
    title: "Virginia SOL",
    subtitle: "Mathematics Standards of Learning",
    heroDesc: "All Virginia public schools teach and assess math based on the Standards of Learning (SOL) set by the Virginia Department of Education (VDOE). Each grade has defined content that students are expected to master by year-end.",
    whatIs: {
      eyebrow: "SOL Basics",
      title: "Four things to know about SOL",
      titleKo: undefined,
      points: [
        { title: "What is the SOL?", body: "Virginia Standards of Learning (SOL) are the grade-by-grade academic achievement standards set by the Virginia Department of Education (VDOE). They define the knowledge and skills students must have in core subjects — math, reading, science, and social studies — at each grade." },
        { title: "What is the SOL test?", body: "Each spring (late April to early June), all students in grades 3–8 take the SOL test for their grade. Math is tested in all grades 3–8. Results are used for school accountability and some promotion decisions." },
        { title: "How does it relate to FCPS?", body: "FCPS Standard math closely follows the grade-level SOL. AAP Advanced math teaches content one grade above — so advanced students are already familiar with the next grade's SOL content when they move up." },
        { title: "What do SOL scores mean?", body: "SOL scores are reported as Pass/Fail. 'Pass (Proficient)' is 600+ points and 'Pass (Advanced Proficient)' is 700+ points (out of 800). Advanced Proficient indicates deeper understanding beyond grade level." },
      ],
    },
    grades: { eyebrow: "Grade-by-Grade SOL", title: "Kindergarten – Grade 6 Math SOL Summary", titleKo: undefined },
    connection: {
      eyebrow: "SOL × FCPS",
      title: "SOL Tests and AAP by Grade",
      titleKo: undefined,
      ths: ["Grade", "SOL Tests", "Math Focus", "AAP Connection"],
      rows: [
        { grade: "Grade 3", test: "Math + Reading", tip: "First time taking the math SOL. Multiplication, division, and fractions are key.", aap: "Grade 3 AAP screening → Full-Time placement starting Grade 4" },
        { grade: "Grade 4", test: "Math + Reading", tip: "Decimals, fraction operations, and angle measurement are newly added.", aap: "AAP track studies Grade 5 SOL content." },
        { grade: "Grade 5", test: "Math + Reading + Science", tip: "Science SOL is added. Math focuses on decimal/fraction arithmetic and volume.", aap: "AAP track studies Grade 6 SOL (ratios, integers, algebra)." },
        { grade: "Grade 6", test: "Math + Reading", tip: "Last elementary SOL. Ratios, integers, and equations are central. Prep for middle school Algebra.", aap: "AAP track studies Pre-Algebra (Grade 7 level)." },
      ],
    },
    solPageLink: "VDOE Official SOL Page",
    curriculumLink: "View Grade Curriculum",
    disclaimer: "The above is based on the Virginia 2023 Mathematics SOL. For detailed grade-level standards, visit the",
    disclaimerLink: "Virginia Department of Education official site",
    disclaimerSuffix: ".",
  };

  return (
    <>
      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-navy-900 py-14 sm:py-20">
        <Image
          src="/hero/student-1.jpg"
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
            <h1 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">
              {t.title}
            </h1>
            <p className={`mt-2 text-xl font-semibold text-white/80${isKo ? " font-ko" : ""}`}>
              {t.subtitle}
            </p>
            <p className={`mx-auto mt-5 max-w-2xl text-sm leading-7 text-white/70${isKo ? " font-ko" : ""}`}>
              {t.heroDesc}
            </p>
          </div>
        </Container>
      </section>

      {/* What Is SOL */}
      <Section className="bg-navy-50/50">
        <Container>
          <SectionHeader
            eyebrow={t.whatIs.eyebrow}
            title={t.whatIs.title}
            titleKo={t.whatIs.titleKo}
          />
          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            {t.whatIs.points.map((p, i) => (
              <div key={p.title} className="rounded-2xl border border-navy-100 bg-white p-6 shadow-sm">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-navy-900 text-sm font-bold text-white">
                  {i + 1}
                </span>
                <h3 className={`mt-4 text-base font-bold text-navy-900${isKo ? " font-ko" : ""}`}>
                  {p.title}
                </h3>
                <p className={`mt-2 text-sm leading-6 text-navy-700${isKo ? " font-ko" : ""}`}>
                  {p.body}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Grade-by-grade */}
      <Section>
        <Container>
          <SectionHeader
            eyebrow={t.grades.eyebrow}
            title={t.grades.title}
            titleKo={t.grades.titleKo}
          />
          <div className="mt-10 space-y-6">
            {solGrades.map((sg) => (
              <div key={sg.grade} className="rounded-2xl border border-navy-100 bg-white shadow-sm overflow-hidden">
                <div className="flex items-center gap-4 border-b border-navy-100 bg-navy-900 px-6 py-4">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white text-xl font-bold text-navy-900">
                    {sg.grade === "Kindergarten" ? "K" : sg.grade.replace("Grade ", "")}
                  </span>
                  <div>
                    <h3 className="font-bold text-white">{sg.grade}</h3>
                    <p className={`text-sm text-navy-200${isKo ? " font-ko" : ""}`}>
                      {isKo ? `${sg.gradeKo} 수학 SOL` : `${sg.grade} Math SOL`}
                    </p>
                  </div>
                </div>
                <div className="grid gap-3 p-5 sm:grid-cols-2 lg:grid-cols-3">
                  {sg.strands.map((st) => (
                    <div
                      key={st.name}
                      className={`rounded-xl border p-4 ${strandColors[st.name] ?? "bg-gray-50 border-gray-200 text-gray-700"}`}
                    >
                      <p className="text-xs font-bold uppercase tracking-wide">{st.name}</p>
                      {isKo && <p className="mt-0.5 text-xs font-semibold font-ko">{st.nameKo}</p>}
                      <p className={`mt-2 text-xs leading-5${isKo ? " font-ko" : ""}`}>
                        {st.summary}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex items-start gap-3 rounded-xl border border-navy-200 bg-navy-50 px-5 py-4 text-sm text-navy-700">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-navy-400" />
            <p className={`leading-6${isKo ? " font-ko" : ""}`}>
              {t.disclaimer}{" "}
              <a
                href="https://www.doe.virginia.gov/teaching-learning-assessment/instruction/mathematics/standards-of-learning-for-mathematics"
                target="_blank"
                rel="noopener noreferrer"
                className="ml-1 font-semibold underline underline-offset-2 hover:text-navy-900"
              >
                {t.disclaimerLink}
              </a>
              {t.disclaimerSuffix}
            </p>
          </div>
        </Container>
      </Section>

      {/* Connection table */}
      <Section className="bg-navy-50/60">
        <Container>
          <SectionHeader
            eyebrow={t.connection.eyebrow}
            title={t.connection.title}
            titleKo={t.connection.titleKo}
          />
          <div className="mt-10 overflow-x-auto rounded-2xl border border-navy-100 bg-white shadow-sm touch-pan-x">
            <table className="w-full text-sm">
              <thead className="border-b border-navy-100 bg-navy-50">
                <tr>
                  {t.connection.ths.map((th, i) => (
                    <th key={i} className={`px-5 py-3.5 text-left font-semibold text-navy-900${isKo && i < 4 ? " font-ko" : ""}`}>
                      {th}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-50">
                {t.connection.rows.map((r) => (
                  <tr key={r.grade} className="hover:bg-navy-50/40">
                    <td className={`px-5 py-4 font-bold text-navy-900${isKo ? " font-ko" : ""}`}>{r.grade}</td>
                    <td className={`px-5 py-4 text-navy-700${isKo ? " font-ko" : ""}`}>{r.test}</td>
                    <td className={`px-5 py-4 text-navy-700${isKo ? " font-ko" : ""}`}>{r.tip}</td>
                    <td className={`px-5 py-4 text-sm text-navy-600${isKo ? " font-ko" : ""}`}>{r.aap}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <a
              href="https://www.doe.virginia.gov/teaching-learning-assessment/instruction/mathematics/standards-of-learning-for-mathematics"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-navy-200 bg-white px-5 py-2.5 text-sm font-semibold text-navy-700 shadow-sm hover:bg-navy-50"
            >
              <ExternalLink className="h-4 w-4" />
              {t.solPageLink}
            </a>
            <Link
              href={lp("/resources/curriculum")}
              className="inline-flex items-center gap-2 rounded-xl border border-navy-200 bg-white px-5 py-2.5 text-sm font-semibold text-navy-700 shadow-sm hover:bg-navy-50"
            >
              <BookOpen className="h-4 w-4" />
              {t.curriculumLink}
            </Link>
          </div>
        </Container>
      </Section>
    </>
  );
}
