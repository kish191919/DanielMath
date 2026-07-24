import { z } from "zod";

export const INQUIRY_GRADES = ["3", "4", "5", "6"] as const;
export const INQUIRY_LANGUAGES = ["ko", "en"] as const;

// Keep field shapes (enum values, min/max) in sync with the client-side
// schema in src/app/[locale]/(marketing)/inquire/inquiry-form.tsx — that
// one owns locale-aware error copy, this one is the server's independent
// re-validation of an untrusted public form submission.
export const inquirySchema = z.object({
  parentName: z.string().min(1, "학부모 성함을 입력해주세요."),
  contactEmail: z.string().email("올바른 이메일을 입력해주세요."),
  phone: z.string().min(7, "연락처를 입력해주세요."),
  childName: z.string().min(1, "자녀 이름을 입력해주세요."),
  grade: z.enum(INQUIRY_GRADES),
  school: z.string().max(200).optional().or(z.literal("")),
  language: z.enum(INQUIRY_LANGUAGES),
  message: z.string().max(2000).optional().or(z.literal("")),
});

export type InquiryValues = z.infer<typeof inquirySchema>;
