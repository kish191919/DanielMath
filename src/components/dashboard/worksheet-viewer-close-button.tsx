"use client";

import { X } from "lucide-react";

export function WorksheetViewerCloseButton() {
  return (
    <button
      type="button"
      onClick={() => window.close()}
      aria-label="닫기"
      className="rounded-full p-1.5 text-navy-500 hover:bg-navy-50 hover:text-navy-900"
    >
      <X className="h-5 w-5" />
    </button>
  );
}
