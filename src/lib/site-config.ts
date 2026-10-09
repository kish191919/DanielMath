export const siteConfig = {
  name: "Daniel Math Academy",
  nameKo: "다니엘 수학 아카데미",
  legalName: "CloudMasterIT LLC",
  url: "https://danielmath.com",
  description:
    "버지니아 페어팩스(Fairfax) 한인 초등수학 학원. 3-6학년 4명 소수정예 맞춤수학으로 FCPS 초등수학·AAP 수학 심화부터 MOEMS·AMC 8 경시대회 준비까지, 과외처럼 꼼꼼하게 진도와 오답을 관리합니다.",
  descriptionEn:
    "A small-group, personalized elementary math academy in Fairfax, VA for Korean-American families, grades 3–6 — only 4 students per class, Mon/Tue/Thu/Fri. Diagnostic-driven, leveled practice with mistake tracking for FCPS and AAP math.",
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
  openingHours: {
    days: ["Monday", "Tuesday", "Thursday", "Friday"],
    opens: "17:00",
    closes: "20:00",
  },
  ogImage: "/og.png",
  nav: [
    { href: "/programs", label: "Programs", labelKo: "프로그램" },
    { href: "/resources", label: "FCPS Math Curriculum", labelKo: "수학 교육과정" },
    { href: "/school-calendar", label: "School Calendar", labelKo: "학교 캘린더" },
    { href: "/blog", label: "Blog", labelKo: "블로그" },
  ],
} as const;

export type SiteConfig = typeof siteConfig;
