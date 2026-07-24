import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { GRADE_LABELS } from "@/lib/students/schema";
import { WEEKDAYS, WEEKDAY_LABELS } from "@/lib/classes/schema";
import { enrollStudentAction, unenrollStudentAction } from "@/lib/classes/actions";
import type { ClassRoster as ClassRosterData } from "@/lib/classes/queries";
import type { Student } from "@/lib/supabase/types";

function scheduleLabel(days: number[], startTime: string, endTime: string) {
  const dayLabel = WEEKDAYS.filter((d) => days.includes(d))
    .map((d) => WEEKDAY_LABELS[d])
    .join("");
  return `${dayLabel} ${startTime.slice(0, 5)}-${endTime.slice(0, 5)}`;
}

export function ClassRoster({
  classRow,
  roster,
  availableStudents,
}: {
  classRow: ClassRosterData["classRow"];
  roster: ClassRosterData["roster"];
  availableStudents: Student[];
}) {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-navy-100 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-wider text-navy-500">Schedule</p>
        <p className="mt-2 text-lg font-medium text-navy-900 font-ko" lang="ko">
          {scheduleLabel(classRow.days_of_week, classRow.start_time, classRow.end_time)}
        </p>
      </div>

      <div className="rounded-2xl border border-navy-100 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-navy-900 font-ko" lang="ko">
            학생 명단 ({roster.length}명)
          </h2>
        </div>

        {roster.length === 0 ? (
          <p className="mt-4 text-sm text-navy-600">등록된 학생이 없습니다.</p>
        ) : (
          <ul className="mt-4 divide-y divide-navy-100">
            {roster.map(({ enrollmentId, student }) => (
              <li key={enrollmentId} className="flex items-center justify-between gap-3 py-3">
                <div>
                  <p className="text-sm font-medium text-navy-900">{student.full_name}</p>
                  <p className="text-xs text-navy-500">{GRADE_LABELS[student.grade]}</p>
                </div>
                <form action={unenrollStudentAction.bind(null, classRow.id, enrollmentId)}>
                  <button
                    type="submit"
                    className="rounded-md border border-red-200 px-3 py-1 text-xs font-medium text-red-700 hover:bg-red-50"
                  >
                    탈퇴
                  </button>
                </form>
              </li>
            ))}
          </ul>
        )}

        <form
          action={enrollStudentAction.bind(null, classRow.id)}
          className="mt-6 flex items-end gap-3 border-t border-navy-100 pt-5"
        >
          <div className="flex-1">
            <label className="mb-2 block text-sm font-medium text-navy-800" htmlFor="student_id">
              학생 추가 / Add Student
            </label>
            <Select name="student_id" id="student_id" defaultValue="" required>
              <option value="" disabled>
                Select student
              </option>
              {availableStudents.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.full_name} ({GRADE_LABELS[student.grade]})
                </option>
              ))}
            </Select>
          </div>
          <Button type="submit" size="md" disabled={availableStudents.length === 0}>
            추가
          </Button>
        </form>
      </div>
    </div>
  );
}
