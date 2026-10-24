import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { BookOpen, ChevronRight } from "lucide-react";
import { Container } from "@/components/site/container";
import { Section } from "@/components/site/section";
import { WorksheetUnitBrowser, type UnitItem } from "@/components/worksheets/topic-browser";
import { GRADE_COLORS, UNIT_COLORS } from "@/components/worksheets/unit-style";
import { hasLocale, localePath, type Locale } from "@/lib/i18n";
import { pageAlternates } from "@/lib/seo";
import { cn } from "@/lib/utils";
import {
  gradeSlug,
  parseGradeSlug,
  skillKey,
  skillPosition,
  WORKSHEET_GRADES,
  worksheetPath,
  worksheetsForGrade,
  worksheetsInUnit,
} from "@/lib/worksheets/catalog";
import { unitLetter, unitsForGrade } from "@/lib/worksheets/units";

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
        description: `FCPS·버지니아 SOL ${grade}학년 진도에 맞춘 단원·스킬별 수학 학습지. 세부 스킬을 골라 답안지와 함께 인쇄하세요.`,
        alternates,
      }
    : {
        title: `Grade ${grade} Math Worksheets`,
        description: `Printable grade ${grade} math worksheets by unit and skill, aligned with FCPS and the Virginia SOL, with answer keys.`,
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
  const skillCount = worksheetsForGrade(grade).length;
  const units: UnitItem[] = unitsForGrade(grade).map((u, i) => ({
    key: u.key,
    letter: unitLetter(i),
    title: isKo ? u.title.ko : u.title.en,
    subtitle: isKo ? u.title.en : undefined,
    category: u.category,
    icon: u.icon,
    color: u.color,
    search: [u.title.ko, u.title.en].join(" ").toLowerCase(),
    skills: worksheetsInUnit(grade, u.key).map((s) => ({
      id: skillKey(s),
      href: lp(worksheetPath(s)),
      code: skillPosition(s).code,
      title: isKo ? s.title.ko : s.title.en,
      subtitle: isKo ? s.title.en : undefined,
      chip: s.chip && (isKo ? s.chip.ko : s.chip.en),
      quarter: s.quarter,
      multiLevel: s.levels.length > 1,
      search: [s.title.ko, s.title.en, s.description.ko, s.description.en].join(" ").toLowerCase(),
    })),
  }));
  const gradeTile = UNIT_COLORS[GRADE_COLORS[grade]].tile;

  return (
    <>
      <section className="border-b border-navy-100 bg-white py-8 sm:py-10">
        <Container>
          <nav className={`flex items-center gap-1 text-sm text-navy-500${ko}`} aria-label="Breadcrumb">
            <Link href={lp("/worksheets")} className="hover:text-navy-900">
              {isKo ? "학습지" : "Worksheets"}
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span aria-current="page">{isKo ? `${grade}학년` : `Grade ${grade}`}</span>
          </nav>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-5">
            <div className="flex items-center gap-4">
              <span
                className={cn(
                  "flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-3xl font-black shadow-sm sm:h-16 sm:w-16",
                  gradeTile,
                )}
                aria-hidden
              >
                {grade}
              </span>
              <div>
                <h1 className={`text-2xl font-bold tracking-tight text-navy-900 sm:text-3xl${ko}`}>
                  {isKo ? `${grade}학년 수학 학습지` : `Grade ${grade} Math Worksheets`}
                </h1>
                <p className={`mt-1 text-sm text-navy-500${ko}`}>
                  {isKo
                    ? `단원 ${units.length}개 · 스킬 ${skillCount}개 · 단원을 눌러 연습할 스킬을 골라요`
                    : `${units.length} units · ${skillCount} skills · Open a unit to pick a skill`}
                </p>
              </div>
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

      <Section className="bg-navy-50/50 py-8 sm:py-12">
        <Container>
          <WorksheetUnitBrowser units={units} isKo={isKo} />

          <p className={`mt-12 flex items-center justify-center gap-2 text-sm text-navy-600${ko}`}>
            <BookOpen className="h-4 w-4 shrink-0 text-navy-400" />
            <span>
              {isKo ? `${grade}학년 학교 진도 전체는 ` : `See the full grade ${grade} school pacing in the `}
              <Link
                href={lp(`/resources/curriculum/${slug}`)}
                className="font-semibold text-navy-900 underline underline-offset-2"
              >
                {isKo ? `${grade}학년 수학 커리큘럼` : `Grade ${grade} Math Curriculum`}
              </Link>
              {isKo ? "에서 확인하세요." : "."}
            </span>
          </p>
        </Container>
      </Section>
    </>
  );
}
