"use client";

import { useState } from "react";
import { Calculator, PieChart, Hash, Shapes, Ruler, BarChart3, Repeat, type LucideIcon } from "lucide-react";
import type { QuarterData, TopicCategory } from "@/lib/curriculum-data";
import {
  getCurrentQuarter,
  QUARTER_LABELS_KO,
  QUARTER_LABELS_EN,
  type Quarter,
} from "@/lib/curriculum-quarter";

const CATEGORY_STYLES: Record<TopicCategory, { badge: string; dot: string; icon: LucideIcon }> = {
  "수·연산":  { badge: "bg-blue-50 text-blue-700 border-blue-200",   dot: "bg-blue-400",   icon: Calculator },
  "분수":     { badge: "bg-purple-50 text-purple-700 border-purple-200", dot: "bg-purple-400", icon: PieChart },
  "소수":     { badge: "bg-teal-50 text-teal-700 border-teal-200",   dot: "bg-teal-400",   icon: Hash },
  "도형":     { badge: "bg-orange-50 text-orange-700 border-orange-200", dot: "bg-orange-400", icon: Shapes },
  "측정":     { badge: "bg-amber-50 text-amber-700 border-amber-200", dot: "bg-amber-400",  icon: Ruler },
  "확률·자료": { badge: "bg-rose-50 text-rose-700 border-rose-200",  dot: "bg-rose-400",   icon: BarChart3 },
  "대수·패턴": { badge: "bg-indigo-50 text-indigo-700 border-indigo-200", dot: "bg-indigo-400", icon: Repeat },
};

const CATEGORY_ORDER: TopicCategory[] = [
  "수·연산", "분수", "소수", "도형", "측정", "확률·자료", "대수·패턴",
];

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
        <TrackContent quarter={sq} isKo={isKo} level="standard" />
        <TrackContent quarter={aq} isKo={isKo} level="advanced" />
      </div>
    </div>
  );
}

function TrackContent({
  quarter,
  isKo,
  level,
}: {
  quarter: QuarterData | undefined;
  isKo: boolean;
  level: "standard" | "advanced";
}) {
  const isAdvanced = level === "advanced";
  const hasCategories = quarter?.topics.some((t) => t.category);

  return (
    <div
      className={
        isAdvanced
          ? "rounded-2xl border border-gold-300/60 bg-amber-50/60 p-5"
          : "rounded-2xl border border-navy-100 bg-white p-5 shadow-sm"
      }
    >
      <div className="mb-4 flex items-center gap-2">
        <span
          className={`rounded-full px-2.5 py-0.5 text-xs font-bold text-white ${
            isAdvanced ? "bg-gold-500" : "bg-navy-700"
          }`}
        >
          {isKo ? (isAdvanced ? "AAP 심화" : "일반") : isAdvanced ? "AAP" : "Standard"}
        </span>
        {quarter?.focusKo && isKo && (
          <span className="text-xs font-semibold text-navy-600 font-ko">{quarter.focusKo}</span>
        )}
      </div>

      {hasCategories ? (
        <CategorizedTopics topics={quarter!.topics} isKo={isKo} isAdvanced={isAdvanced} />
      ) : (
        <ul className="space-y-2">
          {quarter?.topics.map((t) => (
            <li key={t.en} className="flex items-start gap-2 text-sm text-navy-800">
              <span
                className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${
                  isAdvanced ? "bg-gold-500" : "bg-navy-400"
                }`}
              />
              <span className={isKo ? "font-ko" : ""}>{isKo ? t.ko : t.en}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function CategorizedTopics({
  topics,
  isKo,
  isAdvanced,
}: {
  topics: QuarterData["topics"];
  isKo: boolean;
  isAdvanced: boolean;
}) {
  // Group topics by category, preserving insertion order
  const grouped = new Map<TopicCategory | "other", QuarterData["topics"]>();
  for (const topic of topics) {
    const key = topic.category ?? "other";
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key)!.push(topic);
  }

  // Sort groups by canonical category order
  const sortedEntries = [...grouped.entries()].sort(([a], [b]) => {
    if (a === "other") return 1;
    if (b === "other") return -1;
    const ai = CATEGORY_ORDER.indexOf(a as TopicCategory);
    const bi = CATEGORY_ORDER.indexOf(b as TopicCategory);
    return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
  });

  return (
    <div className="space-y-4">
      {sortedEntries.map(([category, catTopics]) => {
        const style =
          category !== "other" ? CATEGORY_STYLES[category as TopicCategory] : null;
        return (
          <div key={category}>
            {style && (
              <span
                className={`mb-2 inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${style.badge}`}
              >
                <style.icon className="h-3 w-3" />
                {category}
              </span>
            )}
            <ul className="space-y-2 pl-0.5">
              {catTopics.map((t) => (
                <li key={t.en} className="space-y-1">
                  <div className="flex items-start gap-2">
                    <span
                      className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${
                        style
                          ? style.dot
                          : isAdvanced
                          ? "bg-gold-500"
                          : "bg-navy-400"
                      }`}
                    />
                    <span className={`text-sm leading-snug text-navy-800${isKo ? " font-ko" : ""}`}>
                      {isKo ? t.ko : t.en}
                    </span>
                  </div>
                  {t.note && isKo && (
                    <div className="ml-4 rounded-md bg-navy-50 px-3 py-1.5 font-mono text-xs text-navy-600">
                      {t.note}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
