-- Real-time 1:1 messaging between a principal and a parent. One thread per
-- parent profile (not per child) — a parent's conversation stays unified
-- even if they have multiple students linked via student_guardians.

create table message_threads (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid not null unique references profiles(id) on delete cascade,
  last_message_at timestamptz,
  last_message_body text,
  last_sender_id uuid references profiles(id),
  created_at timestamptz not null default now()
);

create table messages (
  id uuid primary key default gen_random_uuid(),
  thread_id uuid not null references message_threads(id) on delete cascade,
  sender_id uuid not null references profiles(id),
  body text not null check (char_length(body) between 1 and 4000),
  read_at timestamptz,
  created_at timestamptz not null default now()
);
create index messages_thread_created_idx on messages (thread_id, created_at);
create index messages_unread_idx on messages (thread_id) where read_at is null;

alter table message_threads enable row level security;
alter table messages enable row level security;

-- is_principal() defined in 0003_rls_policies.sql.
create policy "message_threads_all_principal" on message_threads
  for all to authenticated using (is_principal()) with check (is_principal());
create policy "message_threads_select_parent" on message_threads
  for select to authenticated using (parent_id = auth.uid());
create policy "message_threads_insert_parent" on message_threads
  for insert to authenticated with check (parent_id = auth.uid());

create policy "messages_all_principal" on messages
  for all to authenticated using (is_principal()) with check (is_principal());
create policy "messages_select_parent" on messages
  for select to authenticated using (
    exists (select 1 from message_threads t where t.id = messages.thread_id and t.parent_id = auth.uid())
  );
-- sender_id = auth.uid() on top of thread ownership stops a parent from
-- inserting a row with a spoofed sender_id impersonating the principal.
create policy "messages_insert_parent" on messages
  for insert to authenticated with check (
    sender_id = auth.uid()
    and exists (select 1 from message_threads t where t.id = messages.thread_id and t.parent_id = auth.uid())
  );
create policy "messages_update_parent" on messages
  for update to authenticated using (
    exists (select 1 from message_threads t where t.id = messages.thread_id and t.parent_id = auth.uid())
  ) with check (
    exists (select 1 from message_threads t where t.id = messages.thread_id and t.parent_id = auth.uid())
  );

alter publication supabase_realtime add table messages;
alter publication supabase_realtime add table message_threads;
