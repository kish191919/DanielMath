"use client";

import * as React from "react";
import { ExternalLink, Paperclip, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WorksheetViewerModalProps {
  url: string;
  mimeType: string | null;
  triggerClassName?: string;
}

export function WorksheetViewerModal({ url, mimeType, triggerClassName }: WorksheetViewerModalProps) {
  const [open, setOpen] = React.useState(false);
  const isPdf = mimeType === "application/pdf";

  React.useEffect(() => {
    if (!open) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <>
      <Button
        variant="secondary"
        className={triggerClassName ?? "mt-4 h-8 gap-1.5 px-3 text-xs"}
        onClick={() => setOpen(true)}
      >
        <Paperclip className="h-3.5 w-3.5" />
        원본 학습지 보기
      </Button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpen(false);
          }}
        >
          <div className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-navy-100 px-4 py-3">
              <span className="font-ko text-sm font-semibold text-navy-900" lang="ko">
                원본 학습지
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="닫기"
                className="rounded-full p-1.5 text-navy-500 hover:bg-navy-50 hover:text-navy-900"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="overflow-auto">
              {isPdf ? (
                <iframe
                  src={url}
                  className="h-[70vh] w-full"
                  title="원본 스캔 (미리보기, 첫 페이지만 표시)"
                />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element -- signed Supabase URL, not a static asset
                <img src={url} alt="원본 스캔" className="max-h-[70vh] w-full object-contain" />
              )}
            </div>

            <div className="flex items-center justify-between gap-3 border-t border-navy-100 px-4 py-3">
              <p className="text-xs text-navy-600 font-ko" lang="ko">
                {isPdf
                  ? "여러 장을 촬영한 스캔은 새 창에서 열어야 모든 페이지를 넘겨보고 확대할 수 있어요."
                  : "새 창에서 열면 사진을 자유롭게 확대/축소해서 볼 수 있어요."}
              </p>
              <Button href={url} external variant="primary" className="h-8 shrink-0 gap-1.5 px-3 text-xs">
                <ExternalLink className="h-3.5 w-3.5" />
                새 창에서 크게 보기
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
