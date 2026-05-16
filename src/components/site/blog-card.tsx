import Link from "next/link";
import { type BlogPost } from "@/lib/blog-posts";
import { localePath, type Locale } from "@/lib/i18n";

type Props = {
  post: BlogPost;
  locale: Locale;
  isKo: boolean;
  readMore: string;
  minRead: string;
};

export function BlogCard({ post, locale, isKo, readMore, minRead }: Props) {
  const href = localePath(locale, `/blog/${post.slug}`);
  const title = isKo ? post.titleKo : post.titleEn;
  const desc = isKo ? post.descKo : post.descEn;
  const category = isKo ? post.category : post.categoryEn;

  const date = new Date(post.publishedAt).toLocaleDateString(
    isKo ? "ko-KR" : "en-US",
    { year: "numeric", month: "long", day: "numeric" }
  );

  return (
    <Link
      href={href}
      className="group flex flex-col rounded-2xl border border-navy-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="mb-4 flex items-center gap-2">
        <span className="rounded-full bg-navy-50 px-3 py-1 text-xs font-semibold text-navy-600">
          {category}
        </span>
        <span className="text-xs text-navy-400">
          {post.readingMins} {minRead}
        </span>
      </div>

      <h3 className="mb-2 text-lg font-bold leading-snug text-navy-900 group-hover:text-navy-600 transition-colors">
        {title}
      </h3>

      <p className="mb-4 flex-1 text-sm leading-relaxed text-navy-600 line-clamp-3">
        {desc}
      </p>

      <div className="flex items-center justify-between border-t border-navy-50 pt-4">
        <span className="text-xs text-navy-400">{date}</span>
        <span className="text-xs font-semibold text-navy-500 group-hover:text-navy-800 transition-colors">
          {readMore}
        </span>
      </div>
    </Link>
  );
}

export function BlogListItem({ post, locale, isKo, readMore, minRead }: Props) {
  const href = localePath(locale, `/blog/${post.slug}`);
  const title = isKo ? post.titleKo : post.titleEn;
  const desc = isKo ? post.descKo : post.descEn;
  const category = isKo ? post.category : post.categoryEn;

  const date = new Date(post.publishedAt).toLocaleDateString(
    isKo ? "ko-KR" : "en-US",
    { year: "numeric", month: "long", day: "numeric" }
  );

  return (
    <Link
      href={href}
      className="group flex items-start gap-4 py-5 px-2 -mx-2 rounded-lg hover:bg-navy-50/50 transition-colors"
    >
      <div className="w-24 shrink-0 pt-0.5 flex flex-col items-center gap-1">
        <span className="rounded-full bg-navy-50 px-2.5 py-0.5 text-xs font-semibold text-navy-600 text-center leading-relaxed">
          {category}
        </span>
        <span className="text-xs text-navy-400">
          {post.readingMins} {minRead}
        </span>
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-navy-900 group-hover:text-navy-600 transition-colors leading-snug">
          {title}
        </h3>
        <p className="mt-0.5 text-sm text-navy-500 line-clamp-1">{desc}</p>
      </div>

      <div className="shrink-0 text-right flex flex-col gap-1 pt-0.5">
        <span className="text-xs text-navy-400 whitespace-nowrap">{date}</span>
        <span className="text-xs font-semibold text-navy-500 group-hover:text-navy-800 transition-colors whitespace-nowrap">
          {readMore}
        </span>
      </div>
    </Link>
  );
}
