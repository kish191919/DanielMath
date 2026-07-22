import "server-only";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { getClaudeClient, PARENT_SUMMARY_MODEL, PARENT_SUMMARY_EFFORT } from "./claude";
import { ParentSummaryFieldsSchema, type ParentSummaryFields } from "./parent-summary-schema";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { ERROR_TYPE_LABELS } from "@/lib/learning-history/schema";
import type { Concept, ErrorType, LearningItem } from "@/lib/supabase/types";

const INSTRUCTIONS = `당신은 미국 북버지니아(NoVa) K-6 AAP 준비 수학 공부방의 선생님을 대신해, 학부모님께 보내는 학습 보고 편지의 문장을 작성하는 보조입니다.

이 글은 선생님이 학부모님께 아이의 학습 상황을 차분히 전하는 보고체 편지입니다. 학생에게 직접 말을 거는 어투("잘했어요!", "~랍니다", "-네요!")가 아니라, 선생님이 학부모님께 설명하듯 "~했습니다", "~하는 모습을 보였습니다", "~필요해 보입니다"와 같은 문어체·보고체로 써주세요. 느낌표는 쓰지 마세요.

편지는 아래 "시작 문장"으로 이미 시작하며(학생 이름과 정답률 언급 완료), 그 뒤에 당신이 작성할 세 문단이 자연스럽게 이어 붙습니다. 학생 이름은 이미 나왔으니 각 문단에서 이름을 반복하지 말고 자연스럽게 이어서 쓰세요.

1. strengths: 오늘 잘한 점 한두 문장. 정답을 맞힌 개념을 근거로 구체적으로.
2. improvements: 보완이 필요한 부분 한두 문장. 오답 유형과 관련 개념을 근거로. 오답이 하나도 없으면 null로 두세요.
3. practice_plan: 아래 제공된 "가장 많이 틀린 개념"과 "주요 오답 유형"을 근거로, 그 부분과 비슷한 유형의 문제를 다음 시간에 더 연습하며 보완하겠다는 내용을 한 문장으로 쓰세요. 오늘 확인된 약점을 반복 연습하겠다는 내용만 다루고, 아직 다루지 않은 새로운 개념이나 커리큘럼 주제를 미리 예고하지 마세요. "가장 많이 틀린 개념"이 없다면(오답 없음), 오늘 배운 내용을 유지할 수 있도록 이어서 연습하겠다는 내용으로 간단히 쓰세요.

문제 수·정답 수·정답률 같은 숫자는 이미 정해져 있으니 문장에서 새로 지어내지 말고, 주어진 개념/오답 유형 정보만 근거로 쓰세요.`;

export type ConceptBreakdown = { label: string; total: number; correct: number };
export type ErrorTypeBreakdown = { label: string; count: number };

export type SessionStats = {
  total: number;
  correct: number;
  incorrect: number;
  accuracyRate: number;
  byConcept: ConceptBreakdown[];
  byErrorType: ErrorTypeBreakdown[];
};

export function computeSessionStats(items: LearningItem[], concepts: Concept[]): SessionStats {
  const conceptById = new Map(concepts.map((c) => [c.id, c]));

  const conceptBuckets = new Map<string, { total: number; correct: number }>();
  const errorTypeBuckets = new Map<ErrorType, number>();
  let correct = 0;

  for (const item of items) {
    if (item.is_correct) correct += 1;

    const conceptKey = item.concept_id ?? "unassigned";
    const bucket = conceptBuckets.get(conceptKey) ?? { total: 0, correct: 0 };
    bucket.total += 1;
    if (item.is_correct) bucket.correct += 1;
    conceptBuckets.set(conceptKey, bucket);

    if (!item.is_correct && item.error_type) {
      errorTypeBuckets.set(item.error_type, (errorTypeBuckets.get(item.error_type) ?? 0) + 1);
    }
  }

  const byConcept: ConceptBreakdown[] = Array.from(conceptBuckets.entries()).map(
    ([key, bucket]) => ({
      label: key === "unassigned" ? "미분류" : (conceptById.get(key)?.label_ko ?? "미분류"),
      total: bucket.total,
      correct: bucket.correct,
    }),
  );

  const byErrorType: ErrorTypeBreakdown[] = Array.from(errorTypeBuckets.entries()).map(
    ([type, count]) => ({ label: ERROR_TYPE_LABELS[type], count }),
  );

  const total = items.length;
  return {
    total,
    correct,
    incorrect: total - correct,
    accuracyRate: total > 0 ? Math.round((correct / total) * 100) : 0,
    byConcept,
    byErrorType,
  };
}

// Deterministic (never AI-written) opening line — states the subject and
// the exact numbers up front so the letter always reads as a report about
// the student, not a caption aimed at them.
function buildIntroLine(studentName: string, stats: SessionStats): string {
  return `${studentName} 학생은 오늘 ${stats.total}문제 중 ${stats.correct}개를 정확히 풀었습니다 (정답률 ${stats.accuracyRate}%).`;
}

// Which concept/error type to ground the practice_plan paragraph in —
// determined here (from data), not left for the model to infer, same as
// every other number in this file.
function findWeakestConcept(stats: SessionStats): ConceptBreakdown | null {
  const withMisses = stats.byConcept.filter((c) => c.total > c.correct);
  if (withMisses.length === 0) return null;
  return withMisses.sort((a, b) => b.total - b.correct - (a.total - a.correct))[0];
}

function findTopErrorType(stats: SessionStats): ErrorTypeBreakdown | null {
  if (stats.byErrorType.length === 0) return null;
  return [...stats.byErrorType].sort((a, b) => b.count - a.count)[0];
}

export function buildParentNoteText(
  sessionDate: string,
  studentName: string,
  stats: SessionStats,
  fields: ParentSummaryFields,
): string {
  const improvementsLine = fields.improvements ?? "보완이 필요한 부분은 특별히 없었습니다.";

  return `${sessionDate} 학습 요약

${buildIntroLine(studentName, stats)} ${fields.strengths}

${improvementsLine}

${fields.practice_plan}`;
}

function buildStatsPromptText(studentName: string, stats: SessionStats): string {
  const conceptLines = stats.byConcept
    .map((c) => `- ${c.label}: ${c.correct}/${c.total} 정답`)
    .join("\n");
  const errorLines =
    stats.byErrorType.length > 0
      ? stats.byErrorType.map((e) => `- ${e.label}: ${e.count}회`).join("\n")
      : "(오답 없음)";

  const weakestConcept = findWeakestConcept(stats);
  const topErrorType = findTopErrorType(stats);
  const weakestConceptLine = weakestConcept
    ? `${weakestConcept.label} (${weakestConcept.total - weakestConcept.correct}문제 오답)`
    : "해당 없음 (오답 없음)";
  const topErrorTypeLine = topErrorType
    ? `${topErrorType.label} (${topErrorType.count}회)`
    : "해당 없음 (오답 없음)";

  return `시작 문장: "${buildIntroLine(studentName, stats)}"

개념별 결과:
${conceptLines}

오답 유형별 집계:
${errorLines}

가장 많이 틀린 개념: ${weakestConceptLine}
주요 오답 유형: ${topErrorTypeLine}`;
}

async function generateFields(
  studentName: string,
  stats: SessionStats,
): Promise<ParentSummaryFields> {
  const client = getClaudeClient();
  const response = await client.messages.parse({
    model: PARENT_SUMMARY_MODEL,
    max_tokens: 1024,
    output_config: {
      format: zodOutputFormat(ParentSummaryFieldsSchema),
      effort: PARENT_SUMMARY_EFFORT,
    },
    messages: [
      {
        role: "user",
        content: `${INSTRUCTIONS}\n\n${buildStatsPromptText(studentName, stats)}`,
      },
    ],
  });

  if (!response.parsed_output) {
    throw new Error(
      `학부모 요약 생성 결과를 파싱하지 못했습니다 (stop_reason: ${response.stop_reason}).`,
    );
  }
  return response.parsed_output;
}

export async function generateParentSummaryDraft(
  scanId: string,
  studentId: string,
  sessionDate: string,
  createdBy: string,
): Promise<void> {
  const admin = createAdminSupabase();

  const [
    { data: items, error: itemsError },
    { data: concepts, error: conceptsError },
    { data: student, error: studentError },
  ] = await Promise.all([
    admin
      .from("learning_items")
      .select("*")
      .eq("scan_id", scanId)
      .eq("confirmed", true)
      .returns<LearningItem[]>(),
    admin.from("concepts").select("*").returns<Concept[]>(),
    admin
      .from("students")
      .select("full_name")
      .eq("id", studentId)
      .maybeSingle<{ full_name: string }>(),
  ]);
  if (itemsError) throw new Error(itemsError.message);
  if (conceptsError) throw new Error(conceptsError.message);
  if (studentError) throw new Error(studentError.message);
  if (!items || items.length === 0) return;
  if (!student) throw new Error("학생 정보를 찾을 수 없습니다.");

  const stats = computeSessionStats(items, concepts ?? []);
  const fields = await generateFields(student.full_name, stats);
  const note = buildParentNoteText(sessionDate, student.full_name, stats, fields);

  const { data: existing } = await admin
    .from("session_notes")
    .select("id")
    .eq("scan_id", scanId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle<{ id: string }>();

  if (existing) {
    const { error } = await admin
      .from("session_notes")
      .update({ note, source: "ai", confirmed: false, edited_by_teacher: false })
      .eq("id", existing.id);
    if (error) throw new Error(error.message);
    return;
  }

  const { error } = await admin.from("session_notes").insert({
    student_id: studentId,
    scan_id: scanId,
    session_date: sessionDate,
    note,
    source: "ai",
    confirmed: false,
    created_by: createdBy,
  });
  if (error) throw new Error(error.message);
}
