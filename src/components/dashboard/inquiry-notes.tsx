"use client";

import * as React from "react";
import { useActionState } from "react";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  addInquiryNoteAction,
  updateInquiryNoteAction,
  deleteInquiryNoteAction,
  type InquiryNoteFormState,
} from "@/lib/inquiries/actions";
import type { InquiryNote } from "@/lib/supabase/types";

export function InquiryNotes({
  inquiryId,
  notes,
}: {
  inquiryId: string;
  notes: InquiryNote[];
}) {
  return (
    <details className="group mt-3 border-t border-navy-100 pt-3">
      <summary className="flex w-fit cursor-pointer list-none items-center gap-1 text-xs font-medium text-navy-600 hover:text-navy-800 [&::-webkit-details-marker]:hidden">
        <ChevronRight className="h-3.5 w-3.5 shrink-0 transition-transform group-open:rotate-90" />
        상담 기록 보기{notes.length > 0 && ` (${notes.length})`}
      </summary>

      <div className="mt-3 space-y-3">
        <AddNoteForm inquiryId={inquiryId} />

        {notes.length === 0 ? (
          <p className="text-xs text-navy-500">아직 남긴 상담 기록이 없습니다.</p>
        ) : (
          <div className="space-y-2">
            {notes.map((note) => (
              <NoteItem key={note.id} note={note} />
            ))}
          </div>
        )}
      </div>
    </details>
  );
}

function NoteItem({ note }: { note: InquiryNote }) {
  const [isEditing, setIsEditing] = React.useState(false);
  const [fieldError, setFieldError] = React.useState<string | undefined>();
  const [isPending, startTransition] = React.useTransition();

  function handleSave(formData: FormData) {
    startTransition(async () => {
      const result = await updateInquiryNoteAction(note.id, null, formData);
      if (result.success) {
        setFieldError(undefined);
        setIsEditing(false);
      } else {
        setFieldError(result.fieldErrors?.note ?? result.error);
      }
    });
  }

  if (isEditing) {
    return (
      <form
        action={handleSave}
        className="space-y-2 rounded-lg border border-navy-100 bg-navy-50/40 p-3"
      >
        <Textarea name="note" defaultValue={note.note} maxLength={2000} className="min-h-20 text-xs" />
        {fieldError && (
          <p className="text-xs text-red-600" role="alert">
            {fieldError}
          </p>
        )}
        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="secondary"
            size="md"
            className="h-7 px-2 text-xs"
            onClick={() => setIsEditing(false)}
          >
            취소
          </Button>
          <Button type="submit" size="md" className="h-7 px-2 text-xs" disabled={isPending}>
            {isPending ? "저장 중..." : "저장"}
          </Button>
        </div>
      </form>
    );
  }

  return (
    <div className="rounded-lg border border-navy-100 bg-white p-3">
      <p className="whitespace-pre-line text-xs text-navy-800 font-ko" lang="ko">
        {note.note}
      </p>
      <div className="mt-2 flex items-center justify-between">
        <p className="text-[11px] text-navy-500">
          {new Date(note.created_at).toLocaleString("ko-KR")}
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="text-[11px] font-medium text-navy-600 hover:text-navy-900"
          >
            수정
          </button>
          <form action={deleteInquiryNoteAction.bind(null, note.id)}>
            <button type="submit" className="text-[11px] font-medium text-red-600 hover:text-red-800">
              삭제
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function AddNoteForm({ inquiryId }: { inquiryId: string }) {
  const action = addInquiryNoteAction.bind(null, inquiryId);
  const [state, formAction, isPending] = useActionState<InquiryNoteFormState | null, FormData>(
    action,
    null,
  );
  const formRef = React.useRef<HTMLFormElement>(null);

  React.useEffect(() => {
    if (state?.success) formRef.current?.reset();
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="space-y-2">
      <Textarea name="note" placeholder="상담 내용을 기록하세요" maxLength={2000} className="min-h-16 text-xs" />
      {state?.fieldErrors?.note && (
        <p className="text-xs text-red-600" role="alert">
          {state.fieldErrors.note}
        </p>
      )}
      <div className="flex justify-end">
        <Button type="submit" size="md" className="h-7 px-3 text-xs" disabled={isPending}>
          {isPending ? "저장 중..." : "기록 추가"}
        </Button>
      </div>
    </form>
  );
}
