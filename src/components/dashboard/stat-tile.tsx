export function StatTile({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-navy-100 bg-white p-4 shadow-sm">
      <p className="text-2xl font-bold text-navy-900">{value}</p>
      <p className="mt-1 text-xs font-medium text-navy-600 font-ko" lang="ko">
        {label}
      </p>
    </div>
  );
}
