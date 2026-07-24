import "server-only";
import { createServerSupabase } from "@/lib/supabase/server";
import type { Inquiry, InquiryNote } from "@/lib/supabase/types";

export async function listInquiries(): Promise<Inquiry[]> {
  const supabase = await createServerSupabase();
  const { data, error } = await supabase
    .from("inquiries")
    .select("*")
    .order("created_at", { ascending: false })
    .returns<Inquiry[]>();

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getInquiry(id: string): Promise<Inquiry | null> {
  const supabase = await createServerSupabase();
  const { data } = await supabase
    .from("inquiries")
    .select("*")
    .eq("id", id)
    .maybeSingle<Inquiry>();

  return data ?? null;
}

export async function listInquiryNotesForInquiries(
  inquiryIds: string[],
): Promise<InquiryNote[]> {
  if (inquiryIds.length === 0) return [];

  const supabase = await createServerSupabase();
  const { data, error } = await supabase
    .from("inquiry_notes")
    .select("*")
    .in("inquiry_id", inquiryIds)
    .order("created_at", { ascending: false })
    .returns<InquiryNote[]>();

  if (error) throw new Error(error.message);
  return data ?? [];
}
