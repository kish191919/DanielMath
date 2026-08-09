export const siteConfig = {
  name: "Daniel Math Academy",
  nameKo: "다니엘 수학 아카데미",
  legalName: "CloudMasterIT LLC",
  url: "https://danielmath.com",
  description:
    "버지니아 Fairfax 소재 수학 공부방·수학 학원. 4명 소수 정예, AAP·CogAT/NNAT 통합 커리큘럼으로 3-6학년 영재 수학을 키우는 한인 수학 아카데미.",
  descriptionEn:
    "A Virginia math tutoring academy in Fairfax for Korean-American families, grades 3–6. Small-group, gifted math with AAP, CogAT/NNAT prep — 4 students per class, Mon/Tue/Thu/Fri.",
  region: "Fairfax Virginia",
  address: {
    locality: "Fairfax",
    region: "VA",
    postalCode: "22030",
    country: "US",
  },
  telephone: "205-734-9654",
  serviceAreas: [
    "Fairfax",
    "Oakton",
    "Vienna",
    "Fairfax Station",
    "Annandale",
    "Centreville",
    "Chantilly",
  ],
  contactEmail: "kish1919@gmail.com",
  googleReviewUrl: "https://g.page/r/CS0dlftSUH10EBM/review",
  hours: "M · T · Th · F · 5–8 PM",
  hoursKo: "월·화·목·금 오후 5–8시",
  ogImage: "/og.png",
  nav: [
    { href: "/programs", label: "Programs", labelKo: "프로그램" },
    { href: "/resources", label: "FCPS Math Curriculum", labelKo: "수학 교육과정" },
    { href: "/school-calendar", label: "School Calendar", labelKo: "학교 캘린더" },
    { href: "/blog", label: "Blog", labelKo: "블로그" },
  ],
} as const;

export type SiteConfig = typeof siteConfig;
