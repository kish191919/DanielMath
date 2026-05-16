import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock } from "lucide-react";
import { getDictionary } from "@/dictionaries";
import { hasLocale, localePath, type Locale } from "@/lib/i18n";
import { pageAlternates } from "@/lib/seo";
import { Container } from "@/components/site/container";
import { getBlogPost, getAllSlugs } from "@/lib/blog-posts";
import { BlogPostingJsonLd } from "@/components/seo/json-ld";

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateStaticParams() {
  const locales = ["ko", "en"];
  const slugs = getAllSlugs();
  return locales.flatMap((locale) => slugs.map((slug) => ({ locale, slug })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!hasLocale(locale)) return {};
  const post = getBlogPost(slug);
  if (!post) return {};
  const isKo = locale === "ko";
  return {
    title: isKo ? post.titleKo : post.titleEn,
    description: isKo ? post.descKo : post.descEn,
    alternates: pageAlternates(locale, `/blog/${slug}`),
    openGraph: {
      type: "article",
      publishedTime: post.publishedAt,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { locale, slug } = await params;
  if (!hasLocale(locale)) notFound();

  const post = getBlogPost(slug);
  if (!post) notFound();

  const d = await getDictionary(locale as Locale);
  const lp = (path: string) => localePath(locale as Locale, path);
  const isKo = locale === "ko";

  const title = isKo ? post.titleKo : post.titleEn;
  const category = isKo ? post.category : post.categoryEn;
  const body = isKo ? post.bodyKo : post.bodyEn;

  const date = new Date(post.publishedAt).toLocaleDateString(
    isKo ? "ko-KR" : "en-US",
    { year: "numeric", month: "long", day: "numeric" }
  );

  return (
    <>
      <BlogPostingJsonLd post={post} locale={locale} />
      <div className="border-b border-navy-100 bg-white py-4">
        <Container>
          <Link
            href={lp("/blog")}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-navy-500 hover:text-navy-900"
          >
            {d.blog.backToList}
          </Link>
        </Container>
      </div>

      <div className="py-12 sm:py-20">
        <Container>
          <div className="mx-auto max-w-2xl">
            {/* Header */}
            <div className="mb-8">
              <div className="mb-4 flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-navy-50 px-3 py-1 text-xs font-semibold text-navy-600">
                  {category}
                </span>
                <span className="flex items-center gap-1 text-xs text-navy-400">
                  <Clock className="h-3.5 w-3.5" />
                  {post.readingMins} {d.blog.minRead}
                </span>
                <span className="text-xs text-navy-400">{date}</span>
              </div>

              <h1 className="text-3xl font-bold leading-tight tracking-tight text-navy-900 sm:text-4xl">
                {title}
              </h1>
            </div>

            {/* Body */}
            <div className="space-y-10">
              {body.map((section, i) => (
                <div key={i}>
                  <h2 className="mb-3 text-xl font-bold text-navy-900">
                    {section.heading}
                  </h2>
                  <div className="space-y-4">
                    {section.paragraphs.map((para, j) => (
                      <p
                        key={j}
                        className="leading-relaxed text-navy-700"
                      >
                        {para}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Footer nav */}
            <div className="mt-16 border-t border-navy-100 pt-8">
              <Link
                href={lp("/blog")}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-navy-500 hover:text-navy-900"
              >
                <ArrowLeft className="h-4 w-4" />
                {d.blog.backToList}
              </Link>
            </div>
          </div>
        </Container>
      </div>
    </>
  );
}
