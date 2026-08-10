import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { type BlogPost } from "@/lib/blog-posts";
import { localePath, type Locale } from "@/lib/i18n";

type Props = {
  post: BlogPost;
  locale: Locale;
  isKo: boolean;
  readMore: string;
  featured?: boolean;
};

export function BlogCard({ post, locale, isKo, readMore, featured = false }: Props) {
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
      className={`group flex flex-col rounded-2xl border border-navy-100 bg-white p-6 transition-all hover:-translate-y-0.5 hover:border-gold-400/50 hover:shadow-lg hover:shadow-navy-900/5 ${
        featured ? "sm:p-8" : ""
      }`}
    >
      <span className="text-xs font-bold uppercase tracking-wider text-gold-600">
        {category}
      </span>

      <h3
        className={`mt-3 font-bold leading-snug text-navy-900 transition-colors group-hover:text-navy-600 ${
          featured ? "text-2xl sm:text-3xl" : "text-lg"
        }`}
      >
        {title}
      </h3>

      <p
        className={`mt-3 flex-1 leading-relaxed text-navy-600 ${
          featured ? "text-base line-clamp-3" : "text-sm line-clamp-2"
        }`}
      >
        {desc}
      </p>

      <div className="mt-6 flex items-center justify-between border-t border-navy-50 pt-4">
        <span className="text-xs text-navy-400">{date}</span>
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-navy-500 transition-colors group-hover:text-navy-800">
          {readMore}
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}
