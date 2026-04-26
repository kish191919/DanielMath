import type { Metadata } from "next";
import { Inter, Noto_Sans_KR } from "next/font/google";
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
    "Daniel Math",
    "다니엘 수학",
    "AAP",
    "Fairfax AAP",
    "CogAT",
    "NNAT",
    "AMC 8",
    "Common Core math",
    "Korean math academy",
    "Northern Virginia",
    "K-6 math tutor",
    "영재 수학",
    "한인 수학공부방",
  ],
  openGraph: {
    type: "website",
    locale: "ko_KR",
    alternateLocale: "en_US",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: `${siteConfig.name} · ${siteConfig.nameKo}`,
    description: siteConfig.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} · ${siteConfig.nameKo}`,
    description: siteConfig.description,
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${inter.variable} ${notoKR.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-navy-900">
        {children}
      </body>
    </html>
  );
}
