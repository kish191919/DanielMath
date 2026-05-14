import { Mail, Clock } from "lucide-react";
import { Container } from "./container";
import { siteConfig } from "@/lib/site-config";
import type { Locale } from "@/lib/i18n";

export function UtilityBar({ locale }: { locale: Locale }) {
  const isKo = locale === "ko";
  return (
    <div className="hidden border-b border-navy-800 bg-navy-900 text-navy-100 sm:block">
      <Container>
        <div className="flex h-9 items-center justify-between text-xs">
          <a
            href={`mailto:${siteConfig.contactEmail}`}
            className="inline-flex items-center gap-1.5 hover:text-white"
          >
            <Mail className="h-3.5 w-3.5" aria-hidden />
            <span>{siteConfig.contactEmail}</span>
          </a>
          <div className="inline-flex items-center gap-2">
            <Clock className="h-3.5 w-3.5" aria-hidden />
            <span>{isKo ? siteConfig.hoursKo : siteConfig.hours}</span>
            <span className="text-navy-400">·</span>
            {isKo ? (
              <span className="font-medium text-gold-300 font-ko" lang="ko">
                무료 상담 환영
              </span>
            ) : (
              <span className="font-medium text-gold-300">
                Free consultation welcome
              </span>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
}
