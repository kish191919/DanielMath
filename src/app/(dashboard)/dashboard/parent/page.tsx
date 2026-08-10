import Link from "next/link";
import { Star } from "lucide-react";
import { Container } from "@/components/site/container";
import { Section } from "@/components/site/section";
import { Button } from "@/components/ui/button";
import { requireRole } from "@/lib/dal";
import { siteConfig } from "@/lib/site-config";

const cards = [
  {
    href: "/dashboard/parent/children",
    title: "Children",
    description: "View your registered children and their grade information.",
    ready: true,
  },
  {
    href: "/dashboard/parent/progress",
    title: "Progress",
    description: "View learning reports left by your teacher.",
    ready: true,
  },
  {
    href: "/dashboard/parent/tuition",
    title: "Tuition",
    description: "Check this month's tuition payment status.",
    ready: true,
  },
  {
    href: "/dashboard/parent/settings",
    title: "Settings",
    description: "Manage your SMS notification preferences.",
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
            Parent
          </p>
          <h1 className="mt-2 text-2xl font-bold text-navy-900 sm:text-3xl">
            Welcome back, {session.profile.full_name ?? session.email}
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
                <h2 className="text-lg font-semibold text-navy-900">
                  {card.title}
                </h2>
              </div>
              <p className="mt-3 flex-1 text-sm text-navy-700">
                {card.description}
              </p>
              {!card.ready && (
                <p className="mt-4 inline-flex w-fit items-center rounded-full bg-gold-300/30 px-2 py-0.5 text-xs font-medium text-navy-800">
                  Coming in Phase B-2
                </p>
              )}
            </Link>
          ))}
        </div>

        <div className="mt-6 flex flex-col items-start gap-4 rounded-2xl border border-gold-300/40 bg-gold-50/50 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <Star className="mt-0.5 h-5 w-5 shrink-0 text-gold-500" fill="currentColor" />
            <div>
              <h2 className="text-sm font-semibold text-navy-900">
                Enjoying Daniel Math?
              </h2>
              <p className="mt-1 text-sm text-navy-700">
                A quick review helps other families find us.
              </p>
            </div>
          </div>
          <Button href={siteConfig.googleReviewUrl} external variant="secondary" size="md" className="shrink-0">
            Leave a Google Review
          </Button>
        </div>
      </Container>
    </Section>
  );
}
