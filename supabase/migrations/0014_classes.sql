-- Classes (반) and student enrollment.
--
-- Students previously had no notion of which recurring class/time-slot they
-- belong to. The academy runs multiple day+time combinations (e.g. Mon/Thu
-- 5:00-6:10, Tue/Fri 6:30-7:40) and a student's schedule can vary — some
-- attend one combination, some attend several at once. Rather than storing
-- a schedule on the student, each day+time combination that actually exists
-- gets its own `classes` row, and `class_enrollments` is a many-to-many join
-- so a student can belong to any number of classes.

create table classes (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  days_of_week smallint[] not null, -- ISO weekday: 1=Mon ... 7=Sun
  start_time time not null,
  end_time time not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint classes_days_of_week_valid check (
    days_of_week <@ array[1,2,3,4,5,6,7]::smallint[]
    and coalesce(array_length(days_of_week, 1), 0) > 0
  ),
  constraint classes_time_order check (start_time < end_time)
);

-- unenrolled_at stays null while a student is currently in the class;
-- setting it (rather than deleting the row) preserves enrollment history.
create table class_enrollments (
  id uuid primary key default gen_random_uuid(),
  class_id uuid not null references classes(id) on delete cascade,
  student_id uuid not null references students(id) on delete cascade,
  enrolled_at date not null default current_date,
  unenrolled_at date,
  created_at timestamptz not null default now(),
  constraint class_enrollments_date_order check (
    unenrolled_at is null or unenrolled_at >= enrolled_at
  )
);

-- Only one *active* enrollment per (class, student) — a student can still
-- be re-enrolled later since past (unenrolled_at is not null) rows don't
-- count toward this constraint.
create unique index class_enrollments_active_unique_idx
  on class_enrollments (class_id, student_id) where unenrolled_at is null;
create index class_enrollments_student_active_idx
  on class_enrollments (student_id) where unenrolled_at is null;
create index class_enrollments_class_active_idx
  on class_enrollments (class_id) where unenrolled_at is null;

alter table classes enable row level security;
alter table class_enrollments enable row level security;

-- is_principal() defined in 0003_rls_policies.sql.
create policy "classes_all_principal" on classes
  for all to authenticated using (is_principal()) with check (is_principal());
create policy "classes_select_parent" on classes
  for select to authenticated using (
    exists (
      select 1 from class_enrollments ce
      join students s on s.id = ce.student_id
      where ce.class_id = classes.id
        and ce.unenrolled_at is null
        and s.parent_id = auth.uid()
    )
  );

create policy "class_enrollments_all_principal" on class_enrollments
  for all to authenticated using (is_principal()) with check (is_principal());
create policy "class_enrollments_select_parent" on class_enrollments
  for select to authenticated using (
    exists (
      select 1 from students s
      where s.id = class_enrollments.student_id and s.parent_id = auth.uid()
    )
  );
