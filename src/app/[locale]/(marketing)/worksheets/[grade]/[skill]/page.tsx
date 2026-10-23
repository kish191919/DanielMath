import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Container } from "@/components/site/container";
import { WorksheetControls } from "@/components/worksheets/worksheet-controls";
import { WorksheetSheet } from "@/components/worksheets/worksheet-sheet";
import { QUARTER_LABELS_EN, QUARTER_LABELS_KO } from "@/lib/curriculum-quarter";
import { hasLocale, localePath, type Locale } from "@/lib/i18n";
import { pageAlternates } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";
import { buildWorksheet, parseWorksheetParams, worksheetQuery } from "@/lib/worksheets/build";
import { getWorksheet, gradeSlug, worksheetPath, worksheetsForGrade } from "@/lib/worksheets/catalog";
import { newSeed } from "@/lib/worksheets/rng";

type Props = {
  params: Promise<{ locale: string; grade: string; skill: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, grade, skill } = await params;
  const def = getWorksheet(grade, skill);
  if (!hasLocale(locale) || !def) return {};
  // Canonical drops the query string — every seed/level variant is the same page for search.
  const alternates = pageAlternates(locale, worksheetPath(def));
  return locale === "ko"
    ? {
        title: `${def.grade}학년 ${def.title.ko} 학습지`,
        description: `${def.description.ko}. 매번 새 문제로 만들고 답안지와 함께 무료로 인쇄하세요.`,
        alternates,
      }
    : {
        title: `Grade ${def.grade} ${def.title.en} Worksheets`,
        description: `${def.description.en} Free printable worksheets with fresh problems every time and an answer key.`,
        alternates,
      };
}

export default async function WorksheetPage({ params, searchParams }: Props) {
  const { locale, grade, skill } = await params;
  const def = getWorksheet(grade, skill);
  if (!hasLocale(locale) || !def) notFound();
  const isKo = locale === "ko";
  const lp = (path: string) => localePath(locale as Locale, path);
  const ko = isKo ? " font-ko" : "";

  const options = parseWorksheetParams(await searchParams, def);
  // No redirect when the seed is missing: the page renders with a fresh one,
  // and the controls/QR carry it from there.
  const seed = options.seed ?? newSeed();
  const problems = buildWorksheet(def, { count: options.count, level: options.level, seed });
  const path = lp(worksheetPath(def));
  const query = worksheetQuery({ ...options, seed });
  const answersUrl = `${siteConfig.url}${path}/answers?${query}`;
  const siblings = worksheetsForGrade(def.grade).filter((w) => w.slug !== def.slug);

  return (
    <div className="bg-navy-50/50 print:bg-white">
      <Container className="py-8 sm:py-12 print:max-w-none print:p-0">
        <div className="print:hidden">
          <nav className={`flex flex-wrap items-center gap-1 text-sm text-navy-500${ko}`} aria-label="Breadcrumb">
            <Link href={lp("/worksheets")} className="hover:text-navy-900">
              {isKo ? "학습지" : "Worksheets"}
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link href={lp(`/worksheets/${gradeSlug(def.grade)}`)} className="hover:text-navy-900">
              {isKo ? `${def.grade}학년` : `Grade ${def.grade}`}
            </Link>
          </nav>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <h1 className={`text-2xl font-bold tracking-tight text-navy-900 sm:text-3xl${ko}`}>
              {isKo ? def.title.ko : def.title.en}
            </h1>
            {def.quarter && (
              <span className={`rounded-full bg-white px-2.5 py-0.5 text-xs font-semibold text-navy-600 ring-1 ring-navy-200${ko}`}>
                {(isKo ? QUARTER_LABELS_KO : QUARTER_LABELS_EN)[def.quarter]}
              </span>
            )}
          </div>
          <p className={`mt-2 text-sm text-navy-600${ko}`}>{isKo ? def.description.ko : def.description.en}</p>

          <div className="mt-6">
            <WorksheetControls
              path={path}
              counts={def.counts}
              count={options.count}
              level={options.level}
              seed={seed}
              showKey={options.showKey}
              isKo={isKo}
            />
          </div>
        </div>

        <div className="mt-6 print:mt-0">
          <WorksheetSheet
            def={def}
            problems={problems}
            level={options.level}
            seed={seed}
            answersUrl={answersUrl}
            showKey={options.showKey}
          />
        </div>

        {siblings.length > 0 && (
          <div className="mt-12 print:hidden">
            <h2 className={`text-base font-bold text-navy-900${ko}`}>
              {isKo ? `${def.grade}학년 다른 학습지` : `More grade ${def.grade} worksheets`}
            </h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {siblings.map((s) => (
                <Link
                  key={s.slug}
                  href={lp(worksheetPath(s))}
                  className={`rounded-full bg-white px-3 py-1.5 text-sm text-navy-700 ring-1 ring-navy-200 transition hover:bg-navy-50 hover:text-navy-900${ko}`}
                >
                  {isKo ? s.title.ko : s.title.en}
                </Link>
              ))}
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}
