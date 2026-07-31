-- Merges two parent profiles that turned out to be the same person (e.g. a
-- duplicate signup under a second email). Repoints every table that
-- references profiles(id) for p_merge_id over to p_keep_id, folding a
-- second message thread into the keep thread instead of leaving the
-- conversation split across two accounts, then deletes the merge profile
-- row. Called only from mergeParentProfilesAction via the service-role
-- client — never exposed to `authenticated` (see grants below).
create or replace function merge_parent_profiles(p_keep_id uuid, p_merge_id uuid)
returns void
language plpgsql
set search_path = public
as $$
declare
  v_keep_role text;
  v_merge_role text;
  v_keep_thread_id uuid;
  v_merge_thread_id uuid;
begin
  if p_keep_id = p_merge_id then
    raise exception 'keep and merge profile ids must differ';
  end if;

  select role into v_keep_role from profiles where id = p_keep_id;
  select role into v_merge_role from profiles where id = p_merge_id;
  if v_keep_role is null or v_merge_role is null then
    raise exception 'both profiles must exist';
  end if;
  if v_keep_role <> 'parent' or v_merge_role <> 'parent' then
    raise exception 'merge_parent_profiles only merges parent-role profiles';
  end if;

  -- Drop any guardian link that would collide with one the keep profile
  -- already has for the same student, then repoint the rest.
  delete from student_guardians sg
    where sg.guardian_id = p_merge_id
      and exists (
        select 1 from student_guardians k
        where k.student_id = sg.student_id and k.guardian_id = p_keep_id
      );
  update student_guardians set guardian_id = p_keep_id where guardian_id = p_merge_id;

  select id into v_keep_thread_id from message_threads where parent_id = p_keep_id;
  select id into v_merge_thread_id from message_threads where parent_id = p_merge_id;

  if v_merge_thread_id is not null then
    if v_keep_thread_id is not null then
      update messages set thread_id = v_keep_thread_id where thread_id = v_merge_thread_id;
      update message_threads k
        set last_message_at = m.last_message_at,
            last_message_body = m.last_message_body,
            last_sender_id = m.last_sender_id
        from message_threads m
        where k.id = v_keep_thread_id
          and m.id = v_merge_thread_id
          and (k.last_message_at is null or m.last_message_at > k.last_message_at);
      delete from message_threads where id = v_merge_thread_id;
    else
      update message_threads set parent_id = p_keep_id where id = v_merge_thread_id;
    end if;
  end if;

  update messages set sender_id = p_keep_id where sender_id = p_merge_id;

  -- Staff-authored columns — a parent role account should never populate
  -- these, but reassigning is a no-op when empty and keeps the merge
  -- exhaustive if that assumption ever breaks.
  update session_notes set created_by = p_keep_id where created_by = p_merge_id;
  update generated_worksheets set created_by = p_keep_id where created_by = p_merge_id;
  update inquiry_notes set created_by = p_keep_id where created_by = p_merge_id;
  update class_sessions set created_by = p_keep_id where created_by = p_merge_id;
  update worksheet_scans set uploaded_by = p_keep_id where uploaded_by = p_merge_id;
  update worksheet_scans set reviewed_by = p_keep_id where reviewed_by = p_merge_id;
  update reference_problem_scans set uploaded_by = p_keep_id where uploaded_by = p_merge_id;
  update reference_problem_scans set reviewed_by = p_keep_id where reviewed_by = p_merge_id;

  delete from profiles where id = p_merge_id;
end;
$$;

-- Same revoke-then-grant pattern as 0026: without this, Postgres' default
-- EXECUTE-to-PUBLIC grant would let any authenticated parent call this and
-- delete another account.
revoke execute on function merge_parent_profiles(uuid, uuid) from public;
grant execute on function merge_parent_profiles(uuid, uuid) to service_role;
