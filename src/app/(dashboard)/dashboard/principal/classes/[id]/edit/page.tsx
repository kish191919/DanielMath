import { notFound } from "next/navigation";
import { Container } from "@/components/site/container";
import { Section } from "@/components/site/section";
import { ClassForm } from "@/components/dashboard/class-form";
import { updateClassAction } from "@/lib/classes/actions";
import { getClass } from "@/lib/classes/queries";
import { requireRole } from "@/lib/dal";

export default async function EditClassPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireRole("principal");
  const { id } = await params;
  const classRecord = await getClass(id);
  if (!classRecord) notFound();

  const action = updateClassAction.bind(null, id);

  return (
    <Section className="py-10 sm:py-14">
      <Container className="max-w-2xl">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-navy-500">
            Edit Class
          </p>
          <h1 className="mt-2 text-2xl font-bold text-navy-900 font-ko sm:text-3xl" lang="ko">
            반 수정 — {classRecord.name}
          </h1>
        </div>
        <div className="mt-8">
          <ClassForm mode="edit" classRecord={classRecord} action={action} />
        </div>
      </Container>
    </Section>
  );
}
