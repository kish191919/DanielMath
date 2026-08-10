import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Container } from "@/components/site/container";
import { Section, SectionHeader } from "@/components/site/section";
import { siteConfig } from "@/lib/site-config";
import { verifySession } from "@/lib/dal";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Login",
  robots: { index: false, follow: false },
};

// Only ever redirect to an in-app path — `next` comes from a query string
// an attacker can craft, so reject anything that isn't a single leading
// slash (rules out "//evil.com" and "https://evil.com" open redirects).
function isSafeNext(next: string | undefined): next is string {
  return !!next && next.startsWith("/") && !next.startsWith("//");
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  const session = await verifySession();
  if (session) redirect(isSafeNext(next) ? next : "/dashboard");

  return (
    <>
      <header className="border-b border-navy-100 bg-white">
        <Container>
          <div className="flex h-16 items-center">
            <Link href="/" className="flex items-baseline gap-2">
              <span className="text-lg font-bold tracking-tight text-navy-900">
                {siteConfig.name}
              </span>
            </Link>
          </div>
        </Container>
      </header>

      <main className="flex-1">
        <Section className="py-12 sm:py-20">
          <Container className="max-w-md">
            <SectionHeader
              eyebrow="Login"
              title="Welcome back."
            />
            <div className="mt-10">
              <LoginForm next={isSafeNext(next) ? next : undefined} />
            </div>
          </Container>
        </Section>
      </main>
    </>
  );
}
