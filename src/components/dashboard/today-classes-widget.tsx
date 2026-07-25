import Link from "next/link";
import type { ClassWithCount } from "@/lib/classes/queries";

export function TodayClassesWidget({ classes }: { classes: ClassWithCount[] }) {
  if (classes.length === 0) {
    return (
      <div className="rounded-2xl border border-navy-100 bg-white p-8 text-center text-sm text-navy-600">
        오늘 예정된 수업이 없습니다.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {classes.map(({ classRow, activeCount }) => (
        <Link
          key={classRow.id}
          href={`/dashboard/principal/classes/${classRow.id}`}
          className="flex items-center justify-between gap-3 rounded-2xl border border-navy-100 bg-white p-4 shadow-sm transition-colors hover:border-navy-300 hover:bg-navy-50"
        >
          <div>
            <p className="text-sm font-semibold text-navy-900">{classRow.name}</p>
            <p className="mt-1 text-xs text-navy-600">
              {classRow.start_time.slice(0, 5)}-{classRow.end_time.slice(0, 5)}
            </p>
          </div>
          <span className="text-xs font-medium text-navy-600">{activeCount}명</span>
        </Link>
      ))}
    </div>
  );
}
