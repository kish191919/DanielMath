"use client";

import * as React from "react";
import { useActionState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Field } from "@/components/forms/field";
import { GRADES, GRADE_LABELS, TRACKS, TRACK_LABELS } from "@/lib/students/schema";
import type { StudentFormState } from "@/lib/students/actions";
import type { Student } from "@/lib/supabase/types";

type Prefill = {
  full_name: string;
  grade: Student["grade"];
  notes: string;
};

type Props = {
  mode: "create" | "edit";
  student?: Student;
  prefill?: Prefill;
  fromInquiryId?: string;
  action: (
    prev: StudentFormState | null,
    formData: FormData,
  ) => Promise<StudentFormState>;
};

export function StudentForm({ mode, student, prefill, fromInquiryId, action }: Props) {
  const [state, formAction, isPending] = useActionState<StudentFormState | null, FormData>(
    action,
    null,
  );

  return (
    <form
      action={formAction}
      noValidate
      className="space-y-6 rounded-2xl border border-navy-100 bg-white p-6 shadow-sm sm:p-8"
    >
      {fromInquiryId && <input type="hidden" name="from_inquiry_id" value={fromInquiryId} />}

      <Field label="학생 이름 / Name" error={state?.fieldErrors?.full_name} required>
        <Input
          name="full_name"
          defaultValue={student?.full_name ?? prefill?.full_name ?? ""}
          aria-required
          placeholder="Alice Kim"
        />
      </Field>

      <Field label="학년 / Grade" error={state?.fieldErrors?.grade} required>
        <Select name="grade" defaultValue={student?.grade ?? prefill?.grade ?? ""} aria-required>
          <option value="" disabled>
            Select grade
          </option>
          {GRADES.map((g) => (
            <option key={g} value={g}>
              {GRADE_LABELS[g]}
            </option>
          ))}
        </Select>
      </Field>

      <Field label="트랙 / Track" error={state?.fieldErrors?.track} required>
        <Select name="track" defaultValue={student?.track ?? "advanced"} aria-required>
          {TRACKS.map((t) => (
            <option key={t} value={t}>
              {TRACK_LABELS[t]}
            </option>
          ))}
        </Select>
      </Field>

      <Field label="메모 / Notes (선택)" error={state?.fieldErrors?.notes}>
        <Textarea
          name="notes"
          defaultValue={student?.notes ?? prefill?.notes ?? ""}
          maxLength={2000}
          placeholder="현재 학습 수준, 목표, 강점/약점 등."
        />
      </Field>

      {state?.error && !state.fieldErrors && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
          {state.error}
        </p>
      )}

      <div className="flex items-center justify-between gap-3 border-t border-navy-100 pt-5">
        <Link
          href="/dashboard/principal/students"
          className="text-sm text-navy-600 hover:text-navy-900"
        >
          취소
        </Link>
        <Button size="md" type="submit" disabled={isPending}>
          {isPending
            ? "저장 중..."
            : mode === "create"
              ? "학생 등록 / Add"
              : "변경 저장 / Save"}
        </Button>
      </div>
    </form>
  );
}
