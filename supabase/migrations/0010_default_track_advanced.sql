-- This academy's students are effectively all on the AAP (advanced) pace,
-- not the standard one — 0009 defaulted `track` to 'standard' as the safe
-- generic backfill, but that's the wrong default here and forced the
-- principal to flip every student by hand. Flip the column default and
-- backfill existing rows to 'advanced'; the standard/advanced selector on
-- the student form stays available for the rare non-AAP student.
alter table students alter column track set default 'advanced';
update students set track = 'advanced';
