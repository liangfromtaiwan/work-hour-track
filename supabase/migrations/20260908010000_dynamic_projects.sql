alter table public.reports add column if not exists name text;

update public.reports set name = 'rinneFACE' where share_token = 'demo-report' and name is null;
update public.reports set name = 'Enebloom' where share_token = 'enebloom' and name is null;
update public.reports set name = share_token where name is null;

alter table public.reports alter column name set not null;

drop policy if exists "reports_insert_anon" on public.reports;
create policy "reports_insert_anon"
  on public.reports for insert to anon with check (true);
