import { Container } from "@/components/site/container";
import { Section } from "@/components/site/section";
import { requireRole } from "@/lib/dal";
import { SmsConsentToggle } from "./sms-consent-toggle";

export default async function ParentSettings() {
  const session = await requireRole("parent");

  return (
    <Section className="py-10 sm:py-14">
      <Container>
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wider text-navy-500">설정</p>
          <h1 className="mt-2 text-2xl font-bold text-navy-900 sm:text-3xl font-ko" lang="ko">
            알림 설정
          </h1>
        </div>
        <div className="mt-8 max-w-xl rounded-2xl border border-navy-100 bg-white p-6 shadow-sm">
          <SmsConsentToggle defaultChecked={session.profile.sms_consent} />
        </div>
      </Container>
    </Section>
  );
}
