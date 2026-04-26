import type { Metadata } from "next";
import { Container } from "@/components/site/container";
import { Section, SectionHeader } from "@/components/site/section";
import { InquiryForm } from "./inquiry-form";

export const metadata: Metadata = {
  title: "Inquire · 상담 신청",
  description:
    "Daniel Math 공부방 무료 상담 신청. 자녀의 학년과 현재 수준을 알려주시면 24시간 내 회신드립니다.",
};

export default function InquirePage() {
  return (
    <Section>
      <Container>
        <SectionHeader
          eyebrow="Inquire · 상담 신청"
          title="Tell us about your child."
          titleKo="자녀에 대해 알려주세요"
          description="아래 정보를 남겨주시면 24시간 내 회신드립니다. 무료 진단 일정도 함께 안내해드립니다."
        />

        <div className="mx-auto mt-12 max-w-2xl">
          <InquiryForm />
        </div>
      </Container>
    </Section>
  );
}
