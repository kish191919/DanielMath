"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { confirmPracticeSheetAction } from "@/lib/practice-sheets/actions";
import type { PracticeProblemInputValues } from "@/lib/practice-sheets/schema";
import type { GeneratedProblemWithCrop } from "@/lib/practice-sheets/queries";

type Row = PracticeProblemInputValues & { clientKey: string; crop_image_url?: string | null };

// Auto-assigned when a teacher adds a new option row — falls back to a
// plain number past F since 6 is the max option count anyway.
const LABEL_POOL = ["A", "B", "C", "D", "E", "F"];

function nextLabel(existingLabels: string[]): string {
  const used = new Set(existingLabels);
  return LABEL_POOL.find((l) => !used.has(l)) ?? `${existingLabels.length + 1}`;
}

function toRow(problem: GeneratedProblemWithCrop): Row {
  return {
    clientKey: problem.id,
    id: problem.id,
    problem_text: problem.problem_text,
    answer_text: problem.answer_text,
    options: problem.options,
    correct_option: problem.correct_option,
    source_item_id: problem.source_item_id,
    source_reference_id: problem.source_reference_id,
    concept_id: problem.concept_id,
    source: problem.source,
    edited_by_teacher: problem.edited_by_teacher,
    answer_needs_review: problem.answer_needs_review,
    crop_image_url: problem.crop_image_url,
  };
}

function emptyRow(): Row {
  return {
    clientKey: crypto.randomUUID(),
    problem_text: "",
    answer_text: "",
    options: null,
    correct_option: null,
    source_item_id: null,
    concept_id: null,
    source: "teacher",
    edited_by_teacher: true,
    answer_needs_review: false,
  };
}

export function PracticeSheetReviewTable({
  worksheetId,
  initialProblems,
  initialTitle,
  readOnly,
}: {
  worksheetId: string;
  initialProblems: GeneratedProblemWithCrop[];
  initialTitle: string | null;
  readOnly: boolean;
}) {
  const [rows, setRows] = React.useState<Row[]>(() => initialProblems.map(toRow));
  const [title, setTitle] = React.useState(initialTitle ?? "");
  const [isSaving, setIsSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  function updateRow(clientKey: string, patch: Partial<Row>) {
    setRows((prev) =>
      prev.map((row) => {
        if (row.clientKey !== clientKey) return row;
        // Both AI-rewritten and verbatim rows count as "touched" once a
        // teacher edits any field — reference_verbatim was previously
        // missing here, which meant editing an AI-estimated verbatim answer
        // never cleared answer_needs_review below.
        const nowReviewed = row.source === "ai" || row.source === "reference_verbatim";
        return {
          ...row,
          ...patch,
          edited_by_teacher: nowReviewed ? true : row.edited_by_teacher,
          answer_needs_review: nowReviewed ? false : row.answer_needs_review,
        };
      }),
    );
  }

  function removeRow(clientKey: string) {
    setRows((prev) => prev.filter((row) => row.clientKey !== clientKey));
  }

  function addRow() {
    setRows((prev) => [...prev, emptyRow()]);
  }

  function toggleMCQ(clientKey: string) {
    setRows((prev) =>
      prev.map((row) => {
        if (row.clientKey !== clientKey) return row;
        if (row.options) return { ...row, options: null, correct_option: null };
        return {
          ...row,
          options: [
            { label: "A", text: "" },
            { label: "B", text: "" },
          ],
          correct_option: null,
        };
      }),
    );
  }

  function updateOption(clientKey: string, optionIndex: number, patch: Partial<{ label: string; text: string }>) {
    setRows((prev) =>
      prev.map((row) => {
        if (row.clientKey !== clientKey || !row.options) return row;
        return {
          ...row,
          options: row.options.map((opt, i) => (i === optionIndex ? { ...opt, ...patch } : opt)),
        };
      }),
    );
  }

  function addOption(clientKey: string) {
    setRows((prev) =>
      prev.map((row) => {
        if (row.clientKey !== clientKey || !row.options || row.options.length >= 6) return row;
        return {
          ...row,
          options: [...row.options, { label: nextLabel(row.options.map((o) => o.label)), text: "" }],
        };
      }),
    );
  }

  function removeOption(clientKey: string, optionIndex: number) {
    setRows((prev) =>
      prev.map((row) => {
        if (row.clientKey !== clientKey || !row.options) return row;
        const removedLabel = row.options[optionIndex]?.label;
        return {
          ...row,
          options: row.options.filter((_, i) => i !== optionIndex),
          correct_option: row.correct_option === removedLabel ? null : row.correct_option,
        };
      }),
    );
  }

  function moveOption(clientKey: string, optionIndex: number, direction: -1 | 1) {
    setRows((prev) =>
      prev.map((row) => {
        if (row.clientKey !== clientKey || !row.options) return row;
        const target = optionIndex + direction;
        if (target < 0 || target >= row.options.length) return row;
        const next = [...row.options];
        [next[optionIndex], next[target]] = [next[target], next[optionIndex]];
        return { ...row, options: next };
      }),
    );
  }

  function setCorrectOption(clientKey: string, label: string) {
    updateRow(clientKey, { correct_option: label });
  }

  async function handleConfirm() {
    setError(null);
    if (rows.length === 0) {
      setError("최소 1개 이상의 문항이 필요합니다.");
      return;
    }
    setIsSaving(true);
    const payload = rows.map((row): PracticeProblemInputValues => {
      const { clientKey, crop_image_url, ...rest } = row;
      void clientKey;
      void crop_image_url;
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

          <div className="mt-3">
            <label className="flex items-center gap-2 text-xs font-medium text-navy-700">
              <input
                type="checkbox"
                className="h-3.5 w-3.5 accent-navy-700"
                checked={!!row.options}
                disabled={readOnly}
                onChange={() => toggleMCQ(row.clientKey)}
              />
              객관식 문제로 만들기
            </label>

            {row.options && (
              <div className="mt-2 space-y-2">
                {row.options.map((opt, optIndex) => (
                  <div key={optIndex} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name={`correct-${row.clientKey}`}
                      className="h-3.5 w-3.5 shrink-0 accent-navy-700"
                      checked={row.correct_option === opt.label}
                      disabled={readOnly}
                      onChange={() => setCorrectOption(row.clientKey, opt.label)}
                      aria-label={`보기 ${opt.label}를 정답으로 표시`}
                    />
                    <Input
                      className="w-14 shrink-0 text-center"
                      value={opt.label}
                      disabled={readOnly}
                      onChange={(e) => updateOption(row.clientKey, optIndex, { label: e.target.value })}
                    />
                    <Input
                      className="flex-1"
                      placeholder="보기 내용"
                      value={opt.text}
                      disabled={readOnly}
                      onChange={(e) => updateOption(row.clientKey, optIndex, { text: e.target.value })}
                    />
                    {!readOnly && (
                      <>
                        <button
                          type="button"
                          onClick={() => moveOption(row.clientKey, optIndex, -1)}
                          disabled={optIndex === 0}
                          className="shrink-0 rounded-md border border-navy-200 px-1.5 py-1 text-xs text-navy-600 hover:bg-navy-50 disabled:opacity-30"
                          aria-label="위로 이동"
                        >
                          ↑
                        </button>
                        <button
                          type="button"
                          onClick={() => moveOption(row.clientKey, optIndex, 1)}
                          disabled={optIndex === row.options!.length - 1}
                          className="shrink-0 rounded-md border border-navy-200 px-1.5 py-1 text-xs text-navy-600 hover:bg-navy-50 disabled:opacity-30"
                          aria-label="아래로 이동"
                        >
                          ↓
                        </button>
                        <button
                          type="button"
                          onClick={() => removeOption(row.clientKey, optIndex)}
                          className="shrink-0 rounded-md border border-red-200 px-1.5 py-1 text-xs font-medium text-red-700 hover:bg-red-50"
                          aria-label="보기 삭제"
                        >
                          삭제
                        </button>
                      </>
                    )}
                  </div>
                ))}
                {!readOnly && row.options.length < 6 && (
                  <button
                    type="button"
                    onClick={() => addOption(row.clientKey)}
                    className="rounded-md border border-dashed border-navy-200 px-2 py-1 text-xs font-medium text-navy-600 hover:border-navy-400 hover:bg-navy-50"
                  >
                    + 보기 추가
                  </button>
                )}
                {!row.correct_option && (
                  <p className="text-xs text-amber-700">정답으로 표시된 보기가 없습니다.</p>
                )}
              </div>
            )}
          </div>

          {row.crop_image_url && (
            <div className="mt-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-navy-500">
                원본 도형 (재크롭은 문제 생성 화면에서)
              </p>
              {/* eslint-disable-next-line @next/next/no-img-element -- signed Supabase Storage URL, not a static asset */}
              <img
                src={row.crop_image_url}
                alt=""
                className="mt-1 max-h-40 rounded-md border border-navy-200 object-contain"
              />
            </div>
          )}

          {row.source === "ai" && (
            <p className="mt-2 text-xs text-navy-500">
              AI 생성{row.edited_by_teacher ? " (수정됨)" : ""}
            </p>
          )}
          {row.source === "reference_verbatim" && (
            <p className="mt-2 text-xs text-navy-500">
              원본 그대로{row.edited_by_teacher ? " (수정됨)" : ""}
            </p>
          )}
          {row.answer_needs_review && (
            <p className="mt-2 inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
              AI 추정 정답 · 확인 필요
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
