"use client";

import * as React from "react";
import { useActionState } from "react";
import { ConfirmSubmitButton } from "@/components/dashboard/confirm-submit-button";
import {
  mergeParentProfilesAction,
  type MergeParentProfilesState,
} from "@/lib/parents/actions";
import type { DuplicateParentGroup } from "@/lib/parents/queries";

export function DuplicateParentGroups({ groups }: { groups: DuplicateParentGroup[] }) {
  return (
    <div className="h-full overflow-y-auto p-6">
      <h1 className="text-xl font-bold text-navy-900 font-ko" lang="ko">
        중복 학부모 계정 정리
      </h1>
      {groups.length === 0 ? (
        <p className="mt-4 text-sm text-navy-600 font-ko" lang="ko">
          중복으로 보이는 학부모 계정이 없습니다.
        </p>
      ) : (
        <div className="mt-6 space-y-6">
          {groups.map((group) => (
            <DuplicateGroupCard key={group.key} group={group} />
          ))}
        </div>
      )}
    </div>
  );
}

function DuplicateGroupCard({ group }: { group: DuplicateParentGroup }) {
  const [keepId, setKeepId] = React.useState(group.candidates[0].profile.id);
  const keepCandidate = group.candidates.find((c) => c.profile.id === keepId) ?? group.candidates[0];

  return (
    <div className="rounded-2xl border border-navy-100 bg-white p-6 shadow-sm">
      <h2 className="text-base font-semibold text-navy-900">
        {group.candidates[0].profile.full_name} ({group.candidates.length}개 계정)
      </h2>
      <p className="mt-1 text-xs text-navy-500 font-ko" lang="ko">
        유지할 계정을 라디오로 선택한 뒤, 나머지 계정 옆의 병합 버튼을 누르세요.
      </p>
      <ul className="mt-4 divide-y divide-navy-100">
        {group.candidates.map((candidate) => (
          <li key={candidate.profile.id} className="flex items-center justify-between gap-3 py-3">
            <label className="flex flex-1 items-start gap-3">
              <input
                type="radio"
                name={`keep-${group.key}`}
                className="mt-1"
                checked={keepId === candidate.profile.id}
                onChange={() => setKeepId(candidate.profile.id)}
              />
              <span className="text-sm">
                <span className="block font-medium text-navy-900">{candidate.profile.email}</span>
                <span className="block text-xs text-navy-500">
                  {candidate.profile.phone ?? "연락처 미등록"} · 가입일{" "}
                  {new Date(candidate.profile.created_at).toLocaleDateString("ko-KR")} · 학생{" "}
                  {candidate.studentCount}명 · {candidate.thread ? "메시지 있음" : "메시지 없음"}
                </span>
              </span>
            </label>
            {keepId !== candidate.profile.id && (
              <MergeButton
                keepId={keepId}
                keepLabel={keepCandidate.profile.email}
                mergeId={candidate.profile.id}
              />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

function MergeButton({
  keepId,
  keepLabel,
  mergeId,
}: {
  keepId: string;
  keepLabel: string;
  mergeId: string;
}) {
  const action = mergeParentProfilesAction.bind(null, keepId, mergeId);
  const [state, formAction] = useActionState<MergeParentProfilesState | null, FormData>(
    action,
    null,
  );

  return (
    <form action={formAction} className="shrink-0">
      <ConfirmSubmitButton
        label="병합"
        confirmMessage={`이 계정의 학생 연결과 메시지 기록을 ${keepLabel} 계정으로 합치고, 이 계정은 삭제합니다. 계속할까요?`}
        className="rounded-md border border-red-200 px-3 py-1 text-xs font-medium text-red-700 hover:bg-red-50"
      />
      {state?.error && (
        <p className="mt-1 max-w-[16rem] text-xs text-red-600" role="alert">
          {state.error}
        </p>
      )}
    </form>
  );
}
