-- Teachers don't photograph every problem a student solves — usually only
-- the ones the student struggled with. That means concept accuracy stats
-- computed from worksheet_scans can skew lower than the student's actual
-- performance for concepts that were only ever captured via a targeted
-- review upload. This flag lets the uploading teacher mark that case so
-- downstream accuracy views can surface it instead of presenting the number
-- as if it came from a representative sample.
alter table worksheet_scans
  add column is_targeted_review boolean not null default false;
