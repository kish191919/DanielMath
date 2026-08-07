"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Camera, Trash2 } from "lucide-react";
import { Field } from "@/components/forms/field";
import { Button } from "@/components/ui/button";
import { createReferenceUploadUrlAction, confirmReferenceUploadAction } from "@/lib/problem-bank/actions";
import { createBrowserSupabase } from "@/lib/supabase/browser";
import {
  assembleScanPdf,
  compressImageFileToJpeg,
  type CapturedPage,
} from "@/lib/images/build-scan-pdf";
import { CameraCapture } from "@/components/dashboard/camera-capture";

const BUCKET = "problem-bank";

// Embedded directly in PracticeSheetGeneratorWorkspace (practice-sheets/new)
// instead of a standalone problem-bank upload page — scanning a workbook
// page and generating similar problems now happen in one place. On success
// this notifies the parent with the new scan's id so it can auto-select
// that scan's items once extraction finishes (see the "이 스캔으로 바로
// 생성" fast path in the workspace component).
export function ReferenceScanUploadForm({ onUploaded }: { onUploaded: (scanId: string) => void }) {
  const router = useRouter();
  const [pickedFile, setPickedFile] = React.useState<File | null>(null);
  const [cameraPages, setCameraPages] = React.useState<CapturedPage[] | null>(null);
  const [showCamera, setShowCamera] = React.useState(false);
  const [cameraSupported, setCameraSupported] = React.useState(false);
  const [status, setStatus] = React.useState<"idle" | "uploading" | "grading">("idle");
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCameraSupported(typeof navigator !== "undefined" && !!navigator.mediaDevices?.getUserMedia);
  }, []);

  React.useEffect(() => {
    return () => {
      cameraPages?.forEach((p) => URL.revokeObjectURL(p.previewUrl));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- cleanup only runs on unmount, not on every cameraPages change
  }, []);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const next = e.target.files?.[0] ?? null;
    if (next) clearCameraPages();
    setPickedFile(next);
  }

  function clearCameraPages() {
    cameraPages?.forEach((p) => URL.revokeObjectURL(p.previewUrl));
    setCameraPages(null);
  }

  function handleCameraComplete(pages: CapturedPage[]) {
    const nextIds = new Set(pages.map((p) => p.id));
    cameraPages?.forEach((p) => {
      if (!nextIds.has(p.id)) URL.revokeObjectURL(p.previewUrl);
    });
    setPickedFile(null);
    setCameraPages(pages);
    setShowCamera(false);
  }

  async function resolveUploadFile(): Promise<File | null> {
    if (pickedFile) {
      if (pickedFile.type === "image/jpeg" || pickedFile.type === "image/png") {
        const compressed = await compressImageFileToJpeg(pickedFile);
        return new File([compressed], pickedFile.name, { type: "image/jpeg" });
      }
      return pickedFile;
    }
    if (cameraPages && cameraPages.length > 0) {
      const pdfBlob = await assembleScanPdf(cameraPages.map((p) => p.blob));
      return new File([pdfBlob], "problem.pdf", { type: "application/pdf" });
    }
    return null;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    let file: File | null;
    try {
      file = await resolveUploadFile();
    } catch (err) {
      setError(err instanceof Error ? err.message : "파일을 준비하지 못했습니다.");
      return;
    }
    if (!file) {
      setError("파일을 선택하거나 카메라로 촬영해주세요.");
      return;
    }

    setStatus("uploading");

    const urlResult = await createReferenceUploadUrlAction(file.type);
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

    const confirmResult = await confirmReferenceUploadAction({
      scanId: urlResult.scanId,
      path: urlResult.path,
      originalFilename: file.name,
      mimeType: file.type,
      fileSizeBytes: file.size,
    });
    if (confirmResult && "error" in confirmResult) {
      setError(confirmResult.error);
      setStatus("idle");
      return;
    }

    setPickedFile(null);
    clearCameraPages();
    setStatus("idle");
    onUploaded(urlResult.scanId);
    router.refresh();
  }

  const isBusy = status !== "idle";

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-2xl border border-navy-100 bg-white p-6 shadow-sm sm:p-8"
    >
      <Field label="사진으로 문제 추가 (사진 또는 PDF)" required>
        <p className="text-xs text-navy-500 font-ko" lang="ko">
          카메라로 여러 장 촬영하거나, 이미 스캔된 파일을 선택하세요. 한 장에 문제가 여러 개
          있으면 전부 추출되어 아래 목록에 나타납니다.
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
          {status === "grading" && "AI 추출 중..."}
          {status === "idle" && "업로드 및 추출 시작"}
        </Button>
      </div>
    </form>
  );
}
