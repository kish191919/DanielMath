-- Practice sheets built from "원본 그대로" (verbatim) or AI-rewritten scanned
-- reference problems don't need to be personalized to one student — the same
-- sheet is meant to be printed and handed to every student. Drop the not-null
-- constraint so generatePracticeSheetAction can create a worksheet with
-- student_id = null for that "공통 학습지" case; RLS is principal-only
-- (is_principal()), not student-scoped, so no policy change is needed.
alter table generated_worksheets alter column student_id drop not null;
