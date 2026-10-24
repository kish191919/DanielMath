import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ChevronRight } from "lucide-react";
import { Container } from "@/components/site/container";
import { WorksheetControls } from "@/components/worksheets/worksheet-controls";
import { WorksheetSheet } from "@/components/worksheets/worksheet-sheet";
import { UNIT_COLORS, UNIT_ICONS } from "@/components/worksheets/unit-style";
import { QUARTER_LABELS_EN, QUARTER_LABELS_KO } from "@/lib/curriculum-quarter";
import { hasLocale, localePath, type Locale } from "@/lib/i18n";
import { pageAlternates } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";
import { buildWorksheet, exampleFor, parseWorksheetParams, worksheetQuery } from "@/lib/worksheets/build";
import {
  getWorksheet,
  gradeSlug,
  skillKey,
  skillPosition,
  skillsInOrder,
  worksheetPath,
  worksheetsInUnit,
} from "@/lib/worksheets/catalog";
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

  const { unit, letter, code } = skillPosition(def);
  const sw = UNIT_COLORS[unit.color];
  const UnitIcon = UNIT_ICONS[unit.icon];
  const unitTitle = isKo ? unit.title.ko : unit.title.en;
  const gradePath = lp(`/worksheets/${gradeSlug(def.grade)}`);
  const order = skillsInOrder(def.grade);
  const index = order.indexOf(def);
  const [prev, next] = [order[index - 1], order[index + 1]];
  const siblings = worksheetsInUnit(def.grade, def.unit);
  const skillTitle = (s: typeof def) => (isKo ? s.title.ko : s.title.en);

  return (
    <div className="bg-navy-50/50 print:bg-white">
      <Container className="py-8 sm:py-12 print:max-w-none print:p-0">
        <div className="print:hidden">
          <nav className={`flex flex-wrap items-center gap-1 text-sm text-navy-500${ko}`} aria-label="Breadcrumb">
            <Link href={lp("/worksheets")} className="hover:text-navy-900">
              {isKo ? "학습지" : "Worksheets"}
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link href={gradePath} className="hover:text-navy-900">
              {isKo ? `${def.grade}학년` : `Grade ${def.grade}`}
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span>
              {letter}. {unitTitle}
            </span>
          </nav>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <span
              className={cn("inline-flex h-9 items-center gap-1.5 rounded-xl px-2.5 text-sm font-extrabold tabular-nums shadow-sm", sw.tile)}
            >
              <UnitIcon className="h-4 w-4" strokeWidth={2.5} />
              {code}
            </span>
            <h1 className={`text-2xl font-bold tracking-tight text-navy-900 sm:text-3xl${ko}`}>{skillTitle(def)}</h1>
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
              levels={def.levels}
              count={options.count}
              level={options.level}
              seed={seed}
              showKey={options.showKey}
              showExample={options.showExample}
              stickerId={skillKey(def)}
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
            code={code}
            unitTitle={unit.title.en}
            example={options.showExample ? exampleFor(def, options.level) : null}
          />
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-start print:hidden">
          <section aria-labelledby="unit-skills" className={cn("rounded-2xl bg-white p-4 ring-1 sm:p-5", sw.ring)}>
            <h2 id="unit-skills" className={`flex items-center gap-2 text-base font-bold text-navy-900${ko}`}>
              <span className={cn("flex h-7 w-7 items-center justify-center rounded-lg", sw.tile)}>
                <UnitIcon className="h-4 w-4" strokeWidth={2.5} />
              </span>
              {letter}. {unitTitle}
              <span className="text-sm font-medium text-navy-400">
                {isKo ? `스킬 ${siblings.length}개` : `${siblings.length} skill${siblings.length === 1 ? "" : "s"}`}
              </span>
            </h2>
            <ol className="mt-3 flex flex-wrap gap-2">
              {siblings.map((s) => {
                const current = s === def;
                return (
                  <li key={s.slug}>
                    <Link
                      href={lp(worksheetPath(s))}
                      aria-current={current ? "page" : undefined}
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm transition",
                        current ? cn(sw.tile, "font-semibold") : "bg-white text-navy-700 ring-1 ring-navy-200 hover:bg-navy-50",
                        isKo && "font-ko",
                      )}
                    >
                      <span className={cn("text-xs font-extrabold tabular-nums", !current && sw.text)}>
                        {skillPosition(s).code}
                      </span>
                      {s.chip ? (isKo ? s.chip.ko : s.chip.en) : skillTitle(s)}
                    </Link>
                  </li>
                );
              })}
            </ol>
          </section>

          <nav className="flex gap-2 lg:flex-col" aria-label={isKo ? "이전·다음 스킬" : "Previous and next skill"}>
            {prev && (
              <Link
                href={lp(worksheetPath(prev))}
                className={`group flex flex-1 items-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm ring-1 ring-navy-200 transition hover:ring-navy-400 lg:w-72${ko}`}
              >
                <ArrowLeft className="h-4 w-4 shrink-0 text-navy-400 transition group-hover:-translate-x-0.5" />
                <span className="min-w-0">
                  <span className="block text-xs text-navy-400">{isKo ? "이전 스킬" : "Previous"}</span>
                  <span className="block truncate font-semibold text-navy-800">
                    {skillPosition(prev).code} {skillTitle(prev)}
                  </span>
                </span>
              </Link>
            )}
            {next && (
              <Link
                href={lp(worksheetPath(next))}
                className={`group flex flex-1 items-center justify-end gap-2 rounded-2xl bg-navy-900 px-4 py-3 text-right text-sm text-white transition hover:bg-navy-800 lg:w-72${ko}`}
              >
                <span className="min-w-0">
                  <span className="block text-xs text-navy-300">{isKo ? "다음 스킬" : "Next"}</span>
                  <span className="block truncate font-semibold">
                    {skillPosition(next).code} {skillTitle(next)}
                  </span>
                </span>
                <ArrowRight className="h-4 w-4 shrink-0 text-navy-300 transition group-hover:translate-x-0.5" />
              </Link>
            )}
          </nav>
        </div>
      </Container>
    </div>
  );
}
