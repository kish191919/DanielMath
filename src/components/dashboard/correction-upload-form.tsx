"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Camera, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CameraCapture } from "@/components/dashboard/camera-capture";
import { useWorksheetUpload } from "@/components/dashboard/use-worksheet-upload";

// Compact uploader for re-photographing just the problems a teacher already
// graded and marked wrong in red pen — attaching sourceScanId is what tells
// confirmUploadAction to run AI grading (see use-worksheet-upload.ts and
// confirmUploadAction), unlike the plain full-session upload above it.
export function CorrectionUploadForm({
  studentId,
  sessionDate,
  sourceScanId,
}: {
  studentId: string;
  sessionDate: string;
  sourceScanId: string;
}) {
  const router = useRouter();
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
    const result = await submit(studentId, { sessionDate, sourceScanId });
    if (!result || !("error" in result)) {
      router.refresh();
    }
  }

  const isBusy = status !== "idle";

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-2xl border border-dashed border-navy-200 bg-navy-50/30 p-4 sm:p-5"
    >
      <div>
        <p className="text-sm font-medium text-navy-800 font-ko" lang="ko">
          오답 학습지 촬영
        </p>
        <p className="mt-1 text-xs text-navy-600 font-ko" lang="ko">
          채점 후 빨간 펜으로 X/빗금 표시한 오답 부분만 다시 촬영하거나 PDF로 올리면, AI가 표시된 문제만 추출해서
          검토할 수 있게 해드려요.
        </p>
      </div>

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
        <div className="space-y-2 rounded-md border border-navy-100 bg-white p-3">
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

      <div className="flex justify-end">
        <Button size="md" type="submit" disabled={isBusy}>
          {status === "uploading" && "업로드 중..."}
          {status === "saving" && "AI 분석 시작 중..."}
          {status === "idle" && "오답 학습지 업로드"}
        </Button>
      </div>
    </form>
  );
}
