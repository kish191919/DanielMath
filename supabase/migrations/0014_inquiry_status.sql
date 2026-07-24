-- Lets the principal work an inquiry through to enrollment instead of just
-- reading it once: new -> contacted -> enrolled, or closed (declined /
-- went cold) at any point. Also adds the update policy 0013 didn't need
-- yet (that migration only covered insert/select/delete).

alter table inquiries
  add column status text not null default 'new'
    check (status in ('new', 'contacted', 'enrolled', 'closed'));

create policy "inquiries_update_principal" on inquiries
  for update to authenticated using (is_principal()) with check (is_principal());
