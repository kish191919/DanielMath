import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Container } from "@/components/site/container";
import { Section, SectionHeader } from "@/components/site/section";
import { siteConfig } from "@/lib/site-config";
import { verifySession } from "@/lib/dal";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "로그인",
  robots: { index: false, follow: false },
};

export default async function LoginPage() {
  const session = await verifySession();
  if (session) redirect("/dashboard");

  return (
    <>
      <header className="border-b border-navy-100 bg-white">
        <Container>
          <div className="flex h-16 items-center">
            <Link href="/" className="flex items-baseline gap-2">
              <span className="text-lg font-bold tracking-tight text-navy-900">
                {siteConfig.name}
              </span>
              <span className="hidden text-sm text-navy-600 sm:inline font-ko" lang="ko">
                {siteConfig.nameKo}
              </span>
            </Link>
          </div>
        </Container>
      </header>

      <main className="flex-1">
        <Section className="py-12 sm:py-20">
          <Container className="max-w-md">
            <SectionHeader
              eyebrow="Login · 로그인"
              title="Welcome back."
              titleKo="로그인"
            />
            <div className="mt-10">
              <LoginForm />
            </div>
          </Container>
        </Section>
      </main>
    </>
  );
}
