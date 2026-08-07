"use client";

import * as React from "react";
import { ZoomableMedia } from "@/components/dashboard/zoomable-media";

interface WorksheetPdfViewerProps {
  url: string;
}

type Status = "loading" | "ready" | "error";

type PDFPageProxy = import("pdfjs-dist").PDFPageProxy;

export function WorksheetPdfViewer({ url }: WorksheetPdfViewerProps) {
  const pdfRef = React.useRef<import("pdfjs-dist").PDFDocumentProxy | null>(null);
  const [status, setStatus] = React.useState<Status>("loading");
  const [pages, setPages] = React.useState<PDFPageProxy[]>([]);

  React.useEffect(() => {
    let cancelled = false;

    (async () => {
      const pdfjs = await import("pdfjs-dist");
      pdfjs.GlobalWorkerOptions.workerSrc = new URL(
        "pdfjs-dist/build/pdf.worker.min.mjs",
        import.meta.url,
      ).toString();

      try {
        const doc = await pdfjs.getDocument(url).promise;
        if (cancelled) {
          doc.destroy();
          return;
        }
        pdfRef.current = doc;
        setStatus("ready");

        for (let n = 1; n <= doc.numPages; n++) {
          if (cancelled) return;
          const page = await doc.getPage(n);
          if (cancelled) return;
          setPages((prev) => [...prev, page]);
        }
      } catch {
        if (!cancelled) setStatus("error");
      }
    })();

    return () => {
      cancelled = true;
      pdfRef.current?.destroy();
      pdfRef.current = null;
    };
  }, [url]);

  if (status === "error") {
    return (
      <div className="flex flex-col items-center gap-3 p-10 text-center">
        <p className="text-sm text-navy-600 font-ko" lang="ko">
          학습지를 불러오지 못했어요.
        </p>
        <a href={url} className="text-xs font-medium text-navy-500 underline hover:text-navy-900">
          새 창에서 열기
        </a>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 bg-navy-50/40 p-2 touch-pan-y">
      {status === "loading" && pages.length === 0 && (
        <p className="py-16 text-center text-sm text-navy-500 font-ko" lang="ko">
          불러오는 중...
        </p>
      )}
      {pages.map((page, i) => (
        <PdfPage key={i} page={page} />
      ))}
    </div>
  );
}

function PdfPage({ page }: { page: PDFPageProxy }) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const renderTaskRef = React.useRef<ReturnType<PDFPageProxy["render"]> | null>(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    (async () => {
      const unscaledViewport = page.getViewport({ scale: 1 });
      const dpr = Math.min(window.devicePixelRatio || 1, 2.5);
      const scale = (container.clientWidth / unscaledViewport.width) * dpr;
      const viewport = page.getViewport({ scale });

      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      canvas.width = viewport.width;
      canvas.height = viewport.height;

      renderTaskRef.current?.cancel();
      const task = page.render({ canvas, canvasContext: ctx, viewport });
      renderTaskRef.current = task;
      try {
        await task.promise;
      } catch {
        // Cancelled (e.g. unmounted before finishing) — ignore.
      }
    })();

    return () => {
      renderTaskRef.current?.cancel();
    };
  }, [page]);

  return (
    <ZoomableMedia
      ref={containerRef}
      label="학습지 페이지"
      className="overflow-hidden rounded-md bg-white"
    >
      <canvas ref={canvasRef} className="h-auto w-full" />
    </ZoomableMedia>
  );
}
