"use client";

import * as React from "react";
import { createUploadUrlAction, confirmUploadAction } from "@/lib/learning-history/actions";
import { createBrowserSupabase } from "@/lib/supabase/browser";
import {
  assembleScanPdf,
  compressImageFileToJpeg,
  compressPdfFile,
  pdfFileToJpegBlobs,
  type CapturedPage,
} from "@/lib/images/build-scan-pdf";

const BUCKET = "worksheet-scans";

export type UploadStatus = "idle" | "uploading" | "saving";

// Shared camera/file-picker + upload plumbing behind both the top-level
// "새 업로드" form and the compact "오답 학습지 촬영" widget on a raw scan's
// review page — the two differ only in which fields they collect and what
// they pass through to confirmUploadAction.
export function useWorksheetUpload() {
  const [pickedFiles, setPickedFiles] = React.useState<File[] | null>(null);
  const [cameraPages, setCameraPages] = React.useState<CapturedPage[] | null>(null);
  const [showCamera, setShowCamera] = React.useState(false);
  const [cameraSupported, setCameraSupported] = React.useState(false);
  const [status, setStatus] = React.useState<UploadStatus>("idle");
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    // getUserMedia support can only be feature-detected client-side (SSR has
    // no `navigator`), so this one-time capability check must run in an
    // effect rather than during render.
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
    const next = e.target.files && e.target.files.length > 0 ? Array.from(e.target.files) : null;
    if (next) clearCameraPages();
    setPickedFiles(next);
  }

  function clearCameraPages() {
    cameraPages?.forEach((p) => URL.revokeObjectURL(p.previewUrl));
    setCameraPages(null);
  }

  function handleCameraComplete(pages: CapturedPage[]) {
    // Free URLs for any previously-captured pages the user deleted during a
    // "다시 촬영" (retake) session; pages still present keep their URL.
    const nextIds = new Set(pages.map((p) => p.id));
    cameraPages?.forEach((p) => {
      if (!nextIds.has(p.id)) URL.revokeObjectURL(p.previewUrl);
    });
    setPickedFiles(null);
    setCameraPages(pages);
    setShowCamera(false);
  }

  async function resolveUploadFile(): Promise<File | null> {
    if (pickedFiles && pickedFiles.length > 1) {
      // Multiple directly-picked files are merged into one PDF in selection
      // order, same output shape as a multi-page camera capture — see
      // pdfFileToJpegBlobs/assembleScanPdf in build-scan-pdf.ts.
      const pages: Blob[] = [];
      for (const f of pickedFiles) {
        if (f.type === "application/pdf") {
          pages.push(...(await pdfFileToJpegBlobs(f)));
        } else {
          pages.push(await compressImageFileToJpeg(f));
        }
      }
      const pdfBlob = await assembleScanPdf(pages);
      return new File([pdfBlob], "scan.pdf", { type: "application/pdf" });
    }
    const pickedFile = pickedFiles?.[0] ?? null;
    if (pickedFile) {
      // Camera-captured pages are already resized/compressed by
      // assembleScanPdf below; directly picked files aren't, so a multi-MB
      // phone photo or scanning-app PDF would otherwise upload at full size.
      if (pickedFile.type === "image/jpeg" || pickedFile.type === "image/png") {
        const compressed = await compressImageFileToJpeg(pickedFile);
        return new File([compressed], pickedFile.name, { type: "image/jpeg" });
      }
      if (pickedFile.type === "application/pdf") {
        const compressed = await compressPdfFile(pickedFile);
        return new File([compressed], pickedFile.name, { type: "application/pdf" });
      }
      return pickedFile;
    }
    if (cameraPages && cameraPages.length > 0) {
      const pdfBlob = await assembleScanPdf(cameraPages.map((p) => p.blob));
      return new File([pdfBlob], "scan.pdf", { type: "application/pdf" });
    }
    return null;
  }

  async function submit(
    studentId: string,
    meta: { sessionDate: string; sourceScanId?: string },
  ): Promise<{ error: string } | void> {
    setError(null);

    if (!studentId) return { error: "학생을 선택해주세요." };

    // Set before resolveUploadFile() (not after) — compressing a multi-page
    // PDF client-side can take a few seconds, and the form should be busy
    // for that whole window to prevent a double submit.
    setStatus("uploading");

    let file: File | null;
    try {
      file = await resolveUploadFile();
    } catch (err) {
      const message = err instanceof Error ? err.message : "파일을 준비하지 못했습니다.";
      setError(message);
      setStatus("idle");
      return { error: message };
    }
    if (!file) {
      setError("파일을 선택하거나 카메라로 촬영해주세요.");
      setStatus("idle");
      return { error: "파일을 선택하거나 카메라로 촬영해주세요." };
    }

    const urlResult = await createUploadUrlAction(studentId, file.type);
    if ("error" in urlResult) {
      setError(urlResult.error);
      setStatus("idle");
      return { error: urlResult.error };
    }

    const browser = createBrowserSupabase();
    const { error: uploadError } = await browser.storage
      .from(BUCKET)
      .uploadToSignedUrl(urlResult.path, urlResult.token, file);
    if (uploadError) {
      setError(uploadError.message);
      setStatus("idle");
      return { error: uploadError.message };
    }

    setStatus("saving");

    const confirmResult = await confirmUploadAction({
      scanId: urlResult.scanId,
      path: urlResult.path,
      studentId,
      originalFilename: file.name,
      mimeType: file.type,
      fileSizeBytes: file.size,
      sessionDate: meta.sessionDate,
      sourceScanId: meta.sourceScanId,
    });
    if (confirmResult && "error" in confirmResult) {
      setError(confirmResult.error);
      setStatus("idle");
      return { error: confirmResult.error };
    }
    // On success confirmUploadAction redirects — nothing further to do here.
  }

  return {
    pickedFiles,
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
  };
}
