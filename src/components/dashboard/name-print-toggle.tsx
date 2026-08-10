"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";

export function NamePrintToggle({ defaultChecked }: { defaultChecked: boolean }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleChange = (checked: boolean) => {
    const params = new URLSearchParams(searchParams.toString());
    if (checked) {
      params.delete("showName");
    } else {
      params.set("showName", "0");
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <label
      className="print:hidden flex items-center gap-2 text-sm text-navy-700 font-ko"
      lang="ko"
    >
      <input
        type="checkbox"
        defaultChecked={defaultChecked}
        onChange={(e) => handleChange(e.target.checked)}
        className="h-4 w-4 rounded border-navy-300"
      />
      이름 자동 출력
    </label>
  );
}
