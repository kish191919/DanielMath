import Link from "next/link";
import { Plus } from "lucide-react";
import { WEEKDAYS, WEEKDAY_LABELS } from "@/lib/classes/schema";
import { deleteClassAction } from "@/lib/classes/actions";
import type { ClassWithCount } from "@/lib/classes/queries";

function scheduleLabel(days: number[], startTime: string, endTime: string) {
  const dayLabel = WEEKDAYS.filter((d) => days.includes(d))
    .map((d) => WEEKDAY_LABELS[d])
    .join("");
  return `${dayLabel} ${startTime.slice(0, 5)}-${endTime.slice(0, 5)}`;
}

export function ClassList({ classes }: { classes: ClassWithCount[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <Link
        href="/dashboard/principal/classes/new"
        className="flex min-h-[160px] flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-navy-200 bg-white p-6 text-navy-600 transition-colors hover:border-navy-400 hover:bg-navy-50 hover:text-navy-900"
      >
        <Plus className="h-6 w-6" aria-hidden />
        <span className="text-sm font-medium">반 등록 / Add Class</span>
      </Link>

      {classes.length === 0 ? (
        <div className="col-span-full rounded-2xl border border-navy-100 bg-white p-8 text-center text-sm text-navy-600">
          아직 등록된 반이 없습니다. 위 카드를 눌러 첫 반을 추가하세요.
        </div>
      ) : (
        classes.map(({ classRow, activeCount }) => (
          <article
            key={classRow.id}
            className={`flex min-h-[160px] flex-col rounded-2xl border border-navy-100 bg-white p-5 shadow-sm ${
              classRow.is_active ? "" : "opacity-60"
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-base font-semibold text-navy-900">{classRow.name}</h3>
              {!classRow.is_active && (
                <span className="inline-flex shrink-0 items-center rounded-full bg-navy-50 px-2 py-0.5 text-xs font-medium text-navy-600">
                  운영 중지
                </span>
              )}
            </div>
            <p className="mt-2 text-sm text-navy-700 font-ko" lang="ko">
              {scheduleLabel(classRow.days_of_week, classRow.start_time, classRow.end_time)}
            </p>
            <p className="mt-3 text-xs text-navy-500">등록 학생: {activeCount}명</p>
            <div className="mt-auto flex items-center justify-end gap-2 pt-4">
              <Link
                href={`/dashboard/principal/classes/${classRow.id}`}
                className="rounded-md border border-navy-200 px-3 py-1 text-xs font-medium text-navy-700 hover:bg-navy-50"
              >
                명단
              </Link>
              <Link
                href={`/dashboard/principal/classes/${classRow.id}/edit`}
                className="rounded-md border border-navy-200 px-3 py-1 text-xs font-medium text-navy-700 hover:bg-navy-50"
              >
                수정
              </Link>
              <form action={deleteClassAction.bind(null, classRow.id)}>
                <button
                  type="submit"
                  className="rounded-md border border-red-200 px-3 py-1 text-xs font-medium text-red-700 hover:bg-red-50"
                >
                  삭제
                </button>
              </form>
            </div>
          </article>
        ))
      )}
    </div>
  );
}
