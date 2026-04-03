alter table public.notifications_log
  add column if not exists template_key text,
  add column if not exists error_message text;

update public.notifications_log
set
  template_key = coalesce(template_key, notification_type),
  status = case
    when status = 'logged' then 'sent'
    when status in ('pending', 'sent', 'failed') then status
    else 'failed'
  end
where template_key is null
   or status not in ('pending', 'sent', 'failed');

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'notifications_log_status_check'
  ) then
    alter table public.notifications_log
      add constraint notifications_log_status_check
      check (status in ('pending', 'sent', 'failed'));
  end if;
end
$$;

create index if not exists notifications_log_status_idx
  on public.notifications_log (status);

create index if not exists notifications_log_template_key_idx
  on public.notifications_log (template_key);
