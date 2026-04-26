import { Container } from "@/components/site/container";
import { Section } from "@/components/site/section";
import { StudentList } from "@/components/dashboard/student-list";
import { listStudents } from "@/lib/students/queries";
import { requireRole } from "@/lib/dal";

export default async function PrincipalStudentsPage() {
  await requireRole("principal");
  const students = await listStudents();

  return (
    <Section className="py-10 sm:py-14">
      <Container>
        <div className="flex items-end justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-navy-500">
              Students
            </p>
            <h1 className="mt-2 text-2xl font-bold text-navy-900 font-ko sm:text-3xl" lang="ko">
              학생 관리
            </h1>
          </div>
          <p className="text-sm text-navy-600">총 {students.length}명</p>
        </div>

        <div className="mt-8">
          <StudentList students={students} />
        </div>
      </Container>
    </Section>
  );
}
