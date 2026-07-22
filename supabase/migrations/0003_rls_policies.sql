-- Supabase enables Row Level Security by default on new tables in the
-- `public` schema, which blocked every insert/select on the four new tables
-- (no policies existed for them, unlike `students`/`profiles`, which already
-- had policies added by hand outside this repo). This migration adds
-- role-aware policies consistent with the app's existing model: principals
-- get full access, parents get read-only access scoped to their own
-- children.

-- security definer avoids RLS recursion when checking the caller's role
-- (a plain subquery against `profiles` inside a policy on `profiles` itself
-- would recurse).
create or replace function is_principal()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from profiles where id = auth.uid() and role = 'principal'
  );
$$;

alter table concepts enable row level security;
alter table worksheet_scans enable row level security;
alter table learning_items enable row level security;
alter table session_notes enable row level security;

-- concepts: read-only reference data every signed-in user can see; only the
-- principal manages the list.
create policy "concepts_select_authenticated" on concepts
  for select to authenticated using (true);
create policy "concepts_all_principal" on concepts
  for all to authenticated using (is_principal()) with check (is_principal());

-- worksheet_scans
create policy "worksheet_scans_all_principal" on worksheet_scans
  for all to authenticated using (is_principal()) with check (is_principal());
create policy "worksheet_scans_select_parent" on worksheet_scans
  for select to authenticated using (
    exists (
      select 1 from students s
      where s.id = worksheet_scans.student_id and s.parent_id = auth.uid()
    )
  );

-- learning_items: parents only ever see confirmed rows, never the
-- in-review AI suggestions.
create policy "learning_items_all_principal" on learning_items
  for all to authenticated using (is_principal()) with check (is_principal());
create policy "learning_items_select_parent" on learning_items
  for select to authenticated using (
    confirmed = true
    and exists (
      select 1 from students s
      where s.id = learning_items.student_id and s.parent_id = auth.uid()
    )
  );

-- session_notes
create policy "session_notes_all_principal" on session_notes
  for all to authenticated using (is_principal()) with check (is_principal());
create policy "session_notes_select_parent" on session_notes
  for select to authenticated using (
    exists (
      select 1 from students s
      where s.id = session_notes.student_id and s.parent_id = auth.uid()
    )
  );
