-- Lets a generated_problems row trace back to a reference_problems seed,
-- parallel to the existing source_item_id (which traces back to a
-- learning_items / wrong-answer seed). A row has at most one of the two set
-- (both null for a fully teacher-authored ad hoc row, same as today).
alter table generated_problems
  add column source_reference_id uuid references reference_problems(id) on delete set null;

create index generated_problems_source_reference_idx on generated_problems (source_reference_id);
