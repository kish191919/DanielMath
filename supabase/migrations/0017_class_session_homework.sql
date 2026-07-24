-- Homework completion, per student per class session. This rides on
-- class_session_attendance rather than a new table: that table is already
-- exactly one row per (session, student), which is the same granularity
-- homework status needs — no separate join table required.

alter table class_session_attendance
  add column homework_status text not null default 'na'
    check (homework_status in ('done', 'partial', 'not_done', 'na'));
