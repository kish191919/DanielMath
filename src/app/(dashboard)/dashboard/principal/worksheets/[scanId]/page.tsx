import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink, ArrowLeft } from "lucide-react";
import { Container } from "@/components/site/container";
import { Section } from "@/components/site/section";
import { Button } from "@/components/ui/button";
import { BackLink } from "@/components/ui/back-link";
import { ReviewTable } from "@/components/dashboard/review-table";
import { ParentReportWorkspace } from "@/components/dashboard/parent-report-workspace";
import { ScanStatusBadge } from "@/components/dashboard/scan-status-badge";
import { CorrectionUploadForm } from "@/components/dashboard/correction-upload-form";
import { ConfirmSubmitButton } from "@/components/dashboard/confirm-submit-button";
import { requireRole } from "@/lib/dal";
import {
  getScanWithItems,
  getSignedScanViewUrl,
  getSessionNoteForScan,
  getLastSentNoteLanguage,
  listConcepts,
  listCorrectionScansForScan,
  getConfirmedItemsForScans,
} from "@/lib/learning-history/queries";
import { retryGradingAction, deleteWorksheetScanAction } from "@/lib/learning-history/actions";
import { getStudent } from "@/lib/students/queries";
import { SCAN_STATUS_LABELS } from "@/lib/learning-history/schema";
import { computeSessionStats, sortedStatLabels } from "@/lib/learning-history/stats";
import { GradingStatusPoller } from "@/components/dashboard/grading-status-poller";
import { isGradingStuck } from "@/lib/scan-status";
import { WORKSHEET_GRADING_STUCK_THRESHOLD_MS } from "@/lib/ai/grading-config";

// This page itself no longer runs grading inline — retryGradingAction just
// triggers /api/grading/run (its own maxDuration budget, see
// src/lib/ai/grading-config.ts) and returns fast. This value only needs to
// cover the redirect + trigger round-trip. Must be a literal here (not an
// imported constant) — Next.js reads route segment config via static
// analysis, not module evaluation. Keep this in sync with
// GRADING_ROUTE_MAX_DURATION_S in src/lib/ai/grading-config.ts.
export const maxDuration = 300;

export default async function WorksheetScanReviewPage({
  params,
}: {
  params: Promise<{ scanId: string }>;
}) {
  await requireRole("principal");
  const { scanId } = await params;

  const result = await getScanWithItems(scanId);
  if (!result) notFound();
  const { scan, items } = result;

  const [student, viewUrl, concepts] = await Promise.all([
    getStudent(scan.student_id),
    getSignedScanViewUrl(scanId),
    listConcepts(),
  ]);
  if (!student) notFound();

  // A raw (never AI-graded) full-session upload starts at "uploaded" and,
  // if the teacher sends the session report before ever uploading a
  // correction re-scan, sendSessionNoteAction flips it to
  // "delivered_to_parent" (see actions.ts) — that must NOT hide the
  // correction-upload UI below, since this scan still hasn't been graded.
  // graded_at/source_scan_id are the actual "has this ever been graded"
  // signal: every scan created before this feature shipped already went
  // through the old direct-grading flow and has graded_at set, so this
  // still keeps those legacy scans on the AI-review screen below with no
  // behavior change for them.
  const isRawScan =
    scan.status === "uploaded" ||
    (scan.status === "delivered_to_parent" && !scan.graded_at && !scan.source_scan_id);

  const viewer = viewUrl && (
    <>
      <div className="mt-6 flex items-center justify-between gap-3 rounded-2xl border border-navy-100 bg-navy-50/50 p-4">
        <p className="text-sm text-navy-700 font-ko" lang="ko">
          {scan.mime_type === "application/pdf"
            ? "여러 장을 촬영한 스캔은 새 창에서 열어야 모든 페이지를 넘겨보고 확대할 수 있어요."
            : "새 창에서 열면 사진을 자유롭게 확대/축소해서 볼 수 있어요."}
        </p>
        <Button href={viewUrl} external variant="primary" size="md" className="shrink-0">
          <ExternalLink className="h-4 w-4" />
          새 창에서 크게 보기
        </Button>
      </div>

      <div className="mt-4 overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-sm">
        {scan.mime_type === "application/pdf" ? (
          <iframe src={viewUrl} className="h-[500px] w-full" title="원본 스캔 (미리보기, 첫 페이지만 표시)" />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={viewUrl} alt="원본 스캔" className="max-h-[600px] w-full object-contain" />
        )}
      </div>
    </>
  );

  const header = (
    <div className="flex items-end justify-between gap-3">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wider text-navy-500">
          Worksheet Review
        </p>
        <h1 className="mt-2 text-2xl font-bold text-navy-900 font-ko sm:text-3xl" lang="ko">
          {student.full_name} — {scan.session_date}
        </h1>
      </div>
      <span className="inline-flex shrink-0 items-center rounded-full bg-navy-50 px-2.5 py-0.5 text-xs font-medium text-navy-800">
        {SCAN_STATUS_LABELS[scan.status]}
      </span>
    </div>
  );

  if (isRawScan) {
    const [correctionScans, existingNote, lastNoteLanguage] = await Promise.all([
      listCorrectionScansForScan(scanId),
      getSessionNoteForScan(scanId),
      getLastSentNoteLanguage(scan.student_id),
    ]);
    const reviewedCorrectionScans = correctionScans.filter((s) => s.status === "reviewed");
    const confirmedItems = await getConfirmedItemsForScans(
      reviewedCorrectionScans.map((s) => s.id),
    );
    const stats = computeSessionStats(confirmedItems, concepts);
    const { conceptLabels, errorTypeLabels } = sortedStatLabels(stats);

    return (
      <Section className="py-10 sm:py-14">
        <Container className="max-w-3xl">
          <BackLink label="학습지 목록으로 돌아가기" />
          {header}
          {viewer}

          <div className="mt-8 space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-navy-900 font-ko" lang="ko">
                오답 학습지 촬영
              </h2>
              <p className="mt-1 text-sm text-navy-600 font-ko" lang="ko">
                채점 후 빨간 펜으로 표시한 오답 부분을 다시 촬영하면 AI가 표시된 문제만 추출해서 검토·분석해드려요.
              </p>
            </div>

            {correctionScans.length > 0 && (
              <div className="space-y-2">
                {correctionScans.map((cs) => (
                  <div
                    key={cs.id}
                    className="flex items-center justify-between gap-3 rounded-2xl border border-navy-100 bg-white p-4 shadow-sm transition-colors hover:border-navy-300 hover:bg-navy-50"
                  >
                    <Link
                      href={`/dashboard/principal/worksheets/${cs.id}`}
                      className="flex flex-1 items-center justify-between gap-3"
                    >
                      <span className="text-sm text-navy-800 font-ko" lang="ko">
                        오답 재촬영본 — {new Date(cs.created_at).toLocaleString("ko-KR")}
                      </span>
                      <ScanStatusBadge status={cs.status} />
                    </Link>
                    <form action={deleteWorksheetScanAction.bind(null, cs.id, scan.student_id, scanId)}>
                      <ConfirmSubmitButton
                        label="삭제"
                        confirmMessage="이 재촬영본을 삭제하시겠습니까? 채점 결과가 함께 삭제되며 되돌릴 수 없습니다."
                        className="ml-2 shrink-0 rounded-md border border-red-200 px-3 py-1 text-xs font-medium text-red-700 hover:bg-red-50"
                      />
                    </form>
                  </div>
                ))}
              </div>
            )}

            <CorrectionUploadForm
              studentId={scan.student_id}
              sessionDate={scan.session_date}
              sourceScanId={scanId}
            />
          </div>

          <div className="mt-8">
            <ParentReportWorkspace
              conceptLabels={conceptLabels}
              errorTypeLabels={errorTypeLabels}
              studentId={scan.student_id}
              scanId={scanId}
              sessionDate={scan.session_date}
              existingNote={existingNote}
              initialLanguage={lastNoteLanguage}
              initialSummary={scan.parent_summary}
            />
          </div>
        </Container>
      </Section>
    );
  }

  // Correction scan (source_scan_id set) or a legacy scan graded before this
  // change (source_scan_id null but already past "uploaded") — same AI
  // review flow as before.
  const [existingNote, lastNoteLanguage] = await Promise.all([
    scan.source_scan_id ? Promise.resolve(null) : getSessionNoteForScan(scanId),
    getLastSentNoteLanguage(scan.student_id),
  ]);

  const readOnly = scan.status === "reviewed";
  const stuck = isGradingStuck(scan.status, scan.updated_at, WORKSHEET_GRADING_STUCK_THRESHOLD_MS);
  const stats = computeSessionStats(
    items.filter((i) => i.confirmed),
    concepts,
  );
  const { conceptLabels, errorTypeLabels } = sortedStatLabels(stats);

  return (
    <Section className="py-10 sm:py-14">
      <Container className="max-w-3xl">
        <BackLink label="학습지 목록으로 돌아가기" />
        {scan.source_scan_id && (
          <Link
            href={`/dashboard/principal/worksheets/${scan.source_scan_id}`}
            className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-navy-500 hover:text-navy-900"
          >
            <ArrowLeft className="h-4 w-4" />
            원본 학습지로 돌아가기
          </Link>
        )}

        {header}
        {viewer}

        <GradingStatusPoller isGrading={scan.status === "grading"} />

        {scan.status === "grading" && !stuck && (
          <div className="mt-6 flex items-center gap-3 rounded-2xl border border-navy-100 bg-navy-50/50 p-5">
            <span
              className="h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-navy-300 border-t-navy-700"
              aria-hidden="true"
            />
            <p className="text-sm font-medium text-navy-800 font-ko" lang="ko">
              AI가 채점 중입니다. 완료되면 화면이 자동으로 갱신됩니다.
            </p>
          </div>
        )}

        {(scan.status === "grading_failed" ||
          stuck ||
          (scan.status === "pending_review" && items.length === 0)) && (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-5">
            <p className="text-sm font-medium text-red-800">
              {scan.status === "grading_failed"
                ? "채점에 실패했습니다."
                : stuck
                  ? "채점이 예상보다 오래 걸리고 있어요. 다시 시도해보시겠어요?"
                  : "AI가 문항을 인식하지 못했습니다. 응답이 중간에 잘렸을 수 있습니다."}
            </p>
            {scan.grading_error && (
              <p className="mt-1 text-xs text-red-700">{scan.grading_error}</p>
            )}
            <form action={retryGradingAction.bind(null, scanId)} className="mt-3">
              <button
                type="submit"
                className="rounded-md border border-red-300 bg-white px-3 py-1.5 text-sm font-medium text-red-800 hover:bg-red-100"
              >
                다시 채점하기
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
              ? "이 스캔은 이미 확정되어 학습이력에 반영되었습니다."
              : "원본과 대조하여 필요한 부분을 수정한 뒤 확정하세요."}
          </p>
          <div className="mt-4">
            <ReviewTable
              key={scan.status}
              scanId={scanId}
              studentId={scan.student_id}
              sessionDate={scan.session_date}
              initialItems={items}
              concepts={concepts}
              readOnly={readOnly}
            />
          </div>
        </div>

        {!scan.source_scan_id && (
          <div className="mt-8">
            <ParentReportWorkspace
              conceptLabels={conceptLabels}
              errorTypeLabels={errorTypeLabels}
              studentId={scan.student_id}
              scanId={scanId}
              sessionDate={scan.session_date}
              existingNote={existingNote}
              initialLanguage={lastNoteLanguage}
              initialSummary={scan.parent_summary}
            />
          </div>
        )}
      </Container>
    </Section>
  );
}
