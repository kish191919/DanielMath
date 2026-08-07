import "server-only";
import { GRADING_MODEL, REFERENCE_EXTRACTION_EFFORT } from "./claude";
import { ReferenceExtractionSchema, type ReferenceExtractedItem } from "./reference-extraction-schema";
import { extractStructuredItems } from "./document-extraction";
import { translateReferenceProblems } from "./translate-reference-problems";
import { createAdminSupabase } from "@/lib/supabase/admin";
import type { Concept, ReferenceProblemScan } from "@/lib/supabase/types";

const BUCKET = "problem-bank";

// Runs inside after() — after the response/redirect (or the 202 ack from
// /api/reference-extraction/run) has already been sent — so it uses the
// admin client (not createServerSupabase()) since it doesn't depend on
// request cookies still being valid in that deferred context. Authorization
// already happened synchronously (requireRole() or the CRON_SECRET check)
// before this ever runs. Mirrors markGradingFailed in grade-worksheet.ts.
export async function markExtractionFailed(scanId: string, err: unknown) {
  const admin = createAdminSupabase();
  await admin
    .from("reference_problem_scans")
    .update({
      status: "grading_failed",
      grading_error: err instanceof Error ? err.message : "문제 추출 중 오류가 발생했습니다.",
    })
    .eq("id", scanId);
}

const REFERENCE_EXTRACTION_INSTRUCTIONS = `당신은 미국 북버지니아(NoVa) K-6 AAP 준비 수학 공부방의 문제 보관함 등록 보조입니다.
선생님이 나중에 재사용하려고 찍어둔 "좋은 문제" 사진/PDF(여러 페이지일 수 있음)가 첨부되어 있습니다. 이 파일은 학생 답안이 아니라 문제 원본이며, 채점하는 것이 아니라 문제를 그대로 옮겨 적는 것이 목적입니다. 다음 지침에 따르세요.

1. 모든 페이지에 있는 모든 문제를 빠짐없이 개별 항목으로 추출하세요. 3a, 3b처럼 하위 문항이 있으면 각각을 별도 항목으로 다루세요.
2. transcribed_problem에는 문제 내용만 그대로 옮겨 적으세요.
3. 정답이 인쇄되어 있거나 손으로 적혀 있으면 transcribed_answer에 그대로 옮겨 적으세요. 정답이 보이지 않으면 절대 추측하지 말고 null로 두세요.
4. concept_code는 아래 제공된 개념 코드 목록 중 이 문제에 가장 가까운 것 하나를 선택하세요. 적절한 항목이 없으면 null로 두세요. 목록에 없는 코드를 만들어내지 마세요.
5. 이미지를 자르거나 좌표를 반환하지 마세요.
6. 확신이 서지 않는 부분(글씨 판독 어려움 등)은 confidence_note에 짧게 남기세요. 없으면 null.
7. items를 절대 빈 배열로 반환하지 마세요. 페이지가 복잡해 보여도 그 안에 실제 문제가 있습니다. 문항을 찾기 어렵다고 느껴지면 페이지를 처음부터 다시 살펴보고 최소 1개 이상을 반드시 추출하세요.
8. 이 문제를 정확히 풀려면 도형/그래프/표/그림이 반드시 필요한지 has_diagram에 true/false로 표시하세요. 5번 지침은 그대로입니다 — 좌표는 반환하지 마세요, true/false 판단만 하면 됩니다.`;

function buildConceptListText(concepts: Concept[]): string {
  return concepts
    .map((c) => `${c.code}: ${c.label_ko}${c.label_en ? ` (${c.label_en})` : ""}`)
    .join("\n");
}

export async function extractReferenceProblems(scanId: string, attempt = 0): Promise<void> {
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

  // 여러 장의 사진이 assembleScanPdf()로 한 PDF에 합쳐져 들어오므로,
  // chunkThresholdPages/pagesPerChunk를 1로 고정해 페이지(=사진 한 장)마다
  // 별도 청크로 나눈다. chunkConcurrency: "full"이 핵심 — 기본값 "staged"는
  // 첫 청크를 다 기다린 뒤에야 나머지를 동시에 시작하므로, 사진이 정확히
  // 2장(청크 2개)일 땐 사실상 순차 실행과 같아져 페이지 분할의 의미가
  // 없어진다. "full"로 모든 페이지를 처음부터 동시에 호출해야 사진이 몇
  // 장이든 대기 시간이 "가장 느린 페이지 1장" 수준으로 유지된다. 채점
  // (grade-worksheet.ts)과 달리 여러 페이지의 문맥을 함께 볼 필요가 없는
  // 단순 전사 작업이라 페이지 단위 분할이 정확도를 해치지 않는다.
  const allItems: ReferenceExtractedItem[] = await extractStructuredItems({
    bucket: BUCKET,
    storagePath: scan.storage_path,
    mimeType: scan.mime_type,
    systemText: `${REFERENCE_EXTRACTION_INSTRUCTIONS}\n\n사용 가능한 개념 코드 목록:\n${buildConceptListText(conceptList)}`,
    itemsSchema: ReferenceExtractionSchema,
    model: GRADING_MODEL,
    effort: REFERENCE_EXTRACTION_EFFORT,
    pagesPerChunk: 1,
    chunkThresholdPages: 1,
    chunkConcurrency: "full",
    label: "문제 추출",
    logId: `extractReferenceProblems scan ${scanId} attempt ${attempt}`,
  });

  if (allItems.length > 0) {
    const rows = allItems.map((item) => {
      const concept = item.concept_code ? conceptByCode.get(item.concept_code) : undefined;
      return {
        scan_id: scanId,
        problem_number: item.problem_number,
        transcribed_problem: item.transcribed_problem,
        transcribed_answer: item.transcribed_answer,
        has_diagram: item.has_diagram,
        concept_id: concept?.id ?? null,
        ai_confidence_note: item.confidence_note,
        ai_suggested: item,
        source: "ai" as const,
        edited_by_teacher: false,
        // Usable immediately once extracted — no separate human tag/confirm
        // gate (see practice-sheets/new, which lists scans regardless).
        confirmed: true,
      };
    });

    const { data: inserted, error: insertError } = await admin
      .from("reference_problems")
      .insert(rows)
      .select("id, transcribed_problem, transcribed_answer");
    if (insertError) throw new Error(insertError.message);

    // Best-effort: translation runs in the same background job (still well
    // within the 300s budget for a text-only call) so a scan never sits
    // "extracted but untranslated" waiting on a teacher to notice and
    // trigger it manually. A translation failure must never fail extraction
    // itself — it's recorded per-row via translation_error and retried from
    // the workspace (retranslateReferenceProblemAction).
    if (inserted && inserted.length > 0) {
      try {
        const translated = await translateReferenceProblems(inserted);
        await Promise.all(
          inserted.map((row) => {
            const t = translated.get(row.id);
            return admin
              .from("reference_problems")
              .update(
                t
                  ? { translated_problem: t.translated_problem, translated_answer: t.translated_answer, translation_error: null }
                  : { translation_error: "번역 응답에서 이 문제를 찾지 못했습니다." },
              )
              .eq("id", row.id);
          }),
        );
      } catch (err) {
        const message = err instanceof Error ? err.message : "번역 중 오류가 발생했습니다.";
        await admin
          .from("reference_problems")
          .update({ translation_error: message })
          .in(
            "id",
            inserted.map((row) => row.id),
          );
      }
    }
  }

  const { error: updateError } = await admin
    .from("reference_problem_scans")
    .update({ status: "pending_review", graded_at: new Date().toISOString() })
    .eq("id", scanId);
  if (updateError) throw new Error(updateError.message);
}
