"use client";

import * as React from "react";
import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { TuitionStatusBadge } from "@/components/dashboard/tuition-status-badge";
import { ConfirmSubmitButton } from "@/components/dashboard/confirm-submit-button";
import {
  deleteTuitionPaymentAction,
  markTuitionPaidAction,
  markTuitionUnpaidAction,
  updateTuitionPaymentAction,
  type TuitionActionState,
} from "@/lib/tuition/actions";
import {
  computeTuitionStatus,
  TUITION_PAYMENT_METHODS,
  TUITION_PAYMENT_METHOD_LABELS,
} from "@/lib/tuition/schema";
import { formatUsd } from "@/lib/tuition/format";
import type { TuitionPayment } from "@/lib/supabase/types";

export function TuitionPaymentList({
  payments,
  today,
}: {
  payments: TuitionPayment[];
  today: string;
}) {
  if (payments.length === 0) {
    return <p className="mt-4 text-sm text-navy-600">청구 내역이 없습니다.</p>;
  }

  return (
    <ul className="mt-4 space-y-3">
      {payments.map((payment) => (
        <TuitionPaymentRow key={payment.id} payment={payment} today={today} />
      ))}
    </ul>
  );
}

function TuitionPaymentRow({ payment, today }: { payment: TuitionPayment; today: string }) {
  const status = computeTuitionStatus(payment, today);
  const [editing, setEditing] = React.useState(false);
  const [markingPaid, setMarkingPaid] = React.useState(false);

  return (
    <li className="rounded-2xl border border-navy-100 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-navy-900">{payment.billing_month.slice(0, 7)}</p>
          <p className="mt-1 text-xs text-navy-600">
            {formatUsd(payment.amount_due)} · 기한 {payment.due_date}
          </p>
          {payment.paid_at && (
            <p className="mt-1 text-xs text-navy-500">
              납부 {payment.paid_at} · {formatUsd(payment.paid_amount ?? 0)}
              {payment.payment_method && ` · ${TUITION_PAYMENT_METHOD_LABELS[payment.payment_method]}`}
            </p>
          )}
        </div>
        <TuitionStatusBadge status={status} />
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        {status === "paid" ? (
          <form action={markTuitionUnpaidAction.bind(null, payment.id, payment.student_id)}>
            <button
              type="submit"
              className="rounded-md border border-navy-200 px-3 py-1 text-xs font-medium text-navy-700 hover:bg-navy-50"
            >
              납부 취소
            </button>
          </form>
        ) : (
          <button
            type="button"
            onClick={() => setMarkingPaid((v) => !v)}
            className="rounded-md border border-navy-200 px-3 py-1 text-xs font-medium text-navy-700 hover:bg-navy-50"
          >
            납부 확인
          </button>
        )}
        <button
          type="button"
          onClick={() => setEditing((v) => !v)}
          className="rounded-md border border-navy-200 px-3 py-1 text-xs font-medium text-navy-700 hover:bg-navy-50"
        >
          수정
        </button>
        <form action={deleteTuitionPaymentAction.bind(null, payment.id, payment.student_id)}>
          <ConfirmSubmitButton
            label="삭제"
            confirmMessage="이 청구 기록을 삭제하시겠습니까? 되돌릴 수 없습니다."
            className="rounded-md border border-red-200 px-3 py-1 text-xs font-medium text-red-700 hover:bg-red-50"
          />
        </form>
      </div>

      {markingPaid && (
        <MarkPaidForm
          paymentId={payment.id}
          studentId={payment.student_id}
          amountDue={payment.amount_due}
          today={today}
        />
      )}
      {editing && (
        <EditForm
          paymentId={payment.id}
          studentId={payment.student_id}
          amountDue={payment.amount_due}
          dueDate={payment.due_date}
        />
      )}
    </li>
  );
}

function MarkPaidForm({
  paymentId,
  studentId,
  amountDue,
  today,
}: {
  paymentId: string;
  studentId: string;
  amountDue: number;
  today: string;
}) {
  const action = markTuitionPaidAction.bind(null, paymentId, studentId);
  const [state, formAction, isPending] = useActionState<TuitionActionState | null, FormData>(
    action,
    null,
  );

  return (
    <form
      action={formAction}
      className="mt-3 flex flex-wrap items-end gap-3 border-t border-navy-100 pt-3"
    >
      <div>
        <label
          className="mb-1 block text-xs font-medium text-navy-600"
          htmlFor={`paid_amount_${paymentId}`}
        >
          납부 금액
        </label>
        <Input
          type="number"
          step="0.01"
          min="0"
          name="paid_amount"
          id={`paid_amount_${paymentId}`}
          defaultValue={amountDue}
          className="h-9 w-28 text-sm"
        />
      </div>
      <div>
        <label
          className="mb-1 block text-xs font-medium text-navy-600"
          htmlFor={`paid_at_${paymentId}`}
        >
          납부일
        </label>
        <Input
          type="date"
          name="paid_at"
          id={`paid_at_${paymentId}`}
          defaultValue={today}
          className="h-9 w-40 text-sm"
        />
      </div>
      <div>
        <label
          className="mb-1 block text-xs font-medium text-navy-600"
          htmlFor={`payment_method_${paymentId}`}
        >
          입금 방법
        </label>
        <Select
          name="payment_method"
          id={`payment_method_${paymentId}`}
          defaultValue=""
          required
          className="h-9 w-32 text-sm"
        >
          <option value="" disabled>
            선택
          </option>
          {TUITION_PAYMENT_METHODS.map((method) => (
            <option key={method} value={method}>
              {TUITION_PAYMENT_METHOD_LABELS[method]}
            </option>
          ))}
        </Select>
      </div>
      <Button type="submit" size="md" disabled={isPending}>
        {isPending ? "처리 중..." : "확인"}
      </Button>
      {state?.error && (
        <p className="w-full text-xs text-red-600" role="alert">
          {state.error}
        </p>
      )}
    </form>
  );
}

function EditForm({
  paymentId,
  studentId,
  amountDue,
  dueDate,
}: {
  paymentId: string;
  studentId: string;
  amountDue: number;
  dueDate: string;
}) {
  const action = updateTuitionPaymentAction.bind(null, paymentId, studentId);
  const [state, formAction, isPending] = useActionState<TuitionActionState | null, FormData>(
    action,
    null,
  );

  return (
    <form
      action={formAction}
      className="mt-3 flex flex-wrap items-end gap-3 border-t border-navy-100 pt-3"
    >
      <div>
        <label
          className="mb-1 block text-xs font-medium text-navy-600"
          htmlFor={`amount_due_${paymentId}`}
        >
          청구 금액
        </label>
        <Input
          type="number"
          step="0.01"
          min="0"
          name="amount_due"
          id={`amount_due_${paymentId}`}
          defaultValue={amountDue}
          className="h-9 w-28 text-sm"
        />
      </div>
      <div>
        <label
          className="mb-1 block text-xs font-medium text-navy-600"
          htmlFor={`due_date_${paymentId}`}
        >
          납부 기한
        </label>
        <Input
          type="date"
          name="due_date"
          id={`due_date_${paymentId}`}
          defaultValue={dueDate}
          className="h-9 w-40 text-sm"
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
