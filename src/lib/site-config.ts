export const siteConfig = {
  name: "Daniel Math Academy",
  nameKo: "다니엘 수학 아카데미",
  url: "https://danielmath.com",
  description:
    "4명 소수 정예, AAP·CogAT/NNAT 통합 커리큘럼으로 3-6학년 영재 수학을 키우는 한인 수학 아카데미.",
  descriptionEn:
    "A small-group gifted math academy for grades 3–6 in Northern Virginia. AAP, CogAT/NNAT — 4 students per class, Mon/Tue/Thu/Fri.",
  region: "Northern Virginia",
  contactEmail: "kish1919@gmail.com",
  hours: "M · T · Th · F · 5–8 PM",
  hoursKo: "월·화·목·금 오후 5–8시",
  ogImage: "/og.png",
  nav: [
    { href: "/programs", label: "Programs", labelKo: "프로그램" },
    { href: "/resources", label: "FCPS Math Curriculum", labelKo: "수학 교육과정" },
    { href: "/school-calendar", label: "School Calendar", labelKo: "학교 캘린더" },
  ],
} as const;

export type SiteConfig = typeof siteConfig;
