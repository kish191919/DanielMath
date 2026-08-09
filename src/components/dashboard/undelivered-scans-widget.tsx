import Link from "next/link";
import type { WorksheetScan } from "@/lib/supabase/types";

export function UndeliveredScansWidget({
  scans,
  studentNameById,
}: {
  scans: WorksheetScan[];
  studentNameById: Map<string, string>;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="text-lg font-semibold text-navy-900 font-ko" lang="ko">
          미발송 학부모
        </h2>
        <Link
          href="/dashboard/principal/worksheets?status=undelivered"
          className="text-sm font-medium text-navy-600 underline underline-offset-2 hover:text-navy-800"
        >
          전체보기
        </Link>
      </div>

      <div className="mt-4 space-y-3">
        {scans.length === 0 ? (
          <div className="rounded-2xl border border-navy-100 bg-white p-8 text-center text-sm text-navy-600">
            발송 대기 중인 학습지가 없습니다.
          </div>
        ) : (
          scans.map((scan) => (
            <Link
              key={scan.id}
              href={`/dashboard/principal/worksheets/${scan.id}`}
              className="flex items-center justify-between gap-3 rounded-2xl border border-navy-100 bg-white p-4 shadow-sm transition-colors hover:border-navy-300 hover:bg-navy-50"
            >
              <div>
                <p className="text-sm font-semibold text-navy-900">
                  {studentNameById.get(scan.student_id) ?? "알 수 없는 학생"}
                </p>
                <p className="mt-1 text-xs text-navy-600">{scan.session_date}</p>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
