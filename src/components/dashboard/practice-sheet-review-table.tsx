"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { confirmPracticeSheetAction } from "@/lib/practice-sheets/actions";
import type { PracticeProblemInputValues } from "@/lib/practice-sheets/schema";
import type { GeneratedProblem } from "@/lib/supabase/types";

type Row = PracticeProblemInputValues & { clientKey: string };

function toRow(problem: GeneratedProblem): Row {
  return {
    clientKey: problem.id,
    id: problem.id,
    problem_text: problem.problem_text,
    answer_text: problem.answer_text,
    source_item_id: problem.source_item_id,
    concept_id: problem.concept_id,
    source: problem.source,
    edited_by_teacher: problem.edited_by_teacher,
  };
}

function emptyRow(): Row {
  return {
    clientKey: crypto.randomUUID(),
    problem_text: "",
    answer_text: "",
    source_item_id: null,
    concept_id: null,
    source: "teacher",
    edited_by_teacher: true,
  };
}

export function PracticeSheetReviewTable({
  worksheetId,
  initialProblems,
  initialTitle,
  readOnly,
}: {
  worksheetId: string;
  initialProblems: GeneratedProblem[];
  initialTitle: string | null;
  readOnly: boolean;
}) {
  const [rows, setRows] = React.useState<Row[]>(() => initialProblems.map(toRow));
  const [title, setTitle] = React.useState(initialTitle ?? "");
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

  async function handleConfirm() {
    setError(null);
    if (rows.length === 0) {
      setError("최소 1개 이상의 문항이 필요합니다.");
      return;
    }
    setIsSaving(true);
    const payload = rows.map((row): PracticeProblemInputValues => {
      const { clientKey, ...rest } = row;
      void clientKey;
      return rest;
    });
    const result = await confirmPracticeSheetAction(worksheetId, payload, title.trim());
    if ("error" in result) {
      setError(result.error);
      setIsSaving(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-navy-100 bg-white p-4 shadow-sm sm:p-5">
        <label className="text-xs font-semibold uppercase tracking-wide text-navy-500">
          학습지 제목
        </label>
        <Input
          className="mt-2"
          placeholder="연습문제 (비워두면 기본값 사용)"
          value={title}
          disabled={readOnly}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      {rows.length === 0 && (
        <div className="rounded-2xl border border-navy-100 bg-white p-8 text-center text-sm text-navy-600">
          {readOnly ? "확정된 문항이 없습니다." : "생성된 문항이 없습니다. 아래에서 직접 추가해주세요."}
        </div>
      )}

      {rows.map((row, index) => (
        <div
          key={row.clientKey}
          className="rounded-2xl border border-navy-100 bg-white p-4 shadow-sm sm:p-5"
        >
          <div className="flex items-start justify-between gap-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-navy-500">
              문항 {index + 1}
            </p>
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

          <div className="mt-2 grid gap-3 sm:grid-cols-2">
            <Textarea
              placeholder="문제 내용"
              className="min-h-[80px]"
              value={row.problem_text}
              disabled={readOnly}
              onChange={(e) => updateRow(row.clientKey, { problem_text: e.target.value })}
            />
            <Textarea
              placeholder="정답"
              className="min-h-[80px]"
              value={row.answer_text}
              disabled={readOnly}
              onChange={(e) => updateRow(row.clientKey, { answer_text: e.target.value })}
            />
          </div>

          {row.source === "ai" && (
            <p className="mt-2 text-xs text-navy-500">
              AI 생성{row.edited_by_teacher ? " (수정됨)" : ""}
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
