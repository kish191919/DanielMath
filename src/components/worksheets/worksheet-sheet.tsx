import QRCode from "qrcode";
import { MathText } from "@/components/math-text";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/site-config";
import { LEVEL_LABELS } from "@/lib/worksheets/labels";
import type { Level, WorksheetDef, WorksheetProblem } from "@/lib/worksheets/types";
import { ProblemView } from "./problem-view";

// Static class strings (Tailwind can't see dynamically built ones). Phones get
// fewer columns on screen; print always uses the worksheet's own layout.
const PROBLEM_GRID: Record<WorksheetDef["columns"], string> = {
  2: "grid-cols-1 sm:grid-cols-2 print:grid-cols-2",
  3: "grid-cols-2 sm:grid-cols-3 print:grid-cols-3",
  4: "grid-cols-2 sm:grid-cols-4 print:grid-cols-4",
};

function SheetFooter({ seed }: { seed: string }) {
  return (
    <p className="mt-10 text-center text-[10px] text-navy-400 print:mt-6">
      {siteConfig.name} · {siteConfig.url.replace(/^https?:\/\//, "")} · Worksheet #{seed}
    </p>
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
}: {
  def: WorksheetDef;
  problems: WorksheetProblem[];
  level: Level;
  seed: string;
  answersUrl: string;
  showKey: boolean;
}) {
  const qrSvg = await QRCode.toString(answersUrl, { type: "svg", margin: 1 });

  return (
    <article className="mx-auto w-full max-w-[8.5in] rounded-xl bg-white p-6 shadow-sm ring-1 ring-navy-100 sm:p-10 print:max-w-none print:rounded-none print:p-0 print:shadow-none print:ring-0">
      <style>{`
        @page { size: letter; margin: 12mm; }
        @media print { .ws-page-break { break-before: page; } }
      `}</style>

      <header className="flex items-start justify-between gap-6 border-b-2 border-navy-900 pb-4">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-widest text-navy-500">
            Grade {def.grade} · {LEVEL_LABELS[level].en}
          </p>
          <h2 className="mt-1 text-xl font-bold text-navy-900">{def.title.en}</h2>
          <dl className="mt-4 flex flex-wrap gap-x-6 gap-y-3 text-sm text-navy-800">
            <div className="flex items-end gap-2">
              <dt className="font-medium">Name</dt>
              <dd className="w-40 border-b border-navy-400">&nbsp;</dd>
            </div>
            <div className="flex items-end gap-2">
              <dt className="font-medium">Date</dt>
              <dd className="w-24 border-b border-navy-400">&nbsp;</dd>
            </div>
            <div className="flex items-end gap-2">
              <dt className="font-medium">Score</dt>
              <dd className="w-10 border-b border-navy-400">&nbsp;</dd>
              <span>/ {problems.length}</span>
            </div>
          </dl>
        </div>
        <div className="flex shrink-0 flex-col items-center gap-1 rounded-lg border border-navy-200 p-2">
          <div className="h-16 w-16 [&>svg]:h-full [&>svg]:w-full" dangerouslySetInnerHTML={{ __html: qrSvg }} />
          <p className="text-center text-[10px] leading-tight text-navy-500">
            Scan for
            <br />
            answers
          </p>
        </div>
      </header>

      <p className="mt-4 text-sm font-medium text-navy-800">{def.instructions}</p>

      <ol className={cn("mt-6 grid gap-x-6 gap-y-10 print:gap-y-8", PROBLEM_GRID[def.columns])}>
        {problems.map((p, i) => (
          <li key={i} className="flex min-w-0 break-inside-avoid gap-2 [page-break-inside:avoid]">
            <span className="w-6 shrink-0 pt-1 text-right text-sm font-semibold text-navy-500">{i + 1}.</span>
            <div className="min-w-0 flex-1">
              <ProblemView body={p.body} />
            </div>
          </li>
        ))}
      </ol>

      <SheetFooter seed={seed} />

      {showKey && (
        <section className="ws-page-break mt-12 border-t-2 border-dashed border-navy-200 pt-8 print:mt-0 print:border-0 print:pt-0">
          <header className="flex items-baseline justify-between gap-4 border-b-2 border-navy-900 pb-3">
            <h2 className="text-lg font-bold text-navy-900">Answer Key</h2>
            <p className="text-xs text-navy-500">
              {def.title.en} · Grade {def.grade} · {LEVEL_LABELS[level].en}
            </p>
          </header>
          <ol
            className={cn(
              "mt-6 grid gap-x-6 gap-y-2.5 text-sm text-navy-800",
              def.columns <= 2
                ? "grid-cols-1 sm:grid-cols-2 print:grid-cols-2"
                : "grid-cols-2 sm:grid-cols-4 print:grid-cols-4",
            )}
          >
            {problems.map((p, i) => (
              <li key={i} className="break-inside-avoid">
                <span className="font-semibold text-navy-500">{i + 1}.</span> <MathText text={p.answer} />
              </li>
            ))}
          </ol>
          <SheetFooter seed={seed} />
        </section>
      )}
    </article>
  );
}
