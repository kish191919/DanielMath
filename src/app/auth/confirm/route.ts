import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import type { EmailOtpType } from "@supabase/supabase-js";

// Verifies a Supabase magic-link OTP and establishes the session. Built
// separately from src/lib/supabase/server.ts, whose cookie-setting is
// wrapped in a try/catch that silently swallows failures (that variant
// assumes it may be called from a Server Component, which can't set
// cookies). Here we return our own NextResponse.redirect(...) and must
// guarantee the verifyOtp session cookies land on that exact response —
// same shape as src/lib/supabase/proxy.ts, not the Server-Component-safe
// variant.
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = searchParams.get("next") ?? "/dashboard";

  if (!token_hash || !type) {
    return NextResponse.redirect(new URL("/login?error=invalid_link", origin));
  }

  const response = NextResponse.redirect(new URL(next, origin));

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    },
  );

  const { error } = await supabase.auth.verifyOtp({ type, token_hash });
  if (error) {
    // Preserve `next` so an already-signed-in visitor (e.g. the token was
    // single-use and already redeemed — common with SMS link-preview
    // scanners, or the parent re-tapping an old text) still lands on the
    // deep-linked report instead of bouncing to the dashboard home; see
    // the already-authenticated branch in src/app/login/page.tsx.
    const loginUrl = new URL("/login", origin);
    loginUrl.searchParams.set("error", "link_expired");
    loginUrl.searchParams.set("next", next);
    return NextResponse.redirect(loginUrl);
  }

  return response;
}
