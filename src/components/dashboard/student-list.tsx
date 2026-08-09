import Link from "next/link";
import { Plus } from "lucide-react";
import { GRADE_LABELS } from "@/lib/students/schema";
import { deleteStudentAction } from "@/lib/students/actions";
import { WEEKDAYS, WEEKDAY_LABELS } from "@/lib/classes/schema";
import { EnrollmentStatusBadge } from "@/components/dashboard/enrollment-status-badge";
import type { StudentProgressOverview } from "@/lib/learning-history/queries";
import type { Class } from "@/lib/supabase/types";
import type { EnrollmentStatus } from "@/lib/enrollment/schema";

function scheduleLabel(days: number[], startTime: string, endTime: string) {
  const dayLabel = WEEKDAYS.filter((d) => days.includes(d))
    .map((d) => WEEKDAY_LABELS[d])
    .join("");
  return `${dayLabel} ${startTime.slice(0, 5)}-${endTime.slice(0, 5)}`;
}

export function StudentList({
  overview,
  classBadgesByStudent = {},
  enrollmentStatusByStudent = {},
  hasUnpaidTuitionByStudent = {},
}: {
  overview: StudentProgressOverview[];
  classBadgesByStudent?: Record<string, Class[]>;
  enrollmentStatusByStudent?: Record<string, EnrollmentStatus>;
  hasUnpaidTuitionByStudent?: Record<string, boolean>;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <Link
        href="/dashboard/principal/students/new"
        className="flex min-h-[200px] flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-navy-200 bg-white p-6 text-navy-600 transition-colors hover:border-navy-400 hover:bg-navy-50 hover:text-navy-900"
      >
        <Plus className="h-6 w-6" aria-hidden />
        <span className="text-sm font-medium">학생 등록 / Add Student</span>
      </Link>

      {overview.length === 0 ? (
        <div className="col-span-full rounded-2xl border border-navy-100 bg-white p-8 text-center text-sm text-navy-600">
          아직 등록된 학생이 없습니다. 위 카드를 눌러 첫 학생을 추가하세요.
        </div>
      ) : (
        overview.map(({ student, lastSessionDate }) => (
          <article
            key={student.id}
            className="relative flex min-h-[200px] flex-col rounded-2xl border border-navy-100 bg-white p-5 shadow-sm"
          >
            <Link
              href={`/dashboard/principal/students/${student.id}/history`}
              aria-label={`${student.full_name} 학습이력 보기`}
              className="absolute inset-0 z-0 rounded-2xl transition-colors hover:bg-navy-50 active:bg-navy-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy-400"
            />
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-base font-semibold text-navy-900">
                {student.full_name}
              </h3>
              <div className="flex shrink-0 flex-wrap items-center justify-end gap-1">
                {enrollmentStatusByStudent[student.id] && (
                  <EnrollmentStatusBadge status={enrollmentStatusByStudent[student.id]} />
                )}
                <span className="inline-flex items-center rounded-full bg-navy-50 px-2 py-0.5 text-xs font-medium text-navy-800">
                  {GRADE_LABELS[student.grade]}
                </span>
              </div>
            </div>
            {hasUnpaidTuitionByStudent[student.id] && (
              <p className="mt-1 text-xs font-medium text-red-600 font-ko" lang="ko">
                학원비 미납
              </p>
            )}
            {(classBadgesByStudent[student.id]?.length ?? 0) > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {classBadgesByStudent[student.id].map((classRow) => (
                  <span
                    key={classRow.id}
                    className="inline-flex items-center rounded-full bg-gold-300/20 px-2 py-0.5 text-xs font-medium text-navy-800"
                  >
                    {scheduleLabel(classRow.days_of_week, classRow.start_time, classRow.end_time)}
                  </span>
                ))}
              </div>
            )}
            {student.notes && (
              <p className="mt-3 line-clamp-3 text-xs text-navy-700 font-ko" lang="ko">
                {student.notes}
              </p>
            )}
            <p className="mt-3 text-xs text-navy-500" lang="ko">
              마지막 수업일: {lastSessionDate ?? "-"}
            </p>
            <div className="relative z-10 mt-auto flex items-center justify-end gap-2 pt-4">
              <Link
                href={`/dashboard/principal/students/${student.id}/tuition`}
                className="rounded-md border border-navy-200 bg-white px-3 py-1 text-xs font-medium text-navy-700 hover:bg-navy-50"
              >
                정산
              </Link>
              <Link
                href={`/dashboard/principal/students/${student.id}`}
                className="rounded-md border border-navy-200 bg-white px-3 py-1 text-xs font-medium text-navy-700 hover:bg-navy-50"
              >
                수정
              </Link>
              <form action={deleteStudentAction.bind(null, student.id)}>
                <button
                  type="submit"
                  className="rounded-md border border-red-200 bg-white px-3 py-1 text-xs font-medium text-red-700 hover:bg-red-50"
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
