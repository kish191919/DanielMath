import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, FileText, KeyRound, Printer, RefreshCw } from "lucide-react";
import { Container } from "@/components/site/container";
import { Section, SectionHeader } from "@/components/site/section";
import { GRADE_COLORS, UNIT_COLORS, UNIT_ICONS } from "@/components/worksheets/unit-style";
import { hasLocale, localePath, type Locale } from "@/lib/i18n";
import { pageAlternates } from "@/lib/seo";
import { cn } from "@/lib/utils";
import { gradeSlug, WORKSHEET_GRADES, worksheetsForGrade } from "@/lib/worksheets/catalog";
import { unitsForGrade } from "@/lib/worksheets/units";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(locale)) return {};
  const alternates = pageAlternates(locale, "/worksheets");
  return locale === "ko"
    ? {
        title: "무료 수학 학습지 (3–6학년)",
        description:
          "FCPS·버지니아 SOL 진도에 맞춘 3–6학년 학년별·주제별 수학 학습지. 매번 새 문제로 만들고 답안지와 함께 바로 인쇄하세요.",
        alternates,
      }
    : {
        title: "Free Printable Math Worksheets (Grades 3–6)",
        description:
          "Grade 3–6 math worksheets by topic, aligned with FCPS and the Virginia SOL. Fresh problems every time, printable with an answer key.",
        alternates,
      };
}

const STEPS = [
  {
    icon: FileText,
    ko: { title: "학년·스킬 선택", body: "단원을 펼쳐 학교 진도(FCPS 분기)에 맞는 세부 스킬을 고르세요." },
    en: { title: "Pick a grade & skill", body: "Open a unit and pick a skill; quarters follow the FCPS pacing." },
  },
  {
    icon: RefreshCw,
    ko: { title: "새 문제 만들기", body: "버튼 한 번에 같은 형식의 새로운 문제가 만들어집니다." },
    en: { title: "Get fresh problems", body: "One click makes a new set in the same format." },
  },
  {
    icon: Printer,
    ko: { title: "바로 인쇄", body: "레터 용지에 맞춘 깔끔한 학습지로 인쇄됩니다." },
    en: { title: "Print right away", body: "Clean, letter-size sheets ready for the printer." },
  },
  {
    icon: KeyRound,
    ko: { title: "답안지 · QR 정답", body: "답안지가 함께 인쇄되고, QR 코드로 정답을 확인할 수 있어요." },
    en: { title: "Answer key & QR", body: "Print the answer key, or scan the QR code to check." },
  },
];

export default async function WorksheetsHubPage({ params }: Props) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();
  const isKo = locale === "ko";
  const lp = (path: string) => localePath(locale as Locale, path);
  const ko = isKo ? " font-ko" : "";

  return (
    <>
      <section className="bg-navy-900 py-16 sm:py-24">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-white/80">
              FCPS · Virginia SOL
            </span>
            <h1 className={`mt-6 text-4xl font-bold tracking-tight text-white sm:text-5xl${ko}`}>
              {isKo ? "무료 수학 학습지" : "Free Math Worksheets"}
            </h1>
            <p className="mt-2 text-2xl font-semibold text-gold-300">{isKo ? "3–6학년" : "Grades 3–6"}</p>
            <p className={`mx-auto mt-6 max-w-2xl text-base leading-7 text-navy-200${ko}`}>
              {isKo
                ? "학교에서 배운 내용을 복습하고 다음 단원을 예습할 수 있도록, 학년별·주제별 학습지를 원하는 만큼 새로 만들어 인쇄하세요. 모든 학습지는 영어로 출력됩니다."
                : "Review what was taught at school or preview the next unit. Make as many fresh worksheets as you need, by grade and topic, and print them with an answer key."}
            </p>
          </div>
        </Container>
      </section>

      <Section className="bg-navy-50/50 py-10 sm:py-24">
        <Container>
          <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
            {WORKSHEET_GRADES.map((grade) => {
              const count = worksheetsForGrade(grade).length;
              const units = unitsForGrade(grade);
              const sw = UNIT_COLORS[GRADE_COLORS[grade]];
              return (
                <Link
                  key={grade}
                  href={lp(`/worksheets/${gradeSlug(grade)}`)}
                  className={cn(
                    "group flex flex-col rounded-2xl bg-white p-4 shadow-sm ring-1 transition hover:-translate-y-0.5 hover:shadow-md sm:p-6",
                    sw.ring,
                  )}
                >
                  <div className="flex items-start justify-between">
                    <span
                      className={cn(
                        "inline-flex h-10 w-10 items-center justify-center rounded-xl text-xl font-black shadow-sm sm:h-12 sm:w-12 sm:text-2xl",
                        sw.tile,
                      )}
                    >
                      {grade}
                    </span>
                    <ArrowRight className="h-5 w-5 text-navy-300 transition group-hover:translate-x-0.5 group-hover:text-navy-900" />
                  </div>
                  <h2 className={`mt-4 text-lg font-bold text-navy-900 sm:mt-5 sm:text-xl${ko}`}>
                    {isKo ? `${grade}학년` : `Grade ${grade}`}
                  </h2>
                  <p className={`mt-0.5 text-sm text-navy-500${ko}`}>
                    {isKo ? `단원 ${units.length}개 · 스킬 ${count}개` : `${units.length} units · ${count} skills`}
                  </p>
                  {/* A peek at what's inside: one tile per unit. */}
                  <div className="mt-4 flex flex-wrap gap-1" aria-hidden>
                    {units.map((u) => {
                      const Icon = UNIT_ICONS[u.icon];
                      return (
                        <span
                          key={u.key}
                          className={cn("flex h-6 w-6 items-center justify-center rounded-md", UNIT_COLORS[u.color].soft)}
                        >
                          <Icon className={cn("h-3.5 w-3.5", UNIT_COLORS[u.color].text)} strokeWidth={2.5} />
                        </span>
                      );
                    })}
                  </div>
                </Link>
              );
            })}
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <SectionHeader eyebrow={isKo ? "사용 방법" : "How it works"} isKo={isKo} />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step) => {
              const t = isKo ? step.ko : step.en;
              return (
                <div key={step.en.title} className="rounded-2xl border border-navy-100 bg-white p-6 shadow-sm">
                  <step.icon className="h-6 w-6 text-navy-700" />
                  <h3 className={`mt-4 text-base font-bold text-navy-900${ko}`}>{t.title}</h3>
                  <p className={`mt-2 text-sm leading-6 text-navy-700${ko}`}>{t.body}</p>
                </div>
              );
            })}
          </div>
          <p className={`mt-8 text-center text-sm text-navy-600${ko}`}>
            {isKo ? "학년별 학교 진도가 궁금하다면 " : "Want to see what each grade covers? "}
            <Link href={lp("/resources/curriculum")} className="font-semibold text-navy-900 underline underline-offset-2">
              {isKo ? "FCPS 수학 교육과정" : "FCPS Math Curriculum"}
            </Link>
            {isKo ? "을 확인하세요." : "."}
          </p>
        </Container>
      </Section>
    </>
  );
}
