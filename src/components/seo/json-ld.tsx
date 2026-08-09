import { siteConfig } from "@/lib/site-config";
import type { BlogPost } from "@/lib/blog-posts";

export function LocalBusinessJsonLd({ locale = "ko" }: { locale?: string }) {
  const isKo = locale === "ko";
  const data = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: siteConfig.name,
    alternateName: siteConfig.nameKo,
    url: siteConfig.url,
    description: isKo ? siteConfig.description : siteConfig.descriptionEn,
    email: siteConfig.contactEmail,
    telephone: siteConfig.telephone,
    address: {
      "@type": "PostalAddress",
      addressLocality: siteConfig.address.locality,
      addressRegion: siteConfig.address.region,
      postalCode: siteConfig.address.postalCode,
      addressCountry: siteConfig.address.country,
    },
    areaServed: siteConfig.serviceAreas.map((city) => ({
      "@type": "City",
      name: `${city}, VA`,
    })),
    audience: {
      "@type": "EducationalAudience",
      educationalRole: "student",
    },
    teaches: "Mathematics",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function BlogPostingJsonLd({
  post,
  locale,
}: {
  post: BlogPost;
  locale: string;
}) {
  const isKo = locale === "ko";
  const url = isKo
    ? `${siteConfig.url}/blog/${post.slug}`
    : `${siteConfig.url}/en/blog/${post.slug}`;

  const data = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: isKo ? post.titleKo : post.titleEn,
    description: isKo ? post.descKo : post.descEn,
    url,
    datePublished: post.publishedAt,
    inLanguage: isKo ? "ko" : "en",
    author: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

type BreadcrumbItem = { name: string; url: string };

export function BreadcrumbJsonLd({ items }: { items: BreadcrumbItem[] }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
