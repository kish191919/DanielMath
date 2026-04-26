import { Container } from "@/components/site/container";
import { Section } from "@/components/site/section";

export function ComingSoonPlaceholder({
  title,
  titleEn,
  description,
}: {
  title: string;
  titleEn: string;
  description?: string;
}) {
  return (
    <Section className="py-10 sm:py-14">
      <Container>
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wider text-navy-500">
            {titleEn}
          </p>
          <h1 className="mt-2 text-2xl font-bold text-navy-900 font-ko sm:text-3xl" lang="ko">
            {title}
          </h1>
          {description && (
            <p className="mt-3 text-sm text-navy-700 font-ko" lang="ko">
              {description}
            </p>
          )}
        </div>
        <div className="mt-8 rounded-2xl border border-dashed border-navy-200 bg-white p-10 text-center">
          <p className="text-base font-medium text-navy-900 font-ko" lang="ko">
            이 영역은 Phase B-2에서 추가됩니다.
          </p>
          <p className="mt-1 text-sm text-navy-600">Coming in Phase B-2.</p>
        </div>
      </Container>
    </Section>
  );
}
