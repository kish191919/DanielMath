import { NextResponse, type NextRequest } from "next/server";
import { createProxyClient } from "@/lib/supabase/proxy";

export async function proxy(request: NextRequest) {
  const response = NextResponse.next({ request });
  const supabase = createProxyClient(request, response);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const url = request.nextUrl.clone();
    const next = request.nextUrl.pathname + request.nextUrl.search;
    url.pathname = "/login";
    url.search = `?next=${encodeURIComponent(next)}`;
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
