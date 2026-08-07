"use client";

import * as React from "react";
import { X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createBrowserSupabase } from "@/lib/supabase/browser";
import { compressFrameToJpeg } from "@/lib/images/build-scan-pdf";
import {
  getReferenceScanCropSourceAction,
  createReferenceCropUploadUrlAction,
  confirmReferenceCropAction,
} from "@/lib/problem-bank/actions";

const BUCKET = "problem-bank";

type LoadStatus = "loading" | "ready" | "error";

interface CropRect {
  x: number;
  y: number;
  w: number;
  h: number;
}

// Drag-select rectangle + crop-to-JPEG. No crop library exists in this
// project (checked — none installed), so this is a minimal from-scratch
// canvas implementation rather than the AI attempting to guess bounding
// boxes (extractReferenceProblems explicitly never returns coordinates —
// see reference-extraction-schema.ts's has_diagram comment).
export function ReferenceProblemCropDialog({
  referenceProblemId,
  onClose,
  onSaved,
}: {
  referenceProblemId: string;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [status, setStatus] = React.useState<LoadStatus>("loading");
  const [error, setError] = React.useState<string | null>(null);
  const [isPdf, setIsPdf] = React.useState(false);
  const [pageNum, setPageNum] = React.useState(1);
  const [numPages, setNumPages] = React.useState(1);
  const [saving, setSaving] = React.useState(false);

  const sourceUrlRef = React.useRef<string | null>(null);
  const pdfDocRef = React.useRef<import("pdfjs-dist").PDFDocumentProxy | null>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const [dragStartCss, setDragStartCss] = React.useState<{ x: number; y: number } | null>(null);
  const [selectionCss, setSelectionCss] = React.useState<CropRect | null>(null);

  React.useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  // Fetch the signed URL to the original scan, then render page 1 (image or
  // first PDF page) onto the crop canvas at its native resolution — the
  // scan was already downsized to ~1600px on the long edge at upload time
  // (compressImageFileToJpeg / compressPdfFile), so no further scale
  // bookkeeping is needed between canvas pixels and stored crop pixels.
  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      const result = await getReferenceScanCropSourceAction(referenceProblemId);
      if (cancelled) return;
      if ("error" in result) {
        setError(result.error);
        setStatus("error");
        return;
      }
      sourceUrlRef.current = result.signedUrl;
      if (result.mimeType === "application/pdf") {
        setIsPdf(true);
        await renderPdf(result.signedUrl, 1);
      } else {
        await renderImage(result.signedUrl);
      }
    })();
    return () => {
      cancelled = true;
      pdfDocRef.current?.destroy();
      pdfDocRef.current = null;
    };
  }, [referenceProblemId]);

  async function renderImage(url: string) {
    // Fetched into a blob: URL (same-origin for canvas purposes) rather than
    // set directly as an <img> src — the signed URL is cross-origin, and a
    // cross-origin image drawn into a canvas without a same-origin blob taints
    // the canvas, which silently breaks the later toBlob()/drawImage crop
    // step. Mirrors compressImageFileToJpeg's local-File object-URL pattern.
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error("이미지를 불러오지 못했습니다.");
      const blob = await res.blob();
      const objectUrl = URL.createObjectURL(blob);
      try {
        const img = await new Promise<HTMLImageElement>((resolve, reject) => {
          const el = new Image();
          el.onload = () => resolve(el);
          el.onerror = () => reject(new Error("이미지를 불러오지 못했습니다."));
          el.src = objectUrl;
        });
        const canvas = canvasRef.current;
        if (!canvas) return;
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("캔버스를 생성할 수 없습니다.");
        ctx.drawImage(img, 0, 0);
        setStatus("ready");
      } finally {
        URL.revokeObjectURL(objectUrl);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "이미지를 불러오지 못했습니다.");
      setStatus("error");
    }
  }

  async function renderPdf(url: string, page: number) {
    try {
      const pdfjs = await import("pdfjs-dist");
      pdfjs.GlobalWorkerOptions.workerSrc = new URL(
        "pdfjs-dist/build/pdf.worker.min.mjs",
        import.meta.url,
      ).toString();

      let doc = pdfDocRef.current;
      if (!doc) {
        doc = await pdfjs.getDocument(url).promise;
        pdfDocRef.current = doc;
        setNumPages(doc.numPages);
      }
      const pdfPage = await doc.getPage(page);
      const viewport = pdfPage.getViewport({ scale: 1 });
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("캔버스를 생성할 수 없습니다.");
      await pdfPage.render({ canvas, canvasContext: ctx, viewport }).promise;
      setPageNum(page);
      setSelectionCss(null);
      setStatus("ready");
    } catch (err) {
      setError(err instanceof Error ? err.message : "PDF 페이지를 불러오지 못했습니다.");
      setStatus("error");
    }
  }

  function eventToContainerCss(e: React.PointerEvent): { x: number; y: number } {
    const rect = containerRef.current!.getBoundingClientRect();
    return {
      x: Math.min(Math.max(e.clientX - rect.left, 0), rect.width),
      y: Math.min(Math.max(e.clientY - rect.top, 0), rect.height),
    };
  }

  function handlePointerDown(e: React.PointerEvent) {
    if (status !== "ready") return;
    (e.target as Element).setPointerCapture(e.pointerId);
    setDragStartCss(eventToContainerCss(e));
    setSelectionCss(null);
  }

  function handlePointerMove(e: React.PointerEvent) {
    if (!dragStartCss) return;
    const current = eventToContainerCss(e);
    setSelectionCss({
      x: Math.min(dragStartCss.x, current.x),
      y: Math.min(dragStartCss.y, current.y),
      w: Math.abs(current.x - dragStartCss.x),
      h: Math.abs(current.y - dragStartCss.y),
    });
  }

  function handlePointerUp() {
    setDragStartCss(null);
  }

  async function handleSave() {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container || !selectionCss || selectionCss.w < 8 || selectionCss.h < 8) {
      setError("자를 영역을 드래그로 선택해주세요.");
      return;
    }
    setError(null);
    setSaving(true);
    try {
      // Map the CSS-pixel selection back to the canvas's native pixel space
      // (the canvas is rendered at native resolution but displayed scaled
      // to the container's width via className="w-full h-auto").
      const scale = canvas.width / container.clientWidth;
      const cropX = Math.round(selectionCss.x * scale);
      const cropY = Math.round(selectionCss.y * scale);
      const cropW = Math.round(selectionCss.w * scale);
      const cropH = Math.round(selectionCss.h * scale);

      const offscreen = document.createElement("canvas");
      offscreen.width = cropW;
      offscreen.height = cropH;
      const ctx = offscreen.getContext("2d");
      if (!ctx) throw new Error("캔버스를 생성할 수 없습니다.");
      ctx.drawImage(canvas, cropX, cropY, cropW, cropH, 0, 0, cropW, cropH);
      const blob = await compressFrameToJpeg(offscreen);

      const uploadUrl = await createReferenceCropUploadUrlAction(referenceProblemId);
      if ("error" in uploadUrl) throw new Error(uploadUrl.error);

      // upsert is decided at createSignedUploadUrl() time (see
      // createReferenceCropUploadUrlAction), not here — uploadToSignedUrl's
      // own upsert option is a no-op per the supabase-js docs.
      const browser = createBrowserSupabase();
      const { error: uploadError } = await browser.storage
        .from(BUCKET)
        .uploadToSignedUrl(uploadUrl.path, uploadUrl.token, blob);
      if (uploadError) throw new Error(uploadError.message);

      await confirmReferenceCropAction(referenceProblemId, uploadUrl.path);
      onSaved();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "크롭 이미지를 저장하지 못했습니다.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black/95">
      <div className="flex items-center justify-between px-4 py-3">
        <span className="font-ko text-sm text-white" lang="ko">
          도형 영역 선택 — 드래그해서 자를 영역을 지정하세요
        </span>
        <button
          type="button"
          onClick={onClose}
          aria-label="닫기"
          className="rounded-full bg-white/10 p-2 text-white"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="flex flex-1 items-center justify-center overflow-auto p-4">
        {status === "loading" && (
          <p className="font-ko text-sm text-white/70" lang="ko">
            불러오는 중...
          </p>
        )}
        {status === "error" && (
          <p className="font-ko text-sm text-red-400" lang="ko">
            {error ?? "불러오지 못했습니다."}
          </p>
        )}
        <div
          ref={containerRef}
          className="relative max-w-full touch-none select-none"
          style={{ display: status === "ready" ? "block" : "none" }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
        >
          <canvas ref={canvasRef} className="block h-auto w-full max-w-3xl rounded-md" />
          {selectionCss && (
            <div
              className="pointer-events-none absolute border-2 border-teal-400 bg-teal-400/20"
              style={{
                left: selectionCss.x,
                top: selectionCss.y,
                width: selectionCss.w,
                height: selectionCss.h,
              }}
            />
          )}
        </div>
      </div>

      {isPdf && numPages > 1 && (
        <div className="flex items-center justify-center gap-4 pb-2">
          <button
            type="button"
            className="text-sm text-white/70 disabled:opacity-30"
            disabled={pageNum <= 1}
            onClick={() => sourceUrlRef.current && renderPdf(sourceUrlRef.current, pageNum - 1)}
          >
            이전 페이지
          </button>
          <span className="text-sm text-white/70">
            {pageNum} / {numPages}
          </span>
          <button
            type="button"
            className="text-sm text-white/70 disabled:opacity-30"
            disabled={pageNum >= numPages}
            onClick={() => sourceUrlRef.current && renderPdf(sourceUrlRef.current, pageNum + 1)}
          >
            다음 페이지
          </button>
        </div>
      )}

      {error && status === "ready" && (
        <p className="px-4 pb-1 text-center font-ko text-sm text-red-400" lang="ko">
          {error}
        </p>
      )}

      <div className="flex items-center justify-end gap-3 px-4 py-3">
        <Button variant="secondary" onClick={onClose} disabled={saving}>
          취소
        </Button>
        <Button variant="primary" onClick={handleSave} disabled={saving || status !== "ready"}>
          <Check className="h-4 w-4" />
          {saving ? "저장 중..." : "크롭 저장"}
        </Button>
      </div>
    </div>
  );
}
