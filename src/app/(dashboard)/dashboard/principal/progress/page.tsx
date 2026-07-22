import Link from "next/link";
import { Container } from "@/components/site/container";
import { Section } from "@/components/site/section";
import { requireRole } from "@/lib/dal";
import { listStudentsProgressOverview } from "@/lib/learning-history/queries";
import { GRADE_LABELS } from "@/lib/students/schema";

export default async function PrincipalProgressPage() {
  await requireRole("principal");
  const overview = await listStudentsProgressOverview();

  return (
    <Section className="py-10 sm:py-14">
      <Container>
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-navy-500">
            Progress
          </p>
          <h1 className="mt-2 text-2xl font-bold text-navy-900 font-ko sm:text-3xl" lang="ko">
            학생별 진행 상황
          </h1>
          <p className="mt-2 text-sm text-navy-700 font-ko" lang="ko">
            최근 30일간 확정된 학습이력 기준 정답률입니다. 학생을 클릭하면 개념별 상세 이력을 볼 수 있습니다.
          </p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {overview.length === 0 ? (
            <div className="col-span-full rounded-2xl border border-navy-100 bg-white p-8 text-center text-sm text-navy-600">
              등록된 학생이 없습니다.
            </div>
          ) : (
            overview.map(({ student, lastSessionDate, recentAccuracyRate, recentTotal }) => (
              <Link
                key={student.id}
                href={`/dashboard/principal/students/${student.id}/history`}
                className="flex flex-col rounded-2xl border border-navy-100 bg-white p-5 shadow-sm transition-colors hover:border-navy-300 hover:bg-navy-50"
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-base font-semibold text-navy-900">{student.full_name}</h3>
                  <span className="inline-flex shrink-0 items-center rounded-full bg-navy-50 px-2 py-0.5 text-xs font-medium text-navy-800">
                    {GRADE_LABELS[student.grade]}
                  </span>
                </div>
                <p className="mt-3 text-sm text-navy-700">
                  최근 30일 정답률:{" "}
                  {recentAccuracyRate === null ? (
                    <span className="text-navy-400">기록 없음</span>
                  ) : (
                    <span className="font-medium text-navy-900">
                      {recentAccuracyRate}% ({recentTotal}문항)
                    </span>
                  )}
                </p>
                <p className="mt-1 text-xs text-navy-500">
                  마지막 수업일: {lastSessionDate ?? "-"}
                </p>
              </Link>
            ))
          )}
        </div>
      </Container>
    </Section>
  );
}
