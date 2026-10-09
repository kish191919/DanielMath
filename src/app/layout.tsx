import type { Metadata, Viewport } from "next";
import { Inter, Noto_Sans_KR } from "next/font/google";
import Script from "next/script";
import { headers } from "next/headers";
import { siteConfig } from "@/lib/site-config";
import { ogImages } from "@/lib/seo";
import "./globals.css";
import "katex/dist/katex.min.css";

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
    "Daniel Math",
    "Daniel Math Academy",
    "다니엘 수학",
    "다니엘 수학 아카데미",
    "수학 아카데미",
    "버지니아 수학",
    "버지니아 수학학원",
    "버지니아 수학과외",
    "버지니아 수학 공부방",
    "북버지니아 수학 학원",
    "한인 초등수학",
    "한인 수학 아카데미",
    "페어팩스 초등수학",
    "페어팩스 맞춤수학",
    "Fairfax 수학 학원",
    "FCPS 초등수학",
    "AAP 수학",
    "Fairfax AAP",
    "MOEMS",
    "AMC 8",
    "AMC8",
    "NGAT",
    "Korean math academy",
    "Northern Virginia",
    "3rd-6th grade math tutor",
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
    images: ogImages,
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} · ${siteConfig.nameKo}`,
    description: siteConfig.description,
    images: [`${siteConfig.url}${siteConfig.ogImage}`],
  },
  alternates: {
    types: {
      "application/rss+xml": [
        { url: "/feed.xml", title: `${siteConfig.nameKo} 블로그` },
        { url: "/en/feed.xml", title: `${siteConfig.name} Blog` },
      ],
    },
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
