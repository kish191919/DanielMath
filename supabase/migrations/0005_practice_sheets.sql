-- Practice sheet generation: a principal selects wrong-answer learning_items
-- and generates AI-written similar problems + answer keys, reviewed/edited
-- before printing. Mirrors the worksheet_scans/learning_items shape (a batch
-- header + child rows), so the review/confirm flow can reuse the same
-- delete-then-insert pattern as confirmReviewAction.
--
-- No per-row confirmed flag on generated_problems (unlike learning_items) —
-- the whole batch is edited and confirmed together in one review pass, so
-- the worksheet-level status is the only gate needed.

create type practice_sheet_status as enum ('draft', 'confirmed');

create table generated_worksheets (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references students(id) on delete cascade,
  created_by uuid not null references profiles(id),
  status practice_sheet_status not null default 'draft',
  created_at timestamptz not null default now(),
  confirmed_at timestamptz
);

create table generated_problems (
  id uuid primary key default gen_random_uuid(),
  worksheet_id uuid not null references generated_worksheets(id) on delete cascade,
  -- Kept for traceability (which original mistake this practice problem grew
  -- out of); nullable since the source item could theoretically be removed
  -- independently of the generated sheet.
  source_item_id uuid references learning_items(id) on delete set null,
  concept_id uuid references concepts(id),
  problem_text text not null,
  answer_text text not null,
  sort_order integer not null default 0,
  source text not null default 'ai' check (source in ('ai', 'teacher')),
  edited_by_teacher boolean not null default false,
  ai_suggested jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index generated_problems_worksheet_idx on generated_problems (worksheet_id);

alter table generated_worksheets enable row level security;
alter table generated_problems enable row level security;

-- Principal-only tool — no parent select policy, unlike learning_items/
-- worksheet_scans/session_notes, which parents read a scoped view of.
create policy "generated_worksheets_all_principal" on generated_worksheets
  for all to authenticated using (is_principal()) with check (is_principal());
create policy "generated_problems_all_principal" on generated_problems
  for all to authenticated using (is_principal()) with check (is_principal());
