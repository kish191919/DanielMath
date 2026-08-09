-- Backfills scans that were already reported to a guardian (a confirmed
-- session_notes row exists for the same student+session_date) but were
-- never flipped to 'delivered_to_parent'. This happened whenever a student
-- had more than one worksheet_scans row for the same session_date (e.g. a
-- re-scan) — sendSessionNoteAction only updated the single scan_id it was
-- called with, leaving sibling scans stuck at 'uploaded' forever.
update worksheet_scans ws
set status = 'delivered_to_parent'
where ws.status = 'uploaded'
  and exists (
    select 1
    from session_notes sn
    where sn.student_id = ws.student_id
      and sn.session_date = ws.session_date
      and sn.confirmed = true
  );
