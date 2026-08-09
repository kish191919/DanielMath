import type { LucideIcon } from "lucide-react";

export function KpiCard({
  icon: Icon,
  label,
  value,
  sub,
  warn,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  sub?: string;
  warn?: boolean;
}) {
  return (
    <div className={`rounded-2xl border bg-white p-4 shadow-sm ${warn ? "border-red-200" : "border-navy-100"}`}>
      <div className="flex items-center gap-2">
        <span
          className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
            warn ? "bg-red-100 text-red-600" : "bg-navy-50 text-navy-500"
          }`}
        >
          <Icon className="h-4 w-4" strokeWidth={2} />
        </span>
        <p className="text-xs font-medium text-navy-500 font-ko" lang="ko">
          {label}
        </p>
      </div>
      <p
        className={`mt-2 text-lg font-bold font-ko ${warn ? "text-red-600" : "text-navy-900"}`}
        lang="ko"
      >
        {value}
      </p>
      {sub && <p className="mt-0.5 text-xs text-navy-500">{sub}</p>}
    </div>
  );
}
