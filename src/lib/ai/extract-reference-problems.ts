import "server-only";
import { GRADING_MODEL, REFERENCE_EXTRACTION_EFFORT } from "./claude";
import { ReferenceExtractionSchema, type ReferenceExtractedItem } from "./reference-extraction-schema";
import { MATH_NOTATION_INSTRUCTIONS } from "./math-notation";
import { extractStructuredItems } from "./document-extraction";
import { translateReferenceProblems } from "./translate-reference-problems";
import { solveReferenceProblems } from "./solve-reference-problems";
import { createAdminSupabase } from "@/lib/supabase/admin";
import type { Concept, ReferenceProblem, ReferenceProblemScan } from "@/lib/supabase/types";

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
2. transcribed_problem에는 문제의 본문(stem)만 옮기고, 보기(선택지)는 절대 포함하지 마세요 — 보기는 options에 별도로 담습니다.
2a. 이 문제가 객관식이면(2개 이상 6개 이하의 뚜렷한 보기가 있으면) options에 각 보기를 {label, text}로 담으세요. label은 원본에 인쇄된 그대로(A/B/C, 1)/2)/3), ①②③ 등) 옮기고 절대 새로 만들거나 A/B/C로 바꾸지 마세요. 보기가 6개를 초과하거나 명확히 구분되지 않으면(애매하면) options는 null로 두고 transcribed_problem에 원문 그대로 남기세요(기존 방식).
3. 정답이 인쇄되어 있거나 손으로 적혀 있으면 transcribed_answer에 그대로 옮겨 적으세요. 정답이 보이지 않으면 절대 추측하지 말고 null로 두세요.
3a. transcribed_answer가 options 중 하나의 label과 정확히 일치하는 값(예: "D" 한 글자)이면, correct_option에 그 label을 넣고 transcribed_answer는 그 보기의 실제 text 값으로 바꿔서 채우세요(label 그대로 두지 마세요). transcribed_answer가 이미 값(예: "Q")이고 어느 보기의 text와 정확히 일치하면 correct_option에 그 보기의 label을 채우세요. 어느 쪽인지 확신할 수 없으면 correct_option은 null로 두고 transcribed_answer는 원문 그대로만 옮기세요 — 추측 금지. options가 null이면 correct_option도 반드시 null입니다.
4. concept_code는 아래 제공된 개념 코드 목록 중 이 문제에 가장 가까운 것 하나를 선택하세요. 적절한 항목이 없으면 null로 두세요. 목록에 없는 코드를 만들어내지 마세요.
5. 이미지를 자르거나 좌표를 반환하지 마세요.
6. 확신이 서지 않는 부분(글씨 판독 어려움 등)은 confidence_note에 짧게 남기세요. 없으면 null.
7. items를 절대 빈 배열로 반환하지 마세요. 페이지가 복잡해 보여도 그 안에 실제 문제가 있습니다. 문항을 찾기 어렵다고 느껴지면 페이지를 처음부터 다시 살펴보고 최소 1개 이상을 반드시 추출하세요.
8. 이 문제를 정확히 풀려면 도형/그래프/표/그림이 반드시 필요한지 has_diagram에 true/false로 표시하세요. 5번 지침은 그대로입니다 — 좌표는 반환하지 마세요, true/false 판단만 하면 됩니다.
9. ${MATH_NOTATION_INSTRUCTIONS}`;

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
    // extended thinking은 effort를 낮춰도 꺼지지 않는다 — 이 작업은 페이지에
    // 적힌 문제를 그대로 옮겨 적고 개념 코드 하나를 고르는 단순 전사이지,
    // 깊은 추론이 필요한 문제 풀이가 아니므로 thinking 자체를 꺼서 그 단계를
    // 통째로 건너뛴다. 이게 지연시간에 effort보다 훨씬 큰 영향을 준다.
    thinking: "disabled",
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
        transcribed_options: item.options,
        transcribed_correct_option: item.correct_option,
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
      .select("id, transcribed_problem, transcribed_answer, transcribed_options, transcribed_correct_option");
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
                  ? {
                      translated_problem: t.translated_problem,
                      translated_answer: t.translated_answer,
                      translated_options: t.translated_options,
                      translated_correct_option: t.translated_correct_option,
                      translation_error: null,
                    }
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

      // Best-effort, same reasoning as translation above: for rows whose
      // source scan never printed an answer (translated_answer still null
      // after translation), have the model actually solve the problem so
      // "원본 그대로" mode never has to fall back to a bare "(정답 미확인)"
      // placeholder — see solve-reference-problems.ts and
      // generatePracticeSheetAction's verbatim branch. Re-selected from the
      // DB (rather than reusing the `translated` map above) so this reflects
      // reality regardless of whether translation partially failed.
      const { data: toSolve } = await admin
        .from("reference_problems")
        .select("id, translated_problem, has_diagram, translated_options")
        .in(
          "id",
          inserted.map((row) => row.id),
        )
        .is("translated_answer", null)
        .not("translated_problem", "is", null)
        .returns<Pick<ReferenceProblem, "id" | "translated_problem" | "has_diagram" | "translated_options">[]>();

      if (toSolve && toSolve.length > 0) {
        try {
          const solved = await solveReferenceProblems(
            toSolve.map((r) => ({
              id: r.id,
              translated_problem: r.translated_problem!,
              has_diagram: r.has_diagram,
              translated_options: r.translated_options,
            })),
          );
          await Promise.all(
            toSolve.map((item) => {
              const s = solved.get(item.id);
              return admin
                .from("reference_problems")
                .update(
                  s
                    ? { solved_answer: s.solved_answer, solved_correct_option: s.solved_correct_option, solve_error: null }
                    : { solve_error: "풀이 응답에서 이 문제를 찾지 못했습니다." },
                )
                .eq("id", item.id);
            }),
          );
        } catch (err) {
          const message = err instanceof Error ? err.message : "정답 풀이 중 오류가 발생했습니다.";
          await admin
            .from("reference_problems")
            .update({ solve_error: message })
            .in(
              "id",
              toSolve.map((item) => item.id),
            );
        }
      }
    }
  }

  const { error: updateError } = await admin
    .from("reference_problem_scans")
    .update({ status: "pending_review", graded_at: new Date().toISOString() })
    .eq("id", scanId);
  if (updateError) throw new Error(updateError.message);
}
