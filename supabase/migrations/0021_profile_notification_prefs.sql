-- Adds parent-facing notification preferences. sms_opt_in defaults to false
-- (explicit consent required before a phone number is ever used for SMS).
-- profiles itself predates this migration history (see 0018), so this is
-- an alter-only migration.

alter table profiles
  add column phone text,
  add column sms_opt_in boolean not null default false;
