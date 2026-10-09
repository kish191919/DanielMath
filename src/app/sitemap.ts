import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";
import { blogPosts } from "@/lib/blog-posts";
import { grades } from "@/lib/curriculum-data";
import { pageAlternates } from "@/lib/seo";

const marketingPaths = [
  "",
  "/programs",
  "/inquire",
  "/resources",
  "/resources/curriculum",
  "/resources/sol",
  "/resources/testing",
  "/resources/testing/moems",
  "/resources/testing/amc-8",
  "/resources/testing/virginia-sol",
  "/resources/testing/ngat",
  "/school-calendar",
  "/blog",
  "/privacy",
  "/terms",
  ...grades.map((g) => `/resources/curriculum/${g.slug}`),
];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url;
  const now = new Date();

  const priority = (p: string) => (p === "" ? 1 : p.split("/").length <= 2 ? 0.8 : 0.6);
  // Same hreflang set the pages emit in <head> (ko, en, x-default).
  const alternates = (p: string) => ({ languages: pageAlternates("ko", p).languages });

  const koEntries = marketingPaths.map((p) => ({
    url: `${base}${p}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: priority(p),
    alternates: alternates(p),
  }));

  const enEntries = marketingPaths.map((p) => ({
    url: `${base}/en${p}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: priority(p) * 0.9,
    alternates: alternates(p),
  }));

  const blogKoEntries = blogPosts.map((p) => ({
    url: `${base}/blog/${p.slug}`,
    lastModified: new Date(p.publishedAt),
    changeFrequency: "monthly" as const,
    priority: 0.7,
    alternates: alternates(`/blog/${p.slug}`),
  }));

  const blogEnEntries = blogPosts.map((p) => ({
    url: `${base}/en/blog/${p.slug}`,
    lastModified: new Date(p.publishedAt),
    changeFrequency: "monthly" as const,
    priority: 0.63,
    alternates: alternates(`/blog/${p.slug}`),
  }));

  return [...koEntries, ...enEntries, ...blogKoEntries, ...blogEnEntries];
}
