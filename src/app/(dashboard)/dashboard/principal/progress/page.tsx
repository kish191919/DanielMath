import { requireRole } from "@/lib/dal";
import { ComingSoonPlaceholder } from "@/components/dashboard/placeholder";

export default async function PrincipalProgressPage() {
  await requireRole("principal");
  return (
    <ComingSoonPlaceholder
      title="진행 상황"
      titleEn="Progress"
      description="학생별 진도, 정답률, AAP/CogAT 모의 점수 트렌드를 확인합니다."
    />
  );
}
