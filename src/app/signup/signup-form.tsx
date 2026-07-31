"use client";

import * as React from "react";
import { useActionState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/forms/field";
import { signUpAction, type SignUpState } from "@/lib/auth/actions";
import { signUpSchema, type SignUpValues } from "@/lib/auth/schema";

export function SignUpForm() {
  const [state, formAction, isPending] = useActionState<SignUpState | null, FormData>(
    signUpAction,
    null,
  );

  const {
    register,
    formState: { errors },
  } = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      smsConsent: false,
      password: "",
      confirmPassword: "",
    },
  });

  return (
    <form
      action={formAction}
      noValidate
      className="space-y-6 rounded-2xl border border-navy-100 bg-white p-6 shadow-sm sm:p-8"
    >
      <Field
        label="이름 / Full Name"
        error={errors.fullName?.message ?? state?.fieldErrors?.fullName}
        required
      >
        <Input
          type="text"
          {...register("fullName")}
          aria-required
          autoComplete="name"
          placeholder="홍길동"
        />
      </Field>

      <Field
        label="이메일 / Email"
        error={errors.email?.message ?? state?.fieldErrors?.email}
        required
      >
        <Input
          type="email"
          {...register("email")}
          aria-required
          autoComplete="email"
          placeholder="you@example.com"
        />
      </Field>

      <Field
        label="연락처 / Phone"
        error={errors.phone?.message ?? state?.fieldErrors?.phone}
        required
      >
        <Input
          type="tel"
          {...register("phone")}
          aria-required
          autoComplete="tel"
          placeholder="010-1234-5678"
        />
      </Field>

      <div className="space-y-2">
        <label className="flex cursor-pointer items-start gap-2 text-sm text-navy-800">
          <input
            type="checkbox"
            {...register("smsConsent")}
            className="mt-0.5 h-4 w-4 accent-navy-700"
            aria-required
          />
          <span>
            학습 리포트, 출결, 일정변경 안내 문자(SMS) 수신에 동의합니다. 메시지 빈도는 수업
            일정에 따라 주 최대 4회입니다. 문자/데이터 요금이 발생할 수 있습니다. 언제든지 STOP
            회신 시 수신거부, HELP 회신 시 도움을 받을 수 있습니다. / I agree to receive SMS
            notifications for learning reports, attendance, and schedule changes. Message
            frequency: up to 4 messages/week depending on class schedule. Msg &amp; data rates
            may apply. Reply STOP to cancel, HELP for help. (
            <Link href="/privacy" target="_blank" className="underline underline-offset-2">
              개인정보처리방침 / Privacy Policy
            </Link>{" "}
            ·{" "}
            <Link href="/terms" target="_blank" className="underline underline-offset-2">
              이용약관 / SMS Terms
            </Link>
            )
          </span>
        </label>
        {(errors.smsConsent?.message ?? state?.fieldErrors?.smsConsent) && (
          <p className="text-xs text-red-600" role="alert">
            {errors.smsConsent?.message ?? state?.fieldErrors?.smsConsent}
          </p>
        )}
      </div>

      <Field
        label="비밀번호 / Password"
        error={errors.password?.message ?? state?.fieldErrors?.password}
        required
      >
        <Input
          type="password"
          {...register("password")}
          aria-required
          autoComplete="new-password"
          placeholder="••••••••"
        />
      </Field>

      <Field
        label="비밀번호 확인 / Confirm Password"
        error={errors.confirmPassword?.message ?? state?.fieldErrors?.confirmPassword}
        required
      >
        <Input
          type="password"
          {...register("confirmPassword")}
          aria-required
          autoComplete="new-password"
          placeholder="••••••••"
        />
      </Field>

      {state?.error && !state.fieldErrors && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
          {state.error}
        </p>
      )}

      <div className="border-t border-navy-100 pt-5">
        <Button size="lg" type="submit" disabled={isPending} className="w-full">
          {isPending ? "가입 중..." : "회원가입 / Sign up"}
        </Button>
        <p className="mt-3 text-center text-xs text-navy-600 font-ko" lang="ko">
          이미 계정이 있으신가요?{" "}
          <Link href="/login" className="text-navy-800 underline underline-offset-2">
            로그인
          </Link>
        </p>
      </div>
    </form>
  );
}
