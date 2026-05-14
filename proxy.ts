import { NextResponse, type NextRequest } from "next/server";
import { createProxyClient } from "@/lib/supabase/proxy";
import { locales, defaultLocale, type Locale } from "@/lib/i18n";

const NON_MARKETING = [
  "/dashboard",
  "/login",
  "/api",
  "/_next",
  "/favicon.ico",
  "/robots.txt",
  "/sitemap",
  "/og.png",
  "/warmth",
];

function isMarketingPath(pathname: string): boolean {
  return !NON_MARKETING.some((p) => pathname.startsWith(p));
}

function extractLocale(pathname: string): Locale | null {
  const seg = pathname.split("/")[1];
  return (locales as readonly string[]).includes(seg)
    ? (seg as Locale)
    : null;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── Dashboard: auth guard ────────────────────────────────────────────────
  if (pathname.startsWith("/dashboard")) {
    const response = NextResponse.next({ request });
    const supabase = createProxyClient(request, response);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      const url = request.nextUrl.clone();
      const next = pathname + request.nextUrl.search;
      url.pathname = "/login";
      url.search = `?next=${encodeURIComponent(next)}`;
      return NextResponse.redirect(url);
    }
    return response;
  }

  // ── Marketing: locale rewriting ──────────────────────────────────────────
  if (isMarketingPath(pathname)) {
    const locale = extractLocale(pathname);

    if (!locale) {
      // No locale prefix → rewrite to default (ko) and forward x-locale header
      const url = request.nextUrl.clone();
      url.pathname = `/${defaultLocale}${pathname === "/" ? "" : pathname}`;

      const requestHeaders = new Headers(request.headers);
      requestHeaders.set("x-locale", defaultLocale);

      return NextResponse.rewrite(url, {
        request: { headers: requestHeaders },
      });
    }

    // Already has a locale prefix → just forward x-locale header
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-locale", locale);
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  return NextResponse.next({ request });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
