import { requireRole } from "@/lib/dal";
import { ComingSoonPlaceholder } from "@/components/dashboard/placeholder";

export default async function PrincipalWorksheetsPage() {
  await requireRole("principal");
  return (
    <ComingSoonPlaceholder
      title="학습지"
      titleEn="Worksheets"
      description="AI로 학년별·유형별 영어 학습지를 생성하고 PDF로 출력합니다."
    />
  );
}
