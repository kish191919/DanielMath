"use client";

import * as React from "react";
import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  addGuardianAction,
  removeGuardianAction,
  type AddGuardianFormState,
} from "@/lib/students/actions";
import type { GuardianLink } from "@/lib/students/queries";

export function StudentGuardians({
  studentId,
  guardians,
}: {
  studentId: string;
  guardians: GuardianLink[];
}) {
  return (
    <div className="rounded-2xl border border-navy-100 bg-white p-6 shadow-sm sm:p-8">
      <h2 className="text-base font-semibold text-navy-900 font-ko" lang="ko">
        보호자 ({guardians.length}명)
      </h2>

      {guardians.length === 0 ? (
        <p className="mt-4 text-sm text-navy-600">연결된 보호자가 없습니다.</p>
      ) : (
        <ul className="mt-4 divide-y divide-navy-100">
          {guardians.map(({ linkId, guardian }) => (
            <li key={linkId} className="flex items-center justify-between gap-3 py-3">
              <div>
                <p className="text-sm font-medium text-navy-900">
                  {guardian.full_name ?? guardian.email}
                </p>
                {guardian.full_name && (
                  <p className="text-xs text-navy-500">{guardian.email}</p>
                )}
              </div>
              <form action={removeGuardianAction.bind(null, studentId, linkId)}>
                <button
                  type="submit"
                  className="rounded-md border border-red-200 px-3 py-1 text-xs font-medium text-red-700 hover:bg-red-50"
                >
                  제거
                </button>
              </form>
            </li>
          ))}
        </ul>
      )}

      <AddGuardianForm studentId={studentId} />
    </div>
  );
}

function AddGuardianForm({ studentId }: { studentId: string }) {
  const action = addGuardianAction.bind(null, studentId);
  const [state, formAction, isPending] = useActionState<AddGuardianFormState | null, FormData>(
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
      className="mt-6 flex items-end gap-3 border-t border-navy-100 pt-5"
    >
      <div className="flex-1">
        <label className="mb-2 block text-sm font-medium text-navy-800" htmlFor="guardian_email">
          이메일로 추가 / Add by Email
        </label>
        <Input
          type="email"
          name="email"
          id="guardian_email"
          autoComplete="off"
          placeholder="parent@example.com"
        />
        {(state?.fieldErrors?.email || (state?.error && !state.fieldErrors)) && (
          <p className="mt-2 text-xs text-red-600" role="alert">
            {state?.fieldErrors?.email ?? state?.error}
          </p>
        )}
      </div>
      <Button type="submit" size="md" disabled={isPending}>
        {isPending ? "추가 중..." : "추가"}
      </Button>
    </form>
  );
}
