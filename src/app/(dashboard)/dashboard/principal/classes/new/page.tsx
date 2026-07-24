import { Container } from "@/components/site/container";
import { Section } from "@/components/site/section";
import { ClassForm } from "@/components/dashboard/class-form";
import { createClassAction } from "@/lib/classes/actions";
import { requireRole } from "@/lib/dal";

export default async function NewClassPage() {
  await requireRole("principal");

  return (
    <Section className="py-10 sm:py-14">
      <Container className="max-w-2xl">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-navy-500">
            New Class
          </p>
          <h1 className="mt-2 text-2xl font-bold text-navy-900 font-ko sm:text-3xl" lang="ko">
            반 등록
          </h1>
        </div>
        <div className="mt-8">
          <ClassForm mode="create" action={createClassAction} />
        </div>
      </Container>
    </Section>
  );
}
