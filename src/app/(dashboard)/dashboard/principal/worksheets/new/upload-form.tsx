"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Camera, Trash2 } from "lucide-react";
import { Field, Radio } from "@/components/forms/field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { GRADE_LABELS } from "@/lib/students/schema";
import { createUploadUrlAction, confirmUploadAction } from "@/lib/learning-history/actions";
import { createBrowserSupabase } from "@/lib/supabase/browser";
import { todayInEasternTime } from "@/lib/dates";
import {
  assembleScanPdf,
  compressImageFileToJpeg,
  compressPdfFile,
  type CapturedPage,
} from "@/lib/images/build-scan-pdf";
import { CameraCapture } from "./camera-capture";
import type { Student } from "@/lib/supabase/types";

const BUCKET = "worksheet-scans";

export function UploadForm({ students }: { students: Student[] }) {
  const router = useRouter();
  const [studentId, setStudentId] = React.useState("");
  const [sessionDate, setSessionDate] = React.useState(todayInEasternTime());
  const [isTargetedReview, setIsTargetedReview] = React.useState(false);
  const [pickedFile, setPickedFile] = React.useState<File | null>(null);
  const [cameraPages, setCameraPages] = React.useState<CapturedPage[] | null>(null);
  const [showCamera, setShowCamera] = React.useState(false);
  const [cameraSupported, setCameraSupported] = React.useState(false);
  const [status, setStatus] = React.useState<"idle" | "uploading" | "grading">("idle");
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
    const next = e.target.files?.[0] ?? null;
    if (next) clearCameraPages();
    setPickedFile(next);
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
    setPickedFile(null);
    setCameraPages(pages);
    setShowCamera(false);
  }

  async function resolveUploadFile(): Promise<File | null> {
    if (pickedFile) {
      // Camera-captured pages are already resized/compressed by
      // assembleScanPdf below; directly picked files aren't, so a multi-MB
      // phone photo or scanning-app PDF would otherwise upload (and get
      // graded) at full size.
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!studentId) {
      setError("학생을 선택해주세요.");
      return;
    }

    // Set before resolveUploadFile() (not after) — compressing a multi-page
    // PDF client-side can take a few seconds, and the form should be busy
    // for that whole window to prevent a double submit.
    setStatus("uploading");

    let file: File | null;
    try {
      file = await resolveUploadFile();
    } catch (err) {
      setError(err instanceof Error ? err.message : "파일을 준비하지 못했습니다.");
      setStatus("idle");
      return;
    }
    if (!file) {
      setError("파일을 선택하거나 카메라로 촬영해주세요.");
      setStatus("idle");
      return;
    }

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
      isTargetedReview,
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

      <Field label="촬영 범위 / Coverage">
        <div className="flex flex-col gap-2 sm:flex-row">
          <Radio
            name="isTargetedReview"
            checked={!isTargetedReview}
            disabled={isBusy}
            onChange={() => setIsTargetedReview(false)}
            label="정기 학습 전체 (빠짐없이 촬영)"
          />
          <Radio
            name="isTargetedReview"
            checked={isTargetedReview}
            disabled={isBusy}
            onChange={() => setIsTargetedReview(true)}
            label="오답/복습 위주 (일부만 촬영)"
          />
        </div>
        <p className="text-xs text-navy-500 font-ko" lang="ko">
          &quot;오답/복습 위주&quot;로 표시하면 학부모 진행 상황 페이지의 정답률에 참고 표시가 함께 나타나요.
        </p>
      </Field>

      <Field label="파일 / File (사진 또는 PDF)" required>
        <p className="text-xs text-navy-500 font-ko" lang="ko">
          카메라로 여러 장 촬영하거나, 이미 스캔된 파일을 선택하세요.
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
          {status === "grading" && "AI 채점 중..."}
          {status === "idle" && "업로드 및 채점 시작"}
        </Button>
      </div>
    </form>
  );
}
