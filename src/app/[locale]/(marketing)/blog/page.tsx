import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";

import { getDictionary } from "@/dictionaries";
import { hasLocale, localePath, type Locale } from "@/lib/i18n";
import { pageAlternates } from "@/lib/seo";
import { Container } from "@/components/site/container";
import { Section, SectionHeader } from "@/components/site/section";
import { BlogListItem } from "@/components/site/blog-card";
import { blogPosts } from "@/lib/blog-posts";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(locale)) return {};
  const d = await getDictionary(locale as Locale);
  return {
    title: d.blog.meta.title,
    description: d.blog.meta.description,
    alternates: pageAlternates(locale, "/blog"),
  };
}

export default async function BlogPage({ params }: Props) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();
  const d = await getDictionary(locale as Locale);
  const lp = (path: string) => localePath(locale as Locale, path);
  const isKo = locale === "ko";

  return (
    <>
      <div className="border-b border-navy-100 bg-white py-4">
        <Container>
          <Link
            href={lp("/")}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-navy-500 hover:text-navy-900"
          >
            {isKo ? "홈으로" : "Home"}
          </Link>
        </Container>
      </div>

      <Section>
        <Container>
          <SectionHeader
            eyebrow={d.blog.eyebrow}
            title={d.blog.title}
            description={d.blog.desc}
            isKo={isKo}
          />

          <div className="mt-10 flex flex-col divide-y divide-navy-100">
            {blogPosts.map((post) => (
              <BlogListItem
                key={post.slug}
                post={post}
                locale={locale as Locale}
                isKo={isKo}
                readMore={d.blog.readMore}
                minRead={d.blog.minRead}
              />
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
