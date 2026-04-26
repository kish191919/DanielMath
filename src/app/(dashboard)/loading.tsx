import { Container } from "@/components/site/container";
import { Section } from "@/components/site/section";

export default function DashboardLoading() {
  return (
    <Section className="py-14">
      <Container>
        <div className="space-y-4">
          <div className="h-6 w-48 animate-pulse rounded bg-navy-100" />
          <div className="h-10 w-72 animate-pulse rounded bg-navy-100" />
          <div className="grid gap-4 pt-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-40 animate-pulse rounded-2xl border border-navy-100 bg-navy-50"
              />
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}
