"use client";

import * as React from "react";
import { useActionState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/forms/field";
import { signInAction, type SignInState } from "@/lib/auth/actions";
import { signInSchema, type SignInValues } from "@/lib/auth/schema";

export function LoginForm({ next }: { next?: string }) {
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
      {next && <input type="hidden" name="next" value={next} />}
      <Field
        label="Email"
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
        label="Password"
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
          {isPending ? "Signing in..." : "Sign in"}
        </Button>
        <p className="mt-3 text-center text-xs text-navy-600">
          Forgot your password? Contact your administrator.
        </p>
        <p className="mt-2 text-center text-xs text-navy-600">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-navy-800 underline underline-offset-2">
            Sign up
          </Link>
        </p>
      </div>
    </form>
  );
}
