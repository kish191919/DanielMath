import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, BookOpen } from "lucide-react";
import { Container } from "@/components/site/container";
import { Section } from "@/components/site/section";
import { QUARTER_LABELS_EN, QUARTER_LABELS_KO } from "@/lib/curriculum-quarter";
import { hasLocale, localePath, type Locale } from "@/lib/i18n";
import { pageAlternates } from "@/lib/seo";
import { cn } from "@/lib/utils";
import {
  gradeSlug,
  parseGradeSlug,
  WORKSHEET_GRADES,
  worksheetPath,
  worksheetsForGrade,
} from "@/lib/worksheets/catalog";
import { CATEGORY_LABELS } from "@/lib/worksheets/labels";

type Props = { params: Promise<{ locale: string; grade: string }> };

export function generateStaticParams() {
  return WORKSHEET_GRADES.flatMap((g) => [
    { locale: "ko", grade: gradeSlug(g) },
    { locale: "en", grade: gradeSlug(g) },
  ]);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, grade: slug } = await params;
  const grade = parseGradeSlug(slug);
  if (!hasLocale(locale) || grade === null) return {};
  const alternates = pageAlternates(locale, `/worksheets/${slug}`);
  return locale === "ko"
    ? {
        title: `${grade}학년 수학 학습지`,
        description: `FCPS·버지니아 SOL ${grade}학년 진도에 맞춘 주제별 수학 학습지. 난이도와 문제 수를 골라 답안지와 함께 인쇄하세요.`,
        alternates,
      }
    : {
        title: `Grade ${grade} Math Worksheets`,
        description: `Printable grade ${grade} math worksheets by topic, aligned with FCPS and the Virginia SOL, with answer keys.`,
        alternates,
      };
}

export default async function GradeWorksheetsPage({ params }: Props) {
  const { locale, grade: slug } = await params;
  const grade = parseGradeSlug(slug);
  if (!hasLocale(locale) || grade === null) notFound();
  const isKo = locale === "ko";
  const lp = (path: string) => localePath(locale as Locale, path);
  const ko = isKo ? " font-ko" : "";
  const sheets = worksheetsForGrade(grade);
  const quarterLabels = isKo ? QUARTER_LABELS_KO : QUARTER_LABELS_EN;

  return (
    <>
      <section className="border-b border-navy-100 bg-white py-10 sm:py-14">
        <Container>
          <Link
            href={lp("/worksheets")}
            className={`inline-flex items-center gap-1.5 rounded-full border border-navy-200 bg-white px-4 py-1.5 text-sm font-medium text-navy-600 shadow-sm transition hover:border-navy-400 hover:text-navy-900${ko}`}
          >
            <ArrowLeft className="h-3.5 w-3.5 shrink-0" />
            {isKo ? "전체 학습지" : "All worksheets"}
          </Link>

          <div className="mt-6 flex flex-wrap items-end justify-between gap-6">
            <div>
              <h1 className={`text-3xl font-bold tracking-tight text-navy-900 sm:text-4xl${ko}`}>
                {isKo ? `${grade}학년 수학 학습지` : `Grade ${grade} Math Worksheets`}
              </h1>
              <p className={`mt-2 text-sm text-navy-600${ko}`}>
                {isKo
                  ? "주제를 선택하면 난이도·문제 수를 골라 바로 인쇄할 수 있습니다. 분기 표시는 FCPS 일반반 진도 기준입니다."
                  : "Choose a topic, pick the level and number of problems, and print. Quarter tags follow the FCPS Standard pacing."}
              </p>
            </div>
            <nav className="flex gap-1.5" aria-label={isKo ? "학년 선택" : "Choose grade"}>
              {WORKSHEET_GRADES.map((g) => (
                <Link
                  key={g}
                  href={lp(`/worksheets/${gradeSlug(g)}`)}
                  aria-current={g === grade ? "page" : undefined}
                  className={cn(
                    "inline-flex h-10 min-w-10 items-center justify-center rounded-lg px-3 text-sm font-semibold transition",
                    g === grade ? "bg-navy-900 text-white" : "border border-navy-200 text-navy-700 hover:bg-navy-50",
                  )}
                >
                  {isKo ? `${g}학년` : `Gr ${g}`}
                </Link>
              ))}
            </nav>
          </div>
        </Container>
      </section>

      <Section className="bg-navy-50/50 py-12 sm:py-16">
        <Container>
          <div className="space-y-12">
            {CATEGORY_LABELS.map((cat) => {
              const inCategory = sheets.filter((s) => s.category === cat.key);
              if (inCategory.length === 0) return null;
              return (
                <div key={cat.key}>
                  <h2 className={`text-lg font-bold text-navy-900${ko}`}>{isKo ? cat.key : cat.en}</h2>
                  <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {inCategory.map((s) => (
                      <Link
                        key={s.slug}
                        href={lp(worksheetPath(s))}
                        className="group flex flex-col rounded-2xl border border-navy-100 bg-white p-5 shadow-sm transition hover:border-navy-300 hover:shadow-md"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <h3 className={`text-base font-bold text-navy-900${ko}`}>{isKo ? s.title.ko : s.title.en}</h3>
                          {s.quarter && (
                            <span className={`shrink-0 rounded-full bg-navy-50 px-2 py-0.5 text-[11px] font-semibold text-navy-600${ko}`}>
                              {quarterLabels[s.quarter]}
                            </span>
                          )}
                        </div>
                        {isKo && <p className="text-xs text-navy-500">{s.title.en}</p>}
                        <p className={`mt-2 flex-1 text-sm leading-6 text-navy-700${ko}`}>
                          {isKo ? s.description.ko : s.description.en}
                        </p>
                        <span className={`mt-4 inline-flex items-center gap-1 text-sm font-semibold text-navy-900 group-hover:text-navy-600${ko}`}>
                          {isKo ? "학습지 만들기" : "Make a worksheet"}
                          <ArrowRight className="h-4 w-4" />
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-12 flex items-center gap-3 rounded-xl border border-navy-100 bg-white px-5 py-4 text-sm text-navy-700">
            <BookOpen className="h-5 w-5 shrink-0 text-navy-500" />
            <p className={isKo ? "font-ko" : undefined}>
              {isKo ? `${grade}학년 학교 진도 전체는 ` : `See the full grade ${grade} school pacing in the `}
              <Link
                href={lp(`/resources/curriculum/${slug}`)}
                className="font-semibold text-navy-900 underline underline-offset-2"
              >
                {isKo ? `${grade}학년 수학 커리큘럼` : `Grade ${grade} Math Curriculum`}
              </Link>
              {isKo ? "에서 확인하세요." : "."}
            </p>
          </div>
        </Container>
      </Section>
    </>
  );
}
