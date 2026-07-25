import Link from "next/link";
import { Container } from "@/components/site/container";
import { Section } from "@/components/site/section";
import { requireRole } from "@/lib/dal";

const cards = [
  {
    href: "/dashboard/parent/children",
    title: "자녀",
    description: "등록된 자녀와 학년 정보를 확인합니다.",
    ready: true,
  },
  {
    href: "/dashboard/parent/progress",
    title: "진행 상황",
    description: "개념별 정답률과 선생님이 남긴 학습 리포트를 확인합니다.",
    ready: true,
  },
];

export default async function ParentHome() {
  const session = await requireRole("parent");

  return (
    <Section className="py-10 sm:py-14">
      <Container>
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wider text-navy-500">
            학부모
          </p>
          <h1 className="mt-2 text-2xl font-bold text-navy-900 sm:text-3xl">
            안녕하세요, {session.profile.full_name ?? session.email} 학부모님
          </h1>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {cards.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="group flex flex-col rounded-2xl border border-navy-100 bg-white p-6 shadow-sm transition-colors hover:border-navy-300 hover:bg-navy-50"
            >
              <div className="flex items-baseline justify-between">
                <h2 className="text-lg font-semibold text-navy-900 font-ko" lang="ko">
                  {card.title}
                </h2>
              </div>
              <p className="mt-3 flex-1 text-sm text-navy-700 font-ko" lang="ko">
                {card.description}
              </p>
              {!card.ready && (
                <p className="mt-4 inline-flex w-fit items-center rounded-full bg-gold-300/30 px-2 py-0.5 text-xs font-medium text-navy-800">
                  Phase B-2 예정
                </p>
              )}
            </Link>
          ))}
        </div>
      </Container>
    </Section>
  );
}
