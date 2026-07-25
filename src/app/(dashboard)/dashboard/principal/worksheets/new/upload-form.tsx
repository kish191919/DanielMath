"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Field } from "@/components/forms/field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { GRADE_LABELS } from "@/lib/students/schema";
import { createUploadUrlAction, confirmUploadAction } from "@/lib/learning-history/actions";
import { createBrowserSupabase } from "@/lib/supabase/browser";
import { todayInEasternTime } from "@/lib/dates";
import type { Student } from "@/lib/supabase/types";

const BUCKET = "worksheet-scans";

export function UploadForm({ students }: { students: Student[] }) {
  const router = useRouter();
  const [studentId, setStudentId] = React.useState("");
  const [sessionDate, setSessionDate] = React.useState(todayInEasternTime());
  const [file, setFile] = React.useState<File | null>(null);
  const [status, setStatus] = React.useState<"idle" | "uploading" | "grading">("idle");
  const [error, setError] = React.useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!studentId) {
      setError("학생을 선택해주세요.");
      return;
    }
    if (!file) {
      setError("파일을 선택해주세요.");
      return;
    }

    setStatus("uploading");

    const urlResult = await createUploadUrlAction(studentId, file.type);
    if ("error" in urlResult) {
      setError(urlResult.error);
      setStatus("idle");
      return;
    }

    const browser = createBrowserSupabase();
    const { error: uploadError } = await browser.storage
      .from(BUCKET)
      .uploadToSignedUrl(urlResult.path, urlResult.token, file);
    if (uploadError) {
      setError(uploadError.message);
      setStatus("idle");
      return;
    }

    setStatus("grading");

    const confirmResult = await confirmUploadAction({
      scanId: urlResult.scanId,
      path: urlResult.path,
      studentId,
      originalFilename: file.name,
      mimeType: file.type,
      fileSizeBytes: file.size,
      sessionDate,
    });
    if (confirmResult && "error" in confirmResult) {
      setError(confirmResult.error);
      setStatus("idle");
      return;
    }
    // On success confirmUploadAction redirects — nothing further to do here.
    router.refresh();
  }

  const isBusy = status !== "idle";

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-2xl border border-navy-100 bg-white p-6 shadow-sm sm:p-8"
    >
      <Field label="학생 / Student" required>
        <Select
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
          disabled={isBusy}
          aria-required
        >
          <option value="" disabled>
            Select student
          </option>
          {students.map((s) => (
            <option key={s.id} value={s.id}>
              {s.full_name} ({GRADE_LABELS[s.grade]})
            </option>
          ))}
        </Select>
      </Field>

      <Field label="수업 날짜 / Session Date" required>
        <Input
          type="date"
          value={sessionDate}
          onChange={(e) => setSessionDate(e.target.value)}
          disabled={isBusy}
          aria-required
        />
      </Field>

      <Field label="파일 / File (사진 또는 PDF)" required>
        <input
          type="file"
          accept="image/jpeg,image/png,application/pdf"
          disabled={isBusy}
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="block w-full text-sm text-navy-700 file:mr-4 file:rounded-md file:border-0 file:bg-navy-900 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-navy-800"
        />
      </Field>

      {error && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
          {error}
        </p>
      )}

      <div className="flex items-center justify-end gap-3 border-t border-navy-100 pt-5">
        <Button size="md" type="submit" disabled={isBusy}>
          {status === "uploading" && "업로드 중..."}
          {status === "grading" && "AI 채점 중..."}
          {status === "idle" && "업로드 및 채점 시작"}
        </Button>
      </div>
    </form>
  );
}
