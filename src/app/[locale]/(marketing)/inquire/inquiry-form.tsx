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
import type { Dictionary } from "@/dictionaries";

type FormLabels = Dictionary["inquire"]["form"];
type FormErrors = Dictionary["inquire"]["errors"];

type Props = {
  labels: FormLabels;
  errors: FormErrors;
  thanksPath: string;
};

const grades = [
  { v: "3", l: "3rd Grade" },
  { v: "4", l: "4th Grade" },
  { v: "5", l: "5th Grade" },
  { v: "6", l: "6th Grade" },
];

export function InquiryForm({ labels, errors: errMsgs, thanksPath }: Props) {
  const router = useRouter();
  const [submitting, setSubmitting] = React.useState(false);

  const schema = z.object({
    parentName: z.string().min(1, errMsgs.parentName),
    contactEmail: z.string().email(errMsgs.email),
    phone: z.string().min(7, errMsgs.phone),
    childName: z.string().min(1, errMsgs.childName),
    grade: z.string().min(1, errMsgs.grade),
    school: z.string().optional(),
    language: z.enum(["ko", "en"]),
    message: z.string().max(2000).optional(),
  });

  type FormValues = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { language: "ko" },
  });

  const onSubmit = async (values: FormValues) => {
    setSubmitting(true);
    console.log("[inquiry]", values);
    await new Promise((r) => setTimeout(r, 400));
    router.push(thanksPath);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="space-y-6 rounded-2xl border border-navy-100 bg-white p-6 shadow-sm sm:p-8"
    >
      <Field label={labels.parentName.label} error={errors.parentName?.message} required>
        <Input
          {...register("parentName")}
          aria-required
          autoComplete="name"
          placeholder={labels.parentName.placeholder}
        />
      </Field>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label={labels.email.label} error={errors.contactEmail?.message} required>
          <Input
            type="email"
            {...register("contactEmail")}
            aria-required
            autoComplete="email"
            placeholder="parent@example.com"
          />
        </Field>
        <Field label={labels.phone.label} error={errors.phone?.message} required>
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
        <Field label={labels.childName.label} error={errors.childName?.message} required>
          <Input
            {...register("childName")}
            aria-required
            placeholder={labels.childName.placeholder}
          />
        </Field>
        <Field label={labels.grade.label} error={errors.grade?.message} required>
          <select
            {...register("grade")}
            aria-required
            className="flex h-11 w-full rounded-md border border-navy-200 bg-white px-3 py-2 text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-navy-500"
            defaultValue=""
          >
            <option value="" disabled>{labels.grade.placeholder}</option>
            {grades.map((g) => (
              <option key={g.v} value={g.v}>{g.l}</option>
            ))}
          </select>
        </Field>
      </div>

      <Field label={labels.school.label} error={errors.school?.message}>
        <Input
          {...register("school")}
          autoComplete="organization"
          placeholder="e.g. Wakefield Forest ES"
        />
      </Field>

      <Field label={labels.language.label}>
        <div className="flex gap-5">
          <Radio {...register("language")} value="ko" label="한국어" />
          <Radio {...register("language")} value="en" label="English" />
        </div>
      </Field>

      <Field label={labels.message.label} error={errors.message?.message}>
        <Textarea
          {...register("message")}
          placeholder={labels.message.placeholder}
          maxLength={2000}
        />
      </Field>

      <div className="border-t border-navy-100 pt-5">
        <Button size="lg" disabled={submitting} className="w-full">
          {submitting ? labels.submitting : labels.submit}
        </Button>
        <p className="mt-3 text-center text-xs text-navy-600">{labels.privacy}</p>
      </div>
    </form>
  );
}
