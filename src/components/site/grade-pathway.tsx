import { ArrowRight, GraduationCap } from "lucide-react";

interface PathwayRow {
  grade: string;
  standard: string;
  advanced: string;
}

interface GradePathwayProps {
  rows: PathwayRow[];
  isKo: boolean;
  finalLabel: string;
}

export function GradePathway({ rows, isKo, finalLabel }: GradePathwayProps) {
  return (
    <div className="mx-auto mt-10 max-w-5xl">
      <div className="mb-6 flex items-center justify-center gap-6 text-xs font-semibold">
        <span className="flex items-center gap-1.5 text-navy-700">
          <span className="h-2.5 w-2.5 rounded-full bg-navy-700" />
          {isKo ? "일반 수학" : "Standard Math"}
        </span>
        <span className="flex items-center gap-1.5 text-gold-600">
          <span className="h-2.5 w-2.5 rounded-full bg-gold-500" />
          {isKo ? "심화 수학 (AAP)" : "Advanced Math (AAP)"}
        </span>
      </div>

      <div className="overflow-x-auto pb-2">
        <div className="flex min-w-max items-center gap-2 px-1">
          {rows.map((r) => (
            <div key={r.grade} className="flex items-center gap-2">
              <div className="flex w-32 flex-col gap-1.5">
                <div className="rounded-lg border border-gold-400/60 bg-amber-50 px-3 py-2 text-center">
                  <p className="text-[11px] font-bold text-navy-900">{r.grade}</p>
                  <p className="mt-0.5 text-xs font-semibold text-gold-700">{r.advanced}</p>
                </div>
                <div className="rounded-lg border border-navy-200 bg-white px-3 py-2 text-center shadow-sm">
                  <p className="text-xs font-semibold text-navy-700">{r.standard}</p>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 shrink-0 text-navy-300" />
            </div>
          ))}
          <div className="flex w-36 shrink-0 flex-col items-center justify-center gap-1 rounded-xl border-2 border-gold-500 bg-navy-900 px-3 py-4 text-center">
            <GraduationCap className="h-5 w-5 text-gold-400" />
            <p className={`text-xs font-bold text-white${isKo ? " font-ko" : ""}`}>{finalLabel}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
