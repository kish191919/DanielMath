"use client";

import { useActionState } from "react";
import Link from "next/link";
import { updateSmsConsentAction, type UpdateSmsConsentState } from "@/lib/profile/actions";

export function SmsConsentToggle({ defaultChecked }: { defaultChecked: boolean }) {
  const [state, formAction, isPending] = useActionState<UpdateSmsConsentState | null, FormData>(
    updateSmsConsentAction,
    null,
  );

  return (
    <form action={formAction} className="space-y-2">
      <label className="flex cursor-pointer items-start gap-2 text-sm text-navy-800">
        <input
          type="checkbox"
          name="sms_consent"
          defaultChecked={defaultChecked}
          disabled={isPending}
          onChange={(e) => e.currentTarget.form?.requestSubmit()}
          className="mt-0.5 h-4 w-4 accent-navy-700"
        />
        <span>
          <span className="font-medium text-navy-900 font-ko" lang="ko">
            SMS 알림 수신 동의
          </span>
          <br />
          I agree to receive SMS notifications for learning reports,
          attendance, and schedule changes. Message frequency: up to 4
          messages/week depending on class schedule. Msg &amp; data rates
          may apply. Reply STOP to cancel, HELP for help. (
          <Link href="/privacy" target="_blank" className="underline underline-offset-2">
            Privacy Policy
          </Link>{" "}
          ·{" "}
          <Link href="/terms" target="_blank" className="underline underline-offset-2">
            SMS Terms
          </Link>
          )
        </span>
      </label>
      {state?.error && (
        <p className="text-xs text-red-600" role="alert">
          {state.error}
        </p>
      )}
    </form>
  );
}
