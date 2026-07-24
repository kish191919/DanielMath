-- Lets the principal record multiple timestamped consultation notes per
-- inquiry ("상담 기록"), editable/deletable individually. Mirrors the shape
-- of session_notes (0001_learning_history_schema.sql) but with only a
-- principal-all RLS policy: unlike students, inquiries have no parent-facing
-- select policy at all today (see 0013_inquiries.sql), so there is no parent
-- audience for these notes.

create table inquiry_notes (
  id uuid primary key default gen_random_uuid(),
  inquiry_id uuid not null references inquiries(id) on delete cascade,
  note text not null,
  created_by uuid not null references profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index inquiry_notes_inquiry_created_idx
  on inquiry_notes (inquiry_id, created_at desc);

alter table inquiry_notes enable row level security;

-- is_principal() already defined in 0003_rls_policies.sql
create policy "inquiry_notes_all_principal" on inquiry_notes
  for all to authenticated using (is_principal()) with check (is_principal());
