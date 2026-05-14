export const locales = ['ko', 'en'] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = 'ko'

export function hasLocale(s: string): s is Locale {
  return (locales as readonly string[]).includes(s)
}

/** Returns a URL path prefixed with the locale when not the default. */
export function localePath(locale: Locale, path: string): string {
  if (locale === defaultLocale) return path
  return `/en${path === '/' ? '' : path}`
}
