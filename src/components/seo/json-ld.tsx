import { siteConfig } from "@/lib/site-config";
import type { BlogPost } from "@/lib/blog-posts";

const organizationId = `${siteConfig.url}/#organization`;
const alternateNames = [siteConfig.nameKo, "Daniel Math", "다니엘 수학"];

export function LocalBusinessJsonLd({ locale = "ko" }: { locale?: string }) {
  const isKo = locale === "ko";
  const placeId = new URL(siteConfig.googleReviewUrl).searchParams.get("placeid");
  const data = {
    "@context": "https://schema.org",
    "@type": ["EducationalOrganization", "LocalBusiness"],
    "@id": organizationId,
    name: siteConfig.name,
    alternateName: alternateNames,
    url: siteConfig.url,
    logo: `${siteConfig.url}/brand/daniel-math-academy-logo.png`,
    image: `${siteConfig.url}/hero/student-1.jpg`,
    description: isKo ? siteConfig.description : siteConfig.descriptionEn,
    email: siteConfig.contactEmail,
    telephone: `+1-${siteConfig.telephone}`,
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
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: siteConfig.openingHours.days,
      opens: siteConfig.openingHours.opens,
      closes: siteConfig.openingHours.closes,
    },
    hasMap: placeId
      ? `https://www.google.com/maps/place/?q=place_id:${placeId}`
      : undefined,
    knowsLanguage: ["ko", "en"],
    knowsAbout: [
      "Elementary math",
      "FCPS Advanced Academic Programs (AAP) math",
      "Virginia SOL math",
      "MOEMS",
      "AMC 8",
    ],
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

/** Tells Google the site name and its alternates for brand searches. Home page only. */
export function WebSiteJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteConfig.url}/#website`,
    url: siteConfig.url,
    name: siteConfig.name,
    alternateName: alternateNames,
    inLanguage: ["ko", "en"],
    publisher: { "@id": organizationId },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function FaqJsonLd({ items }: { items: { q: string; a: string }[] }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
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
    image: post.heroImage ? `${siteConfig.url}${post.heroImage.src}` : undefined,
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
