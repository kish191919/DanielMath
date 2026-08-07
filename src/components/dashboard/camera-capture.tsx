"use client";

import * as React from "react";
import { Camera, Trash2, X, RotateCcw, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { compressFrameToJpeg, type CapturedPage } from "@/lib/images/build-scan-pdf";

interface CameraCaptureProps {
  initialPages?: CapturedPage[];
  onComplete: (pages: CapturedPage[]) => void;
  onCancel: () => void;
}

type CameraError = "denied" | "unavailable" | null;

export function CameraCapture({ initialPages, onComplete, onCancel }: CameraCaptureProps) {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const streamRef = React.useRef<MediaStream | null>(null);
  const [pages, setPages] = React.useState<CapturedPage[]>(initialPages ?? []);
  // Pages carried in from a prior session are owned by the parent (upload-form)
  // — only pages captured fresh in *this* session should have their object
  // URLs revoked here; the parent decides what to do with the rest.
  const initialIdsRef = React.useRef(new Set(initialPages?.map((p) => p.id) ?? []));
  const [cameraError, setCameraError] = React.useState<CameraError>(null);
  const [previewIndex, setPreviewIndex] = React.useState<number | null>(null);
  const [validationMessage, setValidationMessage] = React.useState<string | null>(null);
  const [capturing, setCapturing] = React.useState(false);

  React.useEffect(() => {
    let cancelled = false;

    navigator.mediaDevices
      ?.getUserMedia({ video: { facingMode: "environment" }, audio: false })
      .then((stream) => {
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        const name = err instanceof Error ? err.name : "";
        setCameraError(name === "NotAllowedError" || name === "PermissionDeniedError" ? "denied" : "unavailable");
      });

    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    };
  }, []);

  React.useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  function stopStream() {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }

  async function handleCapture() {
    const video = videoRef.current;
    if (!video || video.videoWidth === 0) return;

    setCapturing(true);
    try {
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.drawImage(video, 0, 0);

      const blob = await compressFrameToJpeg(canvas);
      const page: CapturedPage = {
        id: crypto.randomUUID(),
        blob,
        previewUrl: URL.createObjectURL(blob),
      };
      setPages((prev) => [...prev, page]);
      setValidationMessage(null);
    } finally {
      setCapturing(false);
    }
  }

  function deletePage(id: string) {
    setPages((prev) => {
      const target = prev.find((p) => p.id === id);
      // Only free URLs for pages captured this session; parent-owned
      // (initial) pages stay valid in case the session is cancelled.
      if (target && !initialIdsRef.current.has(id)) URL.revokeObjectURL(target.previewUrl);
      return prev.filter((p) => p.id !== id);
    });
    setPreviewIndex(null);
  }

  function handleDone() {
    if (pages.length === 0) {
      setValidationMessage("최소 1장을 촬영해주세요.");
      return;
    }
    stopStream();
    onComplete(pages);
  }

  function handleCancel() {
    pages.forEach((p) => {
      if (!initialIdsRef.current.has(p.id)) URL.revokeObjectURL(p.previewUrl);
    });
    stopStream();
    onCancel();
  }

  if (cameraError) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-black/90 px-6 text-center">
        <p className="font-ko text-white" lang="ko">
          {cameraError === "denied"
            ? "카메라 접근 권한이 거부되었습니다. 브라우저 설정에서 카메라 권한을 허용해주세요."
            : "이 기기에서는 카메라를 사용할 수 없습니다."}
        </p>
        <Button variant="secondary" onClick={onCancel}>
          파일 선택으로 전환
        </Button>
      </div>
    );
  }

  const previewPage = previewIndex !== null ? pages[previewIndex] : null;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-black"
      style={{
        paddingTop: "env(safe-area-inset-top)",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      <div className="flex items-center justify-between px-4 py-3">
        <span className="font-ko text-sm text-white" lang="ko">
          촬영한 페이지 {pages.length}장
        </span>
        <button
          type="button"
          onClick={handleCancel}
          aria-label="취소"
          className="rounded-full bg-black/40 p-2 text-white"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="relative flex-1 overflow-hidden">
        <video ref={videoRef} playsInline muted autoPlay className="h-full w-full object-cover" />

        {previewPage && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/95 p-4">
            {/* eslint-disable-next-line @next/next/no-img-element -- local blob URL preview, not a static asset */}
            <img src={previewPage.previewUrl} alt="" className="max-h-[70vh] max-w-full rounded-md object-contain" />
            <div className="flex gap-3">
              <Button
                variant="secondary"
                onClick={() => {
                  deletePage(previewPage.id);
                }}
              >
                <RotateCcw className="h-4 w-4" />
                다시 찍기
              </Button>
              <Button variant="primary" onClick={() => setPreviewIndex(null)}>
                닫기
              </Button>
            </div>
          </div>
        )}
      </div>

      {validationMessage && (
        <p className="px-4 py-1 text-center font-ko text-sm text-red-400" lang="ko">
          {validationMessage}
        </p>
      )}

      <div className="space-y-3 px-4 py-3">
        {pages.length > 0 && (
          <div className="flex gap-2 overflow-x-auto pb-1 touch-pan-x">
            {pages.map((page, i) => (
              <button
                key={page.id}
                type="button"
                onClick={() => setPreviewIndex(i)}
                className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md border border-white/30"
              >
                {/* eslint-disable-next-line @next/next/no-img-element -- local blob URL thumbnail, not a static asset */}
                <img src={page.previewUrl} alt="" className="h-full w-full object-cover" />
                <span
                  role="button"
                  tabIndex={-1}
                  onClick={(e) => {
                    e.stopPropagation();
                    deletePage(page.id);
                  }}
                  className="absolute right-0.5 top-0.5 rounded-full bg-black/70 p-0.5 text-white"
                >
                  <Trash2 className="h-3 w-3" />
                </span>
              </button>
            ))}
          </div>
        )}

        <div className="flex items-center justify-center gap-6">
          <button
            type="button"
            onClick={handleCapture}
            disabled={capturing}
            aria-label="촬영"
            className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-white bg-white/20 disabled:opacity-50"
          >
            <Camera className="h-7 w-7 text-white" />
          </button>
        </div>

        <div className="flex items-center justify-end gap-3">
          <Button variant="secondary" onClick={handleCancel}>
            취소
          </Button>
          <Button variant="primary" onClick={handleDone}>
            <Check className="h-4 w-4" />
            완료
          </Button>
        </div>
      </div>
    </div>
  );
}
