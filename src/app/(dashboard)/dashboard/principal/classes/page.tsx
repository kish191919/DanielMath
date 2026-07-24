import { Container } from "@/components/site/container";
import { Section } from "@/components/site/section";
import { ClassList } from "@/components/dashboard/class-list";
import { listClassesWithCounts } from "@/lib/classes/queries";
import { requireRole } from "@/lib/dal";

export default async function PrincipalClassesPage() {
  await requireRole("principal");
  const classes = await listClassesWithCounts();

  return (
    <Section className="py-10 sm:py-14">
      <Container>
        <div className="flex items-end justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-navy-500">
              Classes
            </p>
            <h1 className="mt-2 text-2xl font-bold text-navy-900 font-ko sm:text-3xl" lang="ko">
              반 관리
            </h1>
          </div>
          <p className="text-sm text-navy-600">총 {classes.length}개</p>
        </div>

        <div className="mt-8">
          <ClassList classes={classes} />
        </div>
      </Container>
    </Section>
  );
}
