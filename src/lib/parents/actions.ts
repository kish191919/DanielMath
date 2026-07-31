"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/dal";
import { createAdminSupabase } from "@/lib/supabase/admin";

export type MergeParentProfilesState = {
  error?: string;
  success?: boolean;
};

export async function mergeParentProfilesAction(
  keepId: string,
  mergeId: string,
  _prev: MergeParentProfilesState | null,
  _formData: FormData,
): Promise<MergeParentProfilesState> {
  await requireRole("principal");

  if (keepId === mergeId) {
    return { error: "같은 계정은 병합할 수 없습니다." };
  }

  const admin = createAdminSupabase();
  const { error } = await admin.rpc("merge_parent_profiles", {
    p_keep_id: keepId,
    p_merge_id: mergeId,
  });
  if (error) return { error: error.message };

  // Best-effort: profiles row for mergeId is already gone at this point, so
  // even if this cleanup fails, verifySession() can never resolve a session
  // for that auth user again (src/lib/dal.ts requires a matching profile).
  await admin.auth.admin.deleteUser(mergeId);

  revalidatePath("/dashboard/principal/messages");
  revalidatePath("/dashboard/principal/messages/duplicates");
  revalidatePath("/dashboard/principal/students");

  return { success: true };
}
