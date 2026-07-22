-- Learning history / 오답노트 schema.
-- Storage bucket is private; all access goes through signed URLs minted
-- server-side (see src/lib/supabase/admin.ts callers), matching the
-- requireRole()/requireSession() enforcement pattern used across the app
-- (no RLS policies exist yet on students/profiles either).

insert into storage.buckets (id, name, public)
values ('worksheet-scans', 'worksheet-scans', false)
on conflict (id) do nothing;

create type error_type as enum (
  'calculation_mistake',
  'place_value_error',
  'fraction_concept',
  'word_problem_interpretation',
  'unit_conversion',
  'pattern_recognition',
  'time_pressure'
);

create type scan_status as enum (
  'uploaded',
  'grading',
  'pending_review',
  'reviewed',
  'grading_failed'
);

-- Teacher-editable reference table (not a code enum) so concept tags can be
-- added/renamed/retired without a deploy.
create table concepts (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  strand text not null,
  label_ko text not null,
  label_en text,
  grades text[] not null default '{}',
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table worksheet_scans (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references students(id) on delete cascade,
  uploaded_by uuid not null references profiles(id),
  storage_path text not null,
  original_filename text,
  mime_type text not null check (mime_type in ('image/jpeg', 'image/png', 'application/pdf')),
  file_size_bytes integer,
  status scan_status not null default 'uploaded',
  grading_error text,
  graded_at timestamptz,
  reviewed_at timestamptz,
  reviewed_by uuid references profiles(id),
  session_date date not null default current_date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index worksheet_scans_student_date_idx on worksheet_scans (student_id, session_date desc);
create index worksheet_scans_status_idx on worksheet_scans (status);

-- Core learning-history record. Both correct and incorrect items are stored —
-- growth tracking (accuracy over time per concept) needs the denominator,
-- not just the mistakes.
create table learning_items (
  id uuid primary key default gen_random_uuid(),
  scan_id uuid not null references worksheet_scans(id) on delete cascade,
  student_id uuid not null references students(id) on delete cascade,
  problem_number text,
  transcribed_problem text not null,
  transcribed_answer text,
  is_correct boolean not null,
  concept_id uuid references concepts(id),
  error_type error_type,
  ai_confidence_note text,
  ai_suggested jsonb,
  source text not null default 'ai' check (source in ('ai', 'teacher')),
  edited_by_teacher boolean not null default false,
  -- false while the AI's suggestion sits in the review queue; the teacher's
  -- confirm action is what flips this to true. Growth/accuracy queries must
  -- filter on this so unconfirmed AI guesses never pollute the stats.
  confirmed boolean not null default false,
  session_date date not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index learning_items_student_concept_date_idx on learning_items (student_id, concept_id, session_date);
create index learning_items_student_date_idx on learning_items (student_id, session_date desc);
create index learning_items_scan_idx on learning_items (scan_id);

-- Per-session narrative note, kept separate from the auto-graded data so the
-- teacher can record qualitative observations (e.g. "집중을 잘 못했어요").
create table session_notes (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references students(id) on delete cascade,
  scan_id uuid references worksheet_scans(id) on delete set null,
  session_date date not null default current_date,
  note text not null,
  created_by uuid not null references profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index session_notes_student_date_idx on session_notes (student_id, session_date desc);
