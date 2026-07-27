-- Global reference problem bank: teachers upload photos/PDFs of problems
-- they want to reuse as templates (not tied to any student or wrong
-- answer). Mirrors worksheet_scans/learning_items (a scan header + child
-- rows extracted by AI OCR, reviewed/tagged before use), minus every
-- student-specific column, since this bank is shared across all students.
--
-- reuses the existing scan_status enum (uploaded/grading/pending_review/
-- reviewed/grading_failed) — the lifecycle semantics are identical to a
-- worksheet scan's, just without a student attached.

create table reference_problem_scans (
  id uuid primary key default gen_random_uuid(),
  uploaded_by uuid not null references profiles(id),
  storage_path text not null,
  original_filename text,
  mime_type text not null check (mime_type in ('image/jpeg', 'image/png', 'application/pdf')),
  file_size_bytes bigint,
  status scan_status not null default 'uploaded',
  grading_error text,
  graded_at timestamptz,
  reviewed_at timestamptz,
  reviewed_by uuid references profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index reference_problem_scans_status_idx on reference_problem_scans (status);

create table reference_problems (
  id uuid primary key default gen_random_uuid(),
  scan_id uuid not null references reference_problem_scans(id) on delete cascade,
  problem_number text,
  transcribed_problem text not null,
  -- Nullable: a photographed "good problem" may not show a worked answer.
  -- Generation-time AI is expected to derive/verify the answer itself when
  -- this is null (see generate-similar-problems.ts).
  transcribed_answer text,
  concept_id uuid references concepts(id),
  ai_confidence_note text,
  ai_suggested jsonb,
  source text not null default 'ai' check (source in ('ai', 'teacher')),
  edited_by_teacher boolean not null default false,
  -- Gate for catalog usability: the review UI requires concept_id to be set
  -- before a row can be confirmed, even though the column itself is
  -- nullable (matching every other concept_id FK in this schema).
  confirmed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index reference_problems_scan_idx on reference_problems (scan_id);
create index reference_problems_concept_idx on reference_problems (concept_id) where confirmed;

alter table reference_problem_scans enable row level security;
alter table reference_problems enable row level security;

-- Principal-only tool, same reasoning as generated_worksheets/generated_problems
-- (0005_practice_sheets.sql) — no parent ever sees the reference bank.
create policy "reference_problem_scans_all_principal" on reference_problem_scans
  for all to authenticated using (is_principal()) with check (is_principal());
create policy "reference_problems_all_principal" on reference_problems
  for all to authenticated using (is_principal()) with check (is_principal());

-- Private bucket, no storage.objects policies — access is entirely via
-- signed URLs minted server-side (service-role client) behind requireRole(),
-- same convention as the worksheet-scans bucket (0001_learning_history_schema.sql).
insert into storage.buckets (id, name, public)
values ('problem-bank', 'problem-bank', false)
on conflict (id) do nothing;
