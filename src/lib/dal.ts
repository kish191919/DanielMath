import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";
import type { Profile, Role } from "@/lib/supabase/types";

export type Session = {
  userId: string;
  email: string;
  profile: Profile;
};

export const verifySession = cache(async (): Promise<Session | null> => {
  const supabase = await createServerSupabase();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single<Profile>();

  if (!profile) return null;

  return {
    userId: user.id,
    email: user.email ?? profile.email,
    profile,
  };
});

export async function requireSession(): Promise<Session> {
  const session = await verifySession();
  if (!session) redirect("/login");
  return session;
}

export async function requireRole(role: Role): Promise<Session> {
  const session = await requireSession();
  if (session.profile.role !== role) redirect("/dashboard");
  return session;
}

export async function getCurrentProfile(): Promise<Profile | null> {
  const session = await verifySession();
  return session?.profile ?? null;
}
