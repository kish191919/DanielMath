import { notFound } from "next/navigation";
import { Container } from "@/components/site/container";
import { Section } from "@/components/site/section";
import { StudentForm } from "@/components/dashboard/student-form";
import { updateStudentAction } from "@/lib/students/actions";
import { getStudent } from "@/lib/students/queries";
import { requireRole } from "@/lib/dal";

export default async function EditStudentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireRole("principal");
  const { id } = await params;
  const student = await getStudent(id);
  if (!student) notFound();

  const action = updateStudentAction.bind(null, id);

  return (
    <Section className="py-10 sm:py-14">
      <Container className="max-w-2xl">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-navy-500">
            Edit Student
          </p>
          <h1 className="mt-2 text-2xl font-bold text-navy-900 font-ko sm:text-3xl" lang="ko">
            학생 수정 — {student.full_name}
          </h1>
        </div>
        <div className="mt-8">
          <StudentForm mode="edit" student={student} action={action} />
        </div>
      </Container>
    </Section>
  );
}
