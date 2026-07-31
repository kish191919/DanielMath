"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WorksheetPdfViewerProps {
  url: string;
}

type Status = "loading" | "ready" | "error";

export function WorksheetPdfViewer({ url }: WorksheetPdfViewerProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  // Holds the loaded pdf.js document across renders without triggering re-renders itself.
  const pdfRef = React.useRef<import("pdfjs-dist").PDFDocumentProxy | null>(null);
  const renderTaskRef = React.useRef<ReturnType<
    import("pdfjs-dist").PDFPageProxy["render"]
  > | null>(null);

  const [status, setStatus] = React.useState<Status>("loading");
  const [numPages, setNumPages] = React.useState(0);
  const [pageIndex, setPageIndex] = React.useState(0);

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
        setNumPages(doc.numPages);
        setStatus("ready");
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

  React.useEffect(() => {
    if (status !== "ready") return;
    const doc = pdfRef.current;
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!doc || !canvas || !container) return;

    let cancelled = false;

    (async () => {
      const page = await doc.getPage(pageIndex + 1);
      if (cancelled) return;

      const unscaledViewport = page.getViewport({ scale: 1 });
      const scale = container.clientWidth / unscaledViewport.width;
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
        // Cancelled by a newer render task (page change) — ignore.
      }
    })();

    return () => {
      cancelled = true;
      renderTaskRef.current?.cancel();
    };
  }, [status, pageIndex]);

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
    <div>
      <div ref={containerRef} className="flex justify-center bg-navy-50/40 p-2">
        {status === "loading" ? (
          <p className="py-16 text-sm text-navy-500 font-ko" lang="ko">
            불러오는 중...
          </p>
        ) : (
          <canvas ref={canvasRef} className="max-w-full" />
        )}
      </div>

      {status === "ready" && numPages > 1 && (
        <div className="flex items-center justify-center gap-4 border-t border-navy-100 py-2">
          <Button
            variant="ghost"
            className="h-8 w-8 p-0"
            onClick={() => setPageIndex((i) => Math.max(0, i - 1))}
            disabled={pageIndex === 0}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-xs text-navy-600">
            {pageIndex + 1} / {numPages}
          </span>
          <Button
            variant="ghost"
            className="h-8 w-8 p-0"
            onClick={() => setPageIndex((i) => Math.min(numPages - 1, i + 1))}
            disabled={pageIndex === numPages - 1}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
