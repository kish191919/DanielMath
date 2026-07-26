import { Container } from "@/components/site/container";
import { Section } from "@/components/site/section";
import { NotificationSettingsForm } from "@/components/dashboard/notification-settings-form";
import { requireRole } from "@/lib/dal";

export default async function ParentSettingsPage() {
  const session = await requireRole("parent");

  return (
    <Section className="py-10 sm:py-14">
      <Container>
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wider text-navy-500">설정</p>
          <h1 className="mt-2 text-2xl font-bold text-navy-900 font-ko sm:text-3xl" lang="ko">
            알림 설정
          </h1>
          <p className="mt-2 text-sm text-navy-600">
            로그인 이메일: <span className="font-medium text-navy-900">{session.email}</span>
          </p>
        </div>

        <div className="mx-auto mt-8 max-w-2xl">
          <NotificationSettingsForm
            phone={session.profile.phone}
            smsOptIn={session.profile.sms_opt_in}
          />
        </div>
      </Container>
    </Section>
  );
}
