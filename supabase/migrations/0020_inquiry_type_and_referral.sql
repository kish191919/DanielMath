-- Distinguishes a plain consultation request from a free trial/diagnostic
-- class request, and captures an optional referrer name so the principal
-- can manually track word-of-mouth leads for the referral program.

alter table inquiries
  add column inquiry_type text not null default 'consult'
    check (inquiry_type in ('consult', 'trial')),
  add column referred_by text;
