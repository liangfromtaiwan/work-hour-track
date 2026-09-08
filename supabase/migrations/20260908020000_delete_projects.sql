drop policy if exists "reports_delete_anon" on public.reports;
create policy "reports_delete_anon"
  on public.reports for delete to anon using (true);
