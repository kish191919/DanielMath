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
        label="Full Name"
        error={errors.fullName?.message ?? state?.fieldErrors?.fullName}
        required
      >
        <Input
          type="text"
          {...register("fullName")}
          aria-required
          autoComplete="name"
          placeholder="John Doe"
        />
      </Field>

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
        label="Phone"
        error={errors.phone?.message ?? state?.fieldErrors?.phone}
        required
      >
        <Input
          type="tel"
          {...register("phone")}
          aria-required
          autoComplete="tel"
          placeholder="(555) 123-4567"
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
        {(errors.smsConsent?.message ?? state?.fieldErrors?.smsConsent) && (
          <p className="text-xs text-red-600" role="alert">
            {errors.smsConsent?.message ?? state?.fieldErrors?.smsConsent}
          </p>
        )}
      </div>

      <Field
        label="Password"
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
        label="Confirm Password"
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
          {isPending ? "Signing up..." : "Sign up"}
        </Button>
        <p className="mt-3 text-center text-xs text-navy-600">
          Already have an account?{" "}
          <Link href="/login" className="text-navy-800 underline underline-offset-2">
            Log in
          </Link>
        </p>
      </div>
    </form>
  );
}
