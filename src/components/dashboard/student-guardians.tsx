"use client";

import * as React from "react";
import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  addGuardianAction,
  removeGuardianAction,
  updateGuardianPhoneAction,
  type AddGuardianFormState,
  type UpdateGuardianPhoneState,
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
              <div className="flex-1">
                <p className="text-sm font-medium text-navy-900">
                  {guardian.full_name ?? guardian.email}
                </p>
                {guardian.full_name && (
                  <p className="text-xs text-navy-500">{guardian.email}</p>
                )}
                <GuardianPhoneEdit
                  key={guardian.phone ?? "unset"}
                  guardianId={guardian.id}
                  studentId={studentId}
                  phone={guardian.phone}
                />
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

function GuardianPhoneEdit({
  guardianId,
  studentId,
  phone,
}: {
  guardianId: string;
  studentId: string;
  phone: string | null;
}) {
  const action = updateGuardianPhoneAction.bind(null, guardianId, studentId);
  const [state, formAction, isPending] = useActionState<UpdateGuardianPhoneState | null, FormData>(
    action,
    null,
  );
  const [editing, setEditing] = React.useState(false);

  if (!editing) {
    return (
      <button
        type="button"
        onClick={() => setEditing(true)}
        className="mt-1 text-xs text-navy-600 underline underline-offset-2 hover:text-navy-800"
      >
        {phone ?? "연락처 미등록 — 입력하기"}
      </button>
    );
  }

  return (
    <form action={formAction} className="mt-1 flex items-center gap-2">
      <Input
        type="tel"
        name="phone"
        defaultValue={phone ?? ""}
        placeholder="010-1234-5678"
        className="h-8 w-36 text-xs"
      />
      <Button type="submit" size="md" className="h-8 px-3 text-xs" disabled={isPending}>
        저장
      </Button>
      <button
        type="button"
        onClick={() => setEditing(false)}
        className="text-xs text-navy-500 hover:text-navy-700"
      >
        취소
      </button>
      {state?.error && (
        <p className="text-xs text-red-600" role="alert">
          {state.error}
        </p>
      )}
    </form>
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
