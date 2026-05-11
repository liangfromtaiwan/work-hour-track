-- Run in Supabase SQL Editor (or supabase db push) once per project.
-- Matches src/lib/reports.ts (reports + time_entries).

create extension if not exists "pgcrypto";

create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  contract_hours numeric not null default 15,
  max_hours numeric not null default 30,
  share_token text not null unique,
  last_updated timestamptz not null default now()
);

create table if not exists public.time_entries (
  id uuid primary key default gen_random_uuid(),
  report_id uuid not null references public.reports (id) on delete cascade,
  date text not null,
  title text not null,
  hours numeric not null,
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists time_entries_report_id_date_idx
  on public.time_entries (report_id, date);

create or replace function public.set_time_entries_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists time_entries_set_updated_at on public.time_entries;
create trigger time_entries_set_updated_at
  before update on public.time_entries
  for each row
  execute function public.set_time_entries_updated_at();

-- Default row for local / demo (share token must match NEXT_PUBLIC_DEFAULT_SHARE_TOKEN or "demo-report").
insert into public.reports (contract_hours, max_hours, share_token)
values (15, 30, 'demo-report')
on conflict (share_token) do nothing;

alter table public.reports enable row level security;
alter table public.time_entries enable row level security;

-- Anon (browser) access: suitable for a personal project only. Tighten for production.
drop policy if exists "reports_select_anon" on public.reports;
create policy "reports_select_anon"
  on public.reports for select to anon using (true);

drop policy if exists "reports_update_anon" on public.reports;
create policy "reports_update_anon"
  on public.reports for update to anon using (true) with check (true);

drop policy if exists "time_entries_all_anon" on public.time_entries;
create policy "time_entries_all_anon"
  on public.time_entries for all to anon using (true) with check (true);
