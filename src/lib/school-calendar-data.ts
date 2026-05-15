export type EventType = "important" | "holiday" | "break" | "quarter" | "noSchool";

export type CalendarEvent = {
  dateStart: string;
  dateEnd?: string;
  labelEn: string;
  labelKo: string;
  type: EventType;
};

export type SchoolYearCalendar = {
  id: "2025-26" | "2026-27" | "2027-28";
  events: CalendarEvent[];
};

export const schoolCalendars: SchoolYearCalendar[] = [
  {
    id: "2025-26",
    events: [
      { dateStart: "2025-08-18", labelEn: "First Day of School", labelKo: "개학일", type: "important" },
      { dateStart: "2025-08-29", dateEnd: "2025-09-01", labelEn: "Labor Day Break", labelKo: "노동절 연휴", type: "break" },
      { dateStart: "2025-09-09", labelEn: "No School – Special Election", labelKo: "휴교 (특별선거)", type: "noSchool" },
      { dateStart: "2025-10-13", labelEn: "Indigenous Peoples' Day", labelKo: "원주민의 날", type: "holiday" },
      { dateStart: "2025-10-31", labelEn: "End of Q1 (2-hr Early Release)", labelKo: "1분기 마감", type: "quarter" },
      { dateStart: "2025-11-04", labelEn: "No School – Election Day", labelKo: "휴교 (선거일)", type: "noSchool" },
      { dateStart: "2025-11-11", labelEn: "Veterans Day", labelKo: "재향군인의 날", type: "holiday" },
      { dateStart: "2025-11-26", dateEnd: "2025-11-28", labelEn: "Thanksgiving Break", labelKo: "추수감사절 연휴", type: "break" },
      { dateStart: "2025-12-22", dateEnd: "2026-01-02", labelEn: "Winter Break", labelKo: "겨울 방학", type: "break" },
      { dateStart: "2026-01-19", labelEn: "Martin Luther King Jr. Day", labelKo: "MLK 기념일", type: "holiday" },
      { dateStart: "2026-01-28", labelEn: "End of Q2 (2-hr Early Release)", labelKo: "2분기 마감", type: "quarter" },
      { dateStart: "2026-02-16", labelEn: "Presidents' Day", labelKo: "대통령의 날", type: "holiday" },
      { dateStart: "2026-03-27", labelEn: "End of Q3 (2-hr Early Release)", labelKo: "3분기 마감", type: "quarter" },
      { dateStart: "2026-03-30", dateEnd: "2026-04-03", labelEn: "Spring Break", labelKo: "봄 방학", type: "break" },
      { dateStart: "2026-04-21", labelEn: "No School – Special Election", labelKo: "휴교 (특별선거)", type: "noSchool" },
      { dateStart: "2026-05-25", labelEn: "Memorial Day", labelKo: "현충일", type: "holiday" },
      { dateStart: "2026-06-17", labelEn: "Last Day of School (Early Release)", labelKo: "종업일", type: "important" },
    ],
  },
  {
    id: "2026-27",
    events: [
      { dateStart: "2026-08-24", labelEn: "First Day of School", labelKo: "개학일", type: "important" },
      { dateStart: "2026-09-04", dateEnd: "2026-09-07", labelEn: "Labor Day Break", labelKo: "노동절 연휴", type: "break" },
      { dateStart: "2026-10-12", labelEn: "Indigenous Peoples' Day", labelKo: "원주민의 날", type: "holiday" },
      { dateStart: "2026-10-30", labelEn: "End of Q1 (2-hr Early Release)", labelKo: "1분기 마감", type: "quarter" },
      { dateStart: "2026-11-03", labelEn: "No School – Election Day", labelKo: "휴교 (선거일)", type: "noSchool" },
      { dateStart: "2026-11-25", dateEnd: "2026-11-27", labelEn: "Thanksgiving Break", labelKo: "추수감사절 연휴", type: "break" },
      { dateStart: "2026-12-21", dateEnd: "2027-01-03", labelEn: "Winter Break", labelKo: "겨울 방학", type: "break" },
      { dateStart: "2027-01-18", labelEn: "Martin Luther King Jr. Day", labelKo: "MLK 기념일", type: "holiday" },
      { dateStart: "2027-01-28", labelEn: "End of Q2 (2-hr Early Release)", labelKo: "2분기 마감", type: "quarter" },
      { dateStart: "2027-02-01", labelEn: "No School – Staff Development", labelKo: "휴교 (교원 연수)", type: "noSchool" },
      { dateStart: "2027-02-15", labelEn: "Presidents' Day", labelKo: "대통령의 날", type: "holiday" },
      { dateStart: "2027-03-22", dateEnd: "2027-03-26", labelEn: "Spring Break", labelKo: "봄 방학", type: "break" },
      { dateStart: "2027-04-16", labelEn: "End of Q3 (2-hr Early Release)", labelKo: "3분기 마감", type: "quarter" },
      { dateStart: "2027-04-20", labelEn: "No School – Staff Development", labelKo: "휴교 (교원 연수)", type: "noSchool" },
      { dateStart: "2027-05-31", labelEn: "Memorial Day", labelKo: "현충일", type: "holiday" },
      { dateStart: "2027-06-16", labelEn: "Last Day of School (Early Release)", labelKo: "종업일", type: "important" },
    ],
  },
  {
    id: "2027-28",
    events: [
      { dateStart: "2027-08-23", labelEn: "First Day of School", labelKo: "개학일", type: "important" },
      { dateStart: "2027-09-03", dateEnd: "2027-09-06", labelEn: "Labor Day Break", labelKo: "노동절 연휴", type: "break" },
      { dateStart: "2027-11-05", labelEn: "End of Q1 (2-hr Early Release)", labelKo: "1분기 마감", type: "quarter" },
      { dateStart: "2027-11-24", dateEnd: "2027-11-26", labelEn: "Thanksgiving Break", labelKo: "추수감사절 연휴", type: "break" },
      { dateStart: "2027-12-20", dateEnd: "2028-01-02", labelEn: "Winter Break", labelKo: "겨울 방학", type: "break" },
      { dateStart: "2028-01-17", labelEn: "Martin Luther King Jr. Day", labelKo: "MLK 기념일", type: "holiday" },
      { dateStart: "2028-01-27", labelEn: "End of Q2 (2-hr Early Release)", labelKo: "2분기 마감", type: "quarter" },
      { dateStart: "2028-02-21", labelEn: "Presidents' Day", labelKo: "대통령의 날", type: "holiday" },
      { dateStart: "2028-04-10", dateEnd: "2028-04-14", labelEn: "Spring Break", labelKo: "봄 방학", type: "break" },
      { dateStart: "2028-04-21", labelEn: "End of Q3 (2-hr Early Release)", labelKo: "3분기 마감", type: "quarter" },
      { dateStart: "2028-05-29", labelEn: "Memorial Day", labelKo: "현충일", type: "holiday" },
      { dateStart: "2028-06-14", labelEn: "Last Day of School (Early Release)", labelKo: "종업일", type: "important" },
    ],
  },
];
