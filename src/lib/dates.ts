const ACADEMY_TIME_ZONE = "America/New_York";

export function todayInEasternTime(): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: ACADEMY_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const y = parts.find((p) => p.type === "year")!.value;
  const m = parts.find((p) => p.type === "month")!.value;
  const d = parts.find((p) => p.type === "day")!.value;
  return `${y}-${m}-${d}`;
}

const ISO_WEEKDAY_BY_LABEL: Record<string, number> = {
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
  Sun: 7,
};

export function todayIsoWeekdayInEasternTime(): number {
  const label = new Intl.DateTimeFormat("en-US", {
    timeZone: ACADEMY_TIME_ZONE,
    weekday: "short",
  }).format(new Date());
  return ISO_WEEKDAY_BY_LABEL[label];
}
