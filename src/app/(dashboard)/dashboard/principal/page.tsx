import Link from "next/link";
import { Container } from "@/components/site/container";
import { Section } from "@/components/site/section";
import { requireRole } from "@/lib/dal";

const cards = [
  {
    href: "/dashboard/principal/students",
    title: "학생 관리",
    titleEn: "Students",
    description: "학생을 등록하고 학년·학부모 정보를 관리합니다.",
    ready: true,
  },
  {
    href: "/dashboard/principal/worksheets",
    title: "학습지",
    titleEn: "Worksheets",
    description: "AI로 학년별·유형별 영어 학습지를 생성하고 PDF로 출력합니다.",
    ready: false,
  },
  {
    href: "/dashboard/principal/progress",
    title: "진행 상황",
    titleEn: "Progress",
    description: "학생별 진도, 정답률, AAP/CogAT 모의 점수 트렌드를 확인합니다.",
    ready: false,
  },
];

export default async function PrincipalHome() {
  const session = await requireRole("principal");

  return (
    <Section className="py-10 sm:py-14">
      <Container>
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wider text-navy-500">
            Principal · 원장
          </p>
          <h1 className="mt-2 text-2xl font-bold text-navy-900 sm:text-3xl">
            안녕하세요, {session.profile.full_name ?? session.email} 선생님
          </h1>
          <p className="mt-2 text-sm text-navy-700">
            오늘의 수업 준비를 시작하세요.
          </p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
                <span className="text-xs font-medium text-navy-500">
                  {card.titleEn}
                </span>
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
