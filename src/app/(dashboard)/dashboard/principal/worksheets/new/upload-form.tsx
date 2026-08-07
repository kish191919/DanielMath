"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Camera, Trash2 } from "lucide-react";
import { Field } from "@/components/forms/field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { GRADE_LABELS } from "@/lib/students/schema";
import { todayInEasternTime } from "@/lib/dates";
import { CameraCapture } from "@/components/dashboard/camera-capture";
import { useWorksheetUpload } from "@/components/dashboard/use-worksheet-upload";
import type { Student } from "@/lib/supabase/types";

export function UploadForm({ students }: { students: Student[] }) {
  const router = useRouter();
  const [studentId, setStudentId] = React.useState("");
  const [sessionDate, setSessionDate] = React.useState(todayInEasternTime());
  const {
    cameraPages,
    showCamera,
    setShowCamera,
    cameraSupported,
    status,
    error,
    handleFileChange,
    clearCameraPages,
    handleCameraComplete,
    submit,
  } = useWorksheetUpload();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const result = await submit(studentId, { sessionDate });
    if (!result || !("error" in result)) {
      // On success confirmUploadAction redirects — nothing further to do.
      router.refresh();
    }
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
        <p className="text-xs text-navy-500 font-ko" lang="ko">
          그날 학생이 푼 학습지 전체를 빠짐없이 촬영하거나, 이미 스캔된 파일을 선택하세요. 이 업로드는 AI 채점 없이
          그대로 저장됩니다 — 채점 후 오답이 있으면 업로드 완료 화면에서 오답만 다시 촬영해 AI 분석을 받을 수 있어요.
        </p>

        {cameraSupported && (
          <Button
            type="button"
            variant="secondary"
            size="md"
            disabled={isBusy}
            onClick={() => setShowCamera(true)}
          >
            <Camera className="h-4 w-4" />
            카메라로 촬영
          </Button>
        )}

        <input
          type="file"
          accept="image/jpeg,image/png,application/pdf"
          disabled={isBusy}
          onChange={handleFileChange}
          className="block w-full text-sm text-navy-700 file:mr-4 file:rounded-md file:border-0 file:bg-navy-900 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-navy-800"
        />

        {cameraPages && cameraPages.length > 0 && (
          <div className="space-y-2 rounded-md border border-navy-100 bg-navy-50/50 p-3">
            <p className="font-ko text-xs text-navy-700" lang="ko">
              촬영된 페이지 {cameraPages.length}장
            </p>
            <div className="flex gap-2 overflow-x-auto pb-1 touch-pan-x">
              {cameraPages.map((page) => (
                // eslint-disable-next-line @next/next/no-img-element -- local blob URL thumbnail, not a static asset
                <img
                  key={page.id}
                  src={page.previewUrl}
                  alt=""
                  className="h-14 w-14 shrink-0 rounded-md border border-navy-200 object-cover"
                />
              ))}
            </div>
            <div className="flex gap-3">
              <Button
                type="button"
                variant="secondary"
                size="md"
                disabled={isBusy}
                onClick={() => setShowCamera(true)}
              >
                다시 촬영
              </Button>
              <Button type="button" variant="ghost" size="md" disabled={isBusy} onClick={clearCameraPages}>
                <Trash2 className="h-4 w-4" />
                전체 삭제
              </Button>
            </div>
          </div>
        )}
      </Field>

      {showCamera && (
        <CameraCapture
          initialPages={cameraPages ?? undefined}
          onComplete={handleCameraComplete}
          onCancel={() => setShowCamera(false)}
        />
      )}

      {error && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
          {error}
        </p>
      )}

      <div className="flex items-center justify-end gap-3 border-t border-navy-100 pt-5">
        <Button size="md" type="submit" disabled={isBusy}>
          {status === "uploading" && "업로드 중..."}
          {status === "saving" && "저장 중..."}
          {status === "idle" && "업로드"}
        </Button>
      </div>
    </form>
  );
}
