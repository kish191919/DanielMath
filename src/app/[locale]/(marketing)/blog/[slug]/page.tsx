import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight, Clock } from "lucide-react";
import { getDictionary } from "@/dictionaries";
import { hasLocale, localePath, type Locale } from "@/lib/i18n";
import { pageAlternates } from "@/lib/seo";
import { Container } from "@/components/site/container";
import { getBlogPost, getAllSlugs, getAdjacentPosts } from "@/lib/blog-posts";
import { BlogPostingJsonLd } from "@/components/seo/json-ld";
import { BlogVisualBlock } from "@/components/site/blog-visuals";

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

  const { newer, older } = getAdjacentPosts(slug);
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

            {post.heroImage && (
              <div className="relative mb-10 aspect-[16/10] overflow-hidden rounded-2xl shadow-sm ring-1 ring-navy-100">
                <Image
                  src={post.heroImage.src}
                  alt={isKo ? post.heroImage.altKo : post.heroImage.altEn}
                  fill
                  sizes="(min-width: 640px) 672px, 100vw"
                  className="object-cover"
                  loading="eager"
                />
              </div>
            )}

            {/* Body */}
            <div className="space-y-14">
              {body.map((section, i) => (
                <div key={i}>
                  <h2 className="mb-4 text-xl font-bold text-navy-900">
                    {section.heading}
                  </h2>
                  {section.visual && section.visualPosition === "before" && (
                    <div className="mb-5">
                      <BlogVisualBlock visual={section.visual} isKo={isKo} />
                    </div>
                  )}
                  <div className="space-y-7">
                    {section.paragraphs.map((para, j) => (
                      <p
                        key={j}
                        className="text-lg leading-8 text-navy-700"
                      >
                        {para}
                      </p>
                    ))}
                  </div>
                  {section.visual && section.visualPosition !== "before" && (
                    <div className="mt-5">
                      <BlogVisualBlock visual={section.visual} isKo={isKo} />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Prev / next post nav */}
            {(older || newer) && (
              <div className="mt-16 grid grid-cols-1 gap-4 border-t border-navy-100 pt-8 sm:grid-cols-2">
                {older ? (
                  <Link
                    href={lp(`/blog/${older.slug}`)}
                    className="group flex flex-col rounded-2xl border border-navy-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
                  >
                    <span className="mb-1.5 inline-flex items-center gap-1.5 text-xs font-semibold text-navy-400">
                      <ArrowLeft className="h-3.5 w-3.5" />
                      {d.blog.previousPost}
                    </span>
                    <span className="font-bold leading-snug text-navy-900 transition-colors group-hover:text-navy-600">
                      {isKo ? older.titleKo : older.titleEn}
                    </span>
                  </Link>
                ) : (
                  <div />
                )}
                {newer ? (
                  <Link
                    href={lp(`/blog/${newer.slug}`)}
                    className="group flex flex-col items-end rounded-2xl border border-navy-100 bg-white p-5 text-right shadow-sm transition-shadow hover:shadow-md"
                  >
                    <span className="mb-1.5 inline-flex items-center gap-1.5 text-xs font-semibold text-navy-400">
                      {d.blog.nextPost}
                      <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                    <span className="font-bold leading-snug text-navy-900 transition-colors group-hover:text-navy-600">
                      {isKo ? newer.titleKo : newer.titleEn}
                    </span>
                  </Link>
                ) : (
                  <div />
                )}
              </div>
            )}

            {/* Footer nav */}
            <div className="mt-8 border-t border-navy-100 pt-8">
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
