import "server-only";
import { GRADING_MODEL, GRADING_EFFORT } from "./claude";
import { ReferenceExtractionSchema, type ReferenceExtractedItem } from "./reference-extraction-schema";
import { extractStructuredItems } from "./document-extraction";
import { createAdminSupabase } from "@/lib/supabase/admin";
import type { Concept, ReferenceProblemScan } from "@/lib/supabase/types";

const BUCKET = "problem-bank";

const REFERENCE_EXTRACTION_INSTRUCTIONS = `당신은 미국 북버지니아(NoVa) K-6 AAP 준비 수학 공부방의 문제 보관함 등록 보조입니다.
선생님이 나중에 재사용하려고 찍어둔 "좋은 문제" 사진/PDF(여러 페이지일 수 있음)가 첨부되어 있습니다. 이 파일은 학생 답안이 아니라 문제 원본이며, 채점하는 것이 아니라 문제를 그대로 옮겨 적는 것이 목적입니다. 다음 지침에 따르세요.

1. 모든 페이지에 있는 모든 문제를 빠짐없이 개별 항목으로 추출하세요. 3a, 3b처럼 하위 문항이 있으면 각각을 별도 항목으로 다루세요.
2. transcribed_problem에는 문제 내용만 그대로 옮겨 적으세요.
3. 정답이 인쇄되어 있거나 손으로 적혀 있으면 transcribed_answer에 그대로 옮겨 적으세요. 정답이 보이지 않으면 절대 추측하지 말고 null로 두세요.
4. concept_code는 아래 제공된 개념 코드 목록 중 이 문제에 가장 가까운 것 하나를 선택하세요. 적절한 항목이 없으면 null로 두세요. 목록에 없는 코드를 만들어내지 마세요.
5. 이미지를 자르거나 좌표를 반환하지 마세요.
6. 확신이 서지 않는 부분(글씨 판독 어려움 등)은 confidence_note에 짧게 남기세요. 없으면 null.
7. items를 절대 빈 배열로 반환하지 마세요. 페이지가 복잡해 보여도 그 안에 실제 문제가 있습니다. 문항을 찾기 어렵다고 느껴지면 페이지를 처음부터 다시 살펴보고 최소 1개 이상을 반드시 추출하세요.`;

function buildConceptListText(concepts: Concept[]): string {
  return concepts
    .map((c) => `${c.code}: ${c.label_ko}${c.label_en ? ` (${c.label_en})` : ""}`)
    .join("\n");
}

export async function extractReferenceProblems(scanId: string): Promise<void> {
  const admin = createAdminSupabase();

  const { data: scan, error: scanError } = await admin
    .from("reference_problem_scans")
    .select("*")
    .eq("id", scanId)
    .maybeSingle<ReferenceProblemScan>();
  if (scanError) throw new Error(scanError.message);
  if (!scan) throw new Error("스캔 정보를 찾을 수 없습니다.");

  const { data: concepts, error: conceptsError } = await admin
    .from("concepts")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .returns<Concept[]>();
  if (conceptsError) throw new Error(conceptsError.message);

  const conceptList = concepts ?? [];
  const conceptByCode = new Map(conceptList.map((c) => [c.code, c]));

  const allItems: ReferenceExtractedItem[] = await extractStructuredItems({
    bucket: BUCKET,
    storagePath: scan.storage_path,
    mimeType: scan.mime_type,
    systemText: `${REFERENCE_EXTRACTION_INSTRUCTIONS}\n\n사용 가능한 개념 코드 목록:\n${buildConceptListText(conceptList)}`,
    itemsSchema: ReferenceExtractionSchema,
    model: GRADING_MODEL,
    effort: GRADING_EFFORT,
    label: "문제 추출",
    logId: `extractReferenceProblems scan ${scanId}`,
  });

  if (allItems.length > 0) {
    const rows = allItems.map((item) => {
      const concept = item.concept_code ? conceptByCode.get(item.concept_code) : undefined;
      return {
        scan_id: scanId,
        problem_number: item.problem_number,
        transcribed_problem: item.transcribed_problem,
        transcribed_answer: item.transcribed_answer,
        concept_id: concept?.id ?? null,
        ai_confidence_note: item.confidence_note,
        ai_suggested: item,
        source: "ai" as const,
        edited_by_teacher: false,
        confirmed: false,
      };
    });

    const { error: insertError } = await admin.from("reference_problems").insert(rows);
    if (insertError) throw new Error(insertError.message);
  }

  const { error: updateError } = await admin
    .from("reference_problem_scans")
    .update({ status: "pending_review", graded_at: new Date().toISOString() })
    .eq("id", scanId);
  if (updateError) throw new Error(updateError.message);
}
