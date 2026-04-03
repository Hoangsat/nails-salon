create extension if not exists pgcrypto;

do $$
begin
  if not exists (
    select 1
    from pg_type
    where typname = 'booking_status'
  ) then
    create type booking_status as enum (
      'pending',
      'confirmed',
      'cancelled',
      'completed',
      'no_show'
    );
  end if;
end
$$;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create table if not exists public.salons (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  tagline text,
  description text,
  phone text,
  email text,
  address_line_1 text,
  address_line_2 text,
  city text,
  region text,
  postal_code text,
  country_code text not null default 'GB',
  timezone text not null default 'Europe/London',
  currency_code text not null default 'GBP',
  website_url text,
  instagram_url text,
  booking_notice text,
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.salon_theme_settings (
  id uuid primary key default gen_random_uuid(),
  salon_id uuid not null unique references public.salons(id) on delete cascade,
  brand_name text not null,
  primary_color text not null,
  secondary_color text not null,
  accent_color text not null,
  background_color text not null,
  foreground_color text not null,
  heading_font text not null,
  body_font text not null,
  button_style text not null,
  border_radius text not null,
  hero_image_url text,
  hero_image_alt text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.staff (
  id uuid primary key default gen_random_uuid(),
  salon_id uuid not null references public.salons(id) on delete cascade,
  first_name text not null,
  last_name text not null,
  display_name text not null,
  role text not null,
  bio text,
  profile_image_url text,
  email text,
  phone text,
  instagram_handle text,
  is_featured boolean not null default false,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  salon_id uuid not null references public.salons(id) on delete cascade,
  slug text not null,
  name text not null,
  category text not null,
  short_description text,
  description text,
  duration_minutes integer not null check (duration_minutes > 0),
  price_from_cents integer not null check (price_from_cents >= 0),
  is_featured boolean not null default false,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (salon_id, slug)
);

create table if not exists public.service_addons (
  id uuid primary key default gen_random_uuid(),
  salon_id uuid not null references public.salons(id) on delete cascade,
  service_id uuid not null references public.services(id) on delete cascade,
  name text not null,
  description text,
  duration_minutes integer not null default 0 check (duration_minutes >= 0),
  price_cents integer not null check (price_cents >= 0),
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.staff_services (
  salon_id uuid not null references public.salons(id) on delete cascade,
  staff_id uuid not null references public.staff(id) on delete cascade,
  service_id uuid not null references public.services(id) on delete cascade,
  created_at timestamptz not null default timezone('utc', now()),
  primary key (staff_id, service_id)
);

create table if not exists public.working_hours (
  id uuid primary key default gen_random_uuid(),
  salon_id uuid not null references public.salons(id) on delete cascade,
  staff_id uuid references public.staff(id) on delete cascade,
  day_of_week smallint not null check (day_of_week between 0 and 6),
  opens_at time,
  closes_at time,
  is_closed boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  check (
    (is_closed = true and opens_at is null and closes_at is null)
    or
    (is_closed = false and opens_at is not null and closes_at is not null and closes_at > opens_at)
  )
);

create table if not exists public.blackout_dates (
  id uuid primary key default gen_random_uuid(),
  salon_id uuid not null references public.salons(id) on delete cascade,
  staff_id uuid references public.staff(id) on delete cascade,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  reason text,
  created_at timestamptz not null default timezone('utc', now()),
  check (ends_at > starts_at)
);

create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  salon_id uuid not null references public.salons(id) on delete cascade,
  first_name text not null,
  last_name text not null,
  email text,
  phone text,
  notes text,
  marketing_opt_in boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (salon_id, email)
);

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  salon_id uuid not null references public.salons(id) on delete cascade,
  customer_id uuid references public.customers(id) on delete set null,
  staff_id uuid references public.staff(id) on delete set null,
  booking_date date not null,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  status booking_status not null default 'pending',
  customer_name_snapshot text not null,
  customer_email_snapshot text,
  customer_phone_snapshot text,
  notes text,
  internal_notes text,
  total_price_cents integer not null default 0 check (total_price_cents >= 0),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  check (ends_at > starts_at)
);

create table if not exists public.booking_services (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.bookings(id) on delete cascade,
  staff_id uuid references public.staff(id) on delete set null,
  service_id uuid references public.services(id) on delete set null,
  service_addon_id uuid references public.service_addons(id) on delete set null,
  line_label text not null,
  duration_minutes integer not null check (duration_minutes >= 0),
  price_cents integer not null check (price_cents >= 0),
  sort_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  check (service_id is not null or service_addon_id is not null)
);

create table if not exists public.notifications_log (
  id uuid primary key default gen_random_uuid(),
  salon_id uuid not null references public.salons(id) on delete cascade,
  booking_id uuid references public.bookings(id) on delete set null,
  customer_id uuid references public.customers(id) on delete set null,
  channel text not null,
  notification_type text not null,
  recipient text,
  status text not null default 'pending',
  payload jsonb not null default '{}'::jsonb,
  sent_at timestamptz,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.gallery_images (
  id uuid primary key default gen_random_uuid(),
  salon_id uuid not null references public.salons(id) on delete cascade,
  title text not null,
  alt_text text,
  description text,
  image_url text not null,
  category text,
  accent_tone text not null default 'soft',
  is_featured boolean not null default false,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  salon_id uuid not null references public.salons(id) on delete cascade,
  customer_id uuid references public.customers(id) on delete set null,
  author_name text not null,
  rating smallint not null check (rating between 1 and 5),
  review_text text not null,
  source_label text,
  is_featured boolean not null default false,
  is_published boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists salons_is_active_idx
  on public.salons (is_active);

create index if not exists staff_salon_active_sort_idx
  on public.staff (salon_id, is_active, sort_order);

create index if not exists services_salon_active_sort_idx
  on public.services (salon_id, is_active, sort_order);

create index if not exists service_addons_salon_active_sort_idx
  on public.service_addons (salon_id, is_active, sort_order);

create index if not exists service_addons_service_active_sort_idx
  on public.service_addons (service_id, is_active, sort_order);

create index if not exists staff_services_salon_staff_idx
  on public.staff_services (salon_id, staff_id);

create index if not exists staff_services_service_idx
  on public.staff_services (service_id);

create index if not exists working_hours_salon_staff_day_sort_idx
  on public.working_hours (salon_id, staff_id, day_of_week, sort_order);

create index if not exists blackout_dates_salon_starts_idx
  on public.blackout_dates (salon_id, starts_at);

create index if not exists blackout_dates_staff_starts_idx
  on public.blackout_dates (staff_id, starts_at);

create index if not exists customers_salon_created_idx
  on public.customers (salon_id, created_at desc);

create index if not exists bookings_salon_date_idx
  on public.bookings (salon_id, booking_date);

create index if not exists bookings_staff_date_idx
  on public.bookings (staff_id, booking_date);

create index if not exists bookings_status_idx
  on public.bookings (status);

create index if not exists booking_services_booking_sort_idx
  on public.booking_services (booking_id, sort_order);

create index if not exists booking_services_staff_idx
  on public.booking_services (staff_id);

create index if not exists notifications_log_salon_created_idx
  on public.notifications_log (salon_id, created_at desc);

create index if not exists notifications_log_booking_idx
  on public.notifications_log (booking_id);

create index if not exists gallery_images_salon_active_sort_idx
  on public.gallery_images (salon_id, is_active, sort_order);

create index if not exists reviews_salon_published_sort_idx
  on public.reviews (salon_id, is_published, sort_order);

drop trigger if exists salons_set_updated_at on public.salons;
create trigger salons_set_updated_at
before update on public.salons
for each row execute function public.set_updated_at();

drop trigger if exists salon_theme_settings_set_updated_at on public.salon_theme_settings;
create trigger salon_theme_settings_set_updated_at
before update on public.salon_theme_settings
for each row execute function public.set_updated_at();

drop trigger if exists staff_set_updated_at on public.staff;
create trigger staff_set_updated_at
before update on public.staff
for each row execute function public.set_updated_at();

drop trigger if exists services_set_updated_at on public.services;
create trigger services_set_updated_at
before update on public.services
for each row execute function public.set_updated_at();

drop trigger if exists service_addons_set_updated_at on public.service_addons;
create trigger service_addons_set_updated_at
before update on public.service_addons
for each row execute function public.set_updated_at();

drop trigger if exists working_hours_set_updated_at on public.working_hours;
create trigger working_hours_set_updated_at
before update on public.working_hours
for each row execute function public.set_updated_at();

drop trigger if exists customers_set_updated_at on public.customers;
create trigger customers_set_updated_at
before update on public.customers
for each row execute function public.set_updated_at();

drop trigger if exists bookings_set_updated_at on public.bookings;
create trigger bookings_set_updated_at
before update on public.bookings
for each row execute function public.set_updated_at();
