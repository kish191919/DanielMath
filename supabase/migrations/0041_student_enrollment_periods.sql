-- Academy-level enrollment status history — distinct from class_enrollments
-- (0014_classes.sql), which tracks per-class roster membership. This tracks
-- when a student registered (등록), paused (중지), and resumed (재등록) at
-- the academy overall. Mirrors class_enrollments exactly: ended_at stays
-- null while a student is currently enrolled; setting it (rather than
-- deleting the row) preserves history. Current status is derived by the
-- app, not stored: ended_at is null -> 재원중(active), else -> 중지(paused).

create table student_enrollment_periods (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references students(id) on delete cascade,
  started_at date not null default current_date,
  ended_at date,
  note text,
  created_at timestamptz not null default now(),
  constraint student_enrollment_periods_date_order check (
    ended_at is null or ended_at >= started_at
  )
);

-- Only one *active* period per student, mirroring
-- class_enrollments_active_unique_idx.
create unique index student_enrollment_periods_active_unique_idx
  on student_enrollment_periods (student_id) where ended_at is null;
create index student_enrollment_periods_student_idx
  on student_enrollment_periods (student_id);

alter table student_enrollment_periods enable row level security;

-- is_principal() defined in 0003_rls_policies.sql.
create policy "student_enrollment_periods_all_principal" on student_enrollment_periods
  for all to authenticated using (is_principal()) with check (is_principal());
create policy "student_enrollment_periods_select_parent" on student_enrollment_periods
  for select to authenticated using (
    exists (
      select 1 from student_guardians sg
      where sg.student_id = student_enrollment_periods.student_id
        and sg.guardian_id = auth.uid()
    )
  );
