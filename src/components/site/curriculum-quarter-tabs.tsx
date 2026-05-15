"use client";

import { useState } from "react";
import type { QuarterData } from "@/lib/curriculum-data";

type Quarter = "Q1" | "Q2" | "Q3" | "Q4";

function getCurrentQuarter(): Quarter {
  const m = new Date().getMonth() + 1;
  if (m >= 9 && m <= 11) return "Q1";
  if (m === 12 || m === 1 || m === 2) return "Q2";
  if (m === 3) return "Q3";
  if (m >= 4 && m <= 6) return "Q4";
  return "Q1";
}

const QUARTER_LABELS_KO: Record<Quarter, string> = {
  Q1: "1분기 (9~11월)",
  Q2: "2분기 (12~2월)",
  Q3: "3분기 (2~4월)",
  Q4: "4분기 (4~6월)",
};
const QUARTER_LABELS_EN: Record<Quarter, string> = {
  Q1: "Q1 · Sep–Nov",
  Q2: "Q2 · Dec–Feb",
  Q3: "Q3 · Feb–Apr",
  Q4: "Q4 · Apr–Jun",
};

interface QuarterTabsProps {
  standardQuarters: QuarterData[];
  advancedQuarters: QuarterData[];
  isKo: boolean;
}

export function QuarterTabs({ standardQuarters, advancedQuarters, isKo }: QuarterTabsProps) {
  const currentQ = getCurrentQuarter();
  const [activeQ, setActiveQ] = useState<Quarter>(currentQ);
  const quarters: Quarter[] = ["Q1", "Q2", "Q3", "Q4"];
  const qLabels = isKo ? QUARTER_LABELS_KO : QUARTER_LABELS_EN;

  const sq = standardQuarters.find((q) => q.quarter === activeQ);
  const aq = advancedQuarters.find((q) => q.quarter === activeQ);

  return (
    <div>
      {/* Tab bar */}
      <div className="flex gap-1 rounded-xl bg-navy-50 p-1">
        {quarters.map((q) => {
          const isActive = activeQ === q;
          const isCurrent = q === currentQ;
          return (
            <button
              key={q}
              onClick={() => setActiveQ(q)}
              className={`relative flex-1 rounded-lg py-2.5 text-sm font-semibold transition-all ${
                isActive
                  ? "bg-white text-navy-900 shadow-sm"
                  : "text-navy-500 hover:text-navy-800"
              }`}
            >
              {q}
              {isCurrent && (
                <span
                  className={`absolute -top-0.5 right-1.5 h-1.5 w-1.5 rounded-full ${
                    isActive ? "bg-gold-500" : "bg-gold-400"
                  }`}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Quarter label + current indicator */}
      <div className="mt-3 flex items-center justify-center gap-2 text-xs text-navy-500">
        <span>{qLabels[activeQ]}</span>
        {activeQ === currentQ && (
          <span className={`rounded-full bg-gold-500/10 px-2 py-0.5 text-xs font-semibold text-gold-600${isKo ? " font-ko" : ""}`}>
            {isKo ? "현재 분기" : "Current"}
          </span>
        )}
      </div>

      {/* Side-by-side quarter content */}
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        {/* Standard */}
        <div className="rounded-2xl border border-navy-100 bg-white p-5 shadow-sm">
          <div className="mb-3 flex items-center gap-2">
            <span className="rounded-full bg-navy-700 px-2.5 py-0.5 text-xs font-bold text-white">
              {isKo ? "일반" : "Standard"}
            </span>
            {sq?.focusKo && isKo && (
              <span className="text-xs font-semibold text-navy-700 font-ko">{sq.focusKo}</span>
            )}
          </div>
          <ul className="space-y-1.5">
            {sq?.topics.map((t) => (
              <li key={t.en} className="flex items-start gap-2 text-sm text-navy-800">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-navy-400" />
                <span className={isKo ? "font-ko" : ""}>{isKo ? t.ko : t.en}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Advanced */}
        <div className="rounded-2xl border border-gold-300/60 bg-amber-50/60 p-5">
          <div className="mb-3 flex items-center gap-2">
            <span className="rounded-full bg-gold-500 px-2.5 py-0.5 text-xs font-bold text-white">
              {isKo ? "AAP 심화" : "AAP"}
            </span>
            {aq?.focusKo && isKo && (
              <span className="text-xs font-semibold text-navy-700 font-ko">{aq.focusKo}</span>
            )}
          </div>
          <ul className="space-y-1.5">
            {aq?.topics.map((t) => (
              <li key={t.en} className="flex items-start gap-2 text-sm text-navy-800">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold-500" />
                <span className={isKo ? "font-ko" : ""}>{isKo ? t.ko : t.en}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
