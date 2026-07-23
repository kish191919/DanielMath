"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/dal";
import { createServerSupabase } from "@/lib/supabase/server";
import { generateSimilarProblems } from "@/lib/ai/generate-similar-problems";
import { listConcepts } from "@/lib/learning-history/queries";
import {
  generateSelectionSchema,
  confirmPracticeSheetSchema,
  type GenerateSelection,
  type PracticeProblemInputValues,
} from "./schema";
import type { LearningItem } from "@/lib/supabase/types";

export type GenerateResult = { error: string };

export async function generatePracticeSheetAction(
  studentId: string,
  selections: GenerateSelection,
): Promise<GenerateResult | void> {
  const session = await requireRole("principal");

  const parsed = generateSelectionSchema.safeParse(selections);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "입력값을 확인해주세요." };
  }

  const itemIds = parsed.data.map((s) => s.itemId);
  const supabase = await createServerSupabase();

  // Never trust problem content from the client — re-fetch the source
  // wrong-answer items from the DB by id, scoped to this student and to
  // confirmed incorrect items only.
  const { data: items, error: itemsError } = await supabase
    .from("learning_items")
    .select("*")
    .in("id", itemIds)
    .eq("student_id", studentId)
    .eq("is_correct", false)
    .eq("confirmed", true)
    .returns<LearningItem[]>();
  if (itemsError) return { error: itemsError.message };
  if (!items || items.length === 0) {
    return { error: "선택한 오답 문항을 찾을 수 없습니다." };
  }

  const countByItemId = new Map(parsed.data.map((s) => [s.itemId, s.count]));
  const itemById = new Map(items.map((item) => [item.id, item]));
  const concepts = await listConcepts();

  let generated;
  try {
    generated = await generateSimilarProblems(items, countByItemId, concepts);
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : "유사문제 생성 중 오류가 발생했습니다.",
    };
  }

  let sortOrder = 0;
  const problemRows: {
    source_item_id: string;
    concept_id: string | null;
    problem_text: string;
    answer_text: string;
    sort_order: number;
    source: "ai";
    edited_by_teacher: false;
    ai_suggested: unknown;
  }[] = [];
  for (const set of generated.sets) {
    const item = itemById.get(set.source_item_id);
    if (!item) continue; // model echoed back an id we never sent
    for (const problem of set.problems) {
      problemRows.push({
        source_item_id: item.id,
        concept_id: item.concept_id,
        problem_text: problem.problem_text,
        answer_text: problem.answer_text,
        sort_order: sortOrder++,
        source: "ai",
        edited_by_teacher: false,
        ai_suggested: problem,
      });
    }
  }
  if (problemRows.length === 0) {
    return { error: "유사문제를 생성하지 못했습니다. 다시 시도해주세요." };
  }

  const worksheetId = crypto.randomUUID();
  const { error: worksheetError } = await supabase.from("generated_worksheets").insert({
    id: worksheetId,
    student_id: studentId,
    created_by: session.userId,
    status: "draft",
  });
  if (worksheetError) return { error: worksheetError.message };

  const { error: problemsError } = await supabase
    .from("generated_problems")
    .insert(problemRows.map((row) => ({ ...row, worksheet_id: worksheetId })));
  if (problemsError) return { error: problemsError.message };

  redirect(`/dashboard/principal/practice-sheets/${worksheetId}`);
}

export type ConfirmResult = { error: string } | { ok: true };

export async function confirmPracticeSheetAction(
  worksheetId: string,
  problems: PracticeProblemInputValues[],
  title?: string,
): Promise<ConfirmResult> {
  await requireRole("principal");

  const parsed = confirmPracticeSheetSchema.safeParse({
    worksheet_id: worksheetId,
    title,
    problems,
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "입력값을 확인해주세요." };
  }

  const supabase = await createServerSupabase();

  const { error: deleteError } = await supabase
    .from("generated_problems")
    .delete()
    .eq("worksheet_id", parsed.data.worksheet_id);
  if (deleteError) return { error: deleteError.message };

  const rows = parsed.data.problems.map((problem, index) => ({
    worksheet_id: parsed.data.worksheet_id,
    source_item_id: problem.source_item_id ?? null,
    concept_id: problem.concept_id ?? null,
    problem_text: problem.problem_text,
    answer_text: problem.answer_text,
    sort_order: index,
    source: problem.source,
    edited_by_teacher: problem.edited_by_teacher,
  }));
  const { error: insertError } = await supabase.from("generated_problems").insert(rows);
  if (insertError) return { error: insertError.message };

  const { error: updateError } = await supabase
    .from("generated_worksheets")
    .update({
      status: "confirmed",
      confirmed_at: new Date().toISOString(),
      title: parsed.data.title || null,
    })
    .eq("id", parsed.data.worksheet_id);
  if (updateError) return { error: updateError.message };

  revalidatePath(`/dashboard/principal/practice-sheets/${parsed.data.worksheet_id}`);
  redirect(`/dashboard/principal/practice-sheets/${parsed.data.worksheet_id}/print`);
}
