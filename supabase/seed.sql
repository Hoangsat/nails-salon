insert into public.salons (
  id,
  slug,
  name,
  tagline,
  description,
  phone,
  email,
  address_line_1,
  city,
  region,
  postal_code,
  country_code,
  timezone,
  currency_code,
  website_url,
  facebook_url,
  instagram_url,
  booking_notice,
  is_active
)
values (
  '11111111-1111-1111-1111-111111111111',
  'polish-studio',
  'Polish Studio',
  'Luxury manicures, polished pedicures, and design-led nail artistry in London.',
  'A refined city nail studio with signature manicures, polished pedicures, modern design work, direct online booking, and a premium editorial atmosphere.',
  '+44 20 7946 0123',
  'hello@polishstudio.example',
  '18 Rose Lane',
  'London',
  'Greater London',
  'EC1A 1AA',
  'GB',
  'Europe/London',
  'GBP',
  'https://polishstudio.example',
  'https://facebook.com/polishstudio',
  'https://instagram.com/polishstudio',
  'Appointments are confirmed against live availability and followed by a polished confirmation email when delivery is configured.',
  true
)
on conflict (id) do update
set
  slug = excluded.slug,
  name = excluded.name,
  tagline = excluded.tagline,
  description = excluded.description,
  phone = excluded.phone,
  email = excluded.email,
  address_line_1 = excluded.address_line_1,
  city = excluded.city,
  region = excluded.region,
  postal_code = excluded.postal_code,
  country_code = excluded.country_code,
  timezone = excluded.timezone,
  currency_code = excluded.currency_code,
  website_url = excluded.website_url,
  facebook_url = excluded.facebook_url,
  instagram_url = excluded.instagram_url,
  booking_notice = excluded.booking_notice,
  is_active = excluded.is_active;

insert into public.salon_theme_settings (
  id,
  salon_id,
  brand_name,
  primary_color,
  secondary_color,
  accent_color,
  background_color,
  foreground_color,
  heading_font,
  body_font,
  button_style,
  border_radius,
  hero_image_url,
  hero_image_alt
)
values (
  '22222222-2222-2222-2222-222222222222',
  '11111111-1111-1111-1111-111111111111',
  'Polish Studio',
  '15 73% 56%',
  '28 44% 92%',
  '349 47% 84%',
  '32 45% 98%',
  '18 28% 17%',
  'cormorant-garamond',
  'manrope',
  'pill',
  '1.4rem',
  '/images/gallery-minimal.svg',
  'Close-up of a glossy neutral manicure in soft studio lighting'
)
on conflict (salon_id) do update
set
  brand_name = excluded.brand_name,
  primary_color = excluded.primary_color,
  secondary_color = excluded.secondary_color,
  accent_color = excluded.accent_color,
  background_color = excluded.background_color,
  foreground_color = excluded.foreground_color,
  heading_font = excluded.heading_font,
  body_font = excluded.body_font,
  button_style = excluded.button_style,
  border_radius = excluded.border_radius,
  hero_image_url = excluded.hero_image_url,
  hero_image_alt = excluded.hero_image_alt;

insert into public.staff (
  id,
  salon_id,
  first_name,
  last_name,
  display_name,
  role,
  bio,
  profile_image_url,
  email,
  phone,
  instagram_handle,
  is_featured,
  is_active,
  sort_order
)
values
  (
    '33333333-3333-3333-3333-333333333331',
    '11111111-1111-1111-1111-111111111111',
    'Mila',
    'Hart',
    'Mila Hart',
    'Founder & Editorial Nail Artist',
    'Known for clean lines, soft neutrals, and detail-focused finishing.',
    '/images/staff-mila.svg',
    'mila@polishstudio.example',
    '+44 20 7946 0124',
    '@mila.polishstudio',
    true,
    true,
    1
  ),
  (
    '33333333-3333-3333-3333-333333333332',
    '11111111-1111-1111-1111-111111111111',
    'Noa',
    'Lennox',
    'Noa Lennox',
    'Builder Gel Specialist',
    'Focuses on natural structure, long wear, and soft architectural shapes.',
    '/images/staff-noa.svg',
    'noa@polishstudio.example',
    '+44 20 7946 0125',
    '@noa.polishstudio',
    true,
    true,
    2
  ),
  (
    '33333333-3333-3333-3333-333333333333',
    '11111111-1111-1111-1111-111111111111',
    'Iris',
    'Vale',
    'Iris Vale',
    'Nail Art & Finishing Artist',
    'Balances playful accents with a premium studio presentation.',
    '/images/staff-iris.svg',
    'iris@polishstudio.example',
    '+44 20 7946 0126',
    '@iris.polishstudio',
    false,
    true,
    3
  )
on conflict (id) do update
set
  display_name = excluded.display_name,
  role = excluded.role,
  bio = excluded.bio,
  profile_image_url = excluded.profile_image_url,
  email = excluded.email,
  phone = excluded.phone,
  instagram_handle = excluded.instagram_handle,
  is_featured = excluded.is_featured,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order;

insert into public.services (
  id,
  salon_id,
  slug,
  name,
  category,
  short_description,
  description,
  duration_minutes,
  price_from_cents,
  is_featured,
  is_active,
  sort_order
)
values
  (
    '44444444-4444-4444-4444-444444444401',
    '11111111-1111-1111-1111-111111111111',
    'signature-manicure',
    'Signature Manicure',
    'Manicure',
    'Cuticle care, shape work, and a flawless gel finish.',
    'A foundational salon service designed for clean polish work and elevated presentation.',
    60,
    3200,
    true,
    true,
    1
  ),
  (
    '44444444-4444-4444-4444-444444444402',
    '11111111-1111-1111-1111-111111111111',
    'builder-gel-overlay',
    'Builder Gel Overlay',
    'Manicure',
    'Strength-focused overlay for natural nail support.',
    'A flexible base service for structured nails with minimal, glossy styling.',
    75,
    4800,
    true,
    true,
    2
  ),
  (
    '44444444-4444-4444-4444-444444444403',
    '11111111-1111-1111-1111-111111111111',
    'soft-gel-extensions',
    'Soft Gel Extensions',
    'Manicure',
    'Length with lightweight comfort and clean shaping.',
    'Best for guests who want a polished extension set without heavy bulk.',
    105,
    6200,
    true,
    true,
    3
  ),
  (
    '44444444-4444-4444-4444-444444444404',
    '11111111-1111-1111-1111-111111111111',
    'russian-manicure',
    'Russian Manicure',
    'Manicure',
    'Detailed prep work for ultra-clean finish lines.',
    'A precision-focused option that pairs beautifully with minimalist color palettes.',
    75,
    4200,
    false,
    true,
    4
  ),
  (
    '44444444-4444-4444-4444-444444444405',
    '11111111-1111-1111-1111-111111111111',
    'express-nail-art',
    'Signature Nail Design',
    'Design',
    'Modern line work, chrome accents, and elevated detail on selected nails.',
    'A design-focused add-on style appointment for guests who want modern accents, chrome detailing, or a more editorial finish.',
    30,
    1800,
    true,
    true,
    5
  ),
  (
    '44444444-4444-4444-4444-444444444406',
    '11111111-1111-1111-1111-111111111111',
    'bridal-edit',
    'Bridal Edit',
    'Occasion',
    'Premium set styling for event-focused guests.',
    'A longer appointment suited to refined detailing and high-finish photography moments.',
    120,
    7600,
    false,
    true,
    6
  ),
  (
    '44444444-4444-4444-4444-444444444407',
    '11111111-1111-1111-1111-111111111111',
    'restorative-manicure',
    'Signature Pedicure',
    'Pedicure',
    'Cuticle tidy, exfoliation, massage, and a glossy gel finish for toes.',
    'A commercially familiar pedicure service presented with the same refined tone as the manicure menu.',
    50,
    2800,
    false,
    true,
    7
  ),
  (
    '44444444-4444-4444-4444-444444444408',
    '11111111-1111-1111-1111-111111111111',
    'gel-removal-reset',
    'Spa Pedicure Refresh',
    'Pedicure',
    'A quicker tidy-up pedicure for returning guests between full appointments.',
    'Ideal for maintenance visits, polish refreshes, and keeping the pedicure menu commercially familiar.',
    40,
    2200,
    false,
    true,
    8
  )
on conflict (id) do update
set
  slug = excluded.slug,
  name = excluded.name,
  category = excluded.category,
  short_description = excluded.short_description,
  description = excluded.description,
  duration_minutes = excluded.duration_minutes,
  price_from_cents = excluded.price_from_cents,
  is_featured = excluded.is_featured,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order;

insert into public.service_addons (
  id,
  salon_id,
  service_id,
  name,
  description,
  duration_minutes,
  price_cents,
  is_active,
  sort_order
)
values
  (
    '55555555-5555-5555-5555-555555555551',
    '11111111-1111-1111-1111-111111111111',
    '44444444-4444-4444-4444-444444444401',
    'French Finish',
    'Micro-french or soft classic tip detailing.',
    20,
    900,
    true,
    1
  ),
  (
    '55555555-5555-5555-5555-555555555552',
    '11111111-1111-1111-1111-111111111111',
    '44444444-4444-4444-4444-444444444402',
    'Strength Repair Layer',
    'Extra builder support for weak or peeling nails.',
    15,
    1100,
    true,
    1
  ),
  (
    '55555555-5555-5555-5555-555555555553',
    '11111111-1111-1111-1111-111111111111',
    '44444444-4444-4444-4444-444444444403',
    'Chrome Accent',
    'Mirror chrome detailing on selected nails.',
    15,
    1200,
    true,
    1
  ),
  (
    '55555555-5555-5555-5555-555555555554',
    '11111111-1111-1111-1111-111111111111',
    '44444444-4444-4444-4444-444444444406',
    'Trial Set Consultation',
    'Pre-event refinement and look planning add-on.',
    30,
    1800,
    true,
    1
  )
on conflict (id) do update
set
  name = excluded.name,
  description = excluded.description,
  duration_minutes = excluded.duration_minutes,
  price_cents = excluded.price_cents,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order;

insert into public.staff_services (
  salon_id,
  staff_id,
  service_id
)
values
  ('11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333331', '44444444-4444-4444-4444-444444444401'),
  ('11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333331', '44444444-4444-4444-4444-444444444404'),
  ('11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333331', '44444444-4444-4444-4444-444444444406'),
  ('11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333332', '44444444-4444-4444-4444-444444444402'),
  ('11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333332', '44444444-4444-4444-4444-444444444403'),
  ('11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333332', '44444444-4444-4444-4444-444444444408'),
  ('11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333333', '44444444-4444-4444-4444-444444444401'),
  ('11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333333', '44444444-4444-4444-4444-444444444407'),
  ('11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333333', '44444444-4444-4444-4444-444444444405'),
  ('11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333333', '44444444-4444-4444-4444-444444444406')
on conflict do nothing;

insert into public.working_hours (
  id,
  salon_id,
  day_of_week,
  opens_at,
  closes_at,
  is_closed,
  sort_order
)
values
  ('66666666-6666-6666-6666-666666666660', '11111111-1111-1111-1111-111111111111', 0, null, null, true, 0),
  ('66666666-6666-6666-6666-666666666661', '11111111-1111-1111-1111-111111111111', 1, '10:00', '19:00', false, 1),
  ('66666666-6666-6666-6666-666666666662', '11111111-1111-1111-1111-111111111111', 2, '10:00', '19:00', false, 2),
  ('66666666-6666-6666-6666-666666666663', '11111111-1111-1111-1111-111111111111', 3, '10:00', '19:00', false, 3),
  ('66666666-6666-6666-6666-666666666664', '11111111-1111-1111-1111-111111111111', 4, '10:00', '20:00', false, 4),
  ('66666666-6666-6666-6666-666666666665', '11111111-1111-1111-1111-111111111111', 5, '09:30', '19:30', false, 5),
  ('66666666-6666-6666-6666-666666666666', '11111111-1111-1111-1111-111111111111', 6, '09:30', '17:30', false, 6)
on conflict (id) do update
set
  opens_at = excluded.opens_at,
  closes_at = excluded.closes_at,
  is_closed = excluded.is_closed,
  sort_order = excluded.sort_order;

insert into public.blackout_dates (
  id,
  salon_id,
  staff_id,
  starts_at,
  ends_at,
  reason
)
values
  (
    '77777777-7777-7777-7777-777777777771',
    '11111111-1111-1111-1111-111111111111',
    '33333333-3333-3333-3333-333333333331',
    '2026-12-24T00:00:00Z',
    '2026-12-27T23:59:59Z',
    'Holiday closure'
  )
on conflict (id) do update
set
  starts_at = excluded.starts_at,
  ends_at = excluded.ends_at,
  reason = excluded.reason;

insert into public.customers (
  id,
  salon_id,
  first_name,
  last_name,
  email,
  phone,
  notes,
  marketing_opt_in
)
values
  (
    '88888888-8888-8888-8888-888888888881',
    '11111111-1111-1111-1111-111111111111',
    'Ava',
    'Turner',
    'ava.turner@example.com',
    '+44 7700 900111',
    'Prefers neutral palettes and shorter extensions.',
    true
  ),
  (
    '88888888-8888-8888-8888-888888888882',
    '11111111-1111-1111-1111-111111111111',
    'Lina',
    'Morris',
    'lina.morris@example.com',
    '+44 7700 900222',
    'Usually books builder gel with subtle art accents.',
    false
  )
on conflict (id) do update
set
  first_name = excluded.first_name,
  last_name = excluded.last_name,
  email = excluded.email,
  phone = excluded.phone,
  notes = excluded.notes,
  marketing_opt_in = excluded.marketing_opt_in;

insert into public.bookings (
  id,
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
values
  (
    '99999999-9999-9999-9999-999999999991',
    '11111111-1111-1111-1111-111111111111',
    '88888888-8888-8888-8888-888888888881',
    '33333333-3333-3333-3333-333333333331',
    '2026-04-10',
    '2026-04-10T10:00:00Z',
    '2026-04-10T11:15:00Z',
    'confirmed',
    'Ava Turner',
    'ava.turner@example.com',
    '+44 7700 900111',
    'Prefers a short almond shape with a soft neutral finish.',
    'Returning client. Happy with editorial neutrals and concise appointment notes.',
    4100
  ),
  (
    '99999999-9999-9999-9999-999999999992',
    '11111111-1111-1111-1111-111111111111',
    '88888888-8888-8888-8888-888888888882',
    '33333333-3333-3333-3333-333333333332',
    '2026-04-11',
    '2026-04-11T12:30:00Z',
    '2026-04-11T14:15:00Z',
    'pending',
    'Lina Morris',
    'lina.morris@example.com',
    '+44 7700 900222',
    'Interested in a subtle chrome accent if timing allows.',
    'Follow up if the guest wants to switch to Mila for the final bridal preview.',
    6000
  )
on conflict (id) do update
set
  customer_id = excluded.customer_id,
  staff_id = excluded.staff_id,
  booking_date = excluded.booking_date,
  starts_at = excluded.starts_at,
  ends_at = excluded.ends_at,
  status = excluded.status,
  customer_name_snapshot = excluded.customer_name_snapshot,
  customer_email_snapshot = excluded.customer_email_snapshot,
  customer_phone_snapshot = excluded.customer_phone_snapshot,
  notes = excluded.notes,
  internal_notes = excluded.internal_notes,
  total_price_cents = excluded.total_price_cents;

insert into public.booking_services (
  id,
  booking_id,
  staff_id,
  service_id,
  service_addon_id,
  line_label,
  duration_minutes,
  price_cents,
  sort_order
)
values
  (
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1',
    '99999999-9999-9999-9999-999999999991',
    '33333333-3333-3333-3333-333333333331',
    '44444444-4444-4444-4444-444444444401',
    null,
    'Signature Manicure',
    60,
    3200,
    1
  ),
  (
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2',
    '99999999-9999-9999-9999-999999999991',
    '33333333-3333-3333-3333-333333333331',
    null,
    '55555555-5555-5555-5555-555555555551',
    'French Finish',
    15,
    900,
    2
  ),
  (
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa3',
    '99999999-9999-9999-9999-999999999992',
    '33333333-3333-3333-3333-333333333332',
    '44444444-4444-4444-4444-444444444402',
    null,
    'Builder Gel Overlay',
    75,
    4800,
    1
  ),
  (
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa4',
    '99999999-9999-9999-9999-999999999992',
    '33333333-3333-3333-3333-333333333332',
    null,
    '55555555-5555-5555-5555-555555555552',
    'Strength Repair Layer',
    15,
    1200,
    2
  )
on conflict (id) do update
set
  line_label = excluded.line_label,
  duration_minutes = excluded.duration_minutes,
  price_cents = excluded.price_cents,
  sort_order = excluded.sort_order;

insert into public.notifications_log (
  id,
  salon_id,
  booking_id,
  customer_id,
  channel,
  notification_type,
  template_key,
  recipient,
  status,
  payload,
  sent_at,
  error_message
)
values
  (
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1',
    '11111111-1111-1111-1111-111111111111',
    '99999999-9999-9999-9999-999999999991',
    '88888888-8888-8888-8888-888888888881',
    'email',
    'booking_confirmation',
    'booking_confirmation',
    'ava.turner@example.com',
    'sent',
    jsonb_build_object('template', 'booking_confirmation', 'phase', 'demo_seed'),
    '2026-04-01T09:00:00Z',
    null
  )
on conflict (id) do update
set
  channel = excluded.channel,
  notification_type = excluded.notification_type,
  template_key = excluded.template_key,
  recipient = excluded.recipient,
  status = excluded.status,
  payload = excluded.payload,
  sent_at = excluded.sent_at,
  error_message = excluded.error_message;

insert into public.gallery_images (
  id,
  salon_id,
  title,
  alt_text,
  description,
  image_url,
  category,
  accent_tone,
  is_featured,
  is_active,
  sort_order
)
values
  (
    'cccccccc-cccc-cccc-cccc-ccccccccccc1',
    '11111111-1111-1111-1111-111111111111',
    'Glossy Neutral Set',
    'Soft neutral manicure composition',
    'A close-up neutral manicure look that reads like a premium salon Instagram hero post.',
    '/images/gallery-minimal.svg',
    'Editorial',
    'soft',
    true,
    true,
    1
  ),
  (
    'cccccccc-cccc-cccc-cccc-ccccccccccc2',
    '11111111-1111-1111-1111-111111111111',
    'Rosewood Colour Edit',
    'Warm-toned manicure palette',
    'A richer salon colour story suited to launches, seasonal edits, and premium social content.',
    '/images/gallery-seasonal.svg',
    'Campaign',
    'warm',
    true,
    true,
    2
  ),
  (
    'cccccccc-cccc-cccc-cccc-ccccccccccc3',
    '11111111-1111-1111-1111-111111111111',
    'Chrome Detail Close-Up',
    'Close-up nail art texture study',
    'A detail-led work shot focused on finish quality, texture, and reflective design accents.',
    '/images/gallery-texture.svg',
    'Detail',
    'highlight',
    false,
    true,
    3
  ),
  (
    'cccccccc-cccc-cccc-cccc-ccccccccccc4',
    '11111111-1111-1111-1111-111111111111',
    'Bridal Pearl Finish',
    'Bridal-inspired manicure composition',
    'A soft occasion-led manicure image designed to feel bridal, clean, and camera-ready.',
    '/images/gallery-bridal.svg',
    'Occasion',
    'neutral',
    false,
    true,
    4
  )
on conflict (id) do update
set
  title = excluded.title,
  alt_text = excluded.alt_text,
  description = excluded.description,
  image_url = excluded.image_url,
  category = excluded.category,
  accent_tone = excluded.accent_tone,
  is_featured = excluded.is_featured,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order;

insert into public.reviews (
  id,
  salon_id,
  customer_id,
  author_name,
  rating,
  review_text,
  source_label,
  is_featured,
  is_published,
  sort_order
)
values
  (
    'dddddddd-dddd-dddd-dddd-ddddddddddd1',
    '11111111-1111-1111-1111-111111111111',
    '88888888-8888-8888-8888-888888888881',
    'Ava Turner',
    5,
    'Everything felt thoughtful, polished, and premium from prep through the final finish.',
    'Google review',
    true,
    true,
    1
  ),
  (
    'dddddddd-dddd-dddd-dddd-ddddddddddd2',
    '11111111-1111-1111-1111-111111111111',
    '88888888-8888-8888-8888-888888888882',
    'Lina Morris',
    5,
    'The builder gel work lasted beautifully and still felt natural and lightweight.',
    'Treatwell',
    true,
    true,
    2
  ),
  (
    'dddddddd-dddd-dddd-dddd-ddddddddddd3',
    '11111111-1111-1111-1111-111111111111',
    null,
    'Editorial Client',
    5,
    'Perfect for campaign prep: refined, calm, and visually consistent every time.',
    'Studio feedback',
    false,
    true,
    3
  )
on conflict (id) do update
set
  author_name = excluded.author_name,
  rating = excluded.rating,
  review_text = excluded.review_text,
  source_label = excluded.source_label,
  is_featured = excluded.is_featured,
  is_published = excluded.is_published,
  sort_order = excluded.sort_order;

update public.staff_services
set
  custom_duration_minutes = 70,
  custom_price_cents = 3500
where staff_id = '33333333-3333-3333-3333-333333333331'
  and service_id = '44444444-4444-4444-4444-444444444401';

update public.staff_services
set
  custom_duration_minutes = 80,
  custom_price_cents = 5200
where staff_id = '33333333-3333-3333-3333-333333333332'
  and service_id = '44444444-4444-4444-4444-444444444402';










