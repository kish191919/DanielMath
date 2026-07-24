-- Class session log (수업일지): a teacher-authored record of what happened
-- in a class on a given date (topic covered, shared materials, notes) plus
-- per-student attendance for that session. Always written directly by the
-- teacher (no AI-draft/confirm flow like session_notes), and append-only
-- like `inquiries` — create/select/delete only, no update action.

create table class_sessions (
  id uuid primary key default gen_random_uuid(),
  class_id uuid not null references classes(id) on delete cascade,
  session_date date not null default current_date,
  topic text,
  materials text,
  note text,
  created_by uuid not null references profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index class_sessions_class_date_idx on class_sessions (class_id, session_date desc);

-- One row per student per session-log entry; status is always an explicit
-- value (no "unmarked" state) — the create form defaults every roster row
-- to 'present' before submission.
create table class_session_attendance (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references class_sessions(id) on delete cascade,
  student_id uuid not null references students(id) on delete cascade,
  status text not null check (status in ('present', 'absent', 'late')),
  created_at timestamptz not null default now(),
  unique (session_id, student_id)
);
create index class_session_attendance_student_idx on class_session_attendance (student_id);

alter table class_sessions enable row level security;
alter table class_session_attendance enable row level security;

-- is_principal() defined in 0003_rls_policies.sql.
create policy "class_sessions_all_principal" on class_sessions
  for all to authenticated using (is_principal()) with check (is_principal());
create policy "class_sessions_select_parent" on class_sessions
  for select to authenticated using (
    exists (
      select 1 from class_enrollments ce
      join students s on s.id = ce.student_id
      where ce.class_id = class_sessions.class_id
        and s.parent_id = auth.uid()
        and ce.enrolled_at <= class_sessions.session_date
        and (ce.unenrolled_at is null or ce.unenrolled_at >= class_sessions.session_date)
    )
  );

create policy "class_session_attendance_all_principal" on class_session_attendance
  for all to authenticated using (is_principal()) with check (is_principal());
-- A parent only ever sees their own child's attendance row, regardless of
-- who else was in the class that day.
create policy "class_session_attendance_select_parent" on class_session_attendance
  for select to authenticated using (
    exists (
      select 1 from students s
      where s.id = class_session_attendance.student_id and s.parent_id = auth.uid()
    )
  );
