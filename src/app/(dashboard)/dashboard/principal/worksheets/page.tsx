import Link from "next/link";
import { Container } from "@/components/site/container";
import { Section } from "@/components/site/section";
import { Button } from "@/components/ui/button";
import { ScanStatusBadge } from "@/components/dashboard/scan-status-badge";
import { ConfirmSubmitButton } from "@/components/dashboard/confirm-submit-button";
import { requireRole } from "@/lib/dal";
import { listPendingScans, listRecentScans } from "@/lib/learning-history/queries";
import { deleteWorksheetScanAction } from "@/lib/learning-history/actions";
import { listStudents } from "@/lib/students/queries";

export default async function PrincipalWorksheetsPage({
  searchParams,
}: {
  searchParams: Promise<{ studentId?: string; status?: string }>;
}) {
  await requireRole("principal");
  const { studentId, status } = await searchParams;
  const isPendingFilter = status === "pending";
  const [scans, students] = await Promise.all([
    isPendingFilter ? listPendingScans() : listRecentScans(50, studentId),
    listStudents(),
  ]);
  const studentNameById = new Map(students.map((s) => [s.id, s.full_name]));

  return (
    <Section className="py-10 sm:py-14">
      <Container>
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-navy-500">
              Worksheets
            </p>
            <h1 className="mt-2 text-2xl font-bold text-navy-900 font-ko sm:text-3xl" lang="ko">
              학습지 스캔
            </h1>
            <p className="mt-2 text-sm text-navy-700 font-ko" lang="ko">
              학생이 푼 프린트물을 사진/PDF로 업로드하면 Claude Vision이 채점한 뒤 확인을 거쳐 학습이력에 저장됩니다.
            </p>
            {isPendingFilter && (
              <p className="mt-1 text-sm font-medium text-navy-600 font-ko" lang="ko">
                채점 대기 {scans.length}건
              </p>
            )}
          </div>
          <Button href="/dashboard/principal/worksheets/new">새 업로드</Button>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          <Link
            href="/dashboard/principal/worksheets"
            className={`inline-flex items-center rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
              !studentId
                ? "bg-navy-900 text-white"
                : "bg-navy-50 text-navy-700 hover:bg-navy-100"
            }`}
          >
            전체
          </Link>
          {students.map((student) => (
            <Link
              key={student.id}
              href={`/dashboard/principal/worksheets?studentId=${student.id}`}
              className={`inline-flex items-center rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                studentId === student.id
                  ? "bg-navy-900 text-white"
                  : "bg-navy-50 text-navy-700 hover:bg-navy-100"
              }`}
            >
              {student.full_name}
            </Link>
          ))}
        </div>

        <div className="mt-8 space-y-3">
          {scans.length === 0 ? (
            <div className="rounded-2xl border border-navy-100 bg-white p-8 text-center text-sm text-navy-600">
              {isPendingFilter
                ? "채점 대기 중인 학습지가 없습니다."
                : "아직 업로드된 학습지가 없습니다."}
            </div>
          ) : (
            scans.map((scan) => (
              <div
                key={scan.id}
                className="flex items-center justify-between gap-3 rounded-2xl border border-navy-100 bg-white p-4 shadow-sm transition-colors hover:border-navy-300 hover:bg-navy-50 sm:p-5"
              >
                <Link
                  href={`/dashboard/principal/worksheets/${scan.id}`}
                  className="flex flex-1 items-center justify-between gap-3"
                >
                  <div>
                    <p className="text-sm font-semibold text-navy-900">
                      {studentNameById.get(scan.student_id) ?? "알 수 없는 학생"}
                    </p>
                    <p className="mt-1 text-xs text-navy-600">{scan.session_date}</p>
                  </div>
                  <ScanStatusBadge status={scan.status} />
                </Link>
                <form action={deleteWorksheetScanAction.bind(null, scan.id, scan.student_id)}>
                  <ConfirmSubmitButton
                    label="삭제"
                    confirmMessage="이 학습지 스캔을 삭제하시겠습니까? 채점 결과와 업로드된 원본 파일도 함께 삭제되며 되돌릴 수 없습니다."
                    className="ml-2 shrink-0 rounded-md border border-red-200 px-3 py-1 text-xs font-medium text-red-700 hover:bg-red-50"
                  />
                </form>
              </div>
            ))
          )}
        </div>
      </Container>
    </Section>
  );
}
