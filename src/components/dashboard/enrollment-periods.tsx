"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EnrollmentStatusBadge } from "@/components/dashboard/enrollment-status-badge";
import {
  closeEnrollmentPeriodAction,
  openEnrollmentPeriodAction,
  type EnrollmentActionState,
} from "@/lib/enrollment/actions";
import type { StudentEnrollmentPeriod } from "@/lib/supabase/types";

export function EnrollmentPeriods({
  studentId,
  periods,
}: {
  studentId: string;
  periods: StudentEnrollmentPeriod[];
}) {
  const activePeriod = periods.find((p) => p.ended_at === null) ?? null;

  return (
    <div className="rounded-2xl border border-navy-100 bg-white p-6 shadow-sm sm:p-8">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-base font-semibold text-navy-900 font-ko" lang="ko">
          재원 상태
        </h2>
        <EnrollmentStatusBadge status={activePeriod ? "active" : "paused"} />
      </div>

      {activePeriod ? (
        <CloseForm studentId={studentId} periodId={activePeriod.id} />
      ) : (
        <OpenForm studentId={studentId} />
      )}

      {periods.length > 0 && (
        <ul className="mt-6 divide-y divide-navy-100 border-t border-navy-100 pt-4">
          {periods.map((period) => (
            <li key={period.id} className="flex items-center justify-between gap-3 py-2 text-sm">
              <span className="text-navy-800">
                {period.started_at} ~ {period.ended_at ?? "현재"}
              </span>
              {period.note && <span className="text-xs text-navy-500">{period.note}</span>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function OpenForm({ studentId }: { studentId: string }) {
  const action = openEnrollmentPeriodAction.bind(null, studentId);
  const [state, formAction, isPending] = useActionState<EnrollmentActionState | null, FormData>(
    action,
    null,
  );

  return (
    <form action={formAction} className="mt-4 flex flex-wrap items-end gap-3">
      <div>
        <label className="mb-1 block text-xs font-medium text-navy-600" htmlFor="started_at">
          등록일
        </label>
        <Input type="date" name="started_at" id="started_at" className="h-9 w-40 text-sm" />
      </div>
      <Button type="submit" size="md" disabled={isPending}>
        {isPending ? "처리 중..." : "재등록"}
      </Button>
      {state?.error && (
        <p className="w-full text-xs text-red-600" role="alert">
          {state.error}
        </p>
      )}
    </form>
  );
}

function CloseForm({ studentId, periodId }: { studentId: string; periodId: string }) {
  const action = closeEnrollmentPeriodAction.bind(null, studentId, periodId);
  const [state, formAction, isPending] = useActionState<EnrollmentActionState | null, FormData>(
    action,
    null,
  );

  return (
    <form action={formAction} className="mt-4 flex flex-wrap items-end gap-3">
      <div>
        <label className="mb-1 block text-xs font-medium text-navy-600" htmlFor="ended_at">
          중지일
        </label>
        <Input type="date" name="ended_at" id="ended_at" className="h-9 w-40 text-sm" />
      </div>
      <button
        type="submit"
        disabled={isPending}
        className="h-10 rounded-md border border-red-200 px-4 text-sm font-medium text-red-700 hover:bg-red-50 disabled:opacity-50"
      >
        {isPending ? "처리 중..." : "중지"}
      </button>
      {state?.error && (
        <p className="w-full text-xs text-red-600" role="alert">
          {state.error}
        </p>
      )}
    </form>
  );
}
