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

const YEAR_IDS: SchoolYearCalendar["id"][] = ["2025-26", "2026-27", "2027-28"];

const BADGE_STYLES: Record<EventType, string> = {
  important: "bg-navy-900 text-white",
  break: "bg-amber-100 text-amber-800",
  holiday: "bg-blue-50 text-blue-700 border border-blue-200",
  quarter: "bg-gold-500/20 text-gold-600",
  noSchool: "bg-gray-100 text-gray-600",
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
  const [activeYear, setActiveYear] = useState<SchoolYearCalendar["id"]>("2025-26");

  const yearData = schoolCalendars.find((y) => y.id === activeYear)!;

  const grouped = yearData.events.reduce<Record<string, typeof yearData.events>>((acc, event) => {
    const key = event.dateStart.slice(0, 7);
    if (!acc[key]) acc[key] = [];
    acc[key].push(event);
    return acc;
  }, {});
  const sortedMonths = Object.keys(grouped).sort();

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
              onClick={() => setActiveYear(year)}
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

        {/* Event List */}
        <div className="mt-6 rounded-2xl border border-navy-100 bg-white shadow-sm overflow-hidden">
          <div className="divide-y divide-navy-50">
            {sortedMonths.map((monthKey) => {
              const [y, m] = monthKey.split("-");
              const monthIdx = parseInt(m, 10) - 1;
              const monthLabel = isKo
                ? `${y}년 ${MONTH_NAMES_KO[monthIdx]}`
                : `${MONTH_NAMES_EN[monthIdx]} ${y}`;

              return (
                <div key={monthKey}>
                  <div className="px-5 py-2.5 bg-navy-50/70">
                    <p className={`text-xs font-semibold uppercase tracking-widest text-navy-500${isKo ? " font-ko" : ""}`}>
                      {monthLabel}
                    </p>
                  </div>
                  {grouped[monthKey].map((event, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-4 px-5 py-3 hover:bg-navy-50/40 transition-colors"
                    >
                      <span className="w-28 shrink-0 text-xs font-mono text-navy-500">
                        {formatRange(event.dateStart, event.dateEnd, isKo)}
                      </span>
                      <span
                        className={`shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${BADGE_STYLES[event.type]}`}
                      >
                        {d.types[event.type]}
                      </span>
                      <span className={`text-sm text-navy-800${isKo ? " font-ko" : ""}`}>
                        {isKo ? event.labelKo : event.labelEn}
                      </span>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>

          {/* Source Footer */}
          <div className="flex items-center gap-2 border-t border-navy-100 px-5 py-3 bg-navy-50/40">
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
        </div>
      </Container>
    </Section>
  );
}
