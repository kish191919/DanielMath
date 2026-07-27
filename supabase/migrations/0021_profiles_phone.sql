-- Phone number for Kakao AlimTalk (Solapi) delivery. Nullable — existing
-- parent accounts predate this column; the principal backfills these via
-- the guardian-list UI. No format constraint, same convention as
-- inquiries.phone (0013_inquiries.sql) — free text, normalized to
-- digits-only at send time in kakao-alimtalk.ts.
alter table profiles add column phone text;
