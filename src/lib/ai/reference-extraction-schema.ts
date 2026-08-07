import { z } from "zod";

export const ReferenceExtractedItemSchema = z.object({
  problem_number: z.string().nullable(),
  transcribed_problem: z.string(),
  // 원본 사진/PDF에 정답이 안 보이면 추측하지 않고 null — 정답은 생성 시점에
  // AI가 직접 계산/검산한다 (generate-similar-problems.ts 참고).
  transcribed_answer: z.string().nullable(),
  // 채점 파이프라인과 동일하게, 추출 시점에 조회한 개념 목록에 대해
  // 사후 매칭된다 (개념은 교사가 편집 가능하므로 스키마 레벨 enum이 아님).
  concept_code: z.string().nullable(),
  confidence_note: z.string().nullable(),
  // 이 문제를 정확히 풀려면 도형/그래프/표/그림이 반드시 필요한지 여부.
  // 좌표나 크롭된 이미지 자체는 여전히 반환하지 않는다(아래 지침 5) — 교사가
  // reference-problem-crop-dialog.tsx에서 직접 잘라 붙인다.
  has_diagram: z.boolean(),
});

export const ReferenceExtractionSchema = z.object({
  items: z.array(ReferenceExtractedItemSchema).min(1, "최소 1개 이상의 문항이 있어야 합니다"),
});

export type ReferenceExtractedItem = z.infer<typeof ReferenceExtractedItemSchema>;
