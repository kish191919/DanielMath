import { requireRole } from "@/lib/dal";
import { listDuplicateParentCandidates } from "@/lib/parents/queries";
import { DuplicateParentGroups } from "@/components/dashboard/duplicate-parent-groups";

export default async function DuplicateParentsPage() {
  await requireRole("principal");
  const groups = await listDuplicateParentCandidates();

  return <DuplicateParentGroups groups={groups} />;
}
