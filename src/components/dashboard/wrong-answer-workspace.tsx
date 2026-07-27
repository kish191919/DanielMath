"use client";

import * as React from "react";
import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { ERROR_TYPE_LABELS } from "@/lib/learning-history/schema";
import { generatePracticeSheetAction } from "@/lib/practice-sheets/actions";
import type { LearningItem } from "@/lib/supabase/types";

export type ItemGroup = {
  key: string;
  label?: string;
  items: LearningItem[];
};

function InfoTooltip({ text }: { text: string }) {
  return (
    <span className="group relative inline-flex">
      <button
        type="button"
        tabIndex={0}
        aria-label="설명"
        className="inline-flex h-4 w-4 items-center justify-center rounded-full text-navy-400 hover:text-navy-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-500 focus-visible:ring-offset-2"
      >
        <Info className="h-3.5 w-3.5" />
      </button>
      <span
        role="tooltip"
        className="pointer-events-none absolute bottom-full left-1/2 mb-2 w-56 -translate-x-1/2 rounded-lg bg-navy-900 px-3 py-2 text-xs leading-snug text-white opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100 group-focus-within:opacity-100"
      >
        {text}
      </span>
    </span>
  );
}

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
    const selections = selectedIds.map((itemId) => ({
      sourceType: "wrong_answer" as const,
      itemId,
      count: countPerItem,
    }));
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
            <span className="inline-flex items-center gap-1.5">
              {selectedIds.length}개 선택됨
              <InfoTooltip text="체크한 오답을 바탕으로 AI가 비슷한 유형의 연습 문제를 생성합니다. '문항당 개수'는 오답 1개마다 만들 유사문제 수입니다." />
            </span>
            <label className="flex items-center gap-1.5">
              문항당
              <Select
                value={countPerItem}
                onChange={(e) => setCountPerItem(Number(e.target.value))}
                className="h-8 w-16 rounded-lg border border-navy-200 px-2 py-1 text-sm"
              >
                {[1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </Select>
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
