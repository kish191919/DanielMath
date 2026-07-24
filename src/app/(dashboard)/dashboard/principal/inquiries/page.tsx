import { Container } from "@/components/site/container";
import { Section } from "@/components/site/section";
import { InquiryList } from "@/components/dashboard/inquiry-list";
import { listInquiries } from "@/lib/inquiries/queries";
import { requireRole } from "@/lib/dal";

export default async function PrincipalInquiriesPage() {
  await requireRole("principal");
  const inquiries = await listInquiries();

  return (
    <Section className="py-10 sm:py-14">
      <Container>
        <div className="flex items-end justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-navy-500">
              Inquiries
            </p>
            <h1 className="mt-2 text-2xl font-bold text-navy-900 font-ko sm:text-3xl" lang="ko">
              상담 문의
            </h1>
          </div>
          <p className="text-sm text-navy-600">총 {inquiries.length}건</p>
        </div>

        <div className="mt-8">
          <InquiryList inquiries={inquiries} />
        </div>
      </Container>
    </Section>
  );
}
