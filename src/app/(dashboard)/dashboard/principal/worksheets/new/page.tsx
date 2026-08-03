import { Container } from "@/components/site/container";
import { Section } from "@/components/site/section";
import { UploadForm } from "./upload-form";
import { requireRole } from "@/lib/dal";
import { listStudents } from "@/lib/students/queries";
import { GRADING_ROUTE_MAX_DURATION_S } from "@/lib/ai/grading-config";

// confirmUploadAction only triggers /api/grading/run (fast fire-and-wait-
// for-ack) rather than running gradeWorksheetScan inline, so this page's own
// budget just needs to cover the upload confirmation + trigger round-trip.
// Kept in sync with the grading route's budget for simplicity — see
// src/lib/ai/grading-config.ts.
export const maxDuration = GRADING_ROUTE_MAX_DURATION_S;

export default async function NewWorksheetScanPage() {
  await requireRole("principal");
  const students = await listStudents();

  return (
    <Section className="py-10 sm:py-14">
      <Container className="max-w-2xl">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-navy-500">
            New Worksheet Scan
          </p>
          <h1 className="mt-2 text-2xl font-bold text-navy-900 font-ko sm:text-3xl" lang="ko">
            학습지 업로드
          </h1>
          <p className="mt-2 text-sm text-navy-700 font-ko" lang="ko">
            카메라로 여러 페이지를 연속 촬영하거나, 사진(JPG/PNG) 또는 스캔한 PDF 파일을 학생 1명당 업로드하세요.
          </p>
        </div>
        <div className="mt-8">
          <UploadForm students={students} />
        </div>
      </Container>
    </Section>
  );
}
