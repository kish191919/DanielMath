import { Container } from "@/components/site/container";
import { Section } from "@/components/site/section";
import { UploadForm } from "./upload-form";
import { requireRole } from "@/lib/dal";
import { listStudents } from "@/lib/students/queries";

// Grading a multi-page scan can take a while (Claude Vision + adaptive
// thinking); give the Server Action triggered from this page room to finish
// on serverless deployments instead of the platform's default timeout.
export const maxDuration = 180;

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
