import { Container } from "@/components/site/container";
import { Section } from "@/components/site/section";
import { UploadForm } from "./upload-form";
import { requireRole } from "@/lib/dal";

// Extraction (Claude Vision) runs via after() but still shares this route's
// duration budget — same reasoning as worksheets/new/page.tsx.
export const maxDuration = 180;

export default async function NewReferenceProblemPage() {
  await requireRole("principal");

  return (
    <Section className="py-10 sm:py-14">
      <Container className="max-w-2xl">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-navy-500">
            New Reference Problem
          </p>
          <h1 className="mt-2 text-2xl font-bold text-navy-900 font-ko sm:text-3xl" lang="ko">
            문제 보관함에 업로드
          </h1>
          <p className="mt-2 text-sm text-navy-700 font-ko" lang="ko">
            카메라로 여러 페이지를 연속 촬영하거나, 사진(JPG/PNG) 또는 스캔한 PDF 파일을
            업로드하세요. 학생과 무관하게 전체 보관함에 저장되어 나중에 유사문제 생성 시
            재사용할 수 있습니다.
          </p>
        </div>
        <div className="mt-8">
          <UploadForm />
        </div>
      </Container>
    </Section>
  );
}
