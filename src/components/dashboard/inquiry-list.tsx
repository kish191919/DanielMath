import Link from "next/link";
import type { Inquiry, InquiryNote, InquiryStatus } from "@/lib/supabase/types";
import { GRADE_LABELS } from "@/lib/students/schema";
import { INQUIRY_STATUS_LABELS } from "@/lib/inquiries/schema";
import { updateInquiryStatusAction, deleteInquiryAction } from "@/lib/inquiries/actions";
import { InquiryNotes } from "@/components/dashboard/inquiry-notes";

const STATUS_BADGE: Record<InquiryStatus, string> = {
  new: "bg-blue-50 text-blue-800",
  contacted: "bg-amber-50 text-amber-800",
  enrolled: "bg-green-50 text-green-800",
  closed: "bg-gray-100 text-gray-600",
};

function StatusButton({ id, status, label }: { id: string; status: InquiryStatus; label: string }) {
  return (
    <form action={updateInquiryStatusAction.bind(null, id, status)}>
      <button
        type="submit"
        className="rounded-md border border-navy-200 px-3 py-1 text-xs font-medium text-navy-700 hover:bg-navy-50"
      >
        {label}
      </button>
    </form>
  );
}

export function InquiryList({
  inquiries,
  notesByInquiry,
}: {
  inquiries: Inquiry[];
  notesByInquiry: Record<string, InquiryNote[]>;
}) {
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
            <div className="flex shrink-0 flex-col items-end gap-1">
              <span
                className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_BADGE[inquiry.status]}`}
              >
                {INQUIRY_STATUS_LABELS[inquiry.status]}
              </span>
              <span className="text-xs text-navy-500">
                {inquiry.language === "ko" ? "한국어" : "English"}
              </span>
            </div>
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

          <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-4">
            <div className="flex flex-wrap gap-2">
              {inquiry.status === "new" && (
                <>
                  <StatusButton id={inquiry.id} status="contacted" label="연락함" />
                  <StatusButton id={inquiry.id} status="closed" label="보류" />
                </>
              )}
              {inquiry.status === "contacted" && (
                <>
                  <StatusButton id={inquiry.id} status="enrolled" label="등록완료" />
                  <StatusButton id={inquiry.id} status="closed" label="보류" />
                </>
              )}
              {inquiry.status === "closed" && (
                <StatusButton id={inquiry.id} status="new" label="다시 열기" />
              )}
              {inquiry.status !== "enrolled" && (
                <Link
                  href={`/dashboard/principal/students/new?fromInquiry=${inquiry.id}`}
                  className="rounded-md border border-navy-900 bg-navy-900 px-3 py-1 text-xs font-medium text-white hover:bg-navy-800"
                >
                  학생으로 등록 →
                </Link>
              )}
            </div>
            <form action={deleteInquiryAction.bind(null, inquiry.id)}>
              <button
                type="submit"
                className="rounded-md border border-red-200 px-3 py-1 text-xs font-medium text-red-700 hover:bg-red-50"
              >
                삭제
              </button>
            </form>
          </div>

          <p className="mt-3 text-right text-xs text-navy-500">
            {new Date(inquiry.created_at).toLocaleString("ko-KR")}
          </p>

          <InquiryNotes inquiryId={inquiry.id} notes={notesByInquiry[inquiry.id] ?? []} />
        </article>
      ))}
    </div>
  );
}
