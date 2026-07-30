import { siteConfig } from "@/lib/site-config";

export type LegalSection = { heading: string; paragraphs: string[] };

export const privacyPolicy = {
  titleKo: "개인정보처리방침",
  titleEn: "Privacy Policy",
  descKo:
    "다니엘 수학 아카데미(운영: CloudMasterIT LLC)의 개인정보 수집·이용 및 문자(SMS) 알림 동의 안내입니다.",
  descEn:
    "How Daniel Math Academy (operated by CloudMasterIT LLC) collects and uses personal information, including SMS notification consent.",
  effectiveDate: "2026-07-30",

  bodyKo: [
    {
      heading: "1. 개요",
      paragraphs: [
        `본 개인정보처리방침은 다니엘 수학 아카데미(이하 '학원', 운영법인: ${siteConfig.legalName}, ${siteConfig.region} 소재)가 웹사이트 및 학부모 포털을 통해 수집하는 개인정보의 항목, 수집 목적, 이용 방법을 안내합니다.`,
        "본 방침은 2026년 7월 30일부터 시행됩니다.",
      ],
    },
    {
      heading: "2. 수집하는 정보",
      paragraphs: [
        "보호자 정보: 이름, 이메일 주소, 전화번호, 학생과의 관계.",
        "학생 정보: 이름, 학년, 재학 학교(선택), 학습 기록(오답노트, 학습 리포트, 출결 내역). 학생 정보는 등록한 보호자를 통해서만 수집되며, 학생 본인으로부터 직접 수집하지 않습니다.",
      ],
    },
    {
      heading: "3. 정보 이용 목적",
      paragraphs: [
        "상담 및 등록 관리, 수업 배정 및 출결 관리, 학습 리포트 생성 및 발송, 문자(SMS) 및 이메일을 통한 안내(출결, 학습 리포트 도착, 일정 변경 등), 문의 응대를 위해 개인정보를 이용합니다.",
      ],
    },
    {
      heading: "4. 문자메시지(SMS) 알림 및 동의",
      paragraphs: [
        "회원가입 시 별도의 체크박스를 통해 SMS 수신에 대한 명시적 동의를 받으며, 동의하지 않은 보호자에게는 SMS를 발송하지 않습니다.",
        "SMS는 오직 본 학원이 직접 발송하는 안내(학습 리포트 도착, 출결, 일정 변경 등)에만 사용되며, 통신사 요금제에 따라 문자 및 데이터 요금이 발생할 수 있습니다(Message and data rates may apply).",
        "언제든지 문자로 'STOP'을 답장하여 수신을 거부할 수 있으며, 거부 시 즉시 반영됩니다. 'HELP'를 답장하면 도움말을 받을 수 있습니다.",
        "SMS 수신 동의는 등록의 필수 조건이 아니며, 동의하지 않아도 이메일 및 전화를 통한 안내는 계속 제공됩니다.",
      ],
    },
    {
      heading: "5. 제3자 제공 및 판매 금지",
      paragraphs: [
        "전화번호를 포함한 개인정보는 마케팅 목적으로 제3자에게 판매, 대여, 공유하지 않습니다.",
        "서비스 제공에 반드시 필요한 범위 내에서만 위탁업체(문자 발송을 위한 Twilio, 데이터 저장을 위한 Supabase 등)에 처리를 위탁하며, 해당 업체는 계약상 기밀유지 의무를 부담합니다. 법령에 의해 요구되는 경우를 제외하고 개인정보를 외부에 제공하지 않습니다.",
      ],
    },
    {
      heading: "6. 아동의 개인정보 보호(COPPA)",
      paragraphs: [
        "본 학원은 초등학교 3~6학년(만 8~13세 내외) 학생을 대상으로 하며, 학생의 개인정보는 만 13세 미만 아동으로부터 직접 수집하지 않고 등록한 보호자를 통해서만 수집합니다(미국 아동 온라인 개인정보보호법 COPPA 준수).",
        "보호자는 언제든 자녀의 정보 열람, 정정, 삭제를 요청할 수 있습니다.",
      ],
    },
    {
      heading: "7. 보유 기간",
      paragraphs: [
        "재원 기간 동안 및 퇴원 후 최대 2년간 기록 관리 목적으로 개인정보를 보관한 뒤 삭제 또는 비식별화하며, 보호자가 요청하는 경우 그 이전에도 삭제할 수 있습니다.",
      ],
    },
    {
      heading: "8. 정보 보안",
      paragraphs: [
        "Supabase의 접근 제어 기능을 통해 인증된 직원만 개인정보에 접근할 수 있도록 관리하고 있습니다.",
      ],
    },
    {
      heading: "9. 권리 행사 및 문의",
      paragraphs: [
        `개인정보 열람·정정·삭제 요청 또는 SMS 수신 동의 철회는 이메일(${siteConfig.contactEmail}) 또는 전화(${siteConfig.telephone})로 연락 주시기 바랍니다.`,
        "본 방침은 사전 고지 후 변경될 수 있습니다.",
      ],
    },
  ] as LegalSection[],

  bodyEn: [
    {
      heading: "1. Overview",
      paragraphs: [
        `This Privacy Policy explains what personal information Daniel Math Academy ("the Academy," operated by ${siteConfig.legalName}, based in ${siteConfig.region}) collects through its website and parent portal, and how that information is used.`,
        "This policy is effective as of July 30, 2026.",
      ],
    },
    {
      heading: "2. Information We Collect",
      paragraphs: [
        "Guardian information: name, email address, phone number, and relationship to the student.",
        "Student information: name, grade level, school (optional), and learning records (practice-item history, learning reports, attendance). Student information is collected only through the enrolling guardian, never directly from the student.",
      ],
    },
    {
      heading: "3. How We Use Information",
      paragraphs: [
        "We use personal information for inquiry and enrollment management, class assignment and attendance tracking, generating and delivering learning reports, notifications by SMS and email (attendance, report availability, schedule changes), and responding to inquiries.",
      ],
    },
    {
      heading: "4. SMS Notifications and Consent",
      paragraphs: [
        "At signup, guardians provide explicit consent to receive SMS notifications via a dedicated checkbox. We do not send SMS messages to guardians who have not consented.",
        "SMS messages are used only for notifications sent directly by the Academy (learning report availability, attendance, schedule changes). Message and data rates may apply depending on your carrier plan.",
        "You may opt out at any time by replying STOP to any message; opt-outs take effect immediately. Reply HELP for assistance.",
        "SMS consent is not a condition of enrollment — guardians who do not consent will continue to receive updates by email and phone.",
      ],
    },
    {
      heading: "5. No Sale or Third-Party Sharing",
      paragraphs: [
        "We do not sell, rent, or share personal information, including phone numbers, with third parties for marketing purposes.",
        "We share information only with service providers as strictly necessary to operate the Academy — for example, Twilio (SMS delivery) and Supabase (data storage) — under contractual confidentiality obligations. We do not otherwise disclose personal information except where required by law.",
      ],
    },
    {
      heading: "6. Children's Privacy (COPPA)",
      paragraphs: [
        "The Academy serves students in grades 3–6 (approximately ages 8–13). We do not collect personal information directly from children under 13; all student information is collected through the enrolling guardian, consistent with the Children's Online Privacy Protection Act (COPPA).",
        "Guardians may request to review, correct, or delete their child's information at any time.",
      ],
    },
    {
      heading: "7. Data Retention",
      paragraphs: [
        "We retain personal information for the duration of enrollment and up to two years afterward for record-keeping purposes, after which it is deleted or de-identified. Guardians may request earlier deletion at any time.",
      ],
    },
    {
      heading: "8. Security",
      paragraphs: [
        "We restrict access to personal information to authenticated staff using Supabase's access-control features.",
      ],
    },
    {
      heading: "9. Your Rights & Contact",
      paragraphs: [
        `To request access, correction, or deletion of your information, or to withdraw SMS consent, please contact us by email (${siteConfig.contactEmail}) or phone (${siteConfig.telephone}).`,
        "This policy may be updated from time to time; guardians will be notified of material changes in advance.",
      ],
    },
  ] as LegalSection[],
};
