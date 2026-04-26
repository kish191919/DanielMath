import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/site/container";
import { Section, SectionHeader } from "@/components/site/section";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Programs · 프로그램",
  description:
    "K-2 AAP 진입과 3-6 AAP 유지·심화. 학년과 목표에 맞춘 두 트랙을 운영합니다.",
};

const programs = [
  {
    href: "/programs/aap-entry",
    grade: "K – 2",
    title: "AAP Entry Track",
    titleKo: "AAP 진입 트랙",
    target: "AAP·SPECTRUM·G&T 입학을 목표로 하는 K-2 학생",
    pillars: ["CogAT/NNAT 추론", "Common Core 학년 진도", "도형·패턴 사고력", "수학 어휘 영어"],
    outcome: "2학년 CogAT/NNAT 안정적 응시, AAP Level 4 합격",
  },
  {
    href: "/programs/aap-honors",
    grade: "3 – 6",
    title: "AAP Honors Track",
    titleKo: "AAP 유지·심화 트랙",
    target: "AAP 합격 후 유지·심화, 또는 영재반 수준의 도전이 필요한 3-6 학생",
    pillars: ["Common Core 심화", "한 학년 위 콘텐츠", "AMC 8 입문·중급", "서술형·증명형"],
    outcome: "AAP 유지, 중학교 Honors/Algebra 진학, AMC 8 입상권",
  },
];

export default function ProgramsPage() {
  return (
    <>
      <Section>
        <Container>
          <SectionHeader
            eyebrow="Programs · 프로그램"
            title="Two tracks. One goal."
            titleKo="두 개의 트랙, 하나의 목표"
            description="학년과 목표에 맞는 트랙을 선택해 정확한 로드맵으로 진도를 나갑니다."
          />

          <div className="mt-14 grid gap-8 lg:grid-cols-2">
            {programs.map((p) => (
              <article
                key={p.href}
                className="rounded-2xl border border-navy-100 bg-white p-8 shadow-sm"
              >
                <span className="inline-block rounded-full bg-navy-50 px-3 py-1 text-xs font-semibold text-navy-700">
                  Grade {p.grade}
                </span>
                <h2 className="mt-5 text-2xl font-bold text-navy-900">
                  {p.title}
                </h2>
                <p className="mt-1 text-lg font-semibold text-navy-700 font-ko" lang="ko">
                  {p.titleKo}
                </p>

                <div className="mt-6 space-y-4 text-sm">
                  <Row label="대상" value={p.target} />
                  <Row label="핵심 영역" value={p.pillars.join(" · ")} />
                  <Row label="목표 결과" value={p.outcome} />
                </div>

                <div className="mt-7">
                  <Button href={p.href} variant="primary">
                    자세히 보기 / Learn more <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-12 rounded-xl border border-navy-100 bg-navy-50/60 p-6 text-center">
            <p className="text-sm text-navy-700 font-ko" lang="ko">
              어느 트랙이 맞는지 모르시겠다면, 무료 상담에서 자녀의 현재 수준을
              진단해드립니다.
            </p>
            <div className="mt-4">
              <Button href="/inquire" size="md">
                무료 상담 신청
              </Button>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 sm:flex-row sm:gap-4">
      <dt className="w-24 shrink-0 text-xs font-semibold uppercase tracking-wider text-navy-500">
        {label}
      </dt>
      <dd className="text-sm leading-6 text-navy-800 font-ko" lang="ko">
        {value}
      </dd>
    </div>
  );
}
