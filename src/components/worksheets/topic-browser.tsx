"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { ChevronDown, ChevronRight, ChevronsDownUp, ChevronsUpDown, Search } from "lucide-react";
import type { TopicCategory } from "@/lib/curriculum-data";
import {
  getCurrentQuarter,
  QUARTER_LABELS_EN,
  QUARTER_LABELS_KO,
  QUARTERS,
  type Quarter,
} from "@/lib/curriculum-quarter";
import { CATEGORY_LABELS } from "@/lib/worksheets/labels";
import type { UnitColor, UnitIcon } from "@/lib/worksheets/units";
import { cn } from "@/lib/utils";
import { UNIT_COLORS, UNIT_ICONS } from "./unit-style";

// Plain data only — WorksheetDef carries a generator function, which can't
// cross the server/client boundary.
export type SkillItem = {
  /** Unique across grades (see skillKey). */
  id: string;
  href: string;
  /** "C.2" */
  code: string;
  title: string;
  /** English title, shown under the Korean one on ko pages. */
  subtitle?: string;
  /** Shown as a compact tile ("7단") instead of a row. */
  chip?: string;
  quarter?: Quarter;
  /** Lowercased titles and descriptions in both languages. */
  search: string;
};

export type UnitItem = {
  key: string;
  letter: string;
  title: string;
  subtitle?: string;
  category: TopicCategory;
  icon: UnitIcon;
  color: UnitColor;
  /** Lowercased unit titles in both languages. */
  search: string;
  skills: SkillItem[];
};

type QuarterFilter = Quarter | "all";

const subscribeNever = () => () => {};

/** Consecutive chip skills become one tile grid; the rest stay rows. */
function segments(skills: SkillItem[]): { chips: boolean; skills: SkillItem[] }[] {
  const out: { chips: boolean; skills: SkillItem[] }[] = [];
  for (const s of skills) {
    const chips = s.chip !== undefined;
    const last = out[out.length - 1];
    if (last && last.chips === chips) last.skills.push(s);
    else out.push({ chips, skills: [s] });
  }
  return out;
}

export function WorksheetUnitBrowser({ units, isKo }: { units: UnitItem[]; isKo: boolean }) {
  const [query, setQuery] = useState("");
  const [quarter, setQuarter] = useState<QuarterFilter>("all");
  const [open, setOpen] = useState<ReadonlySet<string>>(() => new Set());
  // Pages are statically built, so read the date on the client only.
  const currentQuarter = useSyncExternalStore(subscribeNever, getCurrentQuarter, () => null);
  const ko = isKo ? " font-ko" : "";
  const quarterLabels = isKo ? QUARTER_LABELS_KO : QUARTER_LABELS_EN;
  const shortQuarter = (q: Quarter) => (isKo ? `${q.slice(1)}분기` : q);

  const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  const searching = terms.length > 0;
  const visible = units
    .map((u) => ({
      ...u,
      shown: u.skills.filter(
        (s) =>
          (quarter === "all" || s.quarter === quarter) &&
          terms.every((term) => s.search.includes(term) || u.search.includes(term)),
      ),
    }))
    .filter((u) => u.shown.length > 0);
  const groups = CATEGORY_LABELS.map((cat) => ({
    ...cat,
    units: visible.filter((u) => u.category === cat.key),
  })).filter((g) => g.units.length > 0);

  // Searching opens every matching unit, so the hits are in view.
  const isOpen = (key: string) => searching || open.has(key);
  const allOpen = visible.every((u) => isOpen(u.key));
  const toggle = (key: string) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });

  return (
    <div>
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <label className="relative block lg:w-80">
          <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-navy-400" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={isKo ? "스킬 검색 (예: 7단, 반올림, 분수)" : "Search skills (e.g. round, fractions)"}
            aria-label={isKo ? "스킬 검색" : "Search skills"}
            className={`h-11 w-full rounded-xl border border-navy-200 bg-white pr-3 pl-9 text-sm text-navy-900 placeholder:text-navy-400 focus:border-navy-500 focus:ring-2 focus:ring-navy-100 focus:outline-none${ko}`}
          />
        </label>

        <div className="flex flex-wrap items-center gap-2">
          <div
            role="group"
            aria-label={isKo ? "분기별 보기" : "Filter by quarter"}
            className="grid flex-1 grid-cols-5 gap-1 rounded-xl bg-navy-100/70 p-1 sm:flex sm:flex-none"
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

          {!searching && visible.length > 0 && (
            <button
              type="button"
              onClick={() => setOpen(allOpen ? new Set() : new Set(visible.map((u) => u.key)))}
              className={`inline-flex h-10 items-center gap-1.5 rounded-xl px-3 text-sm font-semibold text-navy-600 ring-1 ring-navy-200 transition hover:bg-white hover:text-navy-900${ko}`}
            >
              {allOpen ? <ChevronsDownUp className="h-4 w-4" /> : <ChevronsUpDown className="h-4 w-4" />}
              {allOpen ? (isKo ? "모두 접기" : "Collapse all") : isKo ? "모두 펼치기" : "Expand all"}
            </button>
          )}
        </div>
      </div>

      {groups.length === 0 ? (
        <div className={`mt-8 rounded-2xl border border-dashed border-navy-200 bg-white px-6 py-12 text-center${ko}`}>
          <p className="text-sm text-navy-600">{isKo ? "조건에 맞는 스킬이 없어요." : "No skills match."}</p>
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setQuarter("all");
            }}
            className="mt-3 text-sm font-semibold text-navy-900 underline underline-offset-2"
          >
            {isKo ? "전체 스킬 보기" : "Show all skills"}
          </button>
        </div>
      ) : (
        <div className="mt-8 space-y-10">
          {groups.map((g) => (
            <section key={g.key} aria-labelledby={`cat-${g.key}`}>
              <h2
                id={`cat-${g.key}`}
                className={`flex items-baseline gap-2 text-sm font-bold tracking-wide text-navy-500 uppercase${ko}`}
              >
                {isKo ? g.key : g.en}
              </h2>
              <div className="mt-3 grid grid-cols-1 items-start gap-3 md:grid-cols-2 xl:grid-cols-3">
                {g.units.map((u) => (
                  <UnitCard
                    key={u.key}
                    unit={u}
                    shown={u.shown}
                    open={isOpen(u.key)}
                    onToggle={() => toggle(u.key)}
                    isKo={isKo}
                    shortQuarter={shortQuarter}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}

function UnitCard({
  unit,
  shown,
  open,
  onToggle,
  isKo,
  shortQuarter,
}: {
  unit: UnitItem;
  shown: SkillItem[];
  open: boolean;
  onToggle: () => void;
  isKo: boolean;
  shortQuarter: (q: Quarter) => string;
}) {
  const sw = UNIT_COLORS[unit.color];
  const Icon = UNIT_ICONS[unit.icon];
  const ko = isKo ? " font-ko" : "";
  const quarters = QUARTERS.filter((q) => unit.skills.some((s) => s.quarter === q));
  const [first, last] = [quarters[0], quarters[quarters.length - 1]];
  const quarterRange =
    quarters.length === 0
      ? null
      : quarters.length === 1
        ? shortQuarter(first)
        : isKo
          ? `${first.slice(1)}–${last.slice(1)}분기`
          : `${first}–${last}`;
  const bodyId = `unit-${unit.key}`;

  return (
    <div className={cn("overflow-hidden rounded-2xl bg-white ring-1 transition", sw.ring, open && "shadow-md")}>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={bodyId}
        className={cn("flex w-full items-center gap-3.5 p-4 text-left transition", open && sw.soft)}
      >
        <span className={cn("relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl shadow-sm", sw.tile)}>
          <Icon className="h-6 w-6" strokeWidth={2.5} />
          <span className="absolute -top-1.5 -left-1.5 flex h-5 min-w-5 items-center justify-center rounded-md bg-white px-1 text-[11px] font-extrabold text-navy-900 shadow-sm ring-1 ring-navy-200">
            {unit.letter}
          </span>
        </span>
        <span className="min-w-0 flex-1">
          <span className={`block text-[15px] leading-snug font-bold text-navy-900${ko}`}>{unit.title}</span>
          {unit.subtitle && <span className="block truncate text-xs text-navy-400">{unit.subtitle}</span>}
          <span className={`mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-navy-500${ko}`}>
            <span className="font-semibold">
              {isKo ? `스킬 ${unit.skills.length}개` : `${unit.skills.length} skill${unit.skills.length === 1 ? "" : "s"}`}
            </span>
            {quarterRange && <span className="rounded bg-navy-50 px-1.5 py-0.5 font-medium">{quarterRange}</span>}
          </span>
        </span>
        <ChevronDown className={cn("h-5 w-5 shrink-0 text-navy-300 transition", open && "rotate-180 text-navy-600")} />
      </button>

      {open && (
        <div id={bodyId} className="space-y-1 border-t border-navy-100 p-2">
          {segments(shown).map((seg, i) =>
            seg.chips ? (
              <ul key={i} className="grid grid-cols-5 gap-1.5 p-1.5">
                {seg.skills.map((s) => (
                  <li key={s.id}>
                    <Link
                      href={s.href}
                      title={`${s.code} ${s.title}`}
                      className={cn(
                        "flex h-11 items-center justify-center rounded-xl text-sm font-extrabold tabular-nums ring-1 ring-transparent transition hover:-translate-y-0.5 hover:shadow-sm",
                        sw.soft,
                        sw.text,
                        "hover:ring-current/30",
                        isKo && "font-ko",
                      )}
                    >
                      {s.chip}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <ol key={i}>
                {seg.skills.map((s) => (
                  <li key={s.id}>
                    <Link
                      href={s.href}
                      className="group flex items-start gap-3 rounded-xl px-2.5 py-2 transition hover:bg-navy-50"
                    >
                      <span className={cn("mt-px w-9 shrink-0 text-xs font-extrabold tabular-nums", sw.text)}>{s.code}</span>
                      <span className="min-w-0 flex-1">
                        <span className={`block text-sm leading-snug font-semibold text-navy-900${ko}`}>{s.title}</span>
                        {s.subtitle && <span className="mt-0.5 block truncate text-xs text-navy-400">{s.subtitle}</span>}
                      </span>
                      <ChevronRight className="mt-px h-4 w-4 shrink-0 text-navy-300 transition group-hover:translate-x-0.5 group-hover:text-navy-700" />
                    </Link>
                  </li>
                ))}
              </ol>
            ),
          )}
        </div>
      )}
    </div>
  );
}
