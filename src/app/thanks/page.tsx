import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Container } from "@/components/site/container";
import { Section } from "@/components/site/section";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Thank you · 문의 접수 완료",
  description: "상담 문의가 정상적으로 접수되었습니다.",
  robots: { index: false, follow: false },
};

export default function ThanksPage() {
  return (
    <Section>
      <Container>
        <div className="mx-auto max-w-xl rounded-2xl border border-navy-100 bg-white p-10 text-center shadow-sm">
          <div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full bg-navy-50 text-navy-700">
            <CheckCircle2 className="h-7 w-7" />
          </div>
          <h1 className="mt-6 text-3xl font-bold tracking-tight text-navy-900">
            Thank you!
          </h1>
          <p className="mt-2 text-2xl font-semibold text-navy-700 font-ko" lang="ko">
            문의가 접수되었습니다
          </p>
          <p className="mt-5 text-sm leading-7 text-navy-700 font-ko" lang="ko">
            소중한 문의 감사합니다. 24시간 내에 입력해주신 이메일 또는 연락처로
            회신드리겠습니다. 자녀의 학년과 목표에 가장 적합한 트랙을
            안내해드릴게요.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Button href="/" variant="primary">
              홈으로 돌아가기
            </Button>
            <Link
              href="/programs"
              className="text-sm font-medium text-navy-700 hover:text-navy-900"
            >
              프로그램 다시 보기 →
            </Link>
          </div>
        </div>
      </Container>
    </Section>
  );
}
