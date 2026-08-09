-- Default monthly tuition amount per student, used to pre-fill new billing
-- records (tuition_payments, added in 0042) when the principal generates
-- this month's bill. Editable per record afterward, so this is only ever a
-- default, never a source of truth for what was actually billed.
alter table students
  add column monthly_tuition_amount numeric(10, 2) not null default 0
    check (monthly_tuition_amount >= 0);
