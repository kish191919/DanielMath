"use client";

import { useState } from "react";
import { ExternalLink } from "lucide-react";
import { Section, SectionHeader } from "@/components/site/section";
import { Container } from "@/components/site/container";
import { schoolCalendars, type EventType, type SchoolYearCalendar } from "@/lib/school-calendar-data";

type DictSlice = {
  eyebrow: string;
  title: string;
  titleKo?: string;
  desc: string;
  source: string;
  sourceLink: string;
  types: Record<EventType, string>;
};

const YEAR_IDS: SchoolYearCalendar["id"][] = ["2026-27", "2027-28", "2028-29"];

const BADGE_STYLES: Record<EventType, string> = {
  important: "bg-navy-900 text-white",
  break: "bg-amber-100 text-amber-800",
  holiday: "bg-blue-50 text-blue-700 border border-blue-200",
  quarter: "bg-gold-500/20 text-gold-600",
  noSchool: "bg-gray-100 text-gray-600",
};

const FILTER_ACTIVE: Record<EventType | "all", string> = {
  all: "bg-navy-900 text-white shadow-sm",
  important: "bg-navy-800 text-white shadow-sm",
  break: "bg-amber-100 text-amber-800 border border-amber-300",
  holiday: "bg-blue-100 text-blue-700 border border-blue-300",
  quarter: "bg-yellow-100 text-yellow-700 border border-yellow-300",
  noSchool: "bg-gray-200 text-gray-700 border border-gray-300",
};

const MONTH_NAMES_EN = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const MONTH_NAMES_KO = [
  "1월", "2월", "3월", "4월", "5월", "6월",
  "7월", "8월", "9월", "10월", "11월", "12월",
];

function formatDate(iso: string, isKo: boolean): string {
  const [, m, d] = iso.split("-");
  const monthIdx = parseInt(m, 10) - 1;
  const day = parseInt(d, 10);
  return isKo ? `${MONTH_NAMES_KO[monthIdx]} ${day}일` : `${MONTH_NAMES_EN[monthIdx].slice(0, 3)} ${day}`;
}

function formatRange(start: string, end: string | undefined, isKo: boolean): string {
  const startStr = formatDate(start, isKo);
  if (!end || end === start) return startStr;
  const [sy, sm] = start.split("-");
  const [ey, em] = end.split("-");
  const endStr =
    sy === ey && sm === em
      ? isKo ? `${parseInt(end.split("-")[2], 10)}일` : end.split("-")[2].replace(/^0/, "")
      : formatDate(end, isKo);
  return `${startStr} – ${endStr}`;
}

export function SchoolCalendarSection({ d, isKo }: { d: DictSlice; isKo: boolean }) {
  const [activeYear, setActiveYear] = useState<SchoolYearCalendar["id"]>("2026-27");
  const [activeFilter, setActiveFilter] = useState<EventType | "all">("all");

  const yearData = schoolCalendars.find((y) => y.id === activeYear)!;

  const filteredEvents =
    activeFilter === "all"
      ? yearData.events
      : yearData.events.filter((e) => e.type === activeFilter);

  const grouped = filteredEvents.reduce<Record<string, typeof yearData.events>>((acc, event) => {
    const key = event.dateStart.slice(0, 7);
    if (!acc[key]) acc[key] = [];
    acc[key].push(event);
    return acc;
  }, {});
  const sortedMonths = Object.keys(grouped).sort();

  const filterOptions: (EventType | "all")[] = ["all", "important", "break", "holiday", "quarter", "noSchool"];
  const filterLabel: Record<EventType | "all", string> = {
    all: isKo ? "전체" : "All",
    important: d.types.important,
    break: d.types.break,
    holiday: d.types.holiday,
    quarter: d.types.quarter,
    noSchool: d.types.noSchool,
  };

  return (
    <Section className="bg-navy-50/60">
      <Container>
        <SectionHeader
          eyebrow={d.eyebrow}
          title={isKo ? d.title : d.title}
          titleKo={isKo && d.titleKo ? d.titleKo : undefined}
          description={d.desc}
          isKo={isKo}
        />

        {/* Year Tabs */}
        <div className="mt-10 flex flex-wrap gap-2">
          {YEAR_IDS.map((year) => (
            <button
              key={year}
              onClick={() => { setActiveYear(year); setActiveFilter("all"); }}
              className={
                activeYear === year
                  ? "rounded-full px-5 py-2 text-sm font-semibold bg-navy-900 text-white shadow-sm"
                  : "rounded-full px-5 py-2 text-sm font-semibold bg-white text-navy-700 border border-navy-200 hover:border-navy-400"
              }
            >
              {year}
            </button>
          ))}
        </div>

        {/* Type Filter Chips */}
        <div className="mt-4 flex flex-wrap gap-2">
          {filterOptions.map((type) => (
            <button
              key={type}
              onClick={() => setActiveFilter(type)}
              className={`rounded-full px-3 py-1 text-[11px] font-semibold transition-colors ${
                activeFilter === type
                  ? FILTER_ACTIVE[type]
                  : "bg-white text-navy-500 border border-navy-200 hover:border-navy-400 hover:text-navy-700"
              }`}
            >
              {filterLabel[type]}
            </button>
          ))}
        </div>

        {/* Month Card Grid */}
        {sortedMonths.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-navy-100 bg-white shadow-sm px-6 py-10 text-center text-sm text-navy-400">
            {isKo ? "해당 일정이 없습니다." : "No events found."}
          </div>
        ) : (
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {sortedMonths.map((monthKey) => {
              const [y, m] = monthKey.split("-");
              const monthIdx = parseInt(m, 10) - 1;
              const monthLabel = isKo
                ? `${y}년 ${MONTH_NAMES_KO[monthIdx]}`
                : `${MONTH_NAMES_EN[monthIdx]} ${y}`;
              const events = grouped[monthKey];

              return (
                <div key={monthKey} className="rounded-xl border border-navy-100 bg-white shadow-sm overflow-hidden">
                  <div className="px-4 py-2.5 bg-navy-50/80 border-b border-navy-100 flex items-center justify-between">
                    <p className={`text-xs font-semibold uppercase tracking-widest text-navy-600${isKo ? " font-ko" : ""}`}>
                      {monthLabel}
                    </p>
                    <span className="text-[10px] font-medium text-navy-400">{events.length}건</span>
                  </div>
                  <div className="divide-y divide-navy-50">
                    {events.map((event, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-navy-50/40 transition-colors"
                      >
                        <span className="w-24 shrink-0 text-[11px] font-mono text-navy-400">
                          {formatRange(event.dateStart, event.dateEnd, isKo)}
                        </span>
                        <span
                          className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${BADGE_STYLES[event.type]}`}
                        >
                          {d.types[event.type]}
                        </span>
                        <span className={`text-sm text-navy-800 leading-snug${isKo ? " font-ko" : ""}`}>
                          {isKo ? event.labelKo : event.labelEn}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Source Footer */}
        <div className="mt-4 flex items-center gap-2 px-1">
          <ExternalLink className="h-3.5 w-3.5 shrink-0 text-navy-400" />
          <p className={`text-xs text-navy-500${isKo ? " font-ko" : ""}`}>
            {d.source}{" "}
            <a
              href="https://www.fcps.edu/calendars"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold underline underline-offset-2 hover:text-navy-700"
            >
              {d.sourceLink}
            </a>
          </p>
        </div>
      </Container>
    </Section>
  );
}
