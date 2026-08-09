import Link from "next/link";
import { formatUsd } from "@/lib/tuition/format";
import type { TuitionPayment } from "@/lib/supabase/types";

export function OverdueTuitionWidget({
  payments,
  studentNameById,
}: {
  payments: TuitionPayment[];
  studentNameById: Map<string, string>;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="text-lg font-semibold text-navy-900 font-ko" lang="ko">
          연체된 학원비
        </h2>
        <Link
          href="/dashboard/principal/tuition?status=overdue"
          className="text-sm font-medium text-navy-600 underline underline-offset-2 hover:text-navy-800"
        >
          전체보기
        </Link>
      </div>

      <div className="mt-4 space-y-3">
        {payments.length === 0 ? (
          <div className="rounded-2xl border border-navy-100 bg-white p-8 text-center text-sm text-navy-600">
            연체된 학원비가 없습니다.
          </div>
        ) : (
          payments.map((payment) => (
            <Link
              key={payment.id}
              href={`/dashboard/principal/students/${payment.student_id}/tuition`}
              className="flex items-center justify-between gap-3 rounded-2xl border border-navy-100 bg-white p-4 shadow-sm transition-colors hover:border-navy-300 hover:bg-navy-50"
            >
              <div>
                <p className="text-sm font-semibold text-navy-900">
                  {studentNameById.get(payment.student_id) ?? "알 수 없는 학생"}
                </p>
                <p className="mt-1 text-xs text-navy-600">기한 {payment.due_date}</p>
              </div>
              <p className="text-sm font-semibold text-red-600">{formatUsd(payment.amount_due)}</p>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
