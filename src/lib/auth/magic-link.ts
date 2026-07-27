import "server-only";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { siteConfig } from "@/lib/site-config";

// Generates a one-time /auth/confirm URL for an existing parent user.
// Uses admin.generateLink() (not signInWithOtp / client signUp) so no
// email is sent by Supabase — delivery is entirely our own (AlimTalk).
// Returns null (never throws) so callers can skip-and-log, matching the
// rest of this feature's best-effort pattern.
export async function generateParentMagicLink(
  email: string,
  next = "/dashboard/parent/messages",
): Promise<string | null> {
  try {
    const admin = createAdminSupabase();
    const { data, error } = await admin.auth.admin.generateLink({
      type: "magiclink",
      email,
      options: { redirectTo: `${siteConfig.url}${next}` },
    });
    if (error || !data?.properties) {
      console.error("generateParentMagicLink failed", error);
      return null;
    }

    // Deliberately use properties.hashed_token + our own /auth/confirm
    // route rather than properties.action_link, which points at
    // Supabase's hosted verify endpoint, not this app.
    const url = new URL("/auth/confirm", siteConfig.url);
    url.searchParams.set("token_hash", data.properties.hashed_token);
    url.searchParams.set("type", "magiclink");
    url.searchParams.set("next", next);
    return url.toString();
  } catch (error) {
    console.error("generateParentMagicLink failed", error);
    return null;
  }
}
