import Link from "next/link";
import { Plus } from "lucide-react";
import { GRADE_LABELS } from "@/lib/students/schema";
import { deleteStudentAction } from "@/lib/students/actions";
import type { Student } from "@/lib/supabase/types";

export function StudentList({ students }: { students: Student[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <Link
        href="/dashboard/principal/students/new"
        className="flex min-h-[160px] flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-navy-200 bg-white p-6 text-navy-600 transition-colors hover:border-navy-400 hover:bg-navy-50 hover:text-navy-900"
      >
        <Plus className="h-6 w-6" aria-hidden />
        <span className="text-sm font-medium">학생 등록 / Add Student</span>
      </Link>

      {students.length === 0 ? (
        <div className="col-span-full rounded-2xl border border-navy-100 bg-white p-8 text-center text-sm text-navy-600">
          아직 등록된 학생이 없습니다. 위 카드를 눌러 첫 학생을 추가하세요.
        </div>
      ) : (
        students.map((student) => (
          <article
            key={student.id}
            className="flex min-h-[160px] flex-col rounded-2xl border border-navy-100 bg-white p-5 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-base font-semibold text-navy-900">
                  {student.full_name}
                </h3>
                {student.parent_email && (
                  <p className="mt-1 text-xs text-navy-600">{student.parent_email}</p>
                )}
              </div>
              <span className="inline-flex shrink-0 items-center rounded-full bg-navy-50 px-2 py-0.5 text-xs font-medium text-navy-800">
                {GRADE_LABELS[student.grade]}
              </span>
            </div>
            {student.notes && (
              <p className="mt-3 line-clamp-3 text-xs text-navy-700 font-ko" lang="ko">
                {student.notes}
              </p>
            )}
            <div className="mt-auto flex items-center justify-end gap-2 pt-4">
              <Link
                href={`/dashboard/principal/students/${student.id}`}
                className="rounded-md border border-navy-200 px-3 py-1 text-xs font-medium text-navy-700 hover:bg-navy-50"
              >
                수정
              </Link>
              <form action={deleteStudentAction.bind(null, student.id)}>
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
