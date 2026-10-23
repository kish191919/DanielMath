import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight, Clock } from "lucide-react";
import { getDictionary } from "@/dictionaries";
import { hasLocale, localePath, type Locale } from "@/lib/i18n";
import { ogImages, pageAlternates } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";
import { Container } from "@/components/site/container";
import { getBlogPost, getAllSlugs, getAdjacentPosts } from "@/lib/blog-posts";
import { BlogPostingJsonLd, BreadcrumbJsonLd, FaqJsonLd } from "@/components/seo/json-ld";
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
  const title = isKo ? post.titleKo : post.titleEn;
  const description = isKo ? post.descKo : post.descEn;
  const alternates = pageAlternates(locale, `/blog/${slug}`);
  return {
    title,
    description,
    alternates,
    // Replaces the root layout's openGraph/twitter, so url, locale and
    // siteName must be repeated here or link previews lose them.
    openGraph: {
      type: "article",
      url: alternates.canonical,
      siteName: siteConfig.name,
      locale: isKo ? "ko_KR" : "en_US",
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt ?? post.publishedAt,
      section: isKo ? post.category : post.categoryEn,
      images: ogImages,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImages.map((img) => img.url),
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
  const faq = isKo ? post.faqKo : post.faqEn;

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString(isKo ? "ko-KR" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  const date = formatDate(post.publishedAt);
  const updated = post.updatedAt ? formatDate(post.updatedAt) : null;
  const siteBase = isKo ? siteConfig.url : `${siteConfig.url}/en`;

  return (
    <>
      <BlogPostingJsonLd post={post} locale={locale} />
      <BreadcrumbJsonLd
        items={[
          { name: isKo ? siteConfig.nameKo : siteConfig.name, url: siteBase },
          { name: isKo ? "블로그" : "Blog", url: `${siteBase}/blog` },
          { name: title, url: `${siteBase}/blog/${post.slug}` },
        ]}
      />
      {faq && faq.length > 0 && <FaqJsonLd items={faq} />}
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
                {updated && (
                  <span className="text-xs text-navy-400">
                    {d.blog.updatedAt} {updated}
                  </span>
                )}
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

              {faq && faq.length > 0 && (
                <div>
                  <h2 className="mb-4 text-xl font-bold text-navy-900">
                    {d.blog.faqTitle}
                  </h2>
                  <dl className="divide-y divide-navy-100 rounded-2xl border border-navy-100 bg-white">
                    {faq.map((item) => (
                      <div key={item.q} className="p-5">
                        <dt className="font-bold leading-snug text-navy-900">
                          Q. {item.q}
                        </dt>
                        <dd className="mt-2 leading-7 text-navy-700">{item.a}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}
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
