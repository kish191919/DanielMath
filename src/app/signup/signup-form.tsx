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
    defaultValues: { fullName: "", email: "", password: "", confirmPassword: "" },
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
