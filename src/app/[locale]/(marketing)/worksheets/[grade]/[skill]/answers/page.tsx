import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { MathText } from "@/components/math-text";
import { hasLocale, localePath, type Locale } from "@/lib/i18n";
import { buildWorksheet, parseWorksheetParams, worksheetQuery } from "@/lib/worksheets/build";
import { getWorksheet, worksheetPath } from "@/lib/worksheets/catalog";
import { LEVEL_LABELS } from "@/lib/worksheets/labels";

type Props = {
  params: Promise<{ locale: string; grade: string; skill: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { grade, skill } = await params;
  const def = getWorksheet(grade, skill);
  return {
    title: def ? `${def.title.en} — Answer Key` : "Answer Key",
    robots: { index: false, follow: false },
  };
}

// Target of the QR code printed on each worksheet. The seed in the URL
// regenerates the exact same problems, so no answers are stored anywhere.
export default async function WorksheetAnswersPage({ params, searchParams }: Props) {
  const { locale, grade, skill } = await params;
  const def = getWorksheet(grade, skill);
  if (!hasLocale(locale) || !def) notFound();
  const isKo = locale === "ko";
  const ko = isKo ? " font-ko" : "";
  const path = localePath(locale as Locale, worksheetPath(def));

  // Any count, not just today's options: the QR on an older printout still works.
  const options = parseWorksheetParams(await searchParams, def, { anyCount: true });
  const seed = options.seed;

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <p className="text-xs font-semibold uppercase tracking-widest text-navy-500">Daniel Math Academy</p>
      <h1 className="mt-1 text-xl font-bold text-navy-900">{def.title.en} — Answer Key</h1>

      {seed === null ? (
        <p className={`mt-6 text-sm text-navy-600${ko}`}>
          {isKo
            ? "이 링크에는 학습지 번호가 없습니다. 학습지의 QR 코드를 다시 스캔해 주세요."
            : "This link has no worksheet number. Please scan the QR code on the worksheet again."}
        </p>
      ) : (
        <>
          <p className="mt-1 text-sm text-navy-500">
            Grade {def.grade} · {LEVEL_LABELS[options.level].en} · Worksheet #{seed}
          </p>
          <ol className="mt-6 space-y-2.5 text-base text-navy-800">
            {buildWorksheet(def, { count: options.count, level: options.level, seed }).map((p, i) => (
              <li key={i}>
                <span className="font-semibold text-navy-500">{i + 1}.</span> <MathText text={p.answer} />
              </li>
            ))}
          </ol>
        </>
      )}

      <Link
        href={seed === null ? path : `${path}?${worksheetQuery({ ...options, seed })}`}
        className={`mt-10 inline-flex items-center gap-1.5 text-sm font-semibold text-navy-700 hover:text-navy-900${ko}`}
      >
        <ArrowLeft className="h-4 w-4" />
        {isKo ? "학습지로 돌아가기" : "Back to the worksheet"}
      </Link>
    </div>
  );
}
