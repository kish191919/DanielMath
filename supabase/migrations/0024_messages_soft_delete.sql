-- Soft-delete for individual messages. A tombstone stays visible to both
-- parties ("삭제된 메시지입니다") rather than disappearing, so the thread
-- stays legible and nothing vanishes without a trace.
alter table messages add column deleted_at timestamptz;

-- messages_update_parent (0019_messages.sql) is intentionally broad: a
-- parent must be able to update read_at on messages sent BY the principal,
-- in their own thread. Reusing that policy for deleted_at would let a
-- parent hide the principal's messages too. This trigger closes that gap:
-- only the original sender (or the principal) may change deleted_at.
create or replace function enforce_message_delete_ownership()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.deleted_at is distinct from old.deleted_at
     and not is_principal()
     and old.sender_id <> auth.uid() then
    raise exception 'only the sender or the principal may delete this message';
  end if;
  return new;
end;
$$;

create trigger messages_enforce_delete_ownership
  before update on messages
  for each row execute function enforce_message_delete_ownership();
