import Link from "next/link";
import { Container } from "@/components/site/container";
import { Section } from "@/components/site/section";

export default function DashboardNotFound() {
  return (
    <Section className="py-14">
      <Container className="max-w-xl text-center">
        <p className="text-sm font-semibold uppercase tracking-wider text-navy-500">
          404
        </p>
        <h1 className="mt-2 text-2xl font-bold text-navy-900">
          페이지를 찾을 수 없습니다
        </h1>
        <p className="mt-3 text-sm text-navy-700">
          요청하신 페이지가 존재하지 않거나 권한이 없습니다.
        </p>
        <Link
          href="/dashboard"
          className="mt-6 inline-flex rounded-md border border-navy-200 bg-white px-4 py-2 text-sm font-medium text-navy-800 hover:bg-navy-50"
        >
          대시보드로 돌아가기
        </Link>
      </Container>
    </Section>
  );
}
