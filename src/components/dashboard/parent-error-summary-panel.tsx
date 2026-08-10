"use client";

import * as React from "react";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/ui/copy-button";
import { generateParentErrorSummaryAction } from "@/lib/learning-history/actions";

// AI-authored, parent-facing explanation of *why* a student is missing
// certain problems (no counts — see generate-parent-error-summary.ts's
// PERSONA). Normally arrives pre-filled via initialSummary — confirmReviewAction
// auto-generates it the moment a correction scan is confirmed — so the
// "만들기" button below is really just a fallback for when that auto-generation
// had nothing to work with yet or failed.
export function ParentErrorSummaryPanel({
  conceptLabels,
  errorTypeLabels,
  initialSummary,
  onInsertToReport,
}: {
  conceptLabels: string[];
  errorTypeLabels: string[];
  initialSummary?: string | null;
  onInsertToReport?: (text: string) => void;
}) {
  const [summary, setSummary] = React.useState<string | null>(initialSummary ?? null);
  const [error, setError] = React.useState<string | null>(null);
  const [inserted, setInserted] = React.useState(false);
  const [isGenerating, startGenerating] = useTransition();

  if (conceptLabels.length === 0) return null;

  function handleGenerate() {
    setError(null);
    startGenerating(async () => {
      const result = await generateParentErrorSummaryAction(conceptLabels, errorTypeLabels);
      if ("error" in result) {
        setError(result.error);
        return;
      }
      setSummary(result.summary);
      setInserted(false);
    });
  }

  function handleInsert() {
    if (!summary || !onInsertToReport) return;
    onInsertToReport(summary);
    setInserted(true);
  }

  return (
    <div className="rounded-2xl border border-navy-100 bg-white p-4 shadow-sm sm:p-5">
      <h3 className="text-sm font-semibold text-navy-900 font-ko" lang="ko">
        학부모용 설명
      </h3>
      <p className="mt-1 text-xs text-navy-600 font-ko" lang="ko">
        오답 학습지를 확정하면 AI가 학부모가 이해하기 쉬운 설명 문구를 자동으로 만들어드려요.
      </p>

      {!summary && (
        <Button
          type="button"
          size="md"
          variant="secondary"
          className="mt-3"
          onClick={handleGenerate}
          disabled={isGenerating}
        >
          <span className="font-ko" lang="ko">
            {isGenerating ? "설명 만드는 중..." : "학부모용 설명 만들기"}
          </span>
        </Button>
      )}

      {error && (
        <p className="mt-2 text-xs text-red-600" role="alert">
          {error}
        </p>
      )}

      {summary && (
        <div className="mt-3 space-y-3">
          <p
            className="whitespace-pre-wrap rounded-lg bg-navy-50/60 p-3 text-sm text-navy-800 font-ko"
            lang="ko"
          >
            {summary}
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <CopyButton text={summary} />
            {onInsertToReport && (
              <Button type="button" size="md" variant="secondary" onClick={handleInsert}>
                <span className="font-ko" lang="ko">
                  {inserted ? "리포트에 추가됨" : "학습 리포트에 채워넣기"}
                </span>
              </Button>
            )}
            <button
              type="button"
              onClick={handleGenerate}
              disabled={isGenerating}
              className="text-xs text-navy-500 underline underline-offset-2 hover:text-navy-700 disabled:opacity-50"
            >
              <span className="font-ko" lang="ko">
                {isGenerating ? "다시 만드는 중..." : "다시 만들기"}
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
