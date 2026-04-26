"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, Radio } from "@/components/forms/field";

const schema = z.object({
  parentName: z.string().min(1, "학부모 성함을 입력해주세요."),
  contactEmail: z.string().email("올바른 이메일을 입력해주세요."),
  phone: z.string().min(7, "연락처를 입력해주세요."),
  childName: z.string().min(1, "자녀 이름을 입력해주세요."),
  grade: z.string().min(1, "학년을 선택해주세요."),
  school: z.string().optional(),
  language: z.enum(["ko", "en"]),
  message: z.string().max(2000).optional(),
});

type FormValues = z.infer<typeof schema>;

const grades = [
  { v: "K", l: "Kindergarten" },
  { v: "1", l: "1st Grade" },
  { v: "2", l: "2nd Grade" },
  { v: "3", l: "3rd Grade" },
  { v: "4", l: "4th Grade" },
  { v: "5", l: "5th Grade" },
  { v: "6", l: "6th Grade" },
];

export function InquiryForm() {
  const router = useRouter();
  const [submitting, setSubmitting] = React.useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      language: "ko",
    },
  });

  const onSubmit = async (values: FormValues) => {
    setSubmitting(true);
    // TEMP: Phase A에서는 콘솔에만 기록. Phase B에서 Supabase + 이메일 알림 연결 예정.
    console.log("[inquiry]", values);
    await new Promise((r) => setTimeout(r, 400));
    router.push("/thanks");
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="space-y-6 rounded-2xl border border-navy-100 bg-white p-6 shadow-sm sm:p-8"
    >
      <Field label="학부모 성함 / Parent Name" error={errors.parentName?.message} required>
        <Input
          {...register("parentName")}
          aria-required
          autoComplete="name"
          placeholder="홍길동"
        />
      </Field>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="이메일 / Email" error={errors.contactEmail?.message} required>
          <Input
            type="email"
            {...register("contactEmail")}
            aria-required
            autoComplete="email"
            placeholder="parent@example.com"
          />
        </Field>
        <Field label="연락처 / Phone" error={errors.phone?.message} required>
          <Input
            type="tel"
            {...register("phone")}
            aria-required
            autoComplete="tel"
            placeholder="(703) 555-0100"
          />
        </Field>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="자녀 이름 / Child Name" error={errors.childName?.message} required>
          <Input
            {...register("childName")}
            aria-required
            placeholder="자녀 이름"
          />
        </Field>
        <Field label="학년 / Grade" error={errors.grade?.message} required>
          <select
            {...register("grade")}
            aria-required
            className="flex h-11 w-full rounded-md border border-navy-200 bg-white px-3 py-2 text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-navy-500"
            defaultValue=""
          >
            <option value="" disabled>
              Select grade
            </option>
            {grades.map((g) => (
              <option key={g.v} value={g.v}>
                {g.l}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="현재 학교 / Current School (선택)" error={errors.school?.message}>
        <Input
          {...register("school")}
          autoComplete="organization"
          placeholder="e.g. Wakefield Forest ES"
        />
      </Field>

      <Field label="응답 선호 언어 / Preferred Language">
        <div className="flex gap-5">
          <Radio {...register("language")} value="ko" label="한국어" />
          <Radio {...register("language")} value="en" label="English" />
        </div>
      </Field>

      <Field label="문의 내용 / Message (선택)" error={errors.message?.message}>
        <Textarea
          {...register("message")}
          placeholder="자녀의 현재 수학 수준, 목표, 또는 궁금한 점을 자유롭게 적어주세요."
          maxLength={2000}
        />
      </Field>

      <div className="border-t border-navy-100 pt-5">
        <Button size="lg" disabled={submitting} className="w-full">
          {submitting ? "보내는 중..." : "상담 신청하기 / Submit"}
        </Button>
        <p className="mt-3 text-center text-xs text-navy-600 font-ko" lang="ko">
          본 폼은 학부모 정보만 수집합니다. 자녀의 개인정보는 등록 후 별도
          동의 절차로 진행됩니다 (COPPA 준수).
        </p>
      </div>
    </form>
  );
}

