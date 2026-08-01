import "server-only";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { getClaudeClient, PARENT_SUMMARY_MODEL, PARENT_SUMMARY_EFFORT } from "./claude";
import { ParentSummaryFieldsSchema, type ParentSummaryFields } from "./parent-summary-schema";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { ERROR_TYPE_LABELS, ERROR_TYPE_LABELS_EN } from "@/lib/learning-history/schema";
import type { Concept, ErrorType, LearningItem, SessionNoteLanguage } from "@/lib/supabase/types";

const INSTRUCTIONS_KO = `당신은 미국 북버지니아(NoVa) K-6 AAP 준비 수학 공부방의 선생님을 대신해, 학부모님께 보내는 학습 리포트의 문장을 작성하는 보조입니다.

이 글은 선생님이 학부모님께 아이의 학습 상황을 차분히 전하는 보고체 리포트입니다. 학생에게 직접 말을 거는 어투("잘했어요!", "~랍니다", "-네요!")가 아니라, 선생님이 학부모님께 설명하듯 "~했습니다", "~하는 모습을 보였습니다", "~필요해 보입니다"와 같은 문어체·보고체로 써주세요. 느낌표는 쓰지 마세요.

리포트는 "학습 결과" 섹션에서 이미 학생 이름과 정답률을 밝혔으므로, 아래 두 항목에서는 이름을 반복하지 말고 바로 내용으로 시작하세요. 각 항목은 한두 문장으로 간결하게 씁니다.

1. strengths: 오늘 잘한 점. 정답을 맞힌 개념을 근거로 구체적으로.
2. improvements: 보완이 필요한 부분. 아래 제공된 "가장 많이 틀린 개념"과 "주요 오답 유형"을 근거로, 어떤 부분에서 어려움을 겪었는지와 추가 연습이 필요하다는 점을 함께 다루세요. "다음 시간에는", "다음 수업에서" 등 특정 회차를 지목해 무엇을 하겠다고 예고하거나 약속하는 표현은 쓰지 마세요. 아직 다루지 않은 새로운 개념이나 커리큘럼 주제를 미리 예고하지도 마세요. 오답이 하나도 없으면 null로 두세요.

문제 수·정답 수·정답률 같은 숫자는 이미 정해져 있으니 문장에서 새로 지어내지 말고, 주어진 개념/오답 유형 정보만 근거로 쓰세요.`;

const INSTRUCTIONS_EN = `You are writing, on behalf of a teacher at a Northern Virginia (NoVa) K-6 AAP-prep math tutoring academy, the prose for a learning report sent to a parent.

This is a calm, written report from the teacher to the parent about the child's session — not a message addressed directly to the student. Write in a report register ("demonstrated...", "showed...", "would benefit from...", "struggled with...") rather than an encouraging tone aimed at the student ("Great job!", "You did it!"). Do not use exclamation marks.

The "Learning Results" section above already states the student's name and accuracy rate, so do not repeat the name in either field below — start directly with the content. Keep each field to one or two concise sentences.

1. strengths: What went well today. Be specific, grounded in the concepts the student answered correctly.
2. improvements: What needs more work. Ground this in the "weakest concept" and "most common error type" provided below — cover both where the student struggled and that more practice is needed there. Do not promise or preview what a specific upcoming session ("next time", "in our next class") will cover. Do not preview new concepts or curriculum topics not yet covered. If there were no incorrect answers, leave this null.

Numbers like problem count, correct count, and accuracy rate are already fixed — do not invent new ones in the prose; base the text only on the concept/error-type information given.`;

export type ConceptBreakdown = {
  label: string;
  labelEn: string | null;
  total: number;
  correct: number;
};
export type ErrorTypeBreakdown = { type: ErrorType; label: string; count: number };

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
    ([key, bucket]) => {
      const concept = key === "unassigned" ? null : conceptById.get(key);
      return {
        label: concept?.label_ko ?? "미분류",
        labelEn: concept ? (concept.label_en ?? null) : "Unclassified",
        total: bucket.total,
        correct: bucket.correct,
      };
    },
  );

  const byErrorType: ErrorTypeBreakdown[] = Array.from(errorTypeBuckets.entries()).map(
    ([type, count]) => ({ type, label: ERROR_TYPE_LABELS[type], count }),
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
function buildIntroLine(studentName: string, stats: SessionStats, language: SessionNoteLanguage): string {
  if (language === "en") {
    return `${studentName} solved ${stats.correct} out of ${stats.total} problems correctly today (accuracy ${stats.accuracyRate}%).`;
  }
  return `${studentName} 학생은 오늘 ${stats.total}문제 중 ${stats.correct}개를 정확히 풀었습니다 (정답률 ${stats.accuracyRate}%).`;
}

// Which concept/error type to ground the improvements paragraph in —
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

// "3학년이면 3학년 또는 4학년 IXL 교재" 식의 힌트만 제공 — 실제 숙제 내용은
// 교사가 PublishNoteForm에서 직접 채워 넣는다.
function buildHomeworkHint(grade: string, language: SessionNoteLanguage): string {
  const current = Number(grade);
  const next = current + 1;
  if (language === "en") {
    return next <= 6 ? `Grade ${current} or ${next} IXL workbook` : `Grade ${current} IXL workbook`;
  }
  return next <= 6 ? `${current}학년 또는 ${next}학년 IXL 교재` : `${current}학년 IXL 교재`;
}

export function buildParentNoteText(
  studentName: string,
  stats: SessionStats,
  fields: ParentSummaryFields,
  gradeLevel: string,
  language: SessionNoteLanguage,
): string {
  if (language === "en") {
    const improvementsText = fields.improvements ?? "There was nothing in particular to improve on today.";
    return `Learning Results
${buildIntroLine(studentName, stats, language)}

What went well
${fields.strengths}

Areas to improve
${improvementsText}

Homework
(Please fill this in — e.g. ${buildHomeworkHint(gradeLevel, language)}, etc.)`;
  }

  const improvementsText = fields.improvements ?? "오늘은 특별히 보완이 필요한 부분이 없었습니다.";
  return `학습 결과
${buildIntroLine(studentName, stats, language)}

잘한 점
${fields.strengths}

보완할 점
${improvementsText}

숙제
(선생님이 직접 작성해주세요 — 예: ${buildHomeworkHint(gradeLevel, language)} 등)`;
}

function buildStatsPromptText(
  studentName: string,
  stats: SessionStats,
  language: SessionNoteLanguage,
): string {
  const conceptLabel = (c: ConceptBreakdown) => (language === "en" ? (c.labelEn ?? c.label) : c.label);
  const errorLabel = (e: ErrorTypeBreakdown) => (language === "en" ? ERROR_TYPE_LABELS_EN[e.type] : e.label);

  const weakestConcept = findWeakestConcept(stats);
  const topErrorType = findTopErrorType(stats);

  if (language === "en") {
    const conceptLines = stats.byConcept
      .map((c) => `- ${conceptLabel(c)}: ${c.correct}/${c.total} correct`)
      .join("\n");
    const errorLines =
      stats.byErrorType.length > 0
        ? stats.byErrorType.map((e) => `- ${errorLabel(e)}: ${e.count} time(s)`).join("\n")
        : "(no incorrect answers)";
    const weakestConceptLine = weakestConcept
      ? `${conceptLabel(weakestConcept)} (${weakestConcept.total - weakestConcept.correct} incorrect)`
      : "N/A (no incorrect answers)";
    const topErrorTypeLine = topErrorType
      ? `${errorLabel(topErrorType)} (${topErrorType.count} time(s))`
      : "N/A (no incorrect answers)";

    return `Opening line: "${buildIntroLine(studentName, stats, language)}"

Results by concept:
${conceptLines}

Error types (incorrect answers only):
${errorLines}

Weakest concept: ${weakestConceptLine}
Most common error type: ${topErrorTypeLine}`;
  }

  const conceptLines = stats.byConcept
    .map((c) => `- ${conceptLabel(c)}: ${c.correct}/${c.total} 정답`)
    .join("\n");
  const errorLines =
    stats.byErrorType.length > 0
      ? stats.byErrorType.map((e) => `- ${errorLabel(e)}: ${e.count}회`).join("\n")
      : "(오답 없음)";
  const weakestConceptLine = weakestConcept
    ? `${conceptLabel(weakestConcept)} (${weakestConcept.total - weakestConcept.correct}문제 오답)`
    : "해당 없음 (오답 없음)";
  const topErrorTypeLine = topErrorType
    ? `${errorLabel(topErrorType)} (${topErrorType.count}회)`
    : "해당 없음 (오답 없음)";

  return `시작 문장: "${buildIntroLine(studentName, stats, language)}"

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
  language: SessionNoteLanguage,
): Promise<ParentSummaryFields> {
  const client = getClaudeClient();
  const instructions = language === "en" ? INSTRUCTIONS_EN : INSTRUCTIONS_KO;
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
        content: `${instructions}\n\n${buildStatsPromptText(studentName, stats, language)}`,
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
  language: SessionNoteLanguage,
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
      .select("full_name, grade")
      .eq("id", studentId)
      .maybeSingle<{ full_name: string; grade: string }>(),
  ]);
  if (itemsError) throw new Error(itemsError.message);
  if (conceptsError) throw new Error(conceptsError.message);
  if (studentError) throw new Error(studentError.message);
  if (!items || items.length === 0) return;
  if (!student) throw new Error("학생 정보를 찾을 수 없습니다.");

  const stats = computeSessionStats(items, concepts ?? []);
  const fields = await generateFields(student.full_name, stats, language);
  const note = buildParentNoteText(student.full_name, stats, fields, student.grade, language);

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
      .update({ note, source: "ai", confirmed: false, edited_by_teacher: false, language })
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
    language,
    created_by: createdBy,
  });
  if (error) throw new Error(error.message);
}
