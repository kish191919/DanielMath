-- Monthly tuition billing records. Generation is manual (principal clicks
-- "이번 달 청구 생성" per student, or bulk-generates for all active
-- students) — there is no cron job. billing_month is always the 1st of the
-- calendar month a bill is *for* (independent of due_date, which the
-- principal can move), and the unique constraint below is what makes
-- "generate this month" idempotent per student.
--
-- paid_at/paid_amount are set together, never independently (see the
-- paid_consistency check), so a payment can't be half-recorded.

create table tuition_payments (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references students(id) on delete cascade,
  billing_month date not null,
  amount_due numeric(10, 2) not null check (amount_due >= 0),
  due_date date not null,
  paid_amount numeric(10, 2),
  paid_at date,
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint tuition_payments_billing_month_is_first_of_month check (
    billing_month = date_trunc('month', billing_month)::date
  ),
  constraint tuition_payments_paid_amount_valid check (
    paid_amount is null or paid_amount >= 0
  ),
  constraint tuition_payments_paid_consistency check (
    (paid_at is null) = (paid_amount is null)
  ),
  unique (student_id, billing_month)
);

create index tuition_payments_student_idx on tuition_payments (student_id);
-- Partial index for "who's unpaid" queries (dashboard widget, list filter).
create index tuition_payments_unpaid_idx
  on tuition_payments (due_date) where paid_at is null;

alter table tuition_payments enable row level security;

-- is_principal() defined in 0003_rls_policies.sql.
create policy "tuition_payments_all_principal" on tuition_payments
  for all to authenticated using (is_principal()) with check (is_principal());
create policy "tuition_payments_select_parent" on tuition_payments
  for select to authenticated using (
    exists (
      select 1 from student_guardians sg
      where sg.student_id = tuition_payments.student_id
        and sg.guardian_id = auth.uid()
    )
  );
