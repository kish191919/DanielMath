"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/dal";
import { createServerSupabase } from "@/lib/supabase/server";

export type NotificationPrefsFormState = {
  error?: string;
  success?: boolean;
};

export async function updateNotificationPrefsAction(
  _prev: NotificationPrefsFormState | null,
  formData: FormData,
): Promise<NotificationPrefsFormState> {
  const session = await requireRole("parent");

  const phoneRaw = (formData.get("phone") as string | null)?.trim() ?? "";
  const smsOptIn = formData.get("smsOptIn") === "on";

  if (smsOptIn && phoneRaw.length < 7) {
    return { error: "문자 알림을 받으려면 전화번호를 입력해주세요." };
  }

  const supabase = await createServerSupabase();
  const { error } = await supabase
    .from("profiles")
    .update({ phone: phoneRaw || null, sms_opt_in: smsOptIn })
    .eq("id", session.userId);
  if (error) return { error: error.message };

  revalidatePath("/dashboard/parent/settings");
  return { success: true };
}
