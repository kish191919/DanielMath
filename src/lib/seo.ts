import { siteConfig } from "./site-config";

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
