import { deleteClassSessionAction } from "@/lib/class-sessions/actions";
import type { AttendanceSummary } from "@/lib/class-sessions/queries";
import type { ClassSession } from "@/lib/supabase/types";

export function ClassSessionLogList({
  classId,
  sessions,
  attendanceBySession,
}: {
  classId: string;
  sessions: ClassSession[];
  attendanceBySession: Record<string, AttendanceSummary>;
}) {
  return (
    <div className="rounded-2xl border border-navy-100 bg-white p-5 shadow-sm">
      <h3 className="text-base font-semibold text-navy-900 font-ko" lang="ko">
        수업일지 기록
      </h3>

      {sessions.length === 0 ? (
        <p className="mt-4 text-sm text-navy-600">아직 작성된 수업일지가 없습니다.</p>
      ) : (
        <ul className="mt-4 divide-y divide-navy-100">
          {sessions.map((sessionRow) => {
            const summary = attendanceBySession[sessionRow.id];
            return (
              <li key={sessionRow.id} className="space-y-2 py-4">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm font-semibold text-navy-900">{sessionRow.session_date}</p>
                  <form action={deleteClassSessionAction.bind(null, sessionRow.id, classId)}>
                    <button
                      type="submit"
                      className="rounded-md border border-red-200 px-3 py-1 text-xs font-medium text-red-700 hover:bg-red-50"
                    >
                      삭제
                    </button>
                  </form>
                </div>

                {sessionRow.topic && (
                  <p className="text-sm text-navy-800">
                    <span className="font-medium">진도:</span> {sessionRow.topic}
                  </p>
                )}
                {sessionRow.materials && (
                  <p className="text-sm text-navy-800">
                    <span className="font-medium">문제지:</span> {sessionRow.materials}
                  </p>
                )}
                {sessionRow.note && (
                  <p className="whitespace-pre-wrap text-sm text-navy-700 font-ko" lang="ko">
                    {sessionRow.note}
                  </p>
                )}

                {summary && (
                  <p className="text-xs text-navy-500">
                    {summary.present}/{summary.total}명 출석
                    {summary.absentNames.length > 0 && ` · 결석: ${summary.absentNames.join(", ")}`}
                    {summary.lateNames.length > 0 && ` · 지각: ${summary.lateNames.join(", ")}`}
                  </p>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
