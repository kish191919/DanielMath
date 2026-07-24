import type { Inquiry } from "@/lib/supabase/types";
import { GRADE_LABELS } from "@/lib/students/schema";

export function InquiryList({ inquiries }: { inquiries: Inquiry[] }) {
  if (inquiries.length === 0) {
    return (
      <div className="rounded-2xl border border-navy-100 bg-white p-8 text-center text-sm text-navy-600">
        아직 접수된 상담 문의가 없습니다.
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {inquiries.map((inquiry) => (
        <article
          key={inquiry.id}
          className="flex min-h-[160px] flex-col rounded-2xl border border-navy-100 bg-white p-5 shadow-sm"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-base font-semibold text-navy-900">
                {inquiry.parent_name}
              </h3>
              <p className="mt-1 text-xs text-navy-600">
                {inquiry.child_name} · {GRADE_LABELS[inquiry.grade]}
              </p>
            </div>
            <span className="inline-flex shrink-0 items-center rounded-full bg-navy-50 px-2 py-0.5 text-xs font-medium text-navy-800">
              {inquiry.language === "ko" ? "한국어" : "English"}
            </span>
          </div>
          <div className="mt-3 space-y-1 text-xs text-navy-700">
            <p>{inquiry.contact_email}</p>
            <p>{inquiry.phone}</p>
            {inquiry.school && <p>{inquiry.school}</p>}
          </div>
          {inquiry.message && (
            <p className="mt-3 line-clamp-4 text-xs text-navy-700 font-ko" lang="ko">
              {inquiry.message}
            </p>
          )}
          <p className="mt-auto pt-4 text-right text-xs text-navy-500">
            {new Date(inquiry.created_at).toLocaleString("ko-KR")}
          </p>
        </article>
      ))}
    </div>
  );
}
