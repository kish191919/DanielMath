import { ENROLLMENT_STATUS_LABELS, type EnrollmentStatus } from "@/lib/enrollment/schema";

const STATUS_STYLES: Record<EnrollmentStatus, string> = {
  active: "bg-green-100 text-green-800",
  paused: "bg-navy-50 text-navy-600",
};

export function EnrollmentStatusBadge({ status }: { status: EnrollmentStatus }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[status]}`}
    >
      {ENROLLMENT_STATUS_LABELS[status]}
    </span>
  );
}
