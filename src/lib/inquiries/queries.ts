import "server-only";
import { createServerSupabase } from "@/lib/supabase/server";
import type { Inquiry } from "@/lib/supabase/types";

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
