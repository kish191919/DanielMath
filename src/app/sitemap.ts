import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";
import { blogPosts } from "@/lib/blog-posts";

const marketingPaths = [
  "",
  "/programs",
  "/inquire",
  "/resources",
  "/resources/curriculum",
  "/resources/sol",
  "/resources/testing",
  "/school-calendar",
  "/blog",
  "/resources/curriculum/kindergarten",
  "/resources/curriculum/grade-1",
  "/resources/curriculum/grade-2",
  "/resources/curriculum/grade-3",
  "/resources/curriculum/grade-4",
  "/resources/curriculum/grade-5",
  "/resources/curriculum/grade-6",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url;
  const now = new Date();

  const priority = (p: string) => (p === "" ? 1 : p.split("/").length <= 2 ? 0.8 : 0.6);

  const koEntries = marketingPaths.map((p) => ({
    url: `${base}${p}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: priority(p),
    alternates: { languages: { ko: `${base}${p}`, en: `${base}/en${p}` } },
  }));

  const enEntries = marketingPaths.map((p) => ({
    url: `${base}/en${p}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: priority(p) * 0.9,
    alternates: { languages: { ko: `${base}${p}`, en: `${base}/en${p}` } },
  }));

  const blogKoEntries = blogPosts.map((p) => ({
    url: `${base}/blog/${p.slug}`,
    lastModified: new Date(p.publishedAt),
    changeFrequency: "monthly" as const,
    priority: 0.7,
    alternates: { languages: { ko: `${base}/blog/${p.slug}`, en: `${base}/en/blog/${p.slug}` } },
  }));

  const blogEnEntries = blogPosts.map((p) => ({
    url: `${base}/en/blog/${p.slug}`,
    lastModified: new Date(p.publishedAt),
    changeFrequency: "monthly" as const,
    priority: 0.63,
    alternates: { languages: { ko: `${base}/blog/${p.slug}`, en: `${base}/en/blog/${p.slug}` } },
  }));

  return [...koEntries, ...enEntries, ...blogKoEntries, ...blogEnEntries];
}
