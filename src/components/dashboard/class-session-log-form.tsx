"use client";

import * as React from "react";
import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  ATTENDANCE_STATUSES,
  ATTENDANCE_LABELS,
  HOMEWORK_STATUSES,
  HOMEWORK_LABELS,
} from "@/lib/class-sessions/schema";
import { createClassSessionAction, type ClassSessionFormState } from "@/lib/class-sessions/actions";
import type { ClassRosterEntry } from "@/lib/classes/queries";
import type { AttendanceStatus, HomeworkStatus } from "@/lib/supabase/types";
import { todayInEasternTime } from "@/lib/dates";

export function ClassSessionLogForm({
  classId,
  roster,
}: {
  classId: string;
  roster: ClassRosterEntry[];
}) {
  const action = createClassSessionAction.bind(null, classId);
  const [state, formAction, isPending] = useActionState<ClassSessionFormState | null, FormData>(
    action,
    null,
  );
  const formRef = React.useRef<HTMLFormElement>(null);

  React.useEffect(() => {
    if (state?.success) formRef.current?.reset();
  }, [state]);

  return (
    <form
      ref={formRef}
      action={formAction}
      className="space-y-4 rounded-2xl border border-navy-100 bg-white p-5 shadow-sm"
    >
      <h3 className="text-base font-semibold text-navy-900 font-ko" lang="ko">
        수업일지 작성
      </h3>

      <div>
        <label className="mb-2 block text-sm font-medium text-navy-800" htmlFor="session_date">
          날짜 / Date
        </label>
        <Input
          type="date"
          name="session_date"
          id="session_date"
          defaultValue={todayInEasternTime()}
          required
        />
        {state?.fieldErrors?.session_date && (
          <p className="mt-1 text-xs text-red-600" role="alert">
            {state.fieldErrors.session_date}
          </p>
        )}
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-navy-800" htmlFor="note">
          특이사항 / Note
        </label>
        <Textarea name="note" id="note" maxLength={2000} placeholder="오늘 수업 중 특이사항을 적어주세요." />
      </div>

      {roster.length > 0 && (
        <div>
          <p className="mb-2 text-sm font-medium text-navy-800">출결 · 숙제 / Attendance &amp; Homework</p>
          <div className="space-y-2">
            {roster.map(({ enrollmentId, student }) => (
              <div
                key={enrollmentId}
                className="space-y-2 rounded-md border border-navy-100 px-3 py-2"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-sm font-medium text-navy-900">{student.full_name}</span>
                  <div className="flex gap-2">
                    {ATTENDANCE_STATUSES.map((status: AttendanceStatus) => (
                      <label
                        key={status}
                        className="inline-flex cursor-pointer items-center gap-1 rounded-md border border-navy-200 bg-white px-2 py-1 text-xs text-navy-800 hover:bg-navy-50 has-[:checked]:border-navy-500 has-[:checked]:bg-navy-50 has-[:checked]:text-navy-900"
                      >
                        <input
                          type="radio"
                          name={`status_${student.id}`}
                          value={status}
                          defaultChecked={status === "present"}
                          className="h-3.5 w-3.5 accent-navy-700"
                        />
                        {ATTENDANCE_LABELS[status]}
                      </label>
                    ))}
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex gap-1">
                    {HOMEWORK_STATUSES.map((status: HomeworkStatus) => (
                      <label
                        key={status}
                        className="inline-flex cursor-pointer items-center gap-1 rounded-md border border-navy-200 bg-white px-1.5 py-1 text-[11px] text-navy-700 hover:bg-navy-50 has-[:checked]:border-navy-500 has-[:checked]:bg-navy-50 has-[:checked]:text-navy-900"
                      >
                        <input
                          type="radio"
                          name={`homework_${student.id}`}
                          value={status}
                          defaultChecked={status === "na"}
                          className="h-3 w-3 accent-navy-700"
                        />
                        {HOMEWORK_LABELS[status]}
                      </label>
                    ))}
                  </div>
                  <Input
                    type="text"
                    name={`note_${student.id}`}
                    maxLength={2000}
                    placeholder="질문/특이사항 (선택, 학부모에게도 공개됨)"
                    className="min-w-[160px] flex-1 text-xs"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {state?.error && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
          {state.error}
        </p>
      )}
      {state?.success && <p className="text-xs text-green-700">저장되었습니다.</p>}

      <div className="flex justify-end border-t border-navy-100 pt-4">
        <Button size="md" type="submit" disabled={isPending}>
          {isPending ? "저장 중..." : "수업일지 저장"}
        </Button>
      </div>
    </form>
  );
}
