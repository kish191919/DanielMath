"use client";

import * as React from "react";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ConfirmSubmitButton } from "@/components/dashboard/confirm-submit-button";
import { GradingStatusPoller } from "@/components/dashboard/grading-status-poller";
import { ReferenceScanUploadForm } from "@/components/dashboard/reference-scan-upload-form";
import { ERROR_TYPE_LABELS } from "@/lib/learning-history/schema";
import { deleteLearningItemAction } from "@/lib/learning-history/actions";
import { generatePracticeSheetAction } from "@/lib/practice-sheets/actions";
import {
  deleteReferenceProblemAction,
  deleteReferenceScanAction,
  retryReferenceExtractionAction,
} from "@/lib/problem-bank/actions";
import type { Concept, LearningItem, ReferenceProblem, ReferenceProblemScan } from "@/lib/supabase/types";

export type ItemGroup = {
  key: string;
  label?: string;
  items: LearningItem[];
};

export type ReferenceScanGroup = {
  scan: ReferenceProblemScan;
  items: ReferenceProblem[];
};

const SCAN_STATE_LABELS: Record<string, string> = {
  uploaded: "추출 대기",
  grading: "추출 중",
  pending_review: "추출 완료",
  reviewed: "추출 완료",
  grading_failed: "추출 실패",
};

// Copies WrongAnswerWorkspace's checkbox-list + sticky-bottom-bar shape and
// extends it with a second section for scanned problems, grouped by scan
// (like wrong answers are grouped by session) — scanned problems have no
// tag/confirm gate, so they're usable the moment OCR extraction finishes.
export function PracticeSheetGeneratorWorkspace({
  studentId,
  wrongAnswerGroups,
  referenceGroups,
  concepts,
}: {
  studentId: string;
  wrongAnswerGroups: ItemGroup[];
  referenceGroups: ReferenceScanGroup[];
  concepts: Concept[];
}) {
  const [selectedWrongAnswers, setSelectedWrongAnswers] = React.useState<Record<string, boolean>>(
    {},
  );
  const [selectedReferences, setSelectedReferences] = React.useState<Record<string, boolean>>({});
  const [conceptFilter, setConceptFilter] = React.useState("");
  const [countPerItem, setCountPerItem] = React.useState(3);
  const [error, setError] = React.useState<string | null>(null);
  const [isPending, startTransition] = React.useTransition();

  // Fast path: after uploading a scan, once its items land (via the poller
  // refreshing the page), auto-select just those items exactly once so a
  // "이 스캔으로 바로 생성" button can generate from them with a single click.
  const [justUploadedScanId, setJustUploadedScanId] = React.useState<string | null>(null);
  const autoSelectedScanIds = React.useRef(new Set<string>());

  const conceptById = React.useMemo(() => new Map(concepts.map((c) => [c.id, c])), [concepts]);

  React.useEffect(() => {
    if (!justUploadedScanId || autoSelectedScanIds.current.has(justUploadedScanId)) return;
    const group = referenceGroups.find((g) => g.scan.id === justUploadedScanId);
    if (!group || group.items.length === 0) return;
    autoSelectedScanIds.current.add(justUploadedScanId);
    // Syncing selection state to a scan_id that just finished extracting
    // server-side (detected via the poller's router.refresh()), guarded by
    // the ref above so it fires exactly once per scan — not a render loop.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSelectedReferences((prev) => {
      const next = { ...prev };
      for (const item of group.items) next[item.id] = true;
      return next;
    });
  }, [justUploadedScanId, referenceGroups]);

  const isAnyScanGrading = referenceGroups.some((g) => g.scan.status === "grading");

  const selectedWrongAnswerIds = Object.keys(selectedWrongAnswers).filter(
    (id) => selectedWrongAnswers[id],
  );
  const selectedReferenceIds = Object.keys(selectedReferences).filter(
    (id) => selectedReferences[id],
  );
  const totalSelected = selectedWrongAnswerIds.length + selectedReferenceIds.length;

  function toggleWrongAnswer(id: string) {
    setSelectedWrongAnswers((prev) => ({ ...prev, [id]: !prev[id] }));
  }
  function toggleReference(id: string) {
    setSelectedReferences((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function handleGenerate() {
    setError(null);
    const selections = [
      ...selectedWrongAnswerIds.map((itemId) => ({
        sourceType: "wrong_answer" as const,
        itemId,
        count: countPerItem,
      })),
      ...selectedReferenceIds.map((itemId) => ({
        sourceType: "reference" as const,
        itemId,
        count: countPerItem,
      })),
    ];
    startTransition(async () => {
      const result = await generatePracticeSheetAction(studentId, selections);
      if (result && "error" in result) {
        setError(result.error);
      }
    });
  }

  // Generates from exactly this scan's items, regardless of whatever else
  // is checked elsewhere on the page — distinct from the shared "선택한
  // 문항으로 생성" button below, which respects the full current selection.
  function handleGenerateFromScan(itemIds: string[]) {
    setError(null);
    const selections = itemIds.map((itemId) => ({
      sourceType: "reference" as const,
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

  const hasNoWrongAnswers = wrongAnswerGroups.every((g) => g.items.length === 0);

  return (
    <div className="space-y-8 pb-24">
      <GradingStatusPoller isGrading={isAnyScanGrading} />

      <section>
        <h2 className="text-lg font-semibold text-navy-900 font-ko" lang="ko">
          오답에서 선택
        </h2>
        {hasNoWrongAnswers ? (
          <div className="mt-3 rounded-2xl border border-navy-100 bg-white p-6 text-center text-sm text-navy-600">
            기록된 오답이 없습니다.
          </div>
        ) : (
          <div className="mt-3 space-y-6">
            {wrongAnswerGroups.map((group) => (
              <div key={group.key}>
                {group.label && (
                  <p className="text-xs font-semibold uppercase tracking-wide text-navy-500">
                    {group.label}
                  </p>
                )}
                <div className="mt-2 space-y-2">
                  {group.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-start gap-3 rounded-2xl border border-navy-100 bg-white p-4 shadow-sm"
                    >
                      <label className="flex flex-1 items-start gap-3">
                        <input
                          type="checkbox"
                          className="mt-1 h-4 w-4 shrink-0 accent-navy-700"
                          checked={!!selectedWrongAnswers[item.id]}
                          onChange={() => toggleWrongAnswer(item.id)}
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
                      <form action={deleteLearningItemAction.bind(null, item.id)}>
                        <ConfirmSubmitButton
                          label="삭제"
                          confirmMessage="이 오답을 삭제하시겠습니까?"
                          className="shrink-0 rounded-md border border-red-200 px-2 py-1 text-xs font-medium text-red-700 hover:bg-red-50"
                        />
                      </form>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-navy-900 font-ko" lang="ko">
            스캔한 문제에서 선택
          </h2>
          <Select
            value={conceptFilter}
            onChange={(e) => setConceptFilter(e.target.value)}
            className="max-w-[220px]"
          >
            <option value="">전체 개념</option>
            {concepts.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label_ko}
              </option>
            ))}
          </Select>
        </div>

        <div className="mt-3">
          <ReferenceScanUploadForm onUploaded={setJustUploadedScanId} />
        </div>

        {referenceGroups.length === 0 ? (
          <div className="mt-3 rounded-2xl border border-navy-100 bg-white p-6 text-center text-sm text-navy-600">
            아직 스캔한 문제가 없습니다.
          </div>
        ) : (
          <div className="mt-3 space-y-6">
            {referenceGroups.map((group) => {
              const filteredItems = conceptFilter
                ? group.items.filter((p) => p.concept_id === conceptFilter)
                : group.items;
              const isJustUploaded = group.scan.id === justUploadedScanId;
              const isFastPathReady =
                isJustUploaded && group.scan.status !== "grading" && filteredItems.length > 0;

              return (
                <div key={group.scan.id}>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-xs font-semibold uppercase tracking-wide text-navy-500">
                      {group.scan.original_filename ?? "업로드된 문제"} ·{" "}
                      {SCAN_STATE_LABELS[group.scan.status] ?? group.scan.status}
                    </p>
                    <div className="flex items-center gap-2">
                      {isFastPathReady && (
                        <button
                          type="button"
                          onClick={() => handleGenerateFromScan(filteredItems.map((i) => i.id))}
                          disabled={isPending}
                          className="rounded-md bg-navy-900 px-2 py-1 text-xs font-medium text-white hover:bg-navy-800 disabled:opacity-50"
                        >
                          이 스캔으로 바로 생성
                        </button>
                      )}
                      {group.scan.status === "grading_failed" && (
                        <form action={retryReferenceExtractionAction.bind(null, group.scan.id)}>
                          <button
                            type="submit"
                            className="rounded-md border border-red-200 px-2 py-1 text-xs font-medium text-red-700 hover:bg-red-50"
                          >
                            다시 추출하기
                          </button>
                        </form>
                      )}
                      <form action={deleteReferenceScanAction.bind(null, group.scan.id)}>
                        <ConfirmSubmitButton
                          label="스캔 삭제"
                          confirmMessage="이 업로드를 삭제하시겠습니까? 추출된 문항과 원본 파일도 함께 삭제되며 되돌릴 수 없습니다."
                          className="rounded-md border border-red-200 px-2 py-1 text-xs font-medium text-red-700 hover:bg-red-50"
                        />
                      </form>
                    </div>
                  </div>

                  {group.scan.status === "grading" ? (
                    <div className="mt-2 flex items-center gap-3 rounded-2xl border border-navy-100 bg-navy-50/50 p-4">
                      <span
                        className="h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-navy-300 border-t-navy-700"
                        aria-hidden="true"
                      />
                      <p className="text-sm text-navy-700 font-ko" lang="ko">
                        AI가 문제를 추출하고 있습니다. 완료되면 자동으로 나타납니다.
                      </p>
                    </div>
                  ) : group.scan.status === "grading_failed" ? (
                    <div className="mt-2 rounded-2xl border border-red-200 bg-red-50 p-4">
                      <p className="text-sm text-red-800">문제 추출에 실패했습니다.</p>
                      {group.scan.grading_error && (
                        <p className="mt-1 text-xs text-red-700">{group.scan.grading_error}</p>
                      )}
                    </div>
                  ) : filteredItems.length === 0 ? (
                    <div className="mt-2 rounded-2xl border border-navy-100 bg-white p-4 text-center text-sm text-navy-600">
                      {conceptFilter ? "이 개념에 해당하는 문제가 없습니다." : "인식된 문항이 없습니다."}
                    </div>
                  ) : (
                    <div className="mt-2 space-y-2">
                      {filteredItems.map((problem) => {
                        const concept = problem.concept_id ? conceptById.get(problem.concept_id) : undefined;
                        return (
                          <div
                            key={problem.id}
                            className="flex items-start gap-3 rounded-2xl border border-navy-100 bg-white p-4 shadow-sm"
                          >
                            <label className="flex flex-1 items-start gap-3">
                              <input
                                type="checkbox"
                                className="mt-1 h-4 w-4 shrink-0 accent-navy-700"
                                checked={!!selectedReferences[problem.id]}
                                onChange={() => toggleReference(problem.id)}
                              />
                              <div className="flex-1">
                                <p className="text-xs font-semibold uppercase tracking-wide text-navy-500">
                                  {concept ? `${concept.strand} · ${concept.label_ko}` : "미분류"}
                                </p>
                                <p className="mt-1 text-sm text-navy-900">
                                  {problem.problem_number && (
                                    <span className="mr-2 font-medium">#{problem.problem_number}</span>
                                  )}
                                  {problem.transcribed_problem}
                                </p>
                              </div>
                            </label>
                            <form action={deleteReferenceProblemAction.bind(null, problem.id)}>
                              <ConfirmSubmitButton
                                label="삭제"
                                confirmMessage="이 문제를 삭제하시겠습니까?"
                                className="shrink-0 rounded-md border border-red-200 px-2 py-1 text-xs font-medium text-red-700 hover:bg-red-50"
                              />
                            </form>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>

      <div className="fixed inset-x-0 bottom-0 z-10 border-t border-navy-100 bg-white/95 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3 text-sm text-navy-700">
            <span>{totalSelected}개 선택됨</span>
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
              disabled={totalSelected === 0 || isPending}
            >
              {isPending ? "생성 중..." : "유사문제 생성"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
