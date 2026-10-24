import { GRADE_3 } from "./catalog-grade3";
import { GRADE_4 } from "./catalog-grade4";
import { GRADE_5 } from "./catalog-grade5";
import { GRADE_6 } from "./catalog-grade6";
import { unitLetter, unitsForGrade } from "./units";
import type { GradeNum, WorksheetDef } from "./types";

// One file per grade (catalog-grade3.ts …), each listed unit by unit in the
// order its skills are numbered.
export const WORKSHEETS: WorksheetDef[] = [...GRADE_3, ...GRADE_4, ...GRADE_5, ...GRADE_6];

export const WORKSHEET_GRADES: readonly GradeNum[] = [3, 4, 5, 6];

export function gradeSlug(grade: GradeNum): string {
  return `grade-${grade}`;
}

export function parseGradeSlug(slug: string): GradeNum | null {
  const n = Number(slug.replace(/^grade-/, ""));
  return (WORKSHEET_GRADES as readonly number[]).includes(n) && slug === `grade-${n}` ? (n as GradeNum) : null;
}

export function worksheetsForGrade(grade: GradeNum): WorksheetDef[] {
  return WORKSHEETS.filter((w) => w.grade === grade);
}

export function getWorksheet(gradeSlugParam: string, slug: string): WorksheetDef | undefined {
  const grade = parseGradeSlug(gradeSlugParam);
  return grade === null ? undefined : WORKSHEETS.find((w) => w.grade === grade && w.slug === slug);
}

export function worksheetPath(def: WorksheetDef): string {
  return `/worksheets/${gradeSlug(def.grade)}/${def.slug}`;
}

/** Stable key for a skill outside the catalog (the skill browser's list keys). */
export function skillKey(def: WorksheetDef): string {
  return `${def.grade}/${def.slug}`;
}

export function worksheetsInUnit(grade: GradeNum, unitKey: string): WorksheetDef[] {
  return WORKSHEETS.filter((w) => w.grade === grade && w.unit === unitKey);
}

/** A grade's skills in display order, unit by unit — the order of their codes. */
export function skillsInOrder(grade: GradeNum): WorksheetDef[] {
  return unitsForGrade(grade).flatMap((u) => worksheetsInUnit(grade, u.key));
}

/** IXL-style position of a skill: its unit, that unit's letter, and the skill's code ("C.2"). */
export function skillPosition(def: WorksheetDef) {
  const units = unitsForGrade(def.grade);
  const index = units.findIndex((u) => u.key === def.unit);
  const letter = unitLetter(index);
  const number = worksheetsInUnit(def.grade, def.unit).indexOf(def) + 1;
  return { unit: units[index], letter, code: `${letter}.${number}` };
}
