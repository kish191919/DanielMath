export const siteConfig = {
  name: "Daniel Math Academy",
  nameKo: "다니엘 수학 아카데미",
  legalName: "CloudMasterIT LLC",
  url: "https://danielmath.com",
  description:
    "버지니아 Fairfax 소재 3-6학년 대상 4명 소수정예 맞춤수학 아카데미. 진단 평가부터 수준별 학습, 오답 관리, 사고력 확장까지 — AAP 수준의 심화 사고력을 기르는 한인 수학 공부방.",
  descriptionEn:
    "A small-group, personalized math enrichment academy in Fairfax, VA for Korean-American families, grades 3–6 — only 4 students per class, Mon/Tue/Thu/Fri. Diagnostic-driven, leveled practice with mistake tracking, building AAP-level depth of thinking.",
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
  contactEmail: "admin@danielmath.com",
  googleReviewUrl: "https://search.google.com/local/writereview?placeid=ChIJnevfwD-qOQ8RLR0h-1JQfXQ",
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
