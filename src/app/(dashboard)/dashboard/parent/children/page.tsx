import { Container } from "@/components/site/container";
import { Section } from "@/components/site/section";
import { listStudents } from "@/lib/students/queries";
import { GRADE_LABELS } from "@/lib/students/schema";
import { requireRole } from "@/lib/dal";

export default async function ParentChildrenPage() {
  await requireRole("parent");
  const children = await listStudents(); // RLS limits to this parent's children

  return (
    <Section className="py-10 sm:py-14">
      <Container>
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-navy-500">
            Children
          </p>
          <h1 className="mt-2 text-2xl font-bold text-navy-900 font-ko sm:text-3xl" lang="ko">
            우리 아이
          </h1>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {children.length === 0 ? (
            <div className="col-span-full rounded-2xl border border-navy-100 bg-white p-8 text-center text-sm text-navy-600">
              등록된 자녀가 없습니다. 원장님께 문의해주세요.
            </div>
          ) : (
            children.map((child) => (
              <article
                key={child.id}
                className="rounded-2xl border border-navy-100 bg-white p-5 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-base font-semibold text-navy-900">
                    {child.full_name}
                  </h3>
                  <span className="inline-flex shrink-0 items-center rounded-full bg-navy-50 px-2 py-0.5 text-xs font-medium text-navy-800">
                    {GRADE_LABELS[child.grade]}
                  </span>
                </div>
                {child.notes && (
                  <p className="mt-3 line-clamp-3 text-xs text-navy-700 font-ko" lang="ko">
                    {child.notes}
                  </p>
                )}
              </article>
            ))
          )}
        </div>
      </Container>
    </Section>
  );
}
