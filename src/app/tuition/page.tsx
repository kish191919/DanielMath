import type { Metadata } from "next";
import { Container } from "@/components/site/container";
import { Section, SectionHeader } from "@/components/site/section";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Tuition · 수업료",
  description:
    "Daniel Math 공부방 수업료 안내. 학년·트랙별 세부 금액은 상담 시 안내드립니다.",
};

// PLACEHOLDER: 실제 운영 금액으로 교체하세요.
const rows = [
  {
    track: "AAP Entry",
    grade: "K – 2",
    sessions: "주 2회 · 회당 90분",
    monthly: "$XXX / 월",
  },
  {
    track: "AAP Honors",
    grade: "3 – 4",
    sessions: "주 2회 · 회당 90분",
    monthly: "$XXX / 월",
  },
  {
    track: "AAP Honors",
    grade: "5 – 6",
    sessions: "주 2회 · 회당 120분",
    monthly: "$XXX / 월",
  },
];

export default function TuitionPage() {
  return (
    <Section>
      <Container>
        <SectionHeader
          eyebrow="Tuition · 수업료"
          title="Transparent pricing."
          titleKo="투명한 수업료"
          description="정확한 금액과 시간표는 자녀의 학년과 트랙에 따라 상담 시 안내드립니다."
        />

        <div className="mt-12 overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-navy-50 text-xs uppercase tracking-wider text-navy-700">
              <tr>
                <th className="px-5 py-4">Track / 트랙</th>
                <th className="px-5 py-4">Grade / 학년</th>
                <th className="px-5 py-4">Schedule / 시간</th>
                <th className="px-5 py-4">Monthly / 월 수업료</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-100">
              {rows.map((r, i) => (
                <tr key={i} className="text-navy-800">
                  <td className="px-5 py-5 font-semibold text-navy-900">
                    {r.track}
                  </td>
                  <td className="px-5 py-5">{r.grade}</td>
                  <td className="px-5 py-5 font-ko" lang="ko">
                    {r.sessions}
                  </td>
                  <td className="px-5 py-5 font-mono text-navy-900">
                    {r.monthly}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          <Card title="형제 할인" desc="둘째 자녀부터 월 수업료 할인 적용" />
          <Card title="등록비 / 교재비" desc="교재·인쇄·리포트 발송료 포함 (별도 청구 없음)" />
          <Card title="환불 정책" desc="첫 2주 내 100% 환불 보장 · 자세한 안내는 상담 시" />
        </div>

        <div className="mt-12 rounded-xl border border-navy-100 bg-navy-50/60 p-6 text-center">
          <p className="text-sm text-navy-700 font-ko" lang="ko">
            정확한 수업료·시간표·등록 가능 여부는 상담 시 안내드립니다.
          </p>
          <div className="mt-4">
            <Button href="/inquire" size="md">
              상담 신청하기
            </Button>
          </div>
        </div>
      </Container>
    </Section>
  );
}

function Card({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-xl border border-navy-100 bg-white p-5 shadow-sm">
      <h3 className="text-base font-bold text-navy-900 font-ko" lang="ko">
        {title}
      </h3>
      <p className="mt-2 text-sm leading-6 text-navy-700 font-ko" lang="ko">
        {desc}
      </p>
    </div>
  );
}
