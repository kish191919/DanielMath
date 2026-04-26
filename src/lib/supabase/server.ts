import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

// Database type generic is intentionally omitted in B-1.
// Boundary types come from .returns<T>() / .single<T>() at call sites.
// Replace with `supabase gen types typescript` output in B-2.
export async function createServerSupabase() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // Server Components cannot set cookies; safe to ignore.
            // The proxy handles session refresh on the next request.
          }
        },
      },
    },
  );
}
