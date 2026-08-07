import { z } from "zod";
import { ProblemOptionsArraySchema } from "./problem-option-schema";

export const ReferenceExtractedItemSchema = z.object({
  problem_number: z.string().nullable(),
  // 지문(stem)만 담는다 — 보기(선택지)가 있으면 절대 여기 포함하지 않고 아래
  // options에 별도로 담는다.
  transcribed_problem: z.string(),
  // 이 문제가 객관식이면(2~6개의 뚜렷한 보기) 각 보기를 {label, text}로 담는다.
  // label은 원본에 인쇄된 그대로(A/B/C, 1)/2)/3), ①②③ 등) 옮기고 새로 만들거나
  // A-E로 바꾸지 않는다. 보기가 6개를 초과하거나 구분이 애매하면 null로 두고
  // transcribed_problem에 원문 그대로 남긴다(기존 방식).
  options: ProblemOptionsArraySchema,
  // transcribed_answer가 options 중 하나의 라벨과 정확히 일치하면 그 라벨.
  // 어느 쪽인지 확신이 없으면 절대 추측하지 않고 null.
  correct_option: z.string().nullable(),
  // 원본 사진/PDF에 정답이 안 보이면 추측하지 않고 null — 정답은 생성 시점에
  // AI가 직접 계산/검산한다 (generate-similar-problems.ts 참고). options가
  // 있는 경우, 이 필드는 항상 보기의 실제 값(예: "Q")을 담아야 하며 맨 라벨
  // ("D")만 담아서는 안 된다 — 라벨은 correct_option에 별도로 담는다.
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
