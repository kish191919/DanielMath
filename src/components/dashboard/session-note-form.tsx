"use client";

import * as React from "react";
import { useActionState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  saveSessionNoteAction,
  sendSessionNoteAction,
  generateParentReportDraftAction,
  type SessionNoteFormState,
} from "@/lib/learning-history/actions";
import type { SessionNote, SessionNoteLanguage } from "@/lib/supabase/types";

export function SessionNoteForm({
  studentId,
  scanId,
  sessionDate,
  existingNote,
  initialLanguage = "ko",
}: {
  studentId: string;
  scanId?: string;
  sessionDate: string;
  existingNote?: SessionNote | null;
  initialLanguage?: SessionNoteLanguage;
}) {
  const noteId = existingNote?.id ?? null;
  const saveAction = saveSessionNoteAction.bind(null, noteId, studentId, scanId ?? "", sessionDate);
  const sendAction = sendSessionNoteAction.bind(null, noteId, studentId, scanId ?? "", sessionDate);

  const [saveState, saveFormAction, isSaving] = useActionState<SessionNoteFormState | null, FormData>(
    saveAction,
    null,
  );
  const [sendState, sendFormAction, isSending] = useActionState<SessionNoteFormState | null, FormData>(
    sendAction,
    null,
  );
  const [language, setLanguage] = React.useState<SessionNoteLanguage>(
    existingNote?.language ?? initialLanguage,
  );
  const [note, setNote] = React.useState(existingNote?.note ?? "");
  // Snapshot taken right before an AI draft overwrites the textarea, so a
  // teacher who doesn't like the draft can get their own wording back
  // instead of retyping it. Cleared on any manual edit or once superseded by
  // a newer draft.
  const [preDraftNote, setPreDraftNote] = React.useState<{
    note: string;
    language: SessionNoteLanguage;
  } | null>(null);
  const [draftError, setDraftError] = React.useState<string | null>(null);
  const [isDrafting, startDraftTransition] = useTransition();

  const isBusy = isSaving || isSending;
  const state = sendState?.success || sendState?.error ? sendState : saveState;
  const isSent = existingNote?.confirmed ?? false;

  function handleGenerateDraft() {
    setDraftError(null);
    startDraftTransition(async () => {
      const result = await generateParentReportDraftAction(note);
      if ("error" in result) {
        setDraftError(result.error);
        return;
      }
      setPreDraftNote({ note, language });
      setNote(result.draft);
      setLanguage("en");
    });
  }

  function handleRevertDraft() {
    if (!preDraftNote) return;
    setNote(preDraftNote.note);
    setLanguage(preDraftNote.language);
    setPreDraftNote(null);
  }

  return (
    <form className="space-y-3 rounded-2xl border border-navy-100 bg-white p-4 shadow-sm sm:p-5">
      <input type="hidden" name="language" value={language} />
      <div className="flex items-center justify-between gap-3">
        <label className="block text-sm font-medium text-navy-800">오늘의 학습 리포트</label>
        <div className="flex items-center gap-2">
          {existingNote && (
            <span
              className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                isSent ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"
              }`}
            >
              {isSent ? "학부모에게 전달됨" : "저장됨 — 아직 전달 전"}
            </span>
          )}
          <div className="flex gap-2">
            {(["ko", "en"] as const).map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setLanguage(option)}
                className={
                  "rounded-full px-2.5 py-1 text-xs font-medium transition-colors " +
                  (language === option
                    ? "bg-navy-700 text-white"
                    : "bg-navy-50 text-navy-700 hover:bg-navy-100")
                }
              >
                {option === "ko" ? "한국어" : "English"}
              </button>
            ))}
          </div>
        </div>
      </div>
      <Textarea
        name="note"
        value={note}
        onChange={(e) => {
          setNote(e.target.value);
          setPreDraftNote(null);
        }}
        placeholder={`예:
학습 결과
오늘 분수 단원 문제를 풀었고, 전반적으로 잘 이해했습니다.

잘한 점
분수 개념을 확실히 이해했습니다.

보완할 점
이분모 덧셈에서 오답이 있어 추가 연습이 필요합니다.

숙제
4학년 IXL C단원 풀어오기`}
        maxLength={2000}
        className="min-h-48"
      />
      <p className="text-xs text-navy-500 font-ko" lang="ko">
        저장은 학부모에게 보이지 않아요 — 나중에 다시 접속해서 이어 쓸 수 있습니다. 다 작성하면 &quot;학부모에게
        전달&quot;을 눌러야 채팅과 SMS로 실제 발송됩니다.
      </p>
      <div className="flex flex-wrap items-center gap-3">
        <Button
          size="md"
          variant="secondary"
          type="button"
          onClick={handleGenerateDraft}
          disabled={isBusy || isDrafting || !note.trim()}
        >
          {isDrafting ? "영어 초안 작성 중..." : "AI로 학부모 안내문 영어 초안 작성"}
        </Button>
        {preDraftNote && (
          <button
            type="button"
            onClick={handleRevertDraft}
            className="text-xs text-navy-500 underline underline-offset-2 hover:text-navy-700"
          >
            번역 전 내용으로 되돌리기
          </button>
        )}
      </div>
      {draftError && (
        <p className="text-xs text-red-600" role="alert">
          {draftError}
        </p>
      )}
      {state?.fieldErrors?.note && (
        <p className="text-xs text-red-600" role="alert">
          {state.fieldErrors.note}
        </p>
      )}
      {saveState?.success && !sendState?.success && (
        <p className="text-xs text-green-700">저장되었습니다.</p>
      )}
      {sendState?.success && <p className="text-xs text-green-700">학부모에게 전달되었습니다.</p>}
      <div className="flex justify-end gap-2">
        <Button
          size="md"
          variant="secondary"
          type="submit"
          formAction={saveFormAction}
          disabled={isBusy}
        >
          {isSaving ? "저장 중..." : "저장"}
        </Button>
        <Button size="md" type="submit" formAction={sendFormAction} disabled={isBusy}>
          {isSending ? "전달 중..." : "학부모에게 전달"}
        </Button>
      </div>
    </form>
  );
}
