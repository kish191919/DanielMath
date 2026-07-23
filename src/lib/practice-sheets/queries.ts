import "server-only";
import { createServerSupabase } from "@/lib/supabase/server";
import { createAdminSupabase } from "@/lib/supabase/admin";
import type { GeneratedProblem, GeneratedWorksheet } from "@/lib/supabase/types";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function getPracticeSheetWithProblems(
  worksheetId: string,
): Promise<{ worksheet: GeneratedWorksheet; problems: GeneratedProblem[] } | null> {
  const supabase = await createServerSupabase();
  const { data: worksheet } = await supabase
    .from("generated_worksheets")
    .select("*")
    .eq("id", worksheetId)
    .maybeSingle<GeneratedWorksheet>();
  if (!worksheet) return null;

  const { data: problems, error } = await supabase
    .from("generated_problems")
    .select("*")
    .eq("worksheet_id", worksheetId)
    .order("sort_order", { ascending: true })
    .returns<GeneratedProblem[]>();
  if (error) throw new Error(error.message);

  return { worksheet, problems: problems ?? [] };
}

// Public "check my answers" lookup for the QR code printed on a practice
// sheet. Runs with the service-role client (no session exists for a parent
// or student scanning the code) and deliberately returns only the title and
// answer text — never the student's name or problem text — scoped to a
// confirmed sheet matching this exact share token.
export async function getPracticeSheetAnswersByToken(
  token: string,
): Promise<{ title: string; answers: Pick<GeneratedProblem, "sort_order" | "answer_text">[] } | null> {
  if (!UUID_RE.test(token)) return null;

  const supabase = createAdminSupabase();
  const { data: worksheet } = await supabase
    .from("generated_worksheets")
    .select("id, title, status")
    .eq("share_token", token)
    .maybeSingle<Pick<GeneratedWorksheet, "id" | "title" | "status">>();
  if (!worksheet || worksheet.status !== "confirmed") return null;

  const { data: problems, error } = await supabase
    .from("generated_problems")
    .select("sort_order, answer_text")
    .eq("worksheet_id", worksheet.id)
    .order("sort_order", { ascending: true })
    .returns<Pick<GeneratedProblem, "sort_order" | "answer_text">[]>();
  if (error) throw new Error(error.message);

  return { title: worksheet.title?.trim() || "연습문제", answers: problems ?? [] };
}
