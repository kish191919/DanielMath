export const siteConfig = {
  name: "Daniel Math",
  nameKo: "다니엘 수학공부방",
  url: "https://danielmath.com",
  description:
    "AAP·CogAT·AMC 8 통합 커리큘럼으로 3-6학년 영재 수학을 키우는 한인 수학공부방. AI 기반 맞춤 학습지와 매일 자동 리포트.",
  descriptionEn:
    "A boutique math academy for 3rd–6th grade gifted minds in Northern Virginia. AI-powered worksheets, daily reports, and a curriculum built for AAP, CogAT, and AMC 8.",
  region: "Northern Virginia",
  contactEmail: "kish1919@gmail.com",
  hours: "M · T · Th · F · 5–8 PM",
  hoursKo: "월·화·목·금 오후 5–8시",
  ogImage: "/og.png",
  nav: [
    { href: "/programs", label: "Programs", labelKo: "프로그램" },
    { href: "/resources", label: "Resources", labelKo: "수학 자료" },
  ],
} as const;

export type SiteConfig = typeof siteConfig;
