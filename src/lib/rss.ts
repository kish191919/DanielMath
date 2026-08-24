import { siteConfig } from "@/lib/site-config";
import { getSortedPosts } from "@/lib/blog-posts";

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function toRfc822(dateStr: string): string {
  return new Date(dateStr).toUTCString();
}

export function buildRssFeed(locale: "ko" | "en"): string {
  const isKo = locale === "ko";
  const base = siteConfig.url;
  const siteUrl = isKo ? base : `${base}/en`;
  const feedUrl = isKo ? `${base}/feed.xml` : `${base}/en/feed.xml`;
  const posts = getSortedPosts();

  const items = posts
    .map((post) => {
      const link = isKo
        ? `${base}/blog/${post.slug}`
        : `${base}/en/blog/${post.slug}`;
      const title = isKo ? post.titleKo : post.titleEn;
      const desc = isKo ? post.descKo : post.descEn;
      const category = isKo ? post.category : post.categoryEn;
      return `    <item>
      <title>${escapeXml(title)}</title>
      <link>${escapeXml(link)}</link>
      <guid isPermaLink="true">${escapeXml(link)}</guid>
      <pubDate>${toRfc822(post.publishedAt)}</pubDate>
      <description>${escapeXml(desc)}</description>
      <category>${escapeXml(category)}</category>
    </item>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(isKo ? siteConfig.nameKo : siteConfig.name)}</title>
    <link>${escapeXml(siteUrl)}</link>
    <description>${escapeXml(isKo ? siteConfig.description : siteConfig.descriptionEn)}</description>
    <language>${isKo ? "ko" : "en-us"}</language>
    <atom:link href="${escapeXml(feedUrl)}" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`;
}
