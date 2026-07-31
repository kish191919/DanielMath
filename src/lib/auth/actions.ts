"use server";

import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { signInSchema, signUpSchema } from "./schema";

export type SignInState = {
  error?: string;
  fieldErrors?: Partial<Record<"email" | "password", string>>;
};

export async function signInAction(
  _prev: SignInState | null,
  formData: FormData,
): Promise<SignInState> {
  const parsed = signInSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    const fieldErrors: SignInState["fieldErrors"] = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (key === "email" || key === "password") {
        fieldErrors[key] = issue.message;
      }
    }
    return { error: "입력값을 확인해주세요.", fieldErrors };
  }

  const supabase = await createServerSupabase();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    return { error: "이메일 또는 비밀번호가 올바르지 않습니다." };
  }

  const next = formData.get("next");
  const isSafeNext = typeof next === "string" && next.startsWith("/") && !next.startsWith("//");
  redirect(isSafeNext ? next : "/dashboard");
}

export async function signOutAction() {
  const supabase = await createServerSupabase();
  await supabase.auth.signOut();
  redirect("/");
}

export type SignUpState = {
  error?: string;
  fieldErrors?: Partial<
    Record<"fullName" | "email" | "phone" | "smsConsent" | "password" | "confirmPassword", string>
  >;
};

export async function signUpAction(
  _prev: SignUpState | null,
  formData: FormData,
): Promise<SignUpState> {
  const parsed = signUpSchema.safeParse({
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    smsConsent: formData.get("smsConsent") === "on",
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsed.success) {
    const fieldErrors: SignUpState["fieldErrors"] = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (
        key === "fullName" ||
        key === "email" ||
        key === "phone" ||
        key === "smsConsent" ||
        key === "password" ||
        key === "confirmPassword"
      ) {
        fieldErrors[key] = issue.message;
      }
    }
    return { error: "입력값을 확인해주세요.", fieldErrors };
  }

  const { fullName, email, phone, password } = parsed.data;
  const admin = createAdminSupabase();

  // No email-confirmation template is configured in this project, so we
  // create an already-confirmed user server-side instead of using client
  // signUp() (which would trigger Supabase's default confirmation email).
  const { data: created, error: createError } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: fullName },
  });

  if (createError || !created.user) {
    if (
      createError?.code === "email_exists" ||
      /already been registered|already exists/i.test(createError?.message ?? "")
    ) {
      return {
        error: "이미 등록된 이메일입니다.",
        fieldErrors: { email: "이미 사용 중인 이메일입니다." },
      };
    }
    return { error: "회원가입 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요." };
  }

  const userId = created.user.id;

  // Role is always hardcoded to "parent" here, never taken from client
  // input, to prevent privilege escalation to "principal". Upsert is
  // idempotent in case a live DB trigger already inserted a profiles row.
  const { error: profileError } = await admin
    .from("profiles")
    .upsert(
      {
        id: userId,
        role: "parent",
        email,
        full_name: fullName,
        phone,
        sms_consent: true,
        sms_consent_at: new Date().toISOString(),
      },
      { onConflict: "id" },
    );

  if (profileError) {
    // Roll back the auth user so we never leave an orphaned auth.users row
    // with no matching profiles row (verifySession() would treat it as no
    // session, bouncing the user back to /login in a confusing loop).
    await admin.auth.admin.deleteUser(userId);
    return { error: "회원가입 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요." };
  }

  const supabase = await createServerSupabase();
  const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
  if (signInError) {
    redirect("/login?signup=success");
  }

  redirect("/dashboard");
}
