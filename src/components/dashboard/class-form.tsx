"use client";

import * as React from "react";
import { useActionState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/forms/field";
import { WEEKDAYS, WEEKDAY_LABELS, WEEKDAY_LABELS_EN } from "@/lib/classes/schema";
import type { ClassFormState } from "@/lib/classes/actions";
import type { Class } from "@/lib/supabase/types";

type Props = {
  mode: "create" | "edit";
  classRecord?: Class;
  action: (prev: ClassFormState | null, formData: FormData) => Promise<ClassFormState>;
};

function WeekdayCheckbox({
  day,
  defaultChecked,
}: {
  day: (typeof WEEKDAYS)[number];
  defaultChecked: boolean;
}) {
  return (
    <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-navy-200 bg-white px-3 py-2 text-sm text-navy-800 hover:bg-navy-50 has-[:checked]:border-navy-500 has-[:checked]:bg-navy-50 has-[:checked]:text-navy-900">
      <input
        type="checkbox"
        name="days_of_week"
        value={day}
        defaultChecked={defaultChecked}
        className="h-4 w-4 accent-navy-700"
      />
      <span>
        {WEEKDAY_LABELS[day]}
        <span className="ml-1 text-xs text-navy-500">{WEEKDAY_LABELS_EN[day]}</span>
      </span>
    </label>
  );
}

export function ClassForm({ mode, classRecord, action }: Props) {
  const [state, formAction, isPending] = useActionState<ClassFormState | null, FormData>(
    action,
    null,
  );

  return (
    <form
      action={formAction}
      noValidate
      className="space-y-6 rounded-2xl border border-navy-100 bg-white p-6 shadow-sm sm:p-8"
    >
      <Field label="반 이름 / Name" error={state?.fieldErrors?.name} required>
        <Input
          name="name"
          defaultValue={classRecord?.name ?? ""}
          aria-required
          placeholder="월목 5시반"
        />
      </Field>

      <Field label="요일 / Days" error={state?.fieldErrors?.days_of_week} required>
        <div className="flex flex-wrap gap-2">
          {WEEKDAYS.map((day) => (
            <WeekdayCheckbox
              key={day}
              day={day}
              defaultChecked={classRecord?.days_of_week.includes(day) ?? false}
            />
          ))}
        </div>
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="시작 시간 / Start" error={state?.fieldErrors?.start_time} required>
          <Input
            type="time"
            name="start_time"
            defaultValue={classRecord?.start_time?.slice(0, 5) ?? ""}
            aria-required
          />
        </Field>

        <Field label="종료 시간 / End" error={state?.fieldErrors?.end_time} required>
          <Input
            type="time"
            name="end_time"
            defaultValue={classRecord?.end_time?.slice(0, 5) ?? ""}
            aria-required
          />
        </Field>
      </div>

      <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-navy-800">
        <input
          type="checkbox"
          name="is_active"
          defaultChecked={classRecord?.is_active ?? true}
          className="h-4 w-4 accent-navy-700"
        />
        운영 중 / Active
      </label>

      {state?.error && !state.fieldErrors && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
          {state.error}
        </p>
      )}

      <div className="flex items-center justify-between gap-3 border-t border-navy-100 pt-5">
        <Link
          href="/dashboard/principal/classes"
          className="text-sm text-navy-600 hover:text-navy-900"
        >
          취소
        </Link>
        <Button size="md" type="submit" disabled={isPending}>
          {isPending
            ? "저장 중..."
            : mode === "create"
              ? "반 등록 / Add"
              : "변경 저장 / Save"}
        </Button>
      </div>
    </form>
  );
}
