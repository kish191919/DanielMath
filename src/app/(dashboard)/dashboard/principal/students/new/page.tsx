import { Container } from "@/components/site/container";
import { Section } from "@/components/site/section";
import { StudentForm } from "@/components/dashboard/student-form";
import { createStudentAction } from "@/lib/students/actions";
import { requireRole } from "@/lib/dal";

export default async function NewStudentPage() {
  await requireRole("principal");

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
        </div>
        <div className="mt-8">
          <StudentForm mode="create" action={createStudentAction} />
        </div>
      </Container>
    </Section>
  );
}
