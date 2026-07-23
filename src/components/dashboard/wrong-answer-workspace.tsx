"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { ERROR_TYPE_LABELS } from "@/lib/learning-history/schema";
import { generatePracticeSheetAction } from "@/lib/practice-sheets/actions";
import type { LearningItem } from "@/lib/supabase/types";

export type ItemGroup = {
  key: string;
  label?: string;
  items: LearningItem[];
};

export function WrongAnswerWorkspace({
  studentId,
  groups,
}: {
  studentId: string;
  groups: ItemGroup[];
}) {
  const [selected, setSelected] = React.useState<Record<string, boolean>>({});
  const [countPerItem, setCountPerItem] = React.useState(3);
  const [error, setError] = React.useState<string | null>(null);
  const [isPending, startTransition] = React.useTransition();

  const selectedIds = Object.keys(selected).filter((id) => selected[id]);

  function toggle(itemId: string) {
    setSelected((prev) => ({ ...prev, [itemId]: !prev[itemId] }));
  }

  function handleGenerate() {
    setError(null);
    const selections = selectedIds.map((itemId) => ({ itemId, count: countPerItem }));
    startTransition(async () => {
      const result = await generatePracticeSheetAction(studentId, selections);
      if (result && "error" in result) {
        setError(result.error);
      }
    });
  }

  if (groups.every((g) => g.items.length === 0)) {
    return (
      <div className="rounded-2xl border border-navy-100 bg-white p-8 text-center text-sm text-navy-600">
        기록된 오답이 없습니다.
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-24">
      {groups.map((group) => (
        <div key={group.key}>
          {group.label && (
            <p className="text-xs font-semibold uppercase tracking-wide text-navy-500">
              {group.label}
            </p>
          )}
          <div className="mt-2 space-y-2">
            {group.items.map((item) => (
              <label
                key={item.id}
                className="flex items-start gap-3 rounded-2xl border border-navy-100 bg-white p-4 shadow-sm"
              >
                <input
                  type="checkbox"
                  className="mt-1 h-4 w-4 shrink-0 accent-navy-700"
                  checked={!!selected[item.id]}
                  onChange={() => toggle(item.id)}
                />
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm text-navy-900">
                      {item.problem_number && (
                        <span className="mr-2 font-medium">#{item.problem_number}</span>
                      )}
                      {item.transcribed_problem}
                    </p>
                    <span className="shrink-0 rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
                      오답
                    </span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-navy-500">
                    <span>{item.session_date}</span>
                    {item.transcribed_answer && <span>학생 답: {item.transcribed_answer}</span>}
                    {item.error_type && <span>{ERROR_TYPE_LABELS[item.error_type]}</span>}
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>
      ))}

      <div className="fixed inset-x-0 bottom-0 z-10 border-t border-navy-100 bg-white/95 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3 text-sm text-navy-700">
            <span>{selectedIds.length}개 선택됨</span>
            <label className="flex items-center gap-1.5">
              문항당
              <input
                type="number"
                min={1}
                max={5}
                value={countPerItem}
                onChange={(e) =>
                  setCountPerItem(Math.min(5, Math.max(1, Number(e.target.value) || 1)))
                }
                className="w-14 rounded-lg border border-navy-200 px-2 py-1 text-sm"
              />
              개 생성
            </label>
          </div>
          <div className="flex items-center gap-3">
            {error && <p className="text-xs text-red-700">{error}</p>}
            <Button
              type="button"
              onClick={handleGenerate}
              disabled={selectedIds.length === 0 || isPending}
            >
              {isPending ? "생성 중..." : "유사문제 생성"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
