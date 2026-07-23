import Link from "next/link";
import { Container } from "@/components/site/container";
import { Section } from "@/components/site/section";
import { Button } from "@/components/ui/button";
import { requireRole } from "@/lib/dal";
import { listRecentScans } from "@/lib/learning-history/queries";
import { listStudents } from "@/lib/students/queries";
import { SCAN_STATUS_LABELS } from "@/lib/learning-history/schema";

const STATUS_STYLES: Record<string, string> = {
  uploaded: "bg-navy-50 text-navy-800",
  grading: "bg-gold-300/30 text-navy-800",
  pending_review: "bg-gold-300/30 text-navy-800",
  reviewed: "bg-green-100 text-green-800",
  grading_failed: "bg-red-100 text-red-700",
};

export default async function PrincipalWorksheetsPage({
  searchParams,
}: {
  searchParams: Promise<{ studentId?: string }>;
}) {
  await requireRole("principal");
  const { studentId } = await searchParams;
  const [scans, students] = await Promise.all([
    listRecentScans(50, studentId),
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
              아직 업로드된 학습지가 없습니다.
            </div>
          ) : (
            scans.map((scan) => (
              <Link
                key={scan.id}
                href={`/dashboard/principal/worksheets/${scan.id}`}
                className="flex items-center justify-between gap-3 rounded-2xl border border-navy-100 bg-white p-4 shadow-sm transition-colors hover:border-navy-300 hover:bg-navy-50 sm:p-5"
              >
                <div>
                  <p className="text-sm font-semibold text-navy-900">
                    {studentNameById.get(scan.student_id) ?? "알 수 없는 학생"}
                  </p>
                  <p className="mt-1 text-xs text-navy-600">{scan.session_date}</p>
                </div>
                <span
                  className={`inline-flex shrink-0 items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    STATUS_STYLES[scan.status] ?? "bg-navy-50 text-navy-800"
                  }`}
                >
                  {SCAN_STATUS_LABELS[scan.status]}
                </span>
              </Link>
            ))
          )}
        </div>
      </Container>
    </Section>
  );
}
