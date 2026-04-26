export const siteConfig = {
  name: "Daniel Math",
  nameKo: "다니엘 수학공부방",
  url: "https://danielmath.com",
  description:
    "AAP·CogAT·AMC 8 통합 커리큘럼으로 K-6 영재 수학을 키우는 한인 수학공부방. AI 기반 맞춤 학습지와 매일 자동 리포트.",
  descriptionEn:
    "A boutique math academy for K-6 gifted minds in Northern Virginia. AI-powered worksheets, daily reports, and a curriculum built for AAP, CogAT, and AMC 8.",
  region: "Northern Virginia",
  contactEmail: "kish1919@gmail.com",
  ogImage: "/og.png",
  nav: [
    { href: "/programs", label: "Programs", labelKo: "프로그램" },
    { href: "/tuition", label: "Tuition", labelKo: "수업료" },
    { href: "/inquire", label: "Inquire", labelKo: "상담 신청" },
  ],
} as const;

export type SiteConfig = typeof siteConfig;
