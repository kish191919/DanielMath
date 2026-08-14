"use client";

import * as React from "react";
import { Camera, Trash2, X, RotateCcw, RotateCw, Check } from "lucide-react";
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
  const [devices, setDevices] = React.useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = React.useState<string | null>(null);
  const [activeDeviceId, setActiveDeviceId] = React.useState<string | null>(null);
  const [rotation, setRotation] = React.useState<0 | 90 | 180 | 270>(0);
  // Continuity Camera streams the iPhone's raw sensor orientation with no
  // EXIF-style correction, so it consistently arrives rotated. Auto-apply
  // the correction once per session; a manual rotate afterward is respected.
  const autoRotationAppliedRef = React.useRef(false);
  const previewContainerRef = React.useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = React.useState({ width: 0, height: 0 });

  React.useLayoutEffect(() => {
    const el = previewContainerRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    setContainerSize({ width: rect.width, height: rect.height });

    const observer = new ResizeObserver(([entry]) => {
      const box = entry.contentRect;
      setContainerSize({ width: box.width, height: box.height });
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  React.useEffect(() => {
    let cancelled = false;

    async function start() {
      try {
        // Request the iPhone's native photo aspect ratio (4:3) at a modest
        // ideal resolution, with resizeMode "none" so the browser picks a
        // native capture mode instead of cropping-and-scaling the stream to
        // match our request — that crop-then-upscale is what produces a
        // zoomed-in-looking image when the requested size doesn't line up
        // with a mode the camera actually supports.
        const videoConstraints: MediaTrackConstraints & { resizeMode?: ConstrainDOMString } = {
          aspectRatio: { ideal: 4 / 3 },
          width: { ideal: 1920 },
          height: { ideal: 1440 },
          resizeMode: { ideal: "none" },
          ...(selectedDeviceId
            ? { deviceId: { exact: selectedDeviceId } }
            : { facingMode: "environment" }),
        };
        const constraints: MediaStreamConstraints = { video: videoConstraints, audio: false };
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current?.getTracks().forEach((t) => t.stop());
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        const track = stream.getVideoTracks()[0];
        const trackDeviceId = track?.getSettings().deviceId ?? null;
        setActiveDeviceId(trackDeviceId);

        // Continuity Camera can start at a non-1x zoom level. Reset to the
        // minimum (1x) when the track exposes the non-standard `zoom`
        // capability; silently no-op on cameras/browsers that don't.
        try {
          const caps = track?.getCapabilities?.() as
            | (MediaTrackCapabilities & { zoom?: { min: number; max: number; step: number } })
            | undefined;
          if (caps?.zoom) {
            await track?.applyConstraints({
              advanced: [{ zoom: caps.zoom.min } as MediaTrackConstraintSet],
            });
          }
        } catch {
          // Zoom reset is a best-effort enhancement; ignore failures.
        }

        // Diagnostic: log what the browser actually negotiated, so if the
        // framing still looks off we can see the real width/height/zoom
        // instead of guessing again.
        console.debug("[camera-capture] negotiated track settings", track?.getSettings());

        // Device labels are only populated once permission has been granted,
        // so refresh the list here. If a Continuity Camera iPhone is present
        // and nothing has been explicitly chosen yet, prefer it automatically.
        const list = (await navigator.mediaDevices.enumerateDevices()).filter(
          (d) => d.kind === "videoinput",
        );
        if (cancelled) return;
        setDevices(list);
        if (!selectedDeviceId) {
          const iphone = list.find((d) => /iphone/i.test(d.label));
          if (iphone && iphone.deviceId !== trackDeviceId) {
            setSelectedDeviceId(iphone.deviceId);
          }
        }

        // iPhone's live video orientation needs a 90deg clockwise correction
        // by default; apply it once per session so the user doesn't have to
        // rotate manually every time.
        const activeIsIphone = list.some((d) => d.deviceId === trackDeviceId && /iphone/i.test(d.label));
        if (activeIsIphone && !autoRotationAppliedRef.current) {
          autoRotationAppliedRef.current = true;
          setRotation(90);
        }
      } catch (err) {
        if (cancelled) return;
        const name = err instanceof Error ? err.name : "";
        setCameraError(name === "NotAllowedError" || name === "PermissionDeniedError" ? "denied" : "unavailable");
      }
    }

    start();

    return () => {
      cancelled = true;
    };
  }, [selectedDeviceId]);

  React.useEffect(() => {
    return () => {
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
      const swapped = rotation === 90 || rotation === 270;
      const canvas = document.createElement("canvas");
      canvas.width = swapped ? video.videoHeight : video.videoWidth;
      canvas.height = swapped ? video.videoWidth : video.videoHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      if (rotation !== 0) {
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.drawImage(video, -video.videoWidth / 2, -video.videoHeight / 2);
      } else {
        ctx.drawImage(video, 0, 0);
      }

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
      <div className="flex items-center justify-between gap-2 px-4 py-3">
        <span className="font-ko text-sm text-white" lang="ko">
          촬영한 페이지 {pages.length}장
        </span>
        <div className="flex items-center gap-2">
          {devices.length > 1 && (
            <select
              value={selectedDeviceId ?? activeDeviceId ?? ""}
              onChange={(e) => setSelectedDeviceId(e.target.value)}
              aria-label="카메라 선택"
              className="max-w-[9rem] truncate rounded-md bg-black/40 px-2 py-1.5 text-xs text-white"
            >
              {devices.map((d) => (
                <option key={d.deviceId} value={d.deviceId} className="text-black">
                  {d.label || "카메라"}
                </option>
              ))}
            </select>
          )}
          <button
            type="button"
            onClick={() => setRotation((r) => (((r + 90) % 360) as 0 | 90 | 180 | 270))}
            aria-label="화면 회전"
            aria-pressed={rotation !== 0}
            className={`rounded-full p-2 text-white ${rotation !== 0 ? "bg-white/40" : "bg-black/40"}`}
          >
            <RotateCw className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={handleCancel}
            aria-label="취소"
            className="rounded-full bg-black/40 p-2 text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div ref={previewContainerRef} className="relative flex-1 overflow-hidden">
        <div
          className="absolute left-1/2 top-1/2"
          style={{
            width: rotation === 90 || rotation === 270 ? containerSize.height : containerSize.width,
            height: rotation === 90 || rotation === 270 ? containerSize.width : containerSize.height,
            transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
          }}
        >
          <video ref={videoRef} playsInline muted autoPlay className="h-full w-full object-contain" />
        </div>

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
