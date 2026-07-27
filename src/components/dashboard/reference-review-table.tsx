"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { confirmReferenceReviewAction } from "@/lib/problem-bank/actions";
import type { ReferenceProblemInputValues } from "@/lib/problem-bank/schema";
import type { Concept, ReferenceProblem } from "@/lib/supabase/types";

// concept_id is kept as a plain string here (rather than
// ReferenceProblemInputValues' uuid-required type) so an unselected concept
// can be represented as "" in the <Select> before the teacher tags it —
// validated as required only at submit time.
type Row = Omit<ReferenceProblemInputValues, "concept_id"> & {
  clientKey: string;
  concept_id: string;
};

function toRow(item: ReferenceProblem): Row {
  return {
    clientKey: item.id,
    id: item.id,
    problem_number: item.problem_number ?? "",
    transcribed_problem: item.transcribed_problem,
    transcribed_answer: item.transcribed_answer ?? "",
    concept_id: item.concept_id ?? "",
    source: item.source,
    edited_by_teacher: item.edited_by_teacher,
  };
}

function emptyRow(): Row {
  return {
    clientKey: crypto.randomUUID(),
    problem_number: "",
    transcribed_problem: "",
    transcribed_answer: "",
    concept_id: "",
    source: "teacher",
    edited_by_teacher: true,
  };
}

export function ReferenceReviewTable({
  scanId,
  initialItems,
  concepts,
  readOnly,
}: {
  scanId: string;
  initialItems: ReferenceProblem[];
  concepts: Concept[];
  readOnly: boolean;
}) {
  const [rows, setRows] = React.useState<Row[]>(() => initialItems.map(toRow));
  const [isSaving, setIsSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  function updateRow(clientKey: string, patch: Partial<Row>) {
    setRows((prev) =>
      prev.map((row) =>
        row.clientKey === clientKey
          ? {
              ...row,
              ...patch,
              edited_by_teacher: row.source === "ai" ? true : row.edited_by_teacher,
            }
          : row,
      ),
    );
  }

  function removeRow(clientKey: string) {
    setRows((prev) => prev.filter((row) => row.clientKey !== clientKey));
  }

  function addRow() {
    setRows((prev) => [...prev, emptyRow()]);
  }

  const hasUntaggedRow = rows.some((row) => !row.concept_id);

  async function handleConfirm() {
    setError(null);
    if (rows.length === 0) {
      setError("최소 1개 이상의 문항이 필요합니다.");
      return;
    }
    if (hasUntaggedRow) {
      setError("모든 문항에 개념을 지정해주세요.");
      return;
    }
    setIsSaving(true);
    const payload = rows.map((row): ReferenceProblemInputValues => {
      const { clientKey, ...rest } = row;
      void clientKey;
      return rest as ReferenceProblemInputValues;
    });
    const result = await confirmReferenceReviewAction(scanId, payload);
    if ("error" in result) {
      setError(result.error);
      setIsSaving(false);
    }
  }

  return (
    <div className="space-y-4">
      {rows.length === 0 && (
        <div className="rounded-2xl border border-navy-100 bg-white p-8 text-center text-sm text-navy-600">
          {readOnly ? "확정된 문항이 없습니다." : "AI가 인식한 문항이 없습니다. 아래에서 직접 추가해주세요."}
        </div>
      )}

      {rows.map((row) => (
        <div
          key={row.clientKey}
          className="rounded-2xl border border-navy-100 bg-white p-4 shadow-sm sm:p-5"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="grid flex-1 gap-3 sm:grid-cols-[96px_1fr]">
              <Input
                placeholder="번호"
                value={row.problem_number ?? ""}
                disabled={readOnly}
                onChange={(e) => updateRow(row.clientKey, { problem_number: e.target.value })}
              />
              <Textarea
                placeholder="문제 내용"
                className="min-h-[44px]"
                value={row.transcribed_problem}
                disabled={readOnly}
                onChange={(e) => updateRow(row.clientKey, { transcribed_problem: e.target.value })}
              />
            </div>
            {!readOnly && (
              <button
                type="button"
                onClick={() => removeRow(row.clientKey)}
                className="shrink-0 rounded-md border border-red-200 px-2 py-1 text-xs font-medium text-red-700 hover:bg-red-50"
              >
                삭제
              </button>
            )}
          </div>

          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <Input
              placeholder="정답 (안 보이면 비워두세요)"
              value={row.transcribed_answer ?? ""}
              disabled={readOnly}
              onChange={(e) => updateRow(row.clientKey, { transcribed_answer: e.target.value })}
            />

            <Select
              value={row.concept_id}
              disabled={readOnly}
              aria-invalid={!row.concept_id}
              className={!row.concept_id && !readOnly ? "border-red-300" : undefined}
              onChange={(e) => updateRow(row.clientKey, { concept_id: e.target.value })}
            >
              <option value="">개념 선택 (필수)</option>
              {concepts.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.strand} · {c.label_ko}
                </option>
              ))}
            </Select>
          </div>

          {row.source === "ai" && (
            <p className="mt-2 text-xs text-navy-500">
              AI 추출 결과{row.edited_by_teacher ? " (수정됨)" : ""}
            </p>
          )}
        </div>
      ))}

      {!readOnly && (
        <>
          <button
            type="button"
            onClick={addRow}
            className="w-full rounded-2xl border border-dashed border-navy-200 bg-white p-4 text-sm font-medium text-navy-600 hover:border-navy-400 hover:bg-navy-50"
          >
            + 문항 추가
          </button>

          {error && (
            <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
              {error}
            </p>
          )}

          <div className="flex justify-end">
            <Button type="button" size="lg" onClick={handleConfirm} disabled={isSaving}>
              {isSaving ? "저장 중..." : "확정"}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
