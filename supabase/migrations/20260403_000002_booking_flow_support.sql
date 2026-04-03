create extension if not exists btree_gist;

alter table public.staff_services
  add column if not exists custom_duration_minutes integer check (custom_duration_minutes is null or custom_duration_minutes > 0),
  add column if not exists custom_price_cents integer check (custom_price_cents is null or custom_price_cents >= 0);

create index if not exists customers_salon_phone_idx
  on public.customers (salon_id, phone);

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'bookings_staff_time_no_overlap'
  ) then
    alter table public.bookings
      add constraint bookings_staff_time_no_overlap
      exclude using gist (
        staff_id with =,
        tstzrange(starts_at, ends_at, '[)') with &&
      )
      where (staff_id is not null and status <> 'cancelled');
  end if;
end
$$;

create or replace function public.create_booking_transaction(
  p_salon_id uuid,
  p_staff_id uuid,
  p_booking_date date,
  p_starts_at timestamptz,
  p_ends_at timestamptz,
  p_customer_full_name text,
  p_customer_email text,
  p_customer_phone text,
  p_customer_notes text,
  p_total_price_cents integer,
  p_status booking_status,
  p_service_lines jsonb
)
returns table (
  booking_id uuid,
  customer_id uuid
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_customer_id uuid;
  v_booking_id uuid;
  v_first_name text;
  v_last_name text;
begin
  if coalesce(trim(p_customer_email), '') <> '' then
    select id
      into v_customer_id
    from public.customers
    where salon_id = p_salon_id
      and lower(email) = lower(trim(p_customer_email))
    order by created_at asc
    limit 1;
  end if;

  if v_customer_id is null and coalesce(trim(p_customer_phone), '') <> '' then
    select id
      into v_customer_id
    from public.customers
    where salon_id = p_salon_id
      and phone = trim(p_customer_phone)
    order by created_at asc
    limit 1;
  end if;

  v_first_name := split_part(trim(p_customer_full_name), ' ', 1);
  v_last_name := nullif(trim(regexp_replace(trim(p_customer_full_name), '^\S+\s*', '')), '');

  if v_last_name is null then
    v_last_name := '';
  end if;

  if v_customer_id is null then
    insert into public.customers (
      salon_id,
      first_name,
      last_name,
      email,
      phone,
      notes,
      marketing_opt_in
    )
    values (
      p_salon_id,
      v_first_name,
      v_last_name,
      nullif(trim(p_customer_email), ''),
      nullif(trim(p_customer_phone), ''),
      nullif(trim(p_customer_notes), ''),
      false
    )
    returning id into v_customer_id;
  else
    update public.customers
    set
      first_name = v_first_name,
      last_name = v_last_name,
      email = coalesce(nullif(trim(p_customer_email), ''), email),
      phone = coalesce(nullif(trim(p_customer_phone), ''), phone),
      notes = coalesce(nullif(trim(p_customer_notes), ''), notes)
    where id = v_customer_id;
  end if;

  insert into public.bookings (
    salon_id,
    customer_id,
    staff_id,
    booking_date,
    starts_at,
    ends_at,
    status,
    customer_name_snapshot,
    customer_email_snapshot,
    customer_phone_snapshot,
    notes,
    internal_notes,
    total_price_cents
  )
  values (
    p_salon_id,
    v_customer_id,
    p_staff_id,
    p_booking_date,
    p_starts_at,
    p_ends_at,
    p_status,
    trim(p_customer_full_name),
    nullif(trim(p_customer_email), ''),
    nullif(trim(p_customer_phone), ''),
    nullif(trim(p_customer_notes), ''),
    null,
    p_total_price_cents
  )
  returning id into v_booking_id;

  insert into public.booking_services (
    booking_id,
    staff_id,
    service_id,
    service_addon_id,
    line_label,
    duration_minutes,
    price_cents,
    sort_order
  )
  select
    v_booking_id,
    x.staff_id,
    x.service_id,
    x.service_addon_id,
    x.line_label,
    x.duration_minutes,
    x.price_cents,
    x.sort_order
  from jsonb_to_recordset(p_service_lines) as x(
    staff_id uuid,
    service_id uuid,
    service_addon_id uuid,
    line_label text,
    duration_minutes integer,
    price_cents integer,
    sort_order integer
  );

  return query
  select v_booking_id, v_customer_id;
end;
$$;
