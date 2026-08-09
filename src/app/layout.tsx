import type { Metadata, Viewport } from "next";
import { Inter, Noto_Sans_KR } from "next/font/google";
import Script from "next/script";
import { headers } from "next/headers";
import { siteConfig } from "@/lib/site-config";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const notoKR = Noto_Sans_KR({
  variable: "--font-noto-kr",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} · ${siteConfig.nameKo}`,
    template: `%s · ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "Daniel Math Academy",
    "다니엘 수학",
    "AAP",
    "Fairfax AAP",
    "CogAT",
    "NNAT",
    "Common Core math",
    "Korean math academy",
    "Northern Virginia",
    "3rd-6th grade math tutor",
    "영재 수학",
    "한인 수학 아카데미",
    "버지니아 수학 학원",
    "버지니아 수학 공부방",
    "북버지니아 수학 학원",
    "Fairfax 수학 학원",
    "Vienna 수학 공부방",
    "Oakton 수학 학원",
    "Virginia math tutoring",
    "Virginia math academy",
  ],
  openGraph: {
    type: "website",
    locale: "ko_KR",
    alternateLocale: "en_US",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: `${siteConfig.name} · ${siteConfig.nameKo}`,
    description: siteConfig.description,
    images: [{ url: `${siteConfig.url}${siteConfig.ogImage}`, width: 1200, height: 630, alt: siteConfig.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} · ${siteConfig.nameKo}`,
    description: siteConfig.description,
    images: [`${siteConfig.url}${siteConfig.ogImage}`],
  },
  robots: { index: true, follow: true },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
    other: {
      "naver-site-verification": "dd0d328210c2ee8794183d90d550976534ffd0ae",
    },
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: siteConfig.nameKo,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0a1f3d",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const heads = await headers();
  const locale = heads.get("x-locale") ?? "ko";
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  return (
    <html
      lang={locale}
      className={`${inter.variable} ${notoKR.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-navy-900">
        {children}
        {gaId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}');
              `}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
