import "server-only";
import { ERROR_TYPE_LABELS } from "./schema";
import type { Concept, ErrorType, LearningItem } from "@/lib/supabase/types";

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
