import { Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";
import { buildWorksheetViewerHref } from "@/lib/learning-history/worksheet-viewer-url";

interface WorksheetViewerLinkProps {
  url: string;
  mimeType: string | null;
  className?: string;
}

export function WorksheetViewerLink({ url, mimeType, className }: WorksheetViewerLinkProps) {
  return (
    <Button
      href={buildWorksheetViewerHref(url, mimeType)}
      external
      variant="secondary"
      className={className ?? "mt-4 h-8 gap-1.5 px-3 text-xs"}
    >
      <Paperclip className="h-3.5 w-3.5" />
      원본 학습지 보기
    </Button>
  );
}
