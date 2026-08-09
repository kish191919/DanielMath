"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateDefaultTuitionAmountAction, type TuitionActionState } from "@/lib/tuition/actions";

export function DefaultTuitionAmountForm({
  studentId,
  monthlyTuitionAmount,
}: {
  studentId: string;
  monthlyTuitionAmount: number;
}) {
  const action = updateDefaultTuitionAmountAction.bind(null, studentId);
  const [state, formAction, isPending] = useActionState<TuitionActionState | null, FormData>(
    action,
    null,
  );

  return (
    <form action={formAction} className="flex flex-wrap items-end gap-3">
      <div>
        <label
          className="mb-1 block text-xs font-medium text-navy-600"
          htmlFor="monthly_tuition_amount"
        >
          기본 월 학원비 (USD)
        </label>
        <Input
          type="number"
          step="0.01"
          min="0"
          name="monthly_tuition_amount"
          id="monthly_tuition_amount"
          defaultValue={monthlyTuitionAmount}
          className="h-9 w-32 text-sm"
        />
      </div>
      <Button type="submit" size="md" disabled={isPending}>
        {isPending ? "저장 중..." : "저장"}
      </Button>
      {state?.error && (
        <p className="w-full text-xs text-red-600" role="alert">
          {state.error}
        </p>
      )}
    </form>
  );
}
