import { SCAN_STATUS_LABELS } from "@/lib/learning-history/schema";
import type { ScanStatus } from "@/lib/supabase/types";

const STATUS_STYLES: Record<ScanStatus, string> = {
  uploaded: "bg-navy-50 text-navy-800",
  grading: "bg-gold-300/30 text-navy-800",
  pending_review: "bg-gold-300/30 text-navy-800",
  reviewed: "bg-green-100 text-green-800",
  grading_failed: "bg-red-100 text-red-700",
  delivered_to_parent: "bg-blue-100 text-blue-800",
};

export function ScanStatusBadge({ status }: { status: ScanStatus }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[status]}`}
    >
      {SCAN_STATUS_LABELS[status]}
    </span>
  );
}
