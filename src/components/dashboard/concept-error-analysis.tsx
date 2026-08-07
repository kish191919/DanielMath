import { computeSessionStats } from "@/lib/learning-history/stats";
import { ERROR_TYPE_LABELS } from "@/lib/learning-history/schema";
import type { Concept, LearningItem } from "@/lib/supabase/types";

// Read-only concept/error-type breakdown of confirmed wrong answers — the
// deterministic analysis a teacher asked for after confirming a correction
// upload ("어느 개념/유형에서 틀리는지"), computed from real data rather than
// AI-authored prose.
export function ConceptErrorAnalysis({
  items,
  concepts,
}: {
  items: LearningItem[];
  concepts: Concept[];
}) {
  if (items.length === 0) return null;

  const stats = computeSessionStats(items, concepts);

  return (
    <div className="rounded-2xl border border-navy-100 bg-white p-4 shadow-sm sm:p-5">
      <h3 className="text-sm font-semibold text-navy-900 font-ko" lang="ko">
        분석 결과
      </h3>
      <p className="mt-1 text-xs text-navy-600 font-ko" lang="ko">
        확정된 오답 {stats.total}개를 개념·오답 유형별로 집계했어요.
      </p>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-navy-500">개념별 오답</p>
          <ul className="mt-2 space-y-1.5">
            {stats.byConcept
              .sort((a, b) => b.total - a.total)
              .map((c) => (
                <li key={c.label} className="flex items-center justify-between text-sm text-navy-800">
                  <span className="font-ko" lang="ko">
                    {c.label}
                  </span>
                  <span className="text-navy-500">{c.total}개</span>
                </li>
              ))}
          </ul>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-navy-500">오답 유형별 집계</p>
          {stats.byErrorType.length === 0 ? (
            <p className="mt-2 text-sm text-navy-500 font-ko" lang="ko">
              분류된 오답 유형이 없습니다.
            </p>
          ) : (
            <ul className="mt-2 space-y-1.5">
              {stats.byErrorType
                .sort((a, b) => b.count - a.count)
                .map((e) => (
                  <li key={e.type} className="flex items-center justify-between text-sm text-navy-800">
                    <span className="font-ko" lang="ko">
                      {ERROR_TYPE_LABELS[e.type]}
                    </span>
                    <span className="text-navy-500">{e.count}회</span>
                  </li>
                ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
