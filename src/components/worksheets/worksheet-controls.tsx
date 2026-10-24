"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw } from "lucide-react";
import { PrintButton } from "@/components/ui/print-button";
import { worksheetQuery } from "@/lib/worksheets/build";
import { LEVEL_LABELS, LEVEL_STARS } from "@/lib/worksheets/labels";
import { newSeed } from "@/lib/worksheets/rng";
import type { Level } from "@/lib/worksheets/types";
import { cn } from "@/lib/utils";
import { StickerButton } from "./stickers";

function pillClass(active: boolean) {
  return cn(
    "inline-flex items-center rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
    active ? "bg-navy-900 text-white" : "bg-white text-navy-700 ring-1 ring-navy-200 hover:bg-navy-50",
  );
}

type State = { count: number; level: Level; seed: string; showKey: boolean; showExample: boolean };

// Options live in the URL (not component state) so the printed QR code and a
// shared link both reproduce exactly what's on screen.
export function WorksheetControls({
  path,
  counts,
  levels,
  stickerId,
  isKo,
  ...state
}: State & { path: string; counts: readonly number[]; levels: readonly Level[]; stickerId: string; isKo: boolean }) {
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
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
        {/* Narrow skills have one level; the skill list is their progression. */}
        {levels.length > 1 && (
          <div className="flex items-center gap-2">
            <span className={cn("text-sm font-semibold text-navy-800", ko)}>{isKo ? "난이도" : "Level"}</span>
            <div className="flex gap-1.5">
              {levels.map((l) => (
                <button key={l} type="button" onClick={() => go({ level: l })} className={pillClass(state.level === l)}>
                  <span className={cn("mr-1 text-xs", state.level === l ? "text-gold-300" : "text-amber-500")} aria-hidden>
                    {LEVEL_STARS[l]}
                  </span>
                  <span className={ko}>{isKo ? LEVEL_LABELS[l].ko : LEVEL_LABELS[l].en}</span>
                </button>
              ))}
            </div>
          </div>
        )}
        <div className="flex items-center gap-2">
          <span className={cn("text-sm font-semibold text-navy-800", ko)}>{isKo ? "문제 수" : "Problems"}</span>
          <div className="flex gap-1.5">
            {counts.map((c) => (
              <button key={c} type="button" onClick={() => go({ count: c })} className={pillClass(state.count === c)}>
                {c}
              </button>
            ))}
          </div>
        </div>
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

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => go({ seed: newSeed() })}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-lg border border-navy-200 bg-white px-4 py-2 text-sm font-medium text-navy-800 hover:bg-navy-50",
            ko,
          )}
        >
          <RefreshCw className="h-4 w-4" />
          {isKo ? "새 문제 만들기" : "New problems"}
        </button>
        <PrintButton label={isKo ? "인쇄하기" : "Print"} />
        <StickerButton id={stickerId} isKo={isKo} />
        <p className={cn("ml-auto text-xs text-navy-500", ko)}>
          {isKo
            ? `학습지 #${state.seed} — 같은 링크는 항상 같은 문제를 보여줍니다.`
            : `Worksheet #${state.seed} — this link always shows the same problems.`}
        </p>
      </div>
    </div>
  );
}
