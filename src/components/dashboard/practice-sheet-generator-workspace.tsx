"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ConfirmSubmitButton } from "@/components/dashboard/confirm-submit-button";
import { GradingStatusPoller } from "@/components/dashboard/grading-status-poller";
import { ReferenceScanUploadForm } from "@/components/dashboard/reference-scan-upload-form";
import { ReferenceProblemCropDialog } from "@/components/dashboard/reference-problem-crop-dialog";
import { ERROR_TYPE_LABELS } from "@/lib/learning-history/schema";
import { deleteLearningItemAction } from "@/lib/learning-history/actions";
import { generatePracticeSheetAction } from "@/lib/practice-sheets/actions";
import {
  deleteReferenceProblemAction,
  deleteReferenceScanAction,
  retryReferenceExtractionAction,
  retranslateReferenceProblemAction,
  deleteReferenceCropAction,
} from "@/lib/problem-bank/actions";
import type { Concept, LearningItem, ReferenceProblem, ReferenceProblemScan } from "@/lib/supabase/types";
import { isGradingStuck } from "@/lib/scan-status";
import { REFERENCE_EXTRACTION_STUCK_THRESHOLD_MS } from "@/lib/ai/grading-config";

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

function isGroupFullySelected(items: { id: string }[], selected: Record<string, boolean>) {
  return items.length > 0 && items.every((item) => selected[item.id]);
}

function toggleGroupSelection(
  items: { id: string }[],
  setSelected: React.Dispatch<React.SetStateAction<Record<string, boolean>>>,
) {
  setSelected((prev) => {
    const allSelected = isGroupFullySelected(items, prev);
    const next = { ...prev };
    for (const item of items) next[item.id] = !allSelected;
    return next;
  });
}

// Copies WrongAnswerWorkspace's checkbox-list + sticky-bottom-bar shape and
// extends it with a second section for scanned problems, grouped by scan
// (like wrong answers are grouped by session) — scanned problems have no
// tag/confirm gate, so they're usable the moment OCR extraction finishes.
// The scan/camera uploader sits above both lists (rather than nested inside
// the reference section) since it's the entry point most sessions start
// from, and the two lists live behind a tab switch with collapsible groups
// so a long problem-bank history doesn't turn this into one giant scroll.
// "similar" (AI-rewritten, default — matches prior behavior) vs "verbatim"
// (translated original text + crop image, printed as-is). Absent from the
// map is treated as "similar", so existing selections behave unchanged.
type ReferenceMode = "similar" | "verbatim";

export function PracticeSheetGeneratorWorkspace({
  studentId,
  wrongAnswerGroups,
  referenceGroups,
  concepts,
  cropThumbnailsByProblemId,
}: {
  // null = "공통 학습지": no student picked, wrong-answer items aren't
  // offered (they're always student-scoped), and every generated sheet
  // prints the same problems for every student.
  studentId: string | null;
  wrongAnswerGroups: ItemGroup[];
  referenceGroups: ReferenceScanGroup[];
  concepts: Concept[];
  cropThumbnailsByProblemId: Record<string, string>;
}) {
  const isCommon = studentId === null;
  const [selectedWrongAnswers, setSelectedWrongAnswers] = React.useState<Record<string, boolean>>(
    {},
  );
  const [selectedReferences, setSelectedReferences] = React.useState<Record<string, boolean>>({});
  const [referenceMode, setReferenceMode] = React.useState<Record<string, ReferenceMode>>({});
  const [cropDialogProblemId, setCropDialogProblemId] = React.useState<string | null>(null);
  const [conceptFilter, setConceptFilter] = React.useState("");
  const [countPerItem, setCountPerItem] = React.useState(3);
  const [error, setError] = React.useState<string | null>(null);
  const [isPending, startTransition] = React.useTransition();

  function modeOf(id: string): ReferenceMode {
    return referenceMode[id] ?? "similar";
  }
  function setModeForIds(ids: string[], mode: ReferenceMode) {
    setReferenceMode((prev) => {
      const next = { ...prev };
      for (const id of ids) next[id] = mode;
      return next;
    });
  }

  const hasNoWrongAnswers = wrongAnswerGroups.every((g) => g.items.length === 0);
  const [activeTab, setActiveTab] = React.useState<"wrong" | "reference">(() =>
    isCommon || hasNoWrongAnswers ? "reference" : "wrong",
  );

  // Per-group expand/collapse state. Absent = default (first group in each
  // section starts open, the rest start collapsed); present = explicit user
  // (or auto-select) override, keyed "wrong:<scanId>" / "ref:<scanId>".
  const [expandedOverrides, setExpandedOverrides] = React.useState<Record<string, boolean>>({});
  function isGroupExpanded(groupKey: string, isFirst: boolean) {
    return expandedOverrides[groupKey] ?? isFirst;
  }
  function toggleGroupExpanded(groupKey: string, currentlyExpanded: boolean) {
    setExpandedOverrides((prev) => ({ ...prev, [groupKey]: !currentlyExpanded }));
  }

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
    setExpandedOverrides((prev) => ({ ...prev, [`ref:${justUploadedScanId}`]: true }));
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

  // Verbatim reprints copy translated_problem/translated_answer as-is (see
  // generatePracticeSheetAction) — there's no "similar variant" concept for
  // them, so count is always 1 regardless of the shared 문항당 개수 selector,
  // which only applies to AI-rewritten (similar) items.
  function referenceSelection(itemId: string) {
    return modeOf(itemId) === "verbatim"
      ? { sourceType: "reference_verbatim" as const, itemId, count: 1 }
      : { sourceType: "reference" as const, itemId, count: countPerItem };
  }

  function handleGenerate() {
    setError(null);
    const selections = [
      ...selectedWrongAnswerIds.map((itemId) => ({
        sourceType: "wrong_answer" as const,
        itemId,
        count: countPerItem,
      })),
      ...selectedReferenceIds.map(referenceSelection),
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
    const selections = itemIds.map(referenceSelection);
    startTransition(async () => {
      const result = await generatePracticeSheetAction(studentId, selections);
      if (result && "error" in result) {
        setError(result.error);
      }
    });
  }

  return (
    <div className="space-y-8 pb-24">
      <GradingStatusPoller isGrading={isAnyScanGrading} />

      <section>
        <h2 className="text-lg font-semibold text-navy-900 font-ko" lang="ko">
          문제집 스캔하여 추가
        </h2>
        <div className="mt-3">
          <ReferenceScanUploadForm
            onUploaded={(scanId) => {
              setJustUploadedScanId(scanId);
              setActiveTab("reference");
            }}
          />
        </div>
      </section>

      <section>
        {!isCommon && (
        <div className="inline-flex rounded-full border border-navy-200 bg-navy-50 p-1">
          <button
            type="button"
            onClick={() => setActiveTab("wrong")}
            className={cn(
              "rounded-full px-4 py-1.5 text-sm font-medium font-ko transition",
              activeTab === "wrong"
                ? "bg-white text-navy-900 shadow-sm"
                : "text-navy-500 hover:text-navy-700",
            )}
          >
            오답에서 선택
            {selectedWrongAnswerIds.length > 0 && ` (${selectedWrongAnswerIds.length})`}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("reference")}
            className={cn(
              "rounded-full px-4 py-1.5 text-sm font-medium font-ko transition",
              activeTab === "reference"
                ? "bg-white text-navy-900 shadow-sm"
                : "text-navy-500 hover:text-navy-700",
            )}
          >
            스캔한 문제에서 선택
            {selectedReferenceIds.length > 0 && ` (${selectedReferenceIds.length})`}
          </button>
        </div>
        )}

        {!isCommon && activeTab === "wrong" ? (
          <div className="mt-4">
            {hasNoWrongAnswers ? (
              <div className="rounded-2xl border border-navy-100 bg-white p-6 text-center text-sm text-navy-600">
                기록된 오답이 없습니다.
              </div>
            ) : (
              <div className="space-y-4">
                {wrongAnswerGroups.map((group, index) => {
                  const groupKey = `wrong:${group.key}`;
                  const expanded = isGroupExpanded(groupKey, index === 0);
                  const allSelected = isGroupFullySelected(group.items, selectedWrongAnswers);
                  return (
                    <div
                      key={group.key}
                      className="overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-sm"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3">
                        <button
                          type="button"
                          onClick={() => toggleGroupExpanded(groupKey, expanded)}
                          className="flex flex-1 items-center gap-2 text-left"
                        >
                          <ChevronDown
                            className={cn(
                              "h-4 w-4 shrink-0 text-navy-400 transition-transform",
                              !expanded && "-rotate-90",
                            )}
                          />
                          {group.label && (
                            <span className="text-xs font-semibold uppercase tracking-wide text-navy-500">
                              {group.label}
                            </span>
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleGroupSelection(group.items, setSelectedWrongAnswers)}
                          className="shrink-0 text-xs font-medium text-navy-600 hover:underline"
                        >
                          {allSelected ? "전체 해제" : "전체 선택"}
                        </button>
                      </div>
                      {expanded && (
                        <div className="space-y-2 border-t border-navy-100 p-4">
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
                                    {item.transcribed_answer && (
                                      <span>학생 답: {item.transcribed_answer}</span>
                                    )}
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
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          <div className="mt-4">
            <div className="flex justify-end">
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

            {referenceGroups.length === 0 ? (
              <div className="mt-3 rounded-2xl border border-navy-100 bg-white p-6 text-center text-sm text-navy-600">
                아직 스캔한 문제가 없습니다.
              </div>
            ) : (
              <div className="mt-3 space-y-4">
                {referenceGroups.map((group, index) => {
                  const filteredItems = conceptFilter
                    ? group.items.filter((p) => p.concept_id === conceptFilter)
                    : group.items;
                  const isJustUploaded = group.scan.id === justUploadedScanId;
                  const isFastPathReady =
                    isJustUploaded && group.scan.status !== "grading" && filteredItems.length > 0;
                  const stuck = isGradingStuck(
                    group.scan.status,
                    group.scan.updated_at,
                    REFERENCE_EXTRACTION_STUCK_THRESHOLD_MS,
                  );
                  const groupKey = `ref:${group.scan.id}`;
                  const expanded = isGroupExpanded(groupKey, index === 0);
                  const allSelected = isGroupFullySelected(filteredItems, selectedReferences);
                  const canSelectAll =
                    filteredItems.length > 0 &&
                    group.scan.status !== "grading" &&
                    group.scan.status !== "grading_failed";

                  return (
                    <div
                      key={group.scan.id}
                      className="overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-sm"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3">
                        <button
                          type="button"
                          onClick={() => toggleGroupExpanded(groupKey, expanded)}
                          className="flex flex-1 items-center gap-2 text-left"
                        >
                          <ChevronDown
                            className={cn(
                              "h-4 w-4 shrink-0 text-navy-400 transition-transform",
                              !expanded && "-rotate-90",
                            )}
                          />
                          <span className="text-xs font-semibold uppercase tracking-wide text-navy-500">
                            {group.scan.original_filename ?? "업로드된 문제"} ·{" "}
                            {SCAN_STATE_LABELS[group.scan.status] ?? group.scan.status}
                          </span>
                        </button>
                        <div className="flex flex-wrap items-center gap-2">
                          {canSelectAll && (
                            <>
                              <button
                                type="button"
                                onClick={() => toggleGroupSelection(filteredItems, setSelectedReferences)}
                                className="text-xs font-medium text-navy-600 hover:underline"
                              >
                                {allSelected ? "전체 해제" : "전체 선택"}
                              </button>
                              <span className="text-xs text-navy-300">|</span>
                              <span className="text-xs text-navy-500">그룹 전체 방식:</span>
                              <button
                                type="button"
                                onClick={() =>
                                  setModeForIds(filteredItems.map((i) => i.id), "verbatim")
                                }
                                className="text-xs font-medium text-navy-600 hover:underline"
                              >
                                원본
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  setModeForIds(filteredItems.map((i) => i.id), "similar")
                                }
                                className="text-xs font-medium text-navy-600 hover:underline"
                              >
                                유사문제
                              </button>
                            </>
                          )}
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
                          {(group.scan.status === "grading_failed" || stuck) && (
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

                      {expanded && (
                        <div className="border-t border-navy-100 p-4">
                          {group.scan.status === "grading" && !stuck ? (
                            <div className="flex items-center gap-3 rounded-2xl border border-navy-100 bg-navy-50/50 p-4">
                              <span
                                className="h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-navy-300 border-t-navy-700"
                                aria-hidden="true"
                              />
                              <p className="text-sm text-navy-700 font-ko" lang="ko">
                                AI가 문제를 추출하고 있습니다. 완료되면 자동으로 나타납니다.
                              </p>
                            </div>
                          ) : group.scan.status === "grading_failed" || stuck ? (
                            <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
                              <p className="text-sm text-red-800">
                                {stuck
                                  ? "추출이 예상보다 오래 걸리고 있어요. 다시 시도해보시겠어요?"
                                  : "문제 추출에 실패했습니다."}
                              </p>
                              {group.scan.grading_error && (
                                <p className="mt-1 text-xs text-red-700">{group.scan.grading_error}</p>
                              )}
                            </div>
                          ) : filteredItems.length === 0 ? (
                            <div className="rounded-2xl border border-navy-100 bg-white p-4 text-center text-sm text-navy-600">
                              {conceptFilter
                                ? "이 개념에 해당하는 문제가 없습니다."
                                : "인식된 문항이 없습니다."}
                            </div>
                          ) : (
                            <div className="space-y-2">
                              {filteredItems.map((problem) => {
                                const concept = problem.concept_id
                                  ? conceptById.get(problem.concept_id)
                                  : undefined;
                                const mode = modeOf(problem.id);
                                const cropUrl = cropThumbnailsByProblemId[problem.id];
                                const needsTranslationRetry =
                                  !problem.translated_problem && !!problem.translation_error;
                                const translationPending =
                                  !problem.translated_problem && !problem.translation_error;
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
                                        <div className="flex flex-wrap items-center gap-1.5">
                                          <p className="text-xs font-semibold uppercase tracking-wide text-navy-500">
                                            {concept ? `${concept.strand} · ${concept.label_ko}` : "미분류"}
                                          </p>
                                          {problem.has_diagram && (
                                            <span
                                              className={cn(
                                                "rounded-full px-2 py-0.5 text-[10px] font-medium",
                                                cropUrl
                                                  ? "bg-teal-100 text-teal-700"
                                                  : "bg-amber-100 text-amber-700",
                                              )}
                                            >
                                              {cropUrl ? "도형 포함 · 크롭 완료" : "도형 포함 · 크롭 필요"}
                                            </span>
                                          )}
                                        </div>
                                        <p className="mt-1 text-sm text-navy-900">
                                          {problem.problem_number && (
                                            <span className="mr-2 font-medium">
                                              #{problem.problem_number}
                                            </span>
                                          )}
                                          {problem.transcribed_problem}
                                        </p>
                                        {mode === "verbatim" && (
                                          <p className="mt-1 text-xs text-navy-500">
                                            {problem.translated_problem ??
                                              (translationPending ? "번역 대기 중..." : "번역 실패")}
                                          </p>
                                        )}

                                        <div className="mt-2 flex flex-wrap items-center gap-2">
                                          <div className="inline-flex rounded-full border border-navy-200 p-0.5 text-xs">
                                            <button
                                              type="button"
                                              onClick={() => setModeForIds([problem.id], "similar")}
                                              className={cn(
                                                "rounded-full px-2 py-0.5 font-medium",
                                                mode === "similar"
                                                  ? "bg-navy-900 text-white"
                                                  : "text-navy-600",
                                              )}
                                            >
                                              유사문제
                                            </button>
                                            <button
                                              type="button"
                                              onClick={() => setModeForIds([problem.id], "verbatim")}
                                              className={cn(
                                                "rounded-full px-2 py-0.5 font-medium",
                                                mode === "verbatim"
                                                  ? "bg-navy-900 text-white"
                                                  : "text-navy-600",
                                              )}
                                            >
                                              원본 그대로
                                            </button>
                                          </div>

                                          {needsTranslationRetry && (
                                            <form
                                              action={retranslateReferenceProblemAction.bind(null, problem.id)}
                                            >
                                              <button
                                                type="submit"
                                                className="rounded-md border border-red-200 px-2 py-1 text-xs font-medium text-red-700 hover:bg-red-50"
                                              >
                                                번역 다시 시도
                                              </button>
                                            </form>
                                          )}

                                          {problem.has_diagram && (
                                            <>
                                              {cropUrl && (
                                                // eslint-disable-next-line @next/next/no-img-element -- signed Supabase Storage URL, not a static asset
                                                <img
                                                  src={cropUrl}
                                                  alt=""
                                                  className="h-10 w-10 rounded-md border border-navy-200 object-cover"
                                                />
                                              )}
                                              <button
                                                type="button"
                                                onClick={() => setCropDialogProblemId(problem.id)}
                                                className="rounded-md border border-navy-200 px-2 py-1 text-xs font-medium text-navy-600 hover:bg-navy-50"
                                              >
                                                {cropUrl ? "크롭 수정" : "크롭 추가"}
                                              </button>
                                              {cropUrl && (
                                                <form
                                                  action={deleteReferenceCropAction.bind(null, problem.id)}
                                                >
                                                  <button
                                                    type="submit"
                                                    className="rounded-md border border-red-200 px-2 py-1 text-xs font-medium text-red-700 hover:bg-red-50"
                                                  >
                                                    크롭 삭제
                                                  </button>
                                                </form>
                                              )}
                                            </>
                                          )}
                                        </div>
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
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </section>

      <div className="fixed inset-x-0 bottom-0 z-10 border-t border-navy-100 bg-white/95 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3 text-sm text-navy-700">
            <span>{totalSelected}개 선택됨</span>
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
              <span className="text-xs text-navy-400">(유사문제 항목에만 적용)</span>
            </label>
          </div>
          <div className="flex items-center gap-3">
            {error && <p className="text-xs text-red-700">{error}</p>}
            <Button
              type="button"
              onClick={handleGenerate}
              disabled={totalSelected === 0 || isPending}
            >
              {isPending ? "생성 중..." : "선택한 문항으로 생성"}
            </Button>
          </div>
        </div>
      </div>

      {cropDialogProblemId && (
        <ReferenceProblemCropDialog
          referenceProblemId={cropDialogProblemId}
          onClose={() => setCropDialogProblemId(null)}
          onSaved={() => setCropDialogProblemId(null)}
        />
      )}
    </div>
  );
}
