import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/site/container";
import { Section } from "@/components/site/section";
import { PracticeSheetReviewTable } from "@/components/dashboard/practice-sheet-review-table";
import { requireRole } from "@/lib/dal";
import { getPracticeSheetWithProblems } from "@/lib/practice-sheets/queries";
import { getStudent } from "@/lib/students/queries";

const STATUS_LABELS = { draft: "검토중", confirmed: "확정됨" } as const;

export default async function PracticeSheetReviewPage({
  params,
}: {
  params: Promise<{ worksheetId: string }>;
}) {
  await requireRole("principal");
  const { worksheetId } = await params;

  const result = await getPracticeSheetWithProblems(worksheetId);
  if (!result) notFound();
  const { worksheet, problems } = result;

  const student = worksheet.student_id ? await getStudent(worksheet.student_id) : null;
  if (worksheet.student_id && !student) notFound();

  const readOnly = worksheet.status === "confirmed";

  return (
    <Section className="py-10 sm:py-14">
      <Container className="max-w-3xl">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-navy-500">
              Practice Sheet
            </p>
            <h1 className="mt-2 text-2xl font-bold text-navy-900 font-ko sm:text-3xl" lang="ko">
              {student ? `${student.full_name} — 유사문제 검토` : "공통 학습지 — 유사문제 검토"}
            </h1>
          </div>
          <span className="inline-flex shrink-0 items-center rounded-full bg-navy-50 px-2.5 py-0.5 text-xs font-medium text-navy-800">
            {STATUS_LABELS[worksheet.status]}
          </span>
        </div>

        <div className="mt-8">
          <p className="text-sm text-navy-600 font-ko" lang="ko">
            {readOnly
              ? "이 학습지는 이미 확정되었습니다."
              : "AI가 생성한 문제와 정답을 확인하고 필요한 부분을 수정한 뒤 확정하세요."}
          </p>
          <div className="mt-4">
            <PracticeSheetReviewTable
              worksheetId={worksheetId}
              initialProblems={problems}
              initialTitle={worksheet.title}
              readOnly={readOnly}
            />
          </div>
        </div>

        {readOnly && (
          <div className="mt-8">
            <Link
              href={`/dashboard/principal/practice-sheets/${worksheetId}/print`}
              className="inline-flex items-center rounded-lg bg-navy-900 px-4 py-2 text-sm font-medium text-white hover:bg-navy-800"
            >
              인쇄 페이지 열기
            </Link>
          </div>
        )}
      </Container>
    </Section>
  );
}
