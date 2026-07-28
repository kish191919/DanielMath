import { notFound } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { Container } from "@/components/site/container";
import { Section } from "@/components/site/section";
import { Button } from "@/components/ui/button";
import { requireRole } from "@/lib/dal";
import { getSignedScanViewUrlForParent } from "@/lib/learning-history/queries";
import { getStudent } from "@/lib/students/queries";

export default async function ParentWorksheetViewPage({
  params,
}: {
  params: Promise<{ scanId: string }>;
}) {
  const session = await requireRole("parent");
  const { scanId } = await params;

  const result = await getSignedScanViewUrlForParent(session.userId, scanId);
  if (!result) notFound();
  const { url, scan } = result;

  const student = await getStudent(scan.student_id);
  if (!student) notFound();

  return (
    <Section className="py-10 sm:py-14">
      <Container className="max-w-3xl">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-navy-500">
            Worksheet
          </p>
          <h1 className="mt-2 text-2xl font-bold text-navy-900 font-ko sm:text-3xl" lang="ko">
            {student.full_name} — {scan.session_date}
          </h1>
        </div>

        <div className="mt-4 flex items-center justify-between gap-3 rounded-2xl border border-navy-100 bg-navy-50/50 p-4">
          <p className="text-sm text-navy-700 font-ko" lang="ko">
            {scan.mime_type === "application/pdf"
              ? "여러 장을 촬영한 학습지는 새 창에서 열어야 모든 페이지를 넘겨보고 확대할 수 있어요."
              : "새 창에서 열면 사진을 자유롭게 확대/축소해서 볼 수 있어요."}
          </p>
          <Button href={url} external variant="primary" size="md" className="shrink-0">
            <ExternalLink className="h-4 w-4" />
            새 창에서 크게 보기
          </Button>
        </div>

        <div className="mt-4 overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-sm">
          {scan.mime_type === "application/pdf" ? (
            <iframe src={url} className="h-[600px] w-full" title="원본 학습지 (미리보기, 첫 페이지만 표시)" />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={url} alt="원본 학습지" className="max-h-[700px] w-full object-contain" />
          )}
        </div>
      </Container>
    </Section>
  );
}
