"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/dal";
import { createServerSupabase } from "@/lib/supabase/server";
import { guardianPhoneSchema } from "@/lib/students/schema";

export type UpdateSmsConsentState = {
  error?: string;
};

export async function updateSmsConsentAction(
  _prev: UpdateSmsConsentState | null,
  formData: FormData,
): Promise<UpdateSmsConsentState> {
  const session = await requireRole("parent");

  const consent = formData.get("sms_consent") === "on";
  const supabase = await createServerSupabase();
  const { error } = await supabase
    .from("profiles")
    .update({
      sms_consent: consent,
      sms_consent_at: consent ? new Date().toISOString() : null,
    })
    .eq("id", session.userId);

  if (error) return { error: error.message };

  revalidatePath("/dashboard/parent/settings");
  return {};
}

export type UpdatePhoneState = {
  error?: string;
  success?: boolean;
};

export async function updatePhoneAction(
  _prev: UpdatePhoneState | null,
  formData: FormData,
): Promise<UpdatePhoneState> {
  const session = await requireRole("parent");

  const parsed = guardianPhoneSchema.safeParse(formData.get("phone"));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "연락처를 확인해주세요." };
  }

  const supabase = await createServerSupabase();
  const { error } = await supabase
    .from("profiles")
    .update({ phone: parsed.data })
    .eq("id", session.userId);

  if (error) return { error: error.message };

  revalidatePath("/dashboard/parent/settings");
  return { success: true };
}
