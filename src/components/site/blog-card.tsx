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
