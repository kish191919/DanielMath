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
import type { LearningItem, ReferenceProblem } from "@/lib/supabase/types";

export type GenerateResult = { error: string };

export async function generatePracticeSheetAction(
  studentId: string | null,
  selections: GenerateSelection,
): Promise<GenerateResult | void> {
  const session = await requireRole("principal");

  const parsed = generateSelectionSchema.safeParse(selections);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "입력값을 확인해주세요." };
  }

  const wrongAnswerIds = parsed.data.filter((s) => s.sourceType === "wrong_answer").map((s) => s.itemId);
  const referenceIds = parsed.data.filter((s) => s.sourceType === "reference").map((s) => s.itemId);
  const verbatimIds = parsed.data
    .filter((s) => s.sourceType === "reference_verbatim")
    .map((s) => s.itemId);

  // Common (no-student) worksheets are built entirely from the scanned
  // reference pool — wrong-answer items are always student-scoped, so there
  // is nothing valid to pull from without a studentId. The generator UI never
  // offers this combination, so this only guards against a stale/tampered
  // client request.
  if (!studentId && wrongAnswerIds.length > 0) {
    return { error: "학생을 선택하지 않은 경우 오답 문항은 사용할 수 없습니다." };
  }

  const supabase = await createServerSupabase();

  // Never trust problem content from the client — re-fetch every source item
  // from the DB by id. Wrong-answer items are scoped to this student and to
  // confirmed incorrect items only; reference items (both AI-rewritten and
  // verbatim reprints) come from the global, scan-derived pool (no student
  // scoping, no confirm gate — usable as soon as extracted, see
  // extractReferenceProblems).
  const [wrongAnswerResult, referenceResult, verbatimResult] = await Promise.all([
    wrongAnswerIds.length > 0
      ? supabase
          .from("learning_items")
          .select("*")
          .in("id", wrongAnswerIds)
          // Guarded above: wrongAnswerIds is only non-empty when studentId is set.
          .eq("student_id", studentId as string)
          .eq("is_correct", false)
          .eq("confirmed", true)
          .returns<LearningItem[]>()
      : Promise.resolve({ data: [] as LearningItem[], error: null }),
    referenceIds.length > 0
      ? supabase
          .from("reference_problems")
          .select("*")
          .in("id", referenceIds)
          .returns<ReferenceProblem[]>()
      : Promise.resolve({ data: [] as ReferenceProblem[], error: null }),
    verbatimIds.length > 0
      ? supabase
          .from("reference_problems")
          .select("*")
          .in("id", verbatimIds)
          .returns<ReferenceProblem[]>()
      : Promise.resolve({ data: [] as ReferenceProblem[], error: null }),
  ]);
  if (wrongAnswerResult.error) return { error: wrongAnswerResult.error.message };
  if (referenceResult.error) return { error: referenceResult.error.message };
  if (verbatimResult.error) return { error: verbatimResult.error.message };

  const wrongAnswerItems = wrongAnswerResult.data ?? [];
  const referenceItems = referenceResult.data ?? [];
  const verbatimItems = verbatimResult.data ?? [];
  if (wrongAnswerItems.length === 0 && referenceItems.length === 0 && verbatimItems.length === 0) {
    return { error: "선택한 문항을 찾을 수 없습니다." };
  }

  // Verbatim reprints skip AI entirely — the translated original is copied
  // as-is (print/page.tsx then pairs it with the crop image, if any). A
  // problem still awaiting/failing translation blocks the whole batch rather
  // than silently printing Korean or dropping the item, so the teacher
  // notices and retries translation instead of handing out a broken sheet.
  const untranslated = verbatimItems.filter((item) => !item.translated_problem);
  if (untranslated.length > 0) {
    return {
      error: "번역이 아직 완료되지 않은 문제가 있습니다. 잠시 후 다시 시도하거나 번역을 다시 시도해주세요.",
    };
  }

  const countById = new Map(parsed.data.map((s) => [s.itemId, s.count]));
  const wrongAnswerById = new Map(wrongAnswerItems.map((item) => [item.id, item]));
  const referenceById = new Map(referenceItems.map((item) => [item.id, item]));
  const concepts = await listConcepts();

  let sortOrder = 0;
  const problemRows: {
    source_item_id: string | null;
    source_reference_id: string | null;
    concept_id: string | null;
    problem_text: string;
    answer_text: string;
    sort_order: number;
    source: "ai" | "reference_verbatim";
    edited_by_teacher: false;
    ai_suggested: unknown;
  }[] = [];

  for (const item of verbatimItems) {
    problemRows.push({
      source_item_id: null,
      source_reference_id: item.id,
      concept_id: item.concept_id,
      problem_text: item.translated_problem!,
      answer_text: item.translated_answer ?? "(정답 미확인)",
      sort_order: sortOrder++,
      source: "reference_verbatim",
      edited_by_teacher: false,
      ai_suggested: null,
    });
  }

  if (wrongAnswerItems.length > 0 || referenceItems.length > 0) {
    let generated;
    try {
      generated = await generateSimilarProblems(wrongAnswerItems, referenceItems, countById, concepts);
    } catch (err) {
      return {
        error: err instanceof Error ? err.message : "유사문제 생성 중 오류가 발생했습니다.",
      };
    }

    for (const set of generated.sets) {
      const source =
        set.source_kind === "wrong_answer"
          ? wrongAnswerById.get(set.source_id)
          : referenceById.get(set.source_id);
      if (!source) continue; // model echoed back an id we never sent
      const requestedCount = countById.get(set.source_id) ?? set.problems.length;
      for (const problem of set.problems.slice(0, requestedCount)) {
        problemRows.push({
          source_item_id: set.source_kind === "wrong_answer" ? source.id : null,
          source_reference_id: set.source_kind === "reference" ? source.id : null,
          concept_id: source.concept_id,
          problem_text: problem.problem_text,
          answer_text: problem.answer_text,
          sort_order: sortOrder++,
          source: "ai",
          edited_by_teacher: false,
          ai_suggested: problem,
        });
      }
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
    source_reference_id: problem.source_reference_id ?? null,
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
