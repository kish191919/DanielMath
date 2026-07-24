import Link from "next/link";
import { Container } from "@/components/site/container";
import { Section } from "@/components/site/section";
import { Button } from "@/components/ui/button";
import { ScanStatusBadge } from "@/components/dashboard/scan-status-badge";
import { requireRole } from "@/lib/dal";
import { listPendingScans, listRecentScans } from "@/lib/learning-history/queries";
import { listStudents } from "@/lib/students/queries";

export default async function PrincipalHome() {
  const session = await requireRole("principal");
  const [pendingScans, students] = await Promise.all([listPendingScans(), listStudents()]);
  const widgetScans =
    pendingScans.length > 0 ? pendingScans.slice(0, 6) : await listRecentScans(6);
  const studentNameById = new Map(students.map((s) => [s.id, s.full_name]));

  return (
    <Section className="py-10 sm:py-14">
      <Container>
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wider text-navy-500">
            Principal · 원장
          </p>
          <h1 className="mt-2 text-2xl font-bold text-navy-900 sm:text-3xl">
            안녕하세요, {session.profile.full_name ?? session.email} 선생님
          </h1>
          <p className="mt-2 text-sm text-navy-700">
            오늘의 수업 준비를 시작하세요.
          </p>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Button href="/dashboard/principal/students/new" variant="secondary">
            학생 등록
          </Button>
          <Button href="/dashboard/principal/worksheets/new">새 학습지 업로드</Button>
        </div>

        <div className="mt-10">
          <div className="flex items-baseline justify-between gap-3">
            <h2 className="text-lg font-semibold text-navy-900 font-ko" lang="ko">
              최근 업로드 · 검토 대기
            </h2>
            <Link
              href="/dashboard/principal/worksheets"
              className="text-sm font-medium text-navy-600 underline underline-offset-2 hover:text-navy-800"
            >
              전체보기
            </Link>
          </div>

          <div className="mt-4 space-y-3">
            {widgetScans.length === 0 ? (
              <div className="rounded-2xl border border-navy-100 bg-white p-8 text-center text-sm text-navy-600">
                아직 업로드된 학습지가 없습니다.
              </div>
            ) : (
              widgetScans.map((scan) => (
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
                  <ScanStatusBadge status={scan.status} />
                </Link>
              ))
            )}
          </div>
        </div>
      </Container>
    </Section>
  );
}
