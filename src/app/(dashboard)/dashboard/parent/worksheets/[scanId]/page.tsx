import { notFound } from "next/navigation";
import { Container } from "@/components/site/container";
import { Section } from "@/components/site/section";
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

        <div className="mt-6 overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-sm">
          {scan.mime_type === "application/pdf" ? (
            <iframe src={url} className="h-[600px] w-full" title="원본 학습지" />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={url} alt="원본 학습지" className="max-h-[700px] w-full object-contain" />
          )}
        </div>
      </Container>
    </Section>
  );
}
