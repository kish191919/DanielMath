import { siteConfig } from "@/lib/site-config";

export type LegalSection = { heading: string; paragraphs: string[] };

export const privacyPolicy = {
  title: "Privacy Policy",
  description:
    "How Daniel Math Academy (operated by CloudMasterIT LLC) collects and uses personal information, including SMS notification consent.",
  effectiveDate: "2026-07-30",

  body: [
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

export const smsTerms = {
  title: "SMS Terms & Conditions",
  description:
    "Terms governing SMS text message notifications sent by Daniel Math Academy (operated by CloudMasterIT LLC) to enrolled students' guardians.",
  effectiveDate: "2026-07-30",

  body: [
    {
      heading: "1. Program Description",
      paragraphs: [
        `The Daniel Math Academy SMS Notification Program sends account-related text messages to the guardians of enrolled students, operated by ${siteConfig.legalName}. Messages include: learning report availability alerts (with a link to view the full report and reply), attendance notifications, and class schedule changes.`,
        "This program does not send marketing or promotional messages.",
      ],
    },
    {
      heading: "2. Opt-In",
      paragraphs: [
        `Guardians opt in by creating an account at ${siteConfig.url}/signup and checking a dedicated SMS consent checkbox. No message is sent to any guardian who has not checked this box. SMS consent is not a condition of enrollment.`,
      ],
    },
    {
      heading: "3. Message Frequency",
      paragraphs: [
        "Message frequency varies based on your student's class schedule and activity. Guardians of students enrolled in classes meeting up to four days per week (Monday, Tuesday, Thursday, Friday) may receive up to 4 messages per week.",
      ],
    },
    {
      heading: "4. Message and Data Rates",
      paragraphs: ["Message and data rates may apply, depending on your mobile carrier plan."],
    },
    {
      heading: "5. Opt-Out and Help",
      paragraphs: [
        "You may opt out at any time by replying STOP to any message; opt-outs take effect immediately. Reply HELP for assistance, or contact us directly.",
      ],
    },
    {
      heading: "6. No Sharing of Mobile Information",
      paragraphs: [
        "We do not sell, rent, or share mobile phone numbers or SMS opt-in information with third parties for marketing purposes. See our Privacy Policy for details.",
      ],
    },
    {
      heading: "7. Contact",
      paragraphs: [
        `Questions about this program can be directed to ${siteConfig.contactEmail} or ${siteConfig.telephone}.`,
      ],
    },
  ] as LegalSection[],
};
