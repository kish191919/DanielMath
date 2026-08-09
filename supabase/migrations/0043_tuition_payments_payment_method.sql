-- How a tuition payment was received. Nullable while unpaid; required once
-- paid_at is set (the principal must record how the money came in when
-- marking a bill paid).
alter table tuition_payments
  add column payment_method text
    check (payment_method in ('zelle', 'venmo', 'cash', 'stripe'));

alter table tuition_payments
  add constraint tuition_payments_payment_method_required_when_paid check (
    paid_at is null or payment_method is not null
  );
