"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/dal";
import { createServerSupabase } from "@/lib/supabase/server";
import type { InquiryStatus } from "@/lib/supabase/types";
import { INQUIRY_STATUSES, inquirySchema, type InquiryValues } from "./schema";

export type InquiryFormState = {
  ok: boolean;
  error?: string;
  fieldErrors?: Partial<Record<keyof InquiryValues, string>>;
};

// No requireSession()/requireRole() here on purpose: this is the public
// "상담신청" form on the marketing site, reachable by signed-out visitors.
// Access control lives entirely in the `inquiries_insert_public` RLS
// policy (insert-only, anon+authenticated) — see
// supabase/migrations/0013_inquiries.sql. This action never calls
// redirect() itself; the caller (inquiry-form.tsx) navigates on ok: true.
//
// `values` is untyped input from the client's own (looser) zod schema, not
// InquiryValues — inquirySchema.safeParse below is this action's actual,
// independent validation of untrusted data.
export async function submitInquiryAction(
  values: unknown,
): Promise<InquiryFormState> {
  const parsed = inquirySchema.safeParse(values);
  if (!parsed.success) {
    const fieldErrors: InquiryFormState["fieldErrors"] = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (typeof key === "string") {
        fieldErrors[key as keyof InquiryValues] = issue.message;
      }
    }
    return { ok: false, error: "입력값을 확인해주세요.", fieldErrors };
  }

  const supabase = await createServerSupabase();
  const { error } = await supabase.from("inquiries").insert({
    parent_name: parsed.data.parentName,
    contact_email: parsed.data.contactEmail,
    phone: parsed.data.phone,
    child_name: parsed.data.childName,
    grade: parsed.data.grade,
    school: parsed.data.school ? parsed.data.school : null,
    language: parsed.data.language,
    message: parsed.data.message ? parsed.data.message : null,
  });

  if (error) {
    return { ok: false, error: "제출 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요." };
  }

  revalidatePath("/dashboard/principal/inquiries");
  return { ok: true };
}

export async function updateInquiryStatusAction(id: string, status: InquiryStatus) {
  await requireRole("principal");
  if (!INQUIRY_STATUSES.includes(status)) throw new Error("Invalid status");

  const supabase = await createServerSupabase();
  const { error } = await supabase.from("inquiries").update({ status }).eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/dashboard/principal/inquiries");
}

export async function deleteInquiryAction(id: string) {
  await requireRole("principal");

  const supabase = await createServerSupabase();
  const { error } = await supabase.from("inquiries").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/dashboard/principal/inquiries");
}
