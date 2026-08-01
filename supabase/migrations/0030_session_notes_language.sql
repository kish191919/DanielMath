-- Lets a parent report be generated in Korean or English, chosen by the
-- teacher on the worksheet review page and persisted so the next report for
-- the same student can default to whichever language was last actually sent.

alter table session_notes
  add column language text not null default 'ko' check (language in ('ko', 'en'));
