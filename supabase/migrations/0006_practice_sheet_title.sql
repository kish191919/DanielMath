-- Lets a principal rename a practice sheet away from the generic default
-- ("연습문제") when reviewing/confirming it, so the printed title can reflect
-- what the sheet is actually for (e.g. a concept or unit name).
alter table generated_worksheets add column title text;
