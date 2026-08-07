-- Drop the 'late' attendance status: attendance is now a binary
-- present/absent signal. Existing 'late' rows are treated as attended.
update class_session_attendance set status = 'present' where status = 'late';

alter table class_session_attendance
  drop constraint class_session_attendance_status_check;
alter table class_session_attendance
  add constraint class_session_attendance_status_check
    check (status in ('present', 'absent'));
