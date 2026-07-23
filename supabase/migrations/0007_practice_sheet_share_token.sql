-- Public, unauthenticated "check my answers" link: printed sheets carry a QR
-- code pointing at /answers/[share_token]. The token is a separate random
-- value (not the worksheet's own id) so a dashboard URL a principal has open
-- can never double as a public answer-key link, and looking it up only ever
-- exposes answers for the one matching sheet.
alter table generated_worksheets
  add column share_token uuid not null default gen_random_uuid() unique;
