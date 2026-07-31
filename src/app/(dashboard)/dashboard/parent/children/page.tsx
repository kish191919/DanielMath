import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Container } from "@/components/site/container";
import { Section } from "@/components/site/section";
import { listChildrenForParent } from "@/lib/learning-history/queries";
import { GRADE_LABELS } from "@/lib/students/schema";
import { requireRole } from "@/lib/dal";

export default async function ParentChildrenPage() {
  const session = await requireRole("parent");
  const children = await listChildrenForParent(session.userId);

  return (
    <Section className="py-10 sm:py-14">
      <Container>
        <div>
          <Link
            href="/dashboard/parent"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-navy-500 hover:text-navy-900"
          >
            <ArrowLeft className="h-4 w-4" />
            돌아가기
          </Link>
          <p className="mt-3 text-sm font-semibold uppercase tracking-wider text-navy-500">
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
              <Link
                key={child.id}
                href={`/dashboard/parent/progress?child=${child.id}`}
                className="rounded-2xl border border-navy-100 bg-white p-5 shadow-sm transition-colors hover:border-navy-300 hover:bg-navy-50"
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
              </Link>
            ))
          )}
        </div>
      </Container>
    </Section>
  );
}
