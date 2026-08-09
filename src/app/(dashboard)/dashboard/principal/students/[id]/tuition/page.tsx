import { notFound } from "next/navigation";
import { Wallet, AlertTriangle } from "lucide-react";
import { Container } from "@/components/site/container";
import { Section } from "@/components/site/section";
import { BackLink } from "@/components/ui/back-link";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { EnrollmentPeriods } from "@/components/dashboard/enrollment-periods";
import { TuitionPaymentList } from "@/components/dashboard/tuition-payment-list";
import { DefaultTuitionAmountForm } from "@/components/dashboard/default-tuition-amount-form";
import { requireRole } from "@/lib/dal";
import { getStudent } from "@/lib/students/queries";
import { listEnrollmentPeriodsForStudent } from "@/lib/enrollment/queries";
import { listTuitionPaymentsForStudent } from "@/lib/tuition/queries";
import { generateBillingForStudentAction } from "@/lib/tuition/actions";
import { currentBillingMonth } from "@/lib/tuition/schema";
import { formatUsd } from "@/lib/tuition/format";
import { todayInEasternTime } from "@/lib/dates";

export default async function StudentTuitionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireRole("principal");
  const { id } = await params;

  const student = await getStudent(id);
  if (!student) notFound();

  const [periods, payments] = await Promise.all([
    listEnrollmentPeriodsForStudent(id),
    listTuitionPaymentsForStudent(id),
  ]);

  const today = todayInEasternTime();
  const unpaidPayments = payments.filter((p) => p.paid_at === null);
  const totalUnpaid = unpaidPayments.reduce((sum, p) => sum + p.amount_due, 0);
  const maxOverdueDays = unpaidPayments.reduce((max, p) => {
    if (p.due_date >= today) return max;
    const days = Math.floor(
      (new Date(today).getTime() - new Date(p.due_date).getTime()) / 86_400_000,
    );
    return Math.max(max, days);
  }, 0);

  const activePeriod = periods.find((p) => p.ended_at === null) ?? null;
  const billingMonth = currentBillingMonth();
  const hasCurrentMonthBilling = payments.some((p) => p.billing_month === billingMonth);

  return (
    <Section className="py-10 sm:py-14">
      <Container className="max-w-3xl">
        <BackLink label="학생 목록으로 돌아가기" />
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-navy-500">Tuition</p>
          <h1 className="mt-2 text-2xl font-bold text-navy-900 font-ko sm:text-3xl" lang="ko">
            {student.full_name} - 재원/정산 관리
          </h1>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <KpiCard
            icon={Wallet}
            label="총 미납액"
            value={formatUsd(totalUnpaid)}
            warn={totalUnpaid > 0}
          />
          <KpiCard
            icon={AlertTriangle}
            label="최대 연체일수"
            value={maxOverdueDays > 0 ? `${maxOverdueDays}일` : "-"}
            warn={maxOverdueDays > 0}
          />
        </div>

        <div className="mt-8">
          <EnrollmentPeriods studentId={id} periods={periods} />
        </div>

        <div className="mt-8 rounded-2xl border border-navy-100 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-base font-semibold text-navy-900 font-ko" lang="ko">
            기본 학원비
          </h2>
          <div className="mt-4">
            <DefaultTuitionAmountForm
              studentId={id}
              monthlyTuitionAmount={student.monthly_tuition_amount}
            />
          </div>

          <div className="mt-6 flex items-center justify-between gap-3 border-t border-navy-100 pt-5">
            <h3 className="text-sm font-semibold text-navy-900 font-ko" lang="ko">
              납부 내역
            </h3>
            {activePeriod && !hasCurrentMonthBilling && (
              <form action={generateBillingForStudentAction.bind(null, id)}>
                <button
                  type="submit"
                  className="rounded-md bg-navy-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-navy-800"
                >
                  이번 달 청구 생성
                </button>
              </form>
            )}
          </div>
          <TuitionPaymentList payments={payments} today={today} />
        </div>
      </Container>
    </Section>
  );
}
