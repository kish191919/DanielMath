import Image from "next/image";
import QRCode from "qrcode";
import { MathText } from "@/components/math-text";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/site-config";
import { CATEGORY_LABELS, LEVEL_LABELS, LEVEL_STARS } from "@/lib/worksheets/labels";
import type { Level, WorksheetDef, WorksheetExample, WorksheetProblem } from "@/lib/worksheets/types";
import { ProblemView } from "./problem-view";
import { WorksheetExampleBox } from "./worksheet-example";

// Static class strings (Tailwind can't see dynamically built ones). Phones get
// fewer columns on screen; print always uses the worksheet's own layout.
const PROBLEM_GRID: Record<WorksheetDef["columns"], string> = {
  2: "grid-cols-1 sm:grid-cols-2 print:grid-cols-2",
  3: "grid-cols-2 sm:grid-cols-3 print:grid-cols-3",
  4: "grid-cols-2 sm:grid-cols-4 print:grid-cols-4",
};

// Answer-key columns are picked so every row is full (counts are multiples of
// the sheet's columns, and 4 when that divides evenly).
const KEY_GRID: Record<2 | 3 | 4, string> = {
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-2 sm:grid-cols-4 print:grid-cols-4",
};

// Each printed page is its own section with the page margin as padding:
// `@page { margin: 0 }` leaves the browser no room for its date/URL header
// and footer. On paper the section fills the page so the footer sits at the
// bottom; print-color-adjust keeps the badges and example tint on paper.
const PAGE =
  "ws-page flex flex-col rounded-xl bg-white p-6 shadow-sm ring-1 ring-navy-100 sm:p-10 print:min-h-[11in] print:rounded-none print:p-[12mm] print:shadow-none print:ring-0";

function Eyebrow({ grade }: { grade: number }) {
  return (
    <div className="flex items-center gap-2 text-navy-500">
      <Image
        src="/brand/daniel-math-academy-logo.png"
        alt=""
        width={20}
        height={20}
        loading="eager"
        className="h-5 w-5 rounded-full"
      />
      <span className="text-[10px] font-bold uppercase tracking-[0.18em]">
        {siteConfig.name} · Grade {grade} Math
      </span>
    </div>
  );
}

function SheetFooter({ seed, page }: { seed: string; page: string }) {
  return (
    <footer className="mt-8 flex items-center justify-between gap-4 border-t border-navy-200 pt-2 text-[10px] text-navy-400 print:mt-auto">
      <span>
        {siteConfig.name} · {siteConfig.url.replace(/^https?:\/\//, "")}
      </span>
      <span>
        Worksheet #{seed} · {page}
      </span>
    </footer>
  );
}

function NumberBadge({ n }: { n: number }) {
  return (
    <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-navy-900 text-[11px] font-bold leading-none text-white">
      {n}
    </span>
  );
}

// Everything printed here is English only — students learn math in English.
export async function WorksheetSheet({
  def,
  problems,
  level,
  seed,
  answersUrl,
  showKey,
  example,
}: {
  def: WorksheetDef;
  problems: WorksheetProblem[];
  level: Level;
  seed: string;
  answersUrl: string;
  showKey: boolean;
  /** null when the example is switched off. */
  example: WorksheetExample | null;
}) {
  const qrSvg = await QRCode.toString(answersUrl, { type: "svg", margin: 1 });
  const category = CATEGORY_LABELS.find((c) => c.key === def.category)?.en;
  const meta = [
    `${LEVEL_STARS[level]} ${LEVEL_LABELS[level].en}`,
    category,
    def.quarter && `Quarter ${def.quarter.slice(1)}`,
  ].filter(Boolean);
  const pages = showKey ? 2 : 1;
  const keyColumns = def.columns === 2 ? 2 : problems.length % 4 === 0 ? 4 : 3;

  return (
    // A math expression never breaks mid-way (KaTeX allows a break after any
    // operator); the text around it still wraps.
    <div className="mx-auto w-full max-w-[8.5in] space-y-8 [print-color-adjust:exact] print:max-w-none print:space-y-0 [&_.katex]:whitespace-nowrap">
      <style>{`
        @page { size: letter; margin: 0; }
        @media print { .ws-page + .ws-page { break-before: page; } }
      `}</style>

      <section className={PAGE}>
        <header className="flex items-start justify-between gap-6 border-b-2 border-navy-900 pb-3">
          <div className="min-w-0 flex-1">
            <Eyebrow grade={def.grade} />
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-navy-900">{def.title.en}</h2>
            <p className="mt-0.5 text-xs font-medium text-navy-500">{meta.join(" · ")}</p>
            <dl className="mt-3 flex flex-wrap gap-x-6 gap-y-3 text-sm text-navy-800">
              <div className="flex items-end gap-2">
                <dt className="font-medium">Name</dt>
                <dd className="w-44 border-b border-navy-500">&nbsp;</dd>
              </div>
              <div className="flex items-end gap-2">
                <dt className="font-medium">Date</dt>
                <dd className="w-28 border-b border-navy-500">&nbsp;</dd>
              </div>
            </dl>
          </div>
          <div className="flex shrink-0 items-stretch gap-2">
            <div className="flex w-20 flex-col rounded-lg border border-navy-300 px-2 py-1.5 text-center">
              <span className="text-[10px] font-bold uppercase tracking-widest text-navy-500">Score</span>
              <span className="mt-auto text-sm text-navy-700">/ {problems.length}</span>
            </div>
            {/* The QR is for paper — on a phone it only crowds the title. */}
            <div className="hidden flex-col items-center gap-1 rounded-lg border border-navy-300 p-1.5 sm:flex print:flex">
              <div className="h-14 w-14 [&>svg]:h-full [&>svg]:w-full" dangerouslySetInnerHTML={{ __html: qrSvg }} />
              <p className="text-[9px] leading-none text-navy-500">Scan for answers</p>
            </div>
          </div>
        </header>

        <p className="mt-3 text-[15px] italic text-navy-800">{def.instructions}</p>
        {example && <WorksheetExampleBox example={example} />}

        <ol className={cn("mt-3 grid border-l border-t border-navy-200", PROBLEM_GRID[def.columns])}>
          {problems.map((p, i) => (
            <li key={i} className="flex min-w-0 break-inside-avoid gap-2.5 border-b border-r border-navy-200 p-3">
              <NumberBadge n={i + 1} />
              <div className="min-w-0 flex-1">
                <ProblemView body={p.body} />
              </div>
            </li>
          ))}
        </ol>

        <SheetFooter seed={seed} page={`Page 1 / ${pages}`} />
      </section>

      {showKey && (
        <section className={PAGE}>
          <header className="flex items-end justify-between gap-4 border-b-2 border-navy-900 pb-3">
            <div>
              <Eyebrow grade={def.grade} />
              <h2 className="mt-2 text-xl font-bold text-navy-900">Answer Key</h2>
            </div>
            <p className="text-xs text-navy-500">
              {def.title.en} · {LEVEL_STARS[level]} {LEVEL_LABELS[level].en}
            </p>
          </header>
          <ol className={cn("mt-4 grid border-l border-t border-navy-200 text-sm text-navy-800", KEY_GRID[keyColumns])}>
            {problems.map((p, i) => (
              <li key={i} className="flex min-w-0 items-start gap-2 border-b border-r border-navy-200 px-3 py-2">
                <NumberBadge n={i + 1} />
                <span className="mt-0.5 min-w-0">
                  <MathText text={p.answer} />
                </span>
              </li>
            ))}
          </ol>
          <SheetFooter seed={seed} page={`Answer Key · Page 2 / ${pages}`} />
        </section>
      )}
    </div>
  );
}
