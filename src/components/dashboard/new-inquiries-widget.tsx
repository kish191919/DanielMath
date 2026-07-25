import Link from "next/link";
import { GRADE_LABELS } from "@/lib/students/schema";
import type { Inquiry } from "@/lib/supabase/types";

const NEW_BADGE = "bg-blue-50 text-blue-800";

export function NewInquiriesWidget({ inquiries }: { inquiries: Inquiry[] }) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="text-lg font-semibold text-navy-900 font-ko" lang="ko">
          신규 상담 문의
        </h2>
        <Link
          href="/dashboard/principal/inquiries"
          className="text-sm font-medium text-navy-600 underline underline-offset-2 hover:text-navy-800"
        >
          전체보기
        </Link>
      </div>

      <div className="mt-4 space-y-3">
        {inquiries.length === 0 ? (
          <div className="rounded-2xl border border-navy-100 bg-white p-8 text-center text-sm text-navy-600">
            신규 상담 문의가 없습니다.
          </div>
        ) : (
          inquiries.map((inquiry) => (
            <div
              key={inquiry.id}
              className="flex items-center justify-between gap-3 rounded-2xl border border-navy-100 bg-white p-4 shadow-sm"
            >
              <div>
                <p className="text-sm font-semibold text-navy-900">
                  {inquiry.parent_name}
                </p>
                <p className="mt-1 text-xs text-navy-600">
                  {inquiry.child_name} · {GRADE_LABELS[inquiry.grade]}
                </p>
              </div>
              <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${NEW_BADGE}`}>
                신규
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
