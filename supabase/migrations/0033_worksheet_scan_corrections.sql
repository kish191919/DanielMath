-- Links an "오답 재촬영본" (correction scan — a re-photograph of only the
-- problems the teacher already graded and marked wrong in red pen) back to
-- the original full-session scan it corrects. Original scans are never
-- AI-graded (see confirmUploadAction); only correction scans are.
alter table worksheet_scans
  add column source_scan_id uuid references worksheet_scans(id) on delete cascade;

create index worksheet_scans_source_scan_idx on worksheet_scans (source_scan_id);
