import Link from "next/link";
import { Container } from "@/components/site/container";
import { Section } from "@/components/site/section";
import { TuitionStatusBadge } from "@/components/dashboard/tuition-status-badge";
import { requireRole } from "@/lib/dal";
import { listTuitionPayments } from "@/lib/tuition/queries";
import { bulkGenerateBillingAction } from "@/lib/tuition/actions";
import {
  TUITION_STATUSES,
  TUITION_STATUS_LABELS,
  computeTuitionStatus,
  type TuitionStatus,
} from "@/lib/tuition/schema";
import { formatUsd } from "@/lib/tuition/format";
import { listStudents } from "@/lib/students/queries";
import { todayInEasternTime } from "@/lib/dates";

function isTuitionStatus(value: string | undefined): value is TuitionStatus {
  return !!value && (TUITION_STATUSES as readonly string[]).includes(value);
}

export default async function PrincipalTuitionPage({
  searchParams,
}: {
  searchParams: Promise<{ studentId?: string; status?: string }>;
}) {
  await requireRole("principal");
  const { studentId, status } = await searchParams;
  const statusFilter = isTuitionStatus(status) ? status : undefined;

  const [payments, students] = await Promise.all([
    listTuitionPayments({ studentId, status: statusFilter }),
    listStudents(),
  ]);
  const studentNameById = new Map(students.map((s) => [s.id, s.full_name]));
  const today = todayInEasternTime();

  return (
    <Section className="py-10 sm:py-14">
      <Container>
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-navy-500">
              Tuition
            </p>
            <h1 className="mt-2 text-2xl font-bold text-navy-900 font-ko sm:text-3xl" lang="ko">
              학원비 정산
            </h1>
            <p className="mt-2 text-sm text-navy-700 font-ko" lang="ko">
              학생별 학원비 청구와 납부 현황을 관리합니다.
            </p>
          </div>
          <form action={bulkGenerateBillingAction}>
            <button
              type="submit"
              className="rounded-md bg-navy-900 px-4 py-2 text-sm font-medium text-white hover:bg-navy-800"
            >
              이번 달 청구 생성 (전체)
            </button>
          </form>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          <Link
            href="/dashboard/principal/tuition"
            className={`inline-flex items-center rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
              !statusFilter ? "bg-navy-900 text-white" : "bg-navy-50 text-navy-700 hover:bg-navy-100"
            }`}
          >
            전체
          </Link>
          {TUITION_STATUSES.map((s) => (
            <Link
              key={s}
              href={`/dashboard/principal/tuition?status=${s}`}
              className={`inline-flex items-center rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                statusFilter === s
                  ? "bg-navy-900 text-white"
                  : "bg-navy-50 text-navy-700 hover:bg-navy-100"
              }`}
            >
              {TUITION_STATUS_LABELS[s]}
            </Link>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            href={
              statusFilter
                ? `/dashboard/principal/tuition?status=${statusFilter}`
                : "/dashboard/principal/tuition"
            }
            className={`inline-flex items-center rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
              !studentId ? "bg-navy-900 text-white" : "bg-navy-50 text-navy-700 hover:bg-navy-100"
            }`}
          >
            학생 전체
          </Link>
          {students.map((student) => {
            const params = new URLSearchParams();
            params.set("studentId", student.id);
            if (statusFilter) params.set("status", statusFilter);
            return (
              <Link
                key={student.id}
                href={`/dashboard/principal/tuition?${params.toString()}`}
                className={`inline-flex items-center rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                  studentId === student.id
                    ? "bg-navy-900 text-white"
                    : "bg-navy-50 text-navy-700 hover:bg-navy-100"
                }`}
              >
                {student.full_name}
              </Link>
            );
          })}
        </div>

        <div className="mt-8 space-y-3">
          {payments.length === 0 ? (
            <div className="rounded-2xl border border-navy-100 bg-white p-8 text-center text-sm text-navy-600">
              해당하는 청구 내역이 없습니다.
            </div>
          ) : (
            payments.map((payment) => (
              <Link
                key={payment.id}
                href={`/dashboard/principal/students/${payment.student_id}/tuition`}
                className="flex items-center justify-between gap-3 rounded-2xl border border-navy-100 bg-white p-4 shadow-sm transition-colors hover:border-navy-300 hover:bg-navy-50 sm:p-5"
              >
                <div>
                  <p className="text-sm font-semibold text-navy-900">
                    {studentNameById.get(payment.student_id) ?? "알 수 없는 학생"}
                  </p>
                  <p className="mt-1 text-xs text-navy-600">
                    {payment.billing_month.slice(0, 7)} · {formatUsd(payment.amount_due)} · 기한{" "}
                    {payment.due_date}
                  </p>
                </div>
                <TuitionStatusBadge status={computeTuitionStatus(payment, today)} />
              </Link>
            ))
          )}
        </div>
      </Container>
    </Section>
  );
}
