import { requireRole } from "@/lib/dal";
import { ComingSoonPlaceholder } from "@/components/dashboard/placeholder";

export default async function ParentProgressPage() {
  await requireRole("parent");
  return (
    <ComingSoonPlaceholder
      title="진행 상황"
      titleEn="Progress"
      description="이번 주 학습량, 정답률, 다음 평가 일정을 확인합니다."
    />
  );
}
