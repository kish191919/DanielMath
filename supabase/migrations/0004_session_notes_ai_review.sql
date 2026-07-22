-- Lets an AI-drafted parent summary sit in session_notes as an unconfirmed
-- draft (source: 'ai', confirmed: false) until the principal reviews/edits
-- and publishes it — same shape as the source/edited_by_teacher/confirmed
-- pattern already used on learning_items.

alter table session_notes
  add column source text not null default 'teacher' check (source in ('ai', 'teacher')),
  add column edited_by_teacher boolean not null default false,
  add column confirmed boolean not null default true;

-- Default true keeps every existing row (and the existing manual
-- addSessionNoteAction insert path) visible to parents exactly as before;
-- only new AI drafts are inserted with confirmed = false.

drop policy if exists "session_notes_select_parent" on session_notes;
create policy "session_notes_select_parent" on session_notes
  for select to authenticated using (
    confirmed = true
    and exists (
      select 1 from students s
      where s.id = session_notes.student_id and s.parent_id = auth.uid()
    )
  );
