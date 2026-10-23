"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { ChevronRight, Search } from "lucide-react";
import type { TopicCategory } from "@/lib/curriculum-data";
import {
  getCurrentQuarter,
  QUARTER_LABELS_EN,
  QUARTER_LABELS_KO,
  QUARTERS,
  type Quarter,
} from "@/lib/curriculum-quarter";
import { CATEGORY_LABELS } from "@/lib/worksheets/labels";
import { cn } from "@/lib/utils";

// Plain data only — WorksheetDef carries a generator function, which can't
// cross the server/client boundary.
export type WorksheetTopic = {
  slug: string;
  href: string;
  title: string;
  /** English title, shown under the Korean one on ko pages. */
  subtitle?: string;
  category: TopicCategory;
  quarter?: Quarter;
  /** Lowercased titles, descriptions and category names in both languages. */
  search: string;
};

type QuarterFilter = Quarter | "all";

const subscribeNever = () => () => {};

export function WorksheetTopicBrowser({ topics, isKo }: { topics: WorksheetTopic[]; isKo: boolean }) {
  const [query, setQuery] = useState("");
  const [quarter, setQuarter] = useState<QuarterFilter>("all");
  // Pages are statically built, so read the date on the client only.
  const currentQuarter = useSyncExternalStore(subscribeNever, getCurrentQuarter, () => null);
  const ko = isKo ? " font-ko" : "";
  const quarterLabels = isKo ? QUARTER_LABELS_KO : QUARTER_LABELS_EN;
  const shortQuarter = (q: Quarter) => (isKo ? `${q.slice(1)}분기` : q);

  const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  const visible = topics.filter(
    (t) => (quarter === "all" || t.quarter === quarter) && terms.every((term) => t.search.includes(term)),
  );
  const groups = CATEGORY_LABELS.map((cat) => ({
    ...cat,
    topics: visible.filter((t) => t.category === cat.key),
  })).filter((g) => g.topics.length > 0);

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <label className="relative block sm:w-80">
          <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-navy-400" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={isKo ? "주제 검색 (예: 분수, 나눗셈)" : "Search topics (e.g. fractions)"}
            aria-label={isKo ? "주제 검색" : "Search topics"}
            className={`h-10 w-full rounded-lg border border-navy-200 bg-white pr-3 pl-9 text-sm text-navy-900 placeholder:text-navy-400 focus:border-navy-500 focus:ring-2 focus:ring-navy-100 focus:outline-none${ko}`}
          />
        </label>

        <div
          role="group"
          aria-label={isKo ? "분기별 보기" : "Filter by quarter"}
          className="grid grid-cols-5 gap-1 rounded-xl bg-navy-100/70 p-1 sm:flex"
        >
          {(["all", ...QUARTERS] as const).map((q) => {
            const active = quarter === q;
            const isCurrent = q === currentQuarter;
            return (
              <button
                key={q}
                type="button"
                onClick={() => setQuarter(q)}
                aria-pressed={active}
                title={q === "all" ? undefined : quarterLabels[q]}
                className={cn(
                  "relative rounded-lg px-3 py-1.5 text-sm font-semibold transition",
                  active ? "bg-white text-navy-900 shadow-sm" : "text-navy-500 hover:text-navy-800",
                  isKo && "font-ko",
                )}
              >
                {q === "all" ? (isKo ? "전체" : "All") : shortQuarter(q)}
                {isCurrent && (
                  <>
                    <span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-gold-500" aria-hidden />
                    <span className="sr-only">{isKo ? " (현재 분기)" : " (current quarter)"}</span>
                  </>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {groups.length === 0 ? (
        <div className={`mt-8 rounded-xl border border-dashed border-navy-200 bg-white px-6 py-12 text-center${ko}`}>
          <p className="text-sm text-navy-600">{isKo ? "조건에 맞는 주제가 없어요." : "No topics match."}</p>
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setQuarter("all");
            }}
            className="mt-3 text-sm font-semibold text-navy-900 underline underline-offset-2"
          >
            {isKo ? "전체 주제 보기" : "Show all topics"}
          </button>
        </div>
      ) : (
        <div className="mt-8 space-y-9">
          {groups.map((g) => (
            <section key={g.key} aria-labelledby={`cat-${g.key}`}>
              <h2 id={`cat-${g.key}`} className={`flex items-baseline gap-2 text-base font-bold text-navy-900${ko}`}>
                {isKo ? g.key : g.en}
                <span className="text-sm font-medium text-navy-400">{g.topics.length}</span>
              </h2>
              <ul className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
                {g.topics.map((t) => (
                  <li key={t.slug}>
                    <Link
                      href={t.href}
                      className="group flex h-full items-center gap-3 rounded-xl border border-navy-100 bg-white px-4 py-3 transition hover:border-navy-300 hover:shadow-sm"
                    >
                      <div className="min-w-0 flex-1">
                        <p className={`text-[15px] leading-snug font-semibold text-navy-900${ko}`}>{t.title}</p>
                        {t.subtitle && <p className="mt-0.5 truncate text-xs text-navy-400">{t.subtitle}</p>}
                      </div>
                      {quarter === "all" && t.quarter && (
                        <span
                          title={quarterLabels[t.quarter]}
                          className={`shrink-0 rounded-md bg-navy-50 px-1.5 py-0.5 text-[11px] font-semibold text-navy-500${ko}`}
                        >
                          {shortQuarter(t.quarter)}
                        </span>
                      )}
                      <ChevronRight className="h-4 w-4 shrink-0 text-navy-300 transition group-hover:translate-x-0.5 group-hover:text-navy-700" />
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
