"use client";

import * as React from "react";
import { ParentErrorSummaryPanel } from "@/components/dashboard/parent-error-summary-panel";
import { SessionNoteForm, type SessionNoteFormHandle } from "@/components/dashboard/session-note-form";
import type { SessionNote, SessionNoteLanguage } from "@/lib/supabase/types";

// Wires the AI parent-explanation panel to the session-note textarea below
// it — both are client components, so this is where the "채워넣기" ref hop
// happens. ConceptErrorAnalysis (the deterministic count-based card above
// this) stays a plain server component and isn't part of this tree.
export function ParentReportWorkspace({
  conceptLabels,
  errorTypeLabels,
  studentId,
  scanId,
  sessionDate,
  existingNote,
  initialLanguage,
}: {
  conceptLabels: string[];
  errorTypeLabels: string[];
  studentId: string;
  scanId?: string;
  sessionDate: string;
  existingNote?: SessionNote | null;
  initialLanguage?: SessionNoteLanguage;
}) {
  const noteFormRef = React.useRef<SessionNoteFormHandle>(null);

  return (
    <div className="space-y-4">
      <ParentErrorSummaryPanel
        conceptLabels={conceptLabels}
        errorTypeLabels={errorTypeLabels}
        onInsertToReport={(text) => noteFormRef.current?.insertNote(text)}
      />
      <SessionNoteForm
        ref={noteFormRef}
        studentId={studentId}
        scanId={scanId}
        sessionDate={sessionDate}
        existingNote={existingNote}
        initialLanguage={initialLanguage}
      />
    </div>
  );
}
