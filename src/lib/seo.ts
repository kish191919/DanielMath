import { siteConfig } from "./site-config";

/**
 * Shared link-preview image. A page that sets its own `openGraph` replaces the
 * root layout's entirely, so it must pass this again to keep `og:image`.
 */
export const ogImages = [
  { url: `${siteConfig.url}${siteConfig.ogImage}`, width: 1200, height: 630, alt: siteConfig.name },
];

/** Generate hreflang alternates for a given locale + path. */
export function pageAlternates(locale: string, path: string) {
  const base = siteConfig.url;
  const clean = path === "/" ? "" : path;
  const koUrl = `${base}${clean}`;
  const enUrl = `${base}/en${clean}`;
  return {
    canonical: locale === "ko" ? koUrl : enUrl,
    languages: {
      ko: koUrl,
      en: enUrl,
      "x-default": koUrl,
    },
  };
}
