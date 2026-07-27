import Link from "next/link";
import { Container } from "@/components/site/container";
import { Section } from "@/components/site/section";
import { Button } from "@/components/ui/button";
import { ScanStatusBadge } from "@/components/dashboard/scan-status-badge";
import { ConfirmSubmitButton } from "@/components/dashboard/confirm-submit-button";
import { requireRole } from "@/lib/dal";
import { listReferenceProblems, listPendingReferenceScans } from "@/lib/problem-bank/queries";
import { listConcepts } from "@/lib/learning-history/queries";
import { deleteReferenceScanAction, deleteReferenceProblemAction } from "@/lib/problem-bank/actions";

export default async function ProblemBankPage({
  searchParams,
}: {
  searchParams: Promise<{ conceptId?: string }>;
}) {
  await requireRole("principal");
  const { conceptId } = await searchParams;

  const [problems, concepts, pendingScans] = await Promise.all([
    listReferenceProblems({ conceptId }),
    listConcepts(),
    listPendingReferenceScans(),
  ]);
  const conceptById = new Map(concepts.map((c) => [c.id, c]));

  return (
    <Section className="py-10 sm:py-14">
      <Container>
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-navy-500">
              Problem Bank
            </p>
            <h1 className="mt-2 text-2xl font-bold text-navy-900 font-ko sm:text-3xl" lang="ko">
              문제 보관함
            </h1>
            <p className="mt-2 text-sm text-navy-700 font-ko" lang="ko">
              사진/PDF로 올려둔 좋은 문제를 개념별로 모아두고, 유사문제 생성 시 학생의 오답과
              함께 선택해 재사용하세요.
            </p>
          </div>
          <Button href="/dashboard/principal/problem-bank/new">업로드</Button>
        </div>

        {pendingScans.length > 0 && (
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-navy-900 font-ko" lang="ko">
              검토 대기 ({pendingScans.length})
            </h2>
            <div className="mt-3 space-y-3">
              {pendingScans.map((scan) => (
                <div
                  key={scan.id}
                  className="flex items-center justify-between gap-3 rounded-2xl border border-navy-100 bg-white p-4 shadow-sm transition-colors hover:border-navy-300 hover:bg-navy-50 sm:p-5"
                >
                  <Link
                    href={`/dashboard/principal/problem-bank/${scan.id}`}
                    className="flex flex-1 items-center justify-between gap-3"
                  >
                    <p className="text-sm font-semibold text-navy-900">
                      {scan.original_filename ?? "업로드된 문제"}
                    </p>
                    <ScanStatusBadge status={scan.status} />
                  </Link>
                  <form action={deleteReferenceScanAction.bind(null, scan.id)}>
                    <ConfirmSubmitButton
                      label="삭제"
                      confirmMessage="이 업로드를 삭제하시겠습니까? 추출된 문항과 원본 파일도 함께 삭제되며 되돌릴 수 없습니다."
                      className="ml-2 shrink-0 rounded-md border border-red-200 px-3 py-1 text-xs font-medium text-red-700 hover:bg-red-50"
                    />
                  </form>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8 flex flex-wrap gap-2">
          <Link
            href="/dashboard/principal/problem-bank"
            className={`inline-flex items-center rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
              !conceptId ? "bg-navy-900 text-white" : "bg-navy-50 text-navy-700 hover:bg-navy-100"
            }`}
          >
            전체
          </Link>
          {concepts.map((c) => (
            <Link
              key={c.id}
              href={`/dashboard/principal/problem-bank?conceptId=${c.id}`}
              className={`inline-flex items-center rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                conceptId === c.id
                  ? "bg-navy-900 text-white"
                  : "bg-navy-50 text-navy-700 hover:bg-navy-100"
              }`}
            >
              {c.label_ko}
            </Link>
          ))}
        </div>

        <div className="mt-6 space-y-3">
          {problems.length === 0 ? (
            <div className="rounded-2xl border border-navy-100 bg-white p-8 text-center text-sm text-navy-600">
              {conceptId ? "이 개념에 확정된 문제가 없습니다." : "아직 확정된 문제가 없습니다."}
            </div>
          ) : (
            problems.map((problem) => {
              const concept = problem.concept_id ? conceptById.get(problem.concept_id) : undefined;
              return (
                <div
                  key={problem.id}
                  className="rounded-2xl border border-navy-100 bg-white p-4 shadow-sm sm:p-5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <p className="text-xs font-semibold uppercase tracking-wide text-navy-500">
                        {concept ? `${concept.strand} · ${concept.label_ko}` : "미분류"}
                      </p>
                      <p className="mt-2 text-sm text-navy-900">
                        {problem.problem_number && (
                          <span className="mr-2 font-medium">#{problem.problem_number}</span>
                        )}
                        {problem.transcribed_problem}
                      </p>
                      {problem.transcribed_answer && (
                        <p className="mt-2 text-xs text-navy-600">
                          정답: {problem.transcribed_answer}
                        </p>
                      )}
                    </div>
                    <form action={deleteReferenceProblemAction.bind(null, problem.id)}>
                      <ConfirmSubmitButton
                        label="삭제"
                        confirmMessage="이 참고문제를 보관함에서 삭제하시겠습니까?"
                        className="shrink-0 rounded-md border border-red-200 px-3 py-1 text-xs font-medium text-red-700 hover:bg-red-50"
                      />
                    </form>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </Container>
    </Section>
  );
}
