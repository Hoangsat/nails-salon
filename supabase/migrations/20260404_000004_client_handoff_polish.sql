alter table public.salons
  add column if not exists facebook_url text;

create table if not exists public.showcase_leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  salon_name text,
  current_setup text,
  notes text,
  source_page text not null default '/for-salons',
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists showcase_leads_email_idx
  on public.showcase_leads (email);

create index if not exists showcase_leads_created_at_idx
  on public.showcase_leads (created_at desc);
