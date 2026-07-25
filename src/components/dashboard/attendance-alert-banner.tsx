export function AttendanceAlertBanner({
  absentNames,
  homeworkNotDoneNames,
}: {
  absentNames: string[];
  homeworkNotDoneNames: string[];
}) {
  if (absentNames.length === 0 && homeworkNotDoneNames.length === 0) return null;

  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
      <p className="text-sm font-semibold text-amber-900 font-ko" lang="ko">
        오늘 결석 {absentNames.length}명 · 숙제 미제출 {homeworkNotDoneNames.length}명
      </p>
      <div className="mt-2 space-y-1 text-xs text-amber-800">
        {absentNames.length > 0 && <p>결석: {absentNames.join(", ")}</p>}
        {homeworkNotDoneNames.length > 0 && <p>숙제 미제출: {homeworkNotDoneNames.join(", ")}</p>}
      </div>
    </div>
  );
}
