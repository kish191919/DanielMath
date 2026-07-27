import { notFound } from "next/navigation";
import { Container } from "@/components/site/container";
import { Section } from "@/components/site/section";
import { ReferenceReviewTable } from "@/components/dashboard/reference-review-table";
import { GradingStatusPoller } from "@/components/dashboard/grading-status-poller";
import { requireRole } from "@/lib/dal";
import {
  getReferenceScanWithItems,
  getSignedReferenceScanViewUrl,
} from "@/lib/problem-bank/queries";
import { listConcepts } from "@/lib/learning-history/queries";
import { retryReferenceExtractionAction } from "@/lib/problem-bank/actions";
import { SCAN_STATUS_LABELS } from "@/lib/learning-history/schema";

// retryReferenceExtractionAction kicks off the same potentially slow Claude
// Vision call via after() — see worksheets/[scanId]/page.tsx.
export const maxDuration = 180;

export default async function ReferenceScanReviewPage({
  params,
}: {
  params: Promise<{ scanId: string }>;
}) {
  await requireRole("principal");
  const { scanId } = await params;

  const result = await getReferenceScanWithItems(scanId);
  if (!result) notFound();
  const { scan, items } = result;

  const [viewUrl, concepts] = await Promise.all([
    getSignedReferenceScanViewUrl(scanId),
    listConcepts(),
  ]);

  const readOnly = scan.status === "reviewed";

  return (
    <Section className="py-10 sm:py-14">
      <Container className="max-w-3xl">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-navy-500">
              Reference Problem Scan
            </p>
            <h1 className="mt-2 text-2xl font-bold text-navy-900 font-ko sm:text-3xl" lang="ko">
              {scan.original_filename ?? "업로드된 문제"}
            </h1>
          </div>
          <span className="inline-flex shrink-0 items-center rounded-full bg-navy-50 px-2.5 py-0.5 text-xs font-medium text-navy-800">
            {SCAN_STATUS_LABELS[scan.status]}
          </span>
        </div>

        {viewUrl && (
          <div className="mt-6 overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-sm">
            {scan.mime_type === "application/pdf" ? (
              <iframe src={viewUrl} className="h-[500px] w-full" title="원본 파일" />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={viewUrl} alt="원본 파일" className="max-h-[600px] w-full object-contain" />
            )}
          </div>
        )}

        <GradingStatusPoller isGrading={scan.status === "grading"} />

        {scan.status === "grading" && (
          <div className="mt-6 flex items-center gap-3 rounded-2xl border border-navy-100 bg-navy-50/50 p-5">
            <span
              className="h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-navy-300 border-t-navy-700"
              aria-hidden="true"
            />
            <p className="text-sm font-medium text-navy-800 font-ko" lang="ko">
              AI가 문제를 추출하고 있습니다. 완료되면 화면이 자동으로 갱신됩니다.
            </p>
          </div>
        )}

        {(scan.status === "grading_failed" ||
          (scan.status === "pending_review" && items.length === 0)) && (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-5">
            <p className="text-sm font-medium text-red-800">
              {scan.status === "grading_failed"
                ? "문제 추출에 실패했습니다."
                : "AI가 문항을 인식하지 못했습니다. 응답이 중간에 잘렸을 수 있습니다."}
            </p>
            {scan.grading_error && (
              <p className="mt-1 text-xs text-red-700">{scan.grading_error}</p>
            )}
            <form action={retryReferenceExtractionAction.bind(null, scanId)} className="mt-3">
              <button
                type="submit"
                className="rounded-md border border-red-300 bg-white px-3 py-1.5 text-sm font-medium text-red-800 hover:bg-red-100"
              >
                다시 추출하기
              </button>
            </form>
          </div>
        )}

        <div className="mt-8">
          <h2 className="text-lg font-semibold text-navy-900 font-ko" lang="ko">
            {readOnly ? "확정된 문항" : "AI 추출 결과 확인"}
          </h2>
          <p className="mt-1 text-sm text-navy-600 font-ko" lang="ko">
            {readOnly
              ? "이 스캔은 이미 확정되어 문제 보관함에 반영되었습니다."
              : "원본과 대조하여 필요한 부분을 수정하고, 모든 문항에 개념을 지정한 뒤 확정하세요."}
          </p>
          <div className="mt-4">
            <ReferenceReviewTable
              scanId={scanId}
              initialItems={items}
              concepts={concepts}
              readOnly={readOnly}
            />
          </div>
        </div>
      </Container>
    </Section>
  );
}
