"use client";

import * as React from "react";
import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  addSessionNoteAction,
  publishSessionNoteAction,
  type SessionNoteFormState,
  type PublishSessionNoteState,
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
  if (existingNote) {
    return (
      <PublishNoteForm studentId={studentId} scanId={scanId ?? ""} existingNote={existingNote} />
    );
  }
  return (
    <CreateNoteForm
      studentId={studentId}
      scanId={scanId}
      sessionDate={sessionDate}
      initialLanguage={initialLanguage}
    />
  );
}

function CreateNoteForm({
  studentId,
  scanId,
  sessionDate,
  initialLanguage,
}: {
  studentId: string;
  scanId?: string;
  sessionDate: string;
  initialLanguage: SessionNoteLanguage;
}) {
  const action = addSessionNoteAction.bind(null, studentId);
  const [state, formAction, isPending] = useActionState<SessionNoteFormState | null, FormData>(
    action,
    null,
  );
  const [language, setLanguage] = React.useState<SessionNoteLanguage>(initialLanguage);
  const formRef = React.useRef<HTMLFormElement>(null);

  React.useEffect(() => {
    if (state?.success) formRef.current?.reset();
  }, [state]);

  return (
    <form
      ref={formRef}
      action={formAction}
      className="space-y-3 rounded-2xl border border-navy-100 bg-white p-4 shadow-sm sm:p-5"
    >
      <input type="hidden" name="scan_id" value={scanId ?? ""} />
      <input type="hidden" name="session_date" value={sessionDate} />
      <input type="hidden" name="language" value={language} />
      <div className="flex items-center justify-between gap-3">
        <label className="block text-sm font-medium text-navy-800">오늘의 학습 리포트</label>
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
      <Textarea
        name="note"
        placeholder={`예:
학습 결과
오늘 20문제 중 18개를 정확히 풀었습니다 (정답률 90%).

잘한 점
분수 개념을 확실히 이해했습니다.

보완할 점
이분모 덧셈에서 오답이 있어 추가 연습이 필요합니다.

숙제
4학년 IXL C단원 풀어오기`}
        maxLength={2000}
      />
      <p className="text-xs text-navy-500 font-ko" lang="ko">
        저장하면 학부모 채팅방과 SMS로 즉시 전달됩니다.
      </p>
      {state?.fieldErrors?.note && (
        <p className="text-xs text-red-600" role="alert">
          {state.fieldErrors.note}
        </p>
      )}
      {state?.success && <p className="text-xs text-green-700">저장 및 전달되었습니다.</p>}
      <div className="flex justify-end">
        <Button size="md" type="submit" disabled={isPending}>
          {isPending ? "전달 중..." : "저장 후 학부모에게 전달"}
        </Button>
      </div>
    </form>
  );
}

function PublishNoteForm({
  studentId,
  scanId,
  existingNote,
}: {
  studentId: string;
  scanId: string;
  existingNote: SessionNote;
}) {
  const action = publishSessionNoteAction.bind(
    null,
    existingNote.id,
    studentId,
    scanId,
    existingNote.note,
  );
  const [state, formAction, isPending] = useActionState<PublishSessionNoteState | null, FormData>(
    action,
    null,
  );
  const isDraft = !existingNote.confirmed;

  return (
    <form
      action={formAction}
      className="space-y-3 rounded-2xl border border-navy-100 bg-white p-4 shadow-sm sm:p-5"
    >
      <div className="flex items-center justify-between gap-3">
        <label className="block text-sm font-medium text-navy-800">오늘의 학습 리포트</label>
        {isDraft && existingNote.source === "ai" && (
          <span className="shrink-0 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800">
            AI 초안 — 검토 후 전달해주세요
          </span>
        )}
      </div>
      <Textarea
        name="note"
        defaultValue={existingNote.note}
        maxLength={2000}
        className="min-h-48"
      />
      {state?.fieldErrors?.note && (
        <p className="text-xs text-red-600" role="alert">
          {state.fieldErrors.note}
        </p>
      )}
      {state?.success && <p className="text-xs text-green-700">저장되었습니다.</p>}
      <div className="flex justify-end">
        <Button size="md" type="submit" disabled={isPending}>
          {isPending ? "저장 중..." : isDraft ? "학부모에게 전달" : "메모 수정"}
        </Button>
      </div>
    </form>
  );
}
