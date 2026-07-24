-- Public marketing "상담신청" (consultation inquiry) form submissions.
-- Unlike every other table so far, this needs an INSERT policy for
-- unauthenticated (anon) visitors — the /inquire page has no login.
-- This is the first `to anon` policy in the project; keep it insert-only
-- so a leaked anon key can never be used to read/delete other families'
-- inquiries. No updated_at: inquiries are immutable records, there is no
-- update action for them.

create table inquiries (
  id uuid primary key default gen_random_uuid(),
  parent_name text not null,
  contact_email text not null,
  phone text not null,
  child_name text not null,
  grade text not null check (grade in ('3', '4', '5', '6')),
  school text,
  language text not null default 'ko' check (language in ('ko', 'en')),
  message text,
  created_at timestamptz not null default now()
);
create index inquiries_created_at_idx on inquiries (created_at desc);

alter table inquiries enable row level security;

-- Anyone (signed out or signed in) may submit an inquiry from the public
-- marketing form; they can never read it back.
create policy "inquiries_insert_public" on inquiries
  for insert to anon, authenticated with check (true);

-- Only the principal reviews submitted inquiries.
create policy "inquiries_select_principal" on inquiries
  for select to authenticated using (is_principal());
create policy "inquiries_delete_principal" on inquiries
  for delete to authenticated using (is_principal());
