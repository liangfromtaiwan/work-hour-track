-- Keep Enebloom time entries separate from the existing rinneFACE report.
insert into public.reports (contract_hours, max_hours, share_token)
values (0, 0, 'enebloom')
on conflict (share_token) do nothing;
