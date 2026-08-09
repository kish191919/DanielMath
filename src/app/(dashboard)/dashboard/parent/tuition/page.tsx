import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Container } from "@/components/site/container";
import { Section } from "@/components/site/section";
import { TuitionStatusBadge } from "@/components/dashboard/tuition-status-badge";
import { requireRole } from "@/lib/dal";
import { GRADE_LABELS } from "@/lib/students/schema";
import { listChildrenForParent } from "@/lib/learning-history/queries";
import { listTuitionPaymentsForParent } from "@/lib/tuition/queries";
import { computeTuitionStatus } from "@/lib/tuition/schema";
import { formatUsd } from "@/lib/tuition/format";
import { todayInEasternTime } from "@/lib/dates";

export default async function ParentTuitionPage({
  searchParams,
}: {
  searchParams: Promise<{ child?: string }>;
}) {
  const session = await requireRole("parent");
  const { child: rawChildId } = await searchParams;
  const children = await listChildrenForParent(session.userId);

  const filterChildId =
    rawChildId && children.some((c) => c.id === rawChildId) ? rawChildId : null;
  const visibleChildren = filterChildId
    ? children.filter((c) => c.id === filterChildId)
    : children;

  const today = todayInEasternTime();
  const childData = await Promise.all(
    visibleChildren.map(async (child) => ({
      child,
      payments: await listTuitionPaymentsForParent(session.userId, child.id),
    })),
  );

  return (
    <Section className="py-10 sm:py-14">
      <Container>
        <div>
          <Link
            href="/dashboard/parent"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-navy-500 hover:text-navy-900"
          >
            <ArrowLeft className="h-4 w-4" />
            돌아가기
          </Link>
          <p className="mt-3 text-sm font-semibold uppercase tracking-wider text-navy-500">
            Tuition
          </p>
          <h1 className="mt-2 text-2xl font-bold text-navy-900 font-ko sm:text-3xl" lang="ko">
            납부 현황
          </h1>
          <p className="mt-2 text-sm text-navy-700 font-ko" lang="ko">
            자녀의 학원비 청구와 납부 내역을 확인하세요.
          </p>
          {filterChildId && (
            <Link
              href="/dashboard/parent/tuition"
              className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-navy-500 hover:text-navy-900"
            >
              전체 자녀 보기
            </Link>
          )}
        </div>

        {childData.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-navy-100 bg-white p-8 text-center text-sm text-navy-600">
            등록된 자녀가 없습니다. 원장님께 문의해주세요.
          </div>
        ) : (
          <div className="mt-8 space-y-8">
            {childData.map(({ child, payments }) => (
              <div key={child.id}>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-semibold text-navy-900">{child.full_name}</h2>
                  <span className="inline-flex items-center rounded-full bg-navy-50 px-2 py-0.5 text-xs font-medium text-navy-800">
                    {GRADE_LABELS[child.grade]}
                  </span>
                </div>

                <div className="mt-3 space-y-2">
                  {payments.length === 0 ? (
                    <p className="text-sm text-navy-600">청구 내역이 없습니다.</p>
                  ) : (
                    payments.map((payment) => (
                      <div
                        key={payment.id}
                        className="flex items-center justify-between gap-3 rounded-2xl border border-navy-100 bg-white p-4 shadow-sm"
                      >
                        <div>
                          <p className="text-sm font-semibold text-navy-900">
                            {payment.billing_month.slice(0, 7)}
                          </p>
                          <p className="mt-1 text-xs text-navy-600">
                            {formatUsd(payment.amount_due)} · 기한 {payment.due_date}
                          </p>
                          {payment.paid_at && (
                            <p className="mt-1 text-xs text-navy-500">납부일 {payment.paid_at}</p>
                          )}
                        </div>
                        <TuitionStatusBadge status={computeTuitionStatus(payment, today)} />
                      </div>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Container>
    </Section>
  );
}
