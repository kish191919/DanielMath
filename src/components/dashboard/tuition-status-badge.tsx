import { TUITION_STATUS_LABELS, type TuitionStatus } from "@/lib/tuition/schema";

const STATUS_STYLES: Record<TuitionStatus, string> = {
  paid: "bg-green-100 text-green-800",
  overdue: "bg-red-100 text-red-700",
  due: "bg-gold-300/30 text-navy-800",
};

export function TuitionStatusBadge({ status }: { status: TuitionStatus }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[status]}`}
    >
      {TUITION_STATUS_LABELS[status]}
    </span>
  );
}
