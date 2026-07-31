import "server-only";
import { createServerSupabase } from "@/lib/supabase/server";
import type { MessageThread, Profile, StudentGuardian } from "@/lib/supabase/types";

export type DuplicateParentCandidate = {
  profile: Profile;
  studentCount: number;
  thread: Pick<MessageThread, "id" | "last_message_at"> | null;
};

export type DuplicateParentGroup = {
  key: string;
  candidates: DuplicateParentCandidate[];
};

function normalizeName(name: string | null): string | null {
  if (!name) return null;
  const normalized = name.trim().replace(/\s+/g, " ").toLowerCase();
  return normalized.length > 0 ? normalized : null;
}

// Same display name across two `profiles` rows usually means the same
// parent signed up twice under a different email — this surfaces those
// groups so the principal can review and merge them from
// mergeParentProfilesAction (src/lib/parents/actions.ts).
export async function listDuplicateParentCandidates(): Promise<DuplicateParentGroup[]> {
  const supabase = await createServerSupabase();

  const { data: parents, error: parentsError } = await supabase
    .from("profiles")
    .select("*")
    .eq("role", "parent")
    .returns<Profile[]>();
  if (parentsError) throw new Error(parentsError.message);

  const byName = new Map<string, Profile[]>();
  for (const parent of parents ?? []) {
    const key = normalizeName(parent.full_name);
    if (!key) continue;
    const group = byName.get(key) ?? [];
    group.push(parent);
    byName.set(key, group);
  }

  const duplicateGroups = [...byName.entries()].filter(([, group]) => group.length > 1);
  if (duplicateGroups.length === 0) return [];

  const parentIds = duplicateGroups.flatMap(([, group]) => group.map((p) => p.id));

  const [{ data: links, error: linksError }, { data: threads, error: threadsError }] =
    await Promise.all([
      supabase
        .from("student_guardians")
        .select("guardian_id")
        .in("guardian_id", parentIds)
        .returns<Pick<StudentGuardian, "guardian_id">[]>(),
      supabase
        .from("message_threads")
        .select("id, parent_id, last_message_at")
        .in("parent_id", parentIds)
        .returns<Pick<MessageThread, "id" | "parent_id" | "last_message_at">[]>(),
    ]);
  if (linksError) throw new Error(linksError.message);
  if (threadsError) throw new Error(threadsError.message);

  const studentCountByParent = new Map<string, number>();
  for (const link of links ?? []) {
    studentCountByParent.set(
      link.guardian_id,
      (studentCountByParent.get(link.guardian_id) ?? 0) + 1,
    );
  }
  const threadByParent = new Map((threads ?? []).map((t) => [t.parent_id, t]));

  return duplicateGroups
    .map(([key, group]) => ({
      key,
      candidates: group
        .map((profile) => ({
          profile,
          studentCount: studentCountByParent.get(profile.id) ?? 0,
          thread: threadByParent.get(profile.id) ?? null,
        }))
        .sort((a, b) => a.profile.created_at.localeCompare(b.profile.created_at)),
    }))
    .sort((a, b) => a.key.localeCompare(b.key, "ko"));
}
