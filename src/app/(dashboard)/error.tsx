"use client";

import { Container } from "@/components/site/container";
import { Section } from "@/components/site/section";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <Section className="py-14">
      <Container className="max-w-xl">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
          <h2 className="text-lg font-semibold text-red-900">
            오류가 발생했습니다
          </h2>
          <p className="mt-2 text-sm text-red-800">
            잠시 후 다시 시도해주세요. 문제가 계속되면 관리자에게 문의해주세요.
          </p>
          {error.digest && (
            <p className="mt-2 font-mono text-xs text-red-700">
              ref: {error.digest}
            </p>
          )}
          <button
            type="button"
            onClick={reset}
            className="mt-4 rounded-md border border-red-300 bg-white px-3 py-1.5 text-sm font-medium text-red-800 hover:bg-red-100"
          >
            다시 시도
          </button>
        </div>
      </Container>
    </Section>
  );
}
