"use client";

import { useId, useTransition, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw } from "lucide-react";
import { PrintButton } from "@/components/ui/print-button";
import { worksheetQuery } from "@/lib/worksheets/build";
import { LEVEL_LABELS, LEVEL_STARS } from "@/lib/worksheets/labels";
import { newSeed } from "@/lib/worksheets/rng";
import type { Level } from "@/lib/worksheets/types";
import { cn } from "@/lib/utils";

function segmentClass(active: boolean) {
  return cn(
    "inline-flex items-center justify-center rounded-lg px-2 py-1.5 text-sm font-semibold whitespace-nowrap transition sm:px-3",
    active ? "bg-white text-navy-900 shadow-sm" : "text-navy-500 hover:text-navy-800",
  );
}

// Label above a full-width control on phones, beside it from `sm` up.
function Segmented({ label, labelClass, children }: { label: string; labelClass?: string; children: ReactNode }) {
  const id = useId();
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-2.5">
      <span id={id} className={cn("text-sm font-semibold text-navy-800", labelClass)}>
        {label}
      </span>
      <div role="group" aria-labelledby={id} className="grid auto-cols-fr grid-flow-col gap-1 rounded-xl bg-navy-100/70 p-1">
        {children}
      </div>
    </div>
  );
}

type State = { count: number; level: Level; seed: string; showKey: boolean; showExample: boolean };

// Options live in the URL (not component state) so the printed QR code and a
// shared link both reproduce exactly what's on screen.
export function WorksheetControls({
  path,
  counts,
  levels,
  isKo,
  ...state
}: State & { path: string; counts: readonly number[]; levels: readonly Level[]; isKo: boolean }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const go = (next: Partial<State>) => {
    const query = worksheetQuery({ ...state, ...next });
    startTransition(() => router.replace(`${path}?${query}`, { scroll: false }));
  };

  const ko = isKo ? "font-ko" : undefined;

  return (
    <div
      className={cn(
        "flex flex-col gap-4 rounded-2xl border border-navy-100 bg-white p-4 shadow-sm transition-opacity sm:p-5 print:hidden",
        pending && "opacity-60",
      )}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-6 sm:gap-y-3">
        {/* Narrow skills have one level; the skill list is their progression. */}
        {levels.length > 1 && (
          <Segmented label={isKo ? "난이도" : "Level"} labelClass={ko}>
            {levels.map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => go({ level: l })}
                aria-pressed={state.level === l}
                className={cn(segmentClass(state.level === l), "flex-col gap-0.5 sm:flex-row sm:gap-1")}
              >
                <span className="text-xs leading-none text-amber-500" aria-hidden>
                  {LEVEL_STARS[l]}
                </span>
                <span className={ko}>{isKo ? LEVEL_LABELS[l].ko : LEVEL_LABELS[l].en}</span>
              </button>
            ))}
          </Segmented>
        )}
        <Segmented label={isKo ? "문제 수" : "Problems"} labelClass={ko}>
          {counts.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => go({ count: c })}
              aria-pressed={state.count === c}
              className={cn(segmentClass(state.count === c), "tabular-nums sm:min-w-11")}
            >
              {c}
            </button>
          ))}
        </Segmented>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <label className={cn("flex items-center gap-2 text-sm text-navy-700", ko)}>
            <input
              type="checkbox"
              checked={state.showExample}
              onChange={(e) => go({ showExample: e.target.checked })}
              className="h-4 w-4 rounded border-navy-300"
            />
            {isKo ? "예제 포함" : "Show example"}
          </label>
          <label className={cn("flex items-center gap-2 text-sm text-navy-700", ko)}>
            <input
              type="checkbox"
              checked={state.showKey}
              onChange={(e) => go({ showKey: e.target.checked })}
              className="h-4 w-4 rounded border-navy-300"
            />
            {isKo ? "답안지 포함" : "Include answer key"}
          </label>
        </div>
      </div>

      <div className="flex gap-2 border-t border-navy-100 pt-4 sm:flex-wrap sm:items-center">
        <button
          type="button"
          onClick={() => go({ seed: newSeed() })}
          className={cn(
            "inline-flex flex-auto items-center justify-center gap-1.5 rounded-lg border border-navy-200 bg-white px-3 py-2 text-sm font-medium text-navy-800 hover:bg-navy-50 sm:flex-none sm:px-4",
            ko,
          )}
        >
          <RefreshCw className="h-4 w-4 shrink-0" />
          {isKo ? "새 문제 만들기" : "New problems"}
        </button>
        <PrintButton label={isKo ? "인쇄하기" : "Print"} className={cn("flex-auto sm:flex-none", ko)} />
      </div>
    </div>
  );
}
