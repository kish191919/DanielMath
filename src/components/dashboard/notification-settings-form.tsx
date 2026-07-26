"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/forms/field";
import {
  updateNotificationPrefsAction,
  type NotificationPrefsFormState,
} from "@/lib/profiles/actions";

export function NotificationSettingsForm({
  phone,
  smsOptIn,
}: {
  phone: string | null;
  smsOptIn: boolean;
}) {
  const [state, formAction, isPending] = useActionState<
    NotificationPrefsFormState | null,
    FormData
  >(updateNotificationPrefsAction, null);

  return (
    <form
      action={formAction}
      className="space-y-6 rounded-2xl border border-navy-100 bg-white p-6 shadow-sm sm:p-8"
    >
      <Field label="연락처 (문자 알림 수신용)">
        <Input
          type="tel"
          name="phone"
          defaultValue={phone ?? ""}
          autoComplete="tel"
          placeholder="(703) 555-0100"
        />
      </Field>

      <label className="flex cursor-pointer items-start gap-2 text-sm text-navy-800">
        <input
          type="checkbox"
          name="smsOptIn"
          defaultChecked={smsOptIn}
          className="mt-0.5 h-4 w-4 accent-navy-700"
        />
        <span className="font-ko" lang="ko">
          문자로도 새 메시지 알림 받기 (선생님이 메시지를 보내면 문자로 안내드립니다)
        </span>
      </label>

      {state?.error && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
          {state.error}
        </p>
      )}
      {state?.success && (
        <p className="rounded-md bg-green-50 px-3 py-2 text-sm text-green-700">저장되었습니다.</p>
      )}

      <div className="border-t border-navy-100 pt-5">
        <Button type="submit" size="lg" disabled={isPending} className="w-full sm:w-auto">
          {isPending ? "저장 중..." : "저장"}
        </Button>
      </div>
    </form>
  );
}
