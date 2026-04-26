"use client";

import * as React from "react";
import { useActionState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/forms/field";
import { signInAction, type SignInState } from "@/lib/auth/actions";
import { signInSchema, type SignInValues } from "@/lib/auth/schema";

export function LoginForm() {
  const [state, formAction, isPending] = useActionState<SignInState | null, FormData>(
    signInAction,
    null,
  );

  const {
    register,
    formState: { errors },
  } = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
  });

  return (
    <form
      action={formAction}
      noValidate
      className="space-y-6 rounded-2xl border border-navy-100 bg-white p-6 shadow-sm sm:p-8"
    >
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
          autoComplete="current-password"
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
          {isPending ? "로그인 중..." : "로그인 / Sign in"}
        </Button>
        <p className="mt-3 text-center text-xs text-navy-600 font-ko" lang="ko">
          비밀번호를 잊으셨나요? 관리자에게 문의해주세요.
        </p>
      </div>
    </form>
  );
}
