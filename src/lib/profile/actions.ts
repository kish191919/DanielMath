"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/dal";
import { createServerSupabase } from "@/lib/supabase/server";

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
