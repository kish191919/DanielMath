import { Container } from "@/components/site/container";
import { Section } from "@/components/site/section";
import { StudentForm } from "@/components/dashboard/student-form";
import { createStudentAction } from "@/lib/students/actions";
import { getInquiry } from "@/lib/inquiries/queries";
import { requireRole } from "@/lib/dal";

type Props = {
  searchParams: Promise<{ fromInquiry?: string }>;
};

export default async function NewStudentPage({ searchParams }: Props) {
  await requireRole("principal");
  const { fromInquiry } = await searchParams;
  const inquiry = fromInquiry ? await getInquiry(fromInquiry) : null;

  return (
    <Section className="py-10 sm:py-14">
      <Container className="max-w-2xl">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-navy-500">
            New Student
          </p>
          <h1 className="mt-2 text-2xl font-bold text-navy-900 font-ko sm:text-3xl" lang="ko">
            학생 등록
          </h1>
          {inquiry && (
            <p className="mt-2 text-sm text-navy-600">
              {inquiry.parent_name}님의 상담 문의에서 이어짐 — 아래 내용이 미리 채워져 있습니다.
              <br />
              상담 문의 이메일: {inquiry.contact_email} (학생 등록 후 학생 상세 페이지의
              &ldquo;보호자&rdquo; 섹션에서 이 이메일로 연결하세요.)
            </p>
          )}
        </div>
        <div className="mt-8">
          <StudentForm
            mode="create"
            action={createStudentAction}
            prefill={
              inquiry
                ? {
                    full_name: inquiry.child_name,
                    grade: inquiry.grade,
                    notes: inquiry.message ? `학부모 문의 내용: ${inquiry.message}` : "",
                  }
                : undefined
            }
            fromInquiryId={inquiry?.id}
          />
        </div>
      </Container>
    </Section>
  );
}
