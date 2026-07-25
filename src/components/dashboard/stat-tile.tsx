import Link from "next/link";

export function StatTile({
  label,
  value,
  href,
}: {
  label: string;
  value: number;
  href?: string;
}) {
  const className =
    "rounded-2xl border border-navy-100 bg-white p-4 shadow-sm transition-colors hover:border-navy-300 hover:bg-navy-50";
  const content = (
    <>
      <p className="text-2xl font-bold text-navy-900">{value}</p>
      <p className="mt-1 text-xs font-medium text-navy-600 font-ko" lang="ko">
        {label}
      </p>
    </>
  );

  if (href) {
    return (
      <Link href={href} className={className}>
        {content}
      </Link>
    );
  }

  return <div className={className}>{content}</div>;
}
