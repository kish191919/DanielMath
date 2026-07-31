import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { shiftMonth } from "@/lib/dates";
import { ATTENDANCE_LABELS } from "@/lib/class-sessions/schema";
import type { AttendanceStatus } from "@/lib/supabase/types";
import type { AttendanceCalendarEntry } from "@/lib/learning-history/queries";

const STATUS_CLASSNAMES: Record<AttendanceStatus, string> = {
  present: "border-green-300 bg-green-100 text-green-800",
  absent: "border-red-300 bg-red-100 text-red-800",
  late: "border-amber-300 bg-amber-100 text-amber-800",
};

const WEEKDAY_LABELS_KO = ["일", "월", "화", "수", "목", "금", "토"];

function buildMonthGrid(month: string): (string | null)[] {
  const [year, monthNum] = month.split("-").map(Number);
  const daysInMonth = new Date(Date.UTC(year, monthNum, 0)).getUTCDate();
  const firstWeekday = new Date(Date.UTC(year, monthNum - 1, 1)).getUTCDay();
  const cells: (string | null)[] = Array(firstWeekday).fill(null);
  for (let day = 1; day <= daysInMonth; day++) {
    cells.push(`${month}-${String(day).padStart(2, "0")}`);
  }
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

function monthHref(basePath: string, params: Record<string, string>, month: string): string {
  const search = new URLSearchParams({ ...params, month });
  return `${basePath}?${search.toString()}`;
}

export function AttendanceCalendar({
  month,
  entries,
  basePath = "/dashboard/parent/progress",
  extraParams = {},
}: {
  month: string;
  entries: AttendanceCalendarEntry[];
  basePath?: string;
  extraParams?: Record<string, string>;
}) {
  const statusByDate = new Map(entries.map((e) => [e.date, e.status]));
  const cells = buildMonthGrid(month);
  const [year, monthNum] = month.split("-");

  return (
    <div className="mt-2 overflow-hidden rounded-2xl border border-navy-100 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <Link
          href={monthHref(basePath, extraParams, shiftMonth(month, -1))}
          className="rounded-full p-1.5 text-navy-500 hover:bg-navy-50 hover:text-navy-900"
          aria-label="이전 달"
        >
          <ChevronLeft className="h-4 w-4" />
        </Link>
        <p className="text-sm font-semibold text-navy-900">
          {year}년 {Number(monthNum)}월
        </p>
        <Link
          href={monthHref(basePath, extraParams, shiftMonth(month, 1))}
          className="rounded-full p-1.5 text-navy-500 hover:bg-navy-50 hover:text-navy-900"
          aria-label="다음 달"
        >
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="mt-3 grid grid-cols-7 gap-1 text-center text-xs">
        {WEEKDAY_LABELS_KO.map((label) => (
          <div key={label} className="py-1 font-medium text-navy-500">
            {label}
          </div>
        ))}
        {cells.map((date, index) => {
          if (!date) return <div key={`empty-${index}`} />;
          const status = statusByDate.get(date);
          const dayNum = Number(date.slice(-2));
          return (
            <div
              key={date}
              className={`flex h-9 items-center justify-center rounded-lg border text-navy-800 ${
                status ? STATUS_CLASSNAMES[status] : "border-transparent"
              }`}
            >
              {dayNum}
            </div>
          );
        })}
      </div>

      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-navy-600 font-ko" lang="ko">
        {(Object.entries(ATTENDANCE_LABELS) as [AttendanceStatus, string][]).map(([status, label]) => (
          <span key={status} className="inline-flex items-center gap-1.5">
            <span className={`inline-block h-3 w-3 rounded-sm border ${STATUS_CLASSNAMES[status]}`} />
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
