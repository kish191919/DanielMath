"use client";

import * as React from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { GRADE_LABELS } from "@/lib/students/schema";
import type { Student } from "@/lib/supabase/types";

export function StudentQuickSearch({ students }: { students: Student[] }) {
  const [query, setQuery] = React.useState("");

  const results = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return students.filter((s) => s.full_name.toLowerCase().includes(q)).slice(0, 8);
  }, [query, students]);

  return (
    <div className="rounded-2xl border border-navy-100 bg-white p-4 shadow-sm">
      <label className="text-sm font-semibold text-navy-900 font-ko" lang="ko">
        학생 빠른 검색
      </label>
      <Input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="학생 이름으로 검색"
        className="mt-2"
      />
      {query.trim() !== "" &&
        (results.length === 0 ? (
          <p className="mt-2 text-xs text-navy-500">검색 결과가 없습니다.</p>
        ) : (
          <div className="mt-2 divide-y divide-navy-100 rounded-md border border-navy-100">
            {results.map((s) => (
              <Link
                key={s.id}
                href={`/dashboard/principal/students/${s.id}`}
                className="flex items-center justify-between gap-3 px-3 py-2 text-sm hover:bg-navy-50"
              >
                <span className="font-medium text-navy-900">{s.full_name}</span>
                <span className="text-xs text-navy-500">{GRADE_LABELS[s.grade]}</span>
              </Link>
            ))}
          </div>
        ))}
    </div>
  );
}
