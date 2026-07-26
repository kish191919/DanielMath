-- Multi-guardian support: a student can now have any number of linked
-- guardian accounts instead of a single students.parent_id FK. Mirrors the
-- class_enrollments many-to-many pattern from 0014_classes.sql.

create table student_guardians (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references students(id) on delete cascade,
  guardian_id uuid not null references profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (student_id, guardian_id)
);
create index student_guardians_student_idx on student_guardians (student_id);
create index student_guardians_guardian_idx on student_guardians (guardian_id);

-- Backfill existing single-guardian links.
insert into student_guardians (student_id, guardian_id)
select id, parent_id from students where parent_id is not null;

alter table student_guardians enable row level security;

-- is_principal() defined in 0003_rls_policies.sql.
create policy "student_guardians_all_principal" on student_guardians
  for all to authenticated using (is_principal()) with check (is_principal());
create policy "student_guardians_select_parent" on student_guardians
  for select to authenticated using (guardian_id = auth.uid());

-- students' own RLS has never been in version control (created by hand
-- outside this repo, per the note at the top of 0003_rls_policies.sql), so
-- we don't reliably know the existing policy name(s). Drop every existing
-- policy on students and recreate a clean, version-controlled pair rather
-- than guessing a name to `drop policy if exists`.
do $$
declare
  pol record;
begin
  for pol in select policyname from pg_policies
    where schemaname = 'public' and tablename = 'students'
  loop
    execute format('drop policy if exists %I on public.students', pol.policyname);
  end loop;
end $$;

alter table students enable row level security;

create policy "students_all_principal" on students
  for all to authenticated using (is_principal()) with check (is_principal());
create policy "students_select_parent" on students
  for select to authenticated using (
    exists (
      select 1 from student_guardians sg
      where sg.student_id = students.id and sg.guardian_id = auth.uid()
    )
  );

-- Rewrite every dependent "select_parent" policy to check student_guardians
-- instead of students.parent_id. Every other clause (confirmed = true,
-- enrolled_at/unenrolled_at ranges, etc.) is preserved verbatim.

drop policy if exists "worksheet_scans_select_parent" on worksheet_scans;
create policy "worksheet_scans_select_parent" on worksheet_scans
  for select to authenticated using (
    exists (
      select 1 from student_guardians sg
      where sg.student_id = worksheet_scans.student_id and sg.guardian_id = auth.uid()
    )
  );

drop policy if exists "learning_items_select_parent" on learning_items;
create policy "learning_items_select_parent" on learning_items
  for select to authenticated using (
    confirmed = true
    and exists (
      select 1 from student_guardians sg
      where sg.student_id = learning_items.student_id and sg.guardian_id = auth.uid()
    )
  );

drop policy if exists "session_notes_select_parent" on session_notes;
create policy "session_notes_select_parent" on session_notes
  for select to authenticated using (
    confirmed = true
    and exists (
      select 1 from student_guardians sg
      where sg.student_id = session_notes.student_id and sg.guardian_id = auth.uid()
    )
  );

drop policy if exists "classes_select_parent" on classes;
create policy "classes_select_parent" on classes
  for select to authenticated using (
    exists (
      select 1 from class_enrollments ce
      join student_guardians sg on sg.student_id = ce.student_id
      where ce.class_id = classes.id
        and ce.unenrolled_at is null
        and sg.guardian_id = auth.uid()
    )
  );

drop policy if exists "class_enrollments_select_parent" on class_enrollments;
create policy "class_enrollments_select_parent" on class_enrollments
  for select to authenticated using (
    exists (
      select 1 from student_guardians sg
      where sg.student_id = class_enrollments.student_id and sg.guardian_id = auth.uid()
    )
  );

drop policy if exists "class_sessions_select_parent" on class_sessions;
create policy "class_sessions_select_parent" on class_sessions
  for select to authenticated using (
    exists (
      select 1 from class_enrollments ce
      join student_guardians sg on sg.student_id = ce.student_id
      where ce.class_id = class_sessions.class_id
        and sg.guardian_id = auth.uid()
        and ce.enrolled_at <= class_sessions.session_date
        and (ce.unenrolled_at is null or ce.unenrolled_at >= class_sessions.session_date)
    )
  );

drop policy if exists "class_session_attendance_select_parent" on class_session_attendance;
create policy "class_session_attendance_select_parent" on class_session_attendance
  for select to authenticated using (
    exists (
      select 1 from student_guardians sg
      where sg.student_id = class_session_attendance.student_id and sg.guardian_id = auth.uid()
    )
  );

-- Needed so the "add guardian by email" lookup can match reliably
-- regardless of the case the principal types. `if not exists` here
-- (unlike the rest of this file) because profiles is the one table this
-- migration doesn't fully control the prior state of.
create unique index if not exists profiles_email_unique_idx on profiles (lower(email));

-- students' own RLS wasn't the only thing hand-created outside the repo:
-- a trigger auto-resolved parent_id from parent_email on write. It's now
-- fully superseded by addGuardianAction, and must be dropped before the
-- columns it depends on can be dropped.
drop trigger if exists "students_resolve_parent" on students;

-- Clean cutover: no backward-compat column. student_guardians now fully
-- owns guardian linkage; parent_email was free-text informational data
-- with no programmatic use once the guardian-list UI replaces the input.
alter table students drop column parent_id;
alter table students drop column parent_email;
