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
  'USA Nails Corstorphine',
  'Luxury manicures, polished pedicures, and design-led nail artistry in London.',
  'A refined city nail studio with signature manicures, polished pedicures, modern design work, direct online booking, and a premium editorial atmosphere.',
  '0131 334 5511',
  'hello@polishstudio.example',
  '205 St John''s Road',
  'Edinburgh',
  null,
  'EH12 7UU',
  'GB',
  'Europe/London',
  'GBP',
  'https://polishstudio.example',
  'https://www.facebook.com/usanailscorstorphine/?locale=en_GB',
  'https://www.instagram.com/usa_nails_corstorphine?fbclid=IwY2xjawQ-ZMtleHRuA2FlbQIxMABicmlkETFJTVZZZERKcnRpSHlBQUJHc3J0YwZhcHBfaWQQMjIyMDM5MTc4ODIwMDg5MgABHnMeNerAAZqLiTOGxlGyRMNCqNWMKXR8VgKvkSdsLujY-mkh6OmvcyZWLeZ7_aem_L0FbvLX2UzcPjXILxWyADA',
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
  'USA Nails Corstorphine',
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
    'fullset-acrylic-with-shellac',
    'Fullset Acrylic With Shellac',
    'Manicure',
    'Full acrylic extensions with shellac colour.',
    'Full acrylic extensions finished with long-lasting shellac colour.',
    45,
    3500,
    true,
    true,
    1
  ),
  (
    '44444444-4444-4444-4444-444444444402',
    '11111111-1111-1111-1111-111111111111',
    'full-set-powder-colour',
    'Full Set Powder Colour',
    'Manicure',
    'Full acrylic set with powder colour.',
    'Full acrylic set with powder colour for a strong and polished finish.',
    40,
    3500,
    true,
    true,
    2
  ),
  (
    '44444444-4444-4444-4444-444444444403',
    '11111111-1111-1111-1111-111111111111',
    'full-set-acrylic-with-white-tips',
    'Full Set Acrylic With White Tips',
    'Manicure',
    'Full acrylic extensions with white tips.',
    'Full acrylic extensions with classic white tips.',
    40,
    3700,
    true,
    true,
    3
  ),
  (
    '44444444-4444-4444-4444-444444444404',
    '11111111-1111-1111-1111-111111111111',
    'full-set-ombre',
    'Full Set Ombre',
    'Manicure',
    'Full acrylic ombre set with blended finish.',
    'Full acrylic ombre set with a smooth blended finish.',
    40,
    3700,
    true,
    true,
    4
  ),
  (
    '44444444-4444-4444-4444-444444444405',
    '11111111-1111-1111-1111-111111111111',
    'full-set-acrylic-with-chrome',
    'Full Set Acrylic With Chrome',
    'Manicure',
    'Full acrylic extensions with chrome effect.',
    'Full acrylic extensions finished with chrome effect.',
    40,
    3700,
    true,
    true,
    5
  ),
  (
    '44444444-4444-4444-4444-444444444406',
    '11111111-1111-1111-1111-111111111111',
    'gel-shellac-hand',
    'Gel/Shellac Hand',
    'Manicure',
    'Glossy gel polish on natural fingernails.',
    'Gel polish on natural fingernails with a glossy long-lasting finish.',
    20,
    2000,
    true,
    true,
    6
  ),
  (
    '44444444-4444-4444-4444-444444444407',
    '11111111-1111-1111-1111-111111111111',
    'gel-shellac-toe',
    'Gel/Shellac Toe',
    'Pedicure',
    'Gel polish on toenails for a clean finish.',
    'Gel polish on toenails for a clean and durable finish.',
    20,
    2000,
    false,
    true,
    7
  ),
  (
    '44444444-4444-4444-4444-444444444408',
    '11111111-1111-1111-1111-111111111111',
    'take-off-and-new-shellac-hand',
    'Take Off & New Shellac Hand',
    'Manicure',
    'Removal and fresh shellac application on hands.',
    'Removal of old shellac and fresh new shellac application on hands.',
    20,
    2300,
    false,
    true,
    8
  ),
  (
    '44444444-4444-4444-4444-444444444409',
    '11111111-1111-1111-1111-111111111111',
    'take-off-and-new-shellac-toe',
    'Take Off & New Shellac Toe',
    'Pedicure',
    'Removal and fresh shellac application on toes.',
    'Removal of old shellac and fresh new shellac application on toes.',
    20,
    2300,
    false,
    true,
    9
  ),
  (
    '44444444-4444-4444-4444-444444444410',
    '11111111-1111-1111-1111-111111111111',
    'biab-builder-gel-in-bottle',
    'BIAB/Builder Gel In Bottle',
    'Manicure',
    'Strengthening BIAB treatment for natural nails.',
    'Strengthening BIAB treatment for natural nails.',
    25,
    2800,
    true,
    true,
    10
  ),
  (
    '44444444-4444-4444-4444-444444444411',
    '11111111-1111-1111-1111-111111111111',
    'take-off-and-new-biab-builder-gel',
    'Take Off & New BIAB/Builder Gel',
    'Manicure',
    'Removal of previous BIAB with a fresh new application.',
    'Removal of previous BIAB and fresh new BIAB application.',
    25,
    3000,
    false,
    true,
    11
  ),
  (
    '44444444-4444-4444-4444-444444444412',
    '11111111-1111-1111-1111-111111111111',
    'full-spa-pedicure-no-colour',
    'Full Spa Pedicure (No Colour)',
    'Pedicure',
    'Full spa pedicure without colour.',
    'Full spa pedicure including nail and foot care without colour.',
    25,
    3000,
    false,
    true,
    12
  ),
  (
    '44444444-4444-4444-4444-444444444413',
    '11111111-1111-1111-1111-111111111111',
    'full-spa-pedicure-with-gel-shellac',
    'Full Spa Pedicure With Gel/Shellac',
    'Pedicure',
    'Full spa pedicure finished with gel or shellac colour.',
    'Full spa pedicure finished with gel or shellac colour.',
    40,
    3800,
    true,
    true,
    13
  ),
  (
    '44444444-4444-4444-4444-444444444414',
    '11111111-1111-1111-1111-111111111111',
    'take-off-shellac',
    'Take Off Shellac',
    'Removal',
    'Quick shellac removal service.',
    'Quick shellac removal service.',
    5,
    500,
    false,
    true,
    14
  ),
  (
    '44444444-4444-4444-4444-444444444415',
    '11111111-1111-1111-1111-111111111111',
    'take-off-biab-builder-gel',
    'Take Off BIAB/Builder Gel',
    'Removal',
    'Safe removal of BIAB or builder gel.',
    'Safe removal of BIAB or builder gel.',
    10,
    700,
    false,
    true,
    15
  ),
  (
    '44444444-4444-4444-4444-444444444416',
    '11111111-1111-1111-1111-111111111111',
    'take-off-acrylic',
    'Take Off Acrylic',
    'Removal',
    'Safe acrylic removal service.',
    'Safe acrylic removal service.',
    10,
    1000,
    false,
    true,
    16
  ),
  (
    '44444444-4444-4444-4444-444444444417',
    '11111111-1111-1111-1111-111111111111',
    'take-off-acrylic-and-new-set',
    'Take Off Acrylic & New Set',
    'Removal',
    'Acrylic removal followed by a new set.',
    'Acrylic removal followed by a fresh new full set.',
    50,
    4000,
    false,
    true,
    17
  ),
  (
    '44444444-4444-4444-4444-444444444418',
    '11111111-1111-1111-1111-111111111111',
    'infill-powder-colour',
    'Infill Powder Colour',
    'Manicure',
    'Acrylic infill with powder colour refresh.',
    'Acrylic infill with powder colour refresh.',
    25,
    3000,
    false,
    true,
    18
  ),
  (
    '44444444-4444-4444-4444-444444444419',
    '11111111-1111-1111-1111-111111111111',
    'infill-acrylic-with-shellac',
    'Infill Acrylic With Shellac',
    'Manicure',
    'Acrylic infill finished with shellac colour.',
    'Acrylic infill finished with shellac colour.',
    25,
    3000,
    false,
    true,
    19
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
    'Design Simple',
    'Simple nail art or accent detail.',
    10,
    200,
    true,
    1
  ),
  (
    '55555555-5555-5555-5555-555555555552',
    '11111111-1111-1111-1111-111111111111',
    '44444444-4444-4444-4444-444444444401',
    'Design Standard',
    'More visible nail art across selected nails.',
    15,
    500,
    true,
    2
  ),
  (
    '55555555-5555-5555-5555-555555555553',
    '11111111-1111-1111-1111-111111111111',
    '44444444-4444-4444-4444-444444444401',
    'Design Detailed',
    'Detailed nail art with layered finish work.',
    20,
    1000,
    true,
    3
  ),
  (
    '55555555-5555-5555-5555-555555555554',
    '11111111-1111-1111-1111-111111111111',
    '44444444-4444-4444-4444-444444444401',
    'Design Premium',
    'Premium multi-nail design with advanced detail.',
    30,
    1500,
    true,
    4
  ),
  (
    '55555555-5555-5555-5555-555555555555',
    '11111111-1111-1111-1111-111111111111',
    '44444444-4444-4444-4444-444444444402',
    'Design Simple',
    'Simple nail art or accent detail.',
    10,
    200,
    true,
    1
  ),
  (
    '55555555-5555-5555-5555-555555555556',
    '11111111-1111-1111-1111-111111111111',
    '44444444-4444-4444-4444-444444444402',
    'Design Standard',
    'More visible nail art across selected nails.',
    15,
    500,
    true,
    2
  ),
  (
    '55555555-5555-5555-5555-555555555557',
    '11111111-1111-1111-1111-111111111111',
    '44444444-4444-4444-4444-444444444402',
    'Design Detailed',
    'Detailed nail art with layered finish work.',
    20,
    1000,
    true,
    3
  ),
  (
    '55555555-5555-5555-5555-555555555558',
    '11111111-1111-1111-1111-111111111111',
    '44444444-4444-4444-4444-444444444402',
    'Design Premium',
    'Premium multi-nail design with advanced detail.',
    30,
    1500,
    true,
    4
  ),
  (
    '55555555-5555-5555-5555-555555555559',
    '11111111-1111-1111-1111-111111111111',
    '44444444-4444-4444-4444-444444444403',
    'Design Simple',
    'Simple nail art or accent detail.',
    10,
    200,
    true,
    1
  ),
  (
    '55555555-5555-5555-5555-555555555560',
    '11111111-1111-1111-1111-111111111111',
    '44444444-4444-4444-4444-444444444403',
    'Design Standard',
    'More visible nail art across selected nails.',
    15,
    500,
    true,
    2
  ),
  (
    '55555555-5555-5555-5555-555555555561',
    '11111111-1111-1111-1111-111111111111',
    '44444444-4444-4444-4444-444444444403',
    'Design Detailed',
    'Detailed nail art with layered finish work.',
    20,
    1000,
    true,
    3
  ),
  (
    '55555555-5555-5555-5555-555555555562',
    '11111111-1111-1111-1111-111111111111',
    '44444444-4444-4444-4444-444444444403',
    'Design Premium',
    'Premium multi-nail design with advanced detail.',
    30,
    1500,
    true,
    4
  ),
  (
    '55555555-5555-5555-5555-555555555563',
    '11111111-1111-1111-1111-111111111111',
    '44444444-4444-4444-4444-444444444404',
    'Design Simple',
    'Simple nail art or accent detail.',
    10,
    200,
    true,
    1
  ),
  (
    '55555555-5555-5555-5555-555555555564',
    '11111111-1111-1111-1111-111111111111',
    '44444444-4444-4444-4444-444444444404',
    'Design Standard',
    'More visible nail art across selected nails.',
    15,
    500,
    true,
    2
  ),
  (
    '55555555-5555-5555-5555-555555555565',
    '11111111-1111-1111-1111-111111111111',
    '44444444-4444-4444-4444-444444444404',
    'Design Detailed',
    'Detailed nail art with layered finish work.',
    20,
    1000,
    true,
    3
  ),
  (
    '55555555-5555-5555-5555-555555555566',
    '11111111-1111-1111-1111-111111111111',
    '44444444-4444-4444-4444-444444444404',
    'Design Premium',
    'Premium multi-nail design with advanced detail.',
    30,
    1500,
    true,
    4
  ),
  (
    '55555555-5555-5555-5555-555555555567',
    '11111111-1111-1111-1111-111111111111',
    '44444444-4444-4444-4444-444444444405',
    'Design Simple',
    'Simple nail art or accent detail.',
    10,
    200,
    true,
    1
  ),
  (
    '55555555-5555-5555-5555-555555555568',
    '11111111-1111-1111-1111-111111111111',
    '44444444-4444-4444-4444-444444444405',
    'Design Standard',
    'More visible nail art across selected nails.',
    15,
    500,
    true,
    2
  ),
  (
    '55555555-5555-5555-5555-555555555569',
    '11111111-1111-1111-1111-111111111111',
    '44444444-4444-4444-4444-444444444405',
    'Design Detailed',
    'Detailed nail art with layered finish work.',
    20,
    1000,
    true,
    3
  ),
  (
    '55555555-5555-5555-5555-555555555570',
    '11111111-1111-1111-1111-111111111111',
    '44444444-4444-4444-4444-444444444405',
    'Design Premium',
    'Premium multi-nail design with advanced detail.',
    30,
    1500,
    true,
    4
  ),
  (
    '55555555-5555-5555-5555-555555555571',
    '11111111-1111-1111-1111-111111111111',
    '44444444-4444-4444-4444-444444444406',
    'Design Simple',
    'Simple nail art or accent detail.',
    10,
    200,
    true,
    1
  ),
  (
    '55555555-5555-5555-5555-555555555572',
    '11111111-1111-1111-1111-111111111111',
    '44444444-4444-4444-4444-444444444406',
    'Design Standard',
    'More visible nail art across selected nails.',
    15,
    500,
    true,
    2
  ),
  (
    '55555555-5555-5555-5555-555555555573',
    '11111111-1111-1111-1111-111111111111',
    '44444444-4444-4444-4444-444444444406',
    'Design Detailed',
    'Detailed nail art with layered finish work.',
    20,
    1000,
    true,
    3
  ),
  (
    '55555555-5555-5555-5555-555555555574',
    '11111111-1111-1111-1111-111111111111',
    '44444444-4444-4444-4444-444444444406',
    'Design Premium',
    'Premium multi-nail design with advanced detail.',
    30,
    1500,
    true,
    4
  ),
  (
    '55555555-5555-5555-5555-555555555575',
    '11111111-1111-1111-1111-111111111111',
    '44444444-4444-4444-4444-444444444407',
    'Design Simple',
    'Simple nail art or accent detail.',
    10,
    200,
    true,
    1
  ),
  (
    '55555555-5555-5555-5555-555555555576',
    '11111111-1111-1111-1111-111111111111',
    '44444444-4444-4444-4444-444444444407',
    'Design Standard',
    'More visible nail art across selected nails.',
    15,
    500,
    true,
    2
  ),
  (
    '55555555-5555-5555-5555-555555555577',
    '11111111-1111-1111-1111-111111111111',
    '44444444-4444-4444-4444-444444444407',
    'Design Detailed',
    'Detailed nail art with layered finish work.',
    20,
    1000,
    true,
    3
  ),
  (
    '55555555-5555-5555-5555-555555555578',
    '11111111-1111-1111-1111-111111111111',
    '44444444-4444-4444-4444-444444444407',
    'Design Premium',
    'Premium multi-nail design with advanced detail.',
    30,
    1500,
    true,
    4
  ),
  (
    '55555555-5555-5555-5555-555555555579',
    '11111111-1111-1111-1111-111111111111',
    '44444444-4444-4444-4444-444444444408',
    'Design Simple',
    'Simple nail art or accent detail.',
    10,
    200,
    true,
    1
  ),
  (
    '55555555-5555-5555-5555-555555555580',
    '11111111-1111-1111-1111-111111111111',
    '44444444-4444-4444-4444-444444444408',
    'Design Standard',
    'More visible nail art across selected nails.',
    15,
    500,
    true,
    2
  ),
  (
    '55555555-5555-5555-5555-555555555581',
    '11111111-1111-1111-1111-111111111111',
    '44444444-4444-4444-4444-444444444408',
    'Design Detailed',
    'Detailed nail art with layered finish work.',
    20,
    1000,
    true,
    3
  ),
  (
    '55555555-5555-5555-5555-555555555582',
    '11111111-1111-1111-1111-111111111111',
    '44444444-4444-4444-4444-444444444408',
    'Design Premium',
    'Premium multi-nail design with advanced detail.',
    30,
    1500,
    true,
    4
  ),
  (
    '55555555-5555-5555-5555-555555555583',
    '11111111-1111-1111-1111-111111111111',
    '44444444-4444-4444-4444-444444444409',
    'Design Simple',
    'Simple nail art or accent detail.',
    10,
    200,
    true,
    1
  ),
  (
    '55555555-5555-5555-5555-555555555584',
    '11111111-1111-1111-1111-111111111111',
    '44444444-4444-4444-4444-444444444409',
    'Design Standard',
    'More visible nail art across selected nails.',
    15,
    500,
    true,
    2
  ),
  (
    '55555555-5555-5555-5555-555555555585',
    '11111111-1111-1111-1111-111111111111',
    '44444444-4444-4444-4444-444444444409',
    'Design Detailed',
    'Detailed nail art with layered finish work.',
    20,
    1000,
    true,
    3
  ),
  (
    '55555555-5555-5555-5555-555555555586',
    '11111111-1111-1111-1111-111111111111',
    '44444444-4444-4444-4444-444444444409',
    'Design Premium',
    'Premium multi-nail design with advanced detail.',
    30,
    1500,
    true,
    4
  ),
  (
    '55555555-5555-5555-5555-555555555587',
    '11111111-1111-1111-1111-111111111111',
    '44444444-4444-4444-4444-444444444410',
    'Design Simple',
    'Simple nail art or accent detail.',
    10,
    200,
    true,
    1
  ),
  (
    '55555555-5555-5555-5555-555555555588',
    '11111111-1111-1111-1111-111111111111',
    '44444444-4444-4444-4444-444444444410',
    'Design Standard',
    'More visible nail art across selected nails.',
    15,
    500,
    true,
    2
  ),
  (
    '55555555-5555-5555-5555-555555555589',
    '11111111-1111-1111-1111-111111111111',
    '44444444-4444-4444-4444-444444444410',
    'Design Detailed',
    'Detailed nail art with layered finish work.',
    20,
    1000,
    true,
    3
  ),
  (
    '55555555-5555-5555-5555-555555555590',
    '11111111-1111-1111-1111-111111111111',
    '44444444-4444-4444-4444-444444444410',
    'Design Premium',
    'Premium multi-nail design with advanced detail.',
    30,
    1500,
    true,
    4
  ),
  (
    '55555555-5555-5555-5555-555555555591',
    '11111111-1111-1111-1111-111111111111',
    '44444444-4444-4444-4444-444444444411',
    'Design Simple',
    'Simple nail art or accent detail.',
    10,
    200,
    true,
    1
  ),
  (
    '55555555-5555-5555-5555-555555555592',
    '11111111-1111-1111-1111-111111111111',
    '44444444-4444-4444-4444-444444444411',
    'Design Standard',
    'More visible nail art across selected nails.',
    15,
    500,
    true,
    2
  ),
  (
    '55555555-5555-5555-5555-555555555593',
    '11111111-1111-1111-1111-111111111111',
    '44444444-4444-4444-4444-444444444411',
    'Design Detailed',
    'Detailed nail art with layered finish work.',
    20,
    1000,
    true,
    3
  ),
  (
    '55555555-5555-5555-5555-555555555594',
    '11111111-1111-1111-1111-111111111111',
    '44444444-4444-4444-4444-444444444411',
    'Design Premium',
    'Premium multi-nail design with advanced detail.',
    30,
    1500,
    true,
    4
  ),
  (
    '55555555-5555-5555-5555-555555555595',
    '11111111-1111-1111-1111-111111111111',
    '44444444-4444-4444-4444-444444444413',
    'Design Simple',
    'Simple nail art or accent detail.',
    10,
    200,
    true,
    1
  ),
  (
    '55555555-5555-5555-5555-555555555596',
    '11111111-1111-1111-1111-111111111111',
    '44444444-4444-4444-4444-444444444413',
    'Design Standard',
    'More visible nail art across selected nails.',
    15,
    500,
    true,
    2
  ),
  (
    '55555555-5555-5555-5555-555555555597',
    '11111111-1111-1111-1111-111111111111',
    '44444444-4444-4444-4444-444444444413',
    'Design Detailed',
    'Detailed nail art with layered finish work.',
    20,
    1000,
    true,
    3
  ),
  (
    '55555555-5555-5555-5555-555555555598',
    '11111111-1111-1111-1111-111111111111',
    '44444444-4444-4444-4444-444444444413',
    'Design Premium',
    'Premium multi-nail design with advanced detail.',
    30,
    1500,
    true,
    4
  ),
  (
    '55555555-5555-5555-5555-555555555599',
    '11111111-1111-1111-1111-111111111111',
    '44444444-4444-4444-4444-444444444417',
    'Design Simple',
    'Simple nail art or accent detail.',
    10,
    200,
    true,
    1
  ),
  (
    '55555555-5555-5555-5555-555555555600',
    '11111111-1111-1111-1111-111111111111',
    '44444444-4444-4444-4444-444444444417',
    'Design Standard',
    'More visible nail art across selected nails.',
    15,
    500,
    true,
    2
  ),
  (
    '55555555-5555-5555-5555-555555555601',
    '11111111-1111-1111-1111-111111111111',
    '44444444-4444-4444-4444-444444444417',
    'Design Detailed',
    'Detailed nail art with layered finish work.',
    20,
    1000,
    true,
    3
  ),
  (
    '55555555-5555-5555-5555-555555555602',
    '11111111-1111-1111-1111-111111111111',
    '44444444-4444-4444-4444-444444444417',
    'Design Premium',
    'Premium multi-nail design with advanced detail.',
    30,
    1500,
    true,
    4
  ),
  (
    '55555555-5555-5555-5555-555555555603',
    '11111111-1111-1111-1111-111111111111',
    '44444444-4444-4444-4444-444444444418',
    'Design Simple',
    'Simple nail art or accent detail.',
    10,
    200,
    true,
    1
  ),
  (
    '55555555-5555-5555-5555-555555555604',
    '11111111-1111-1111-1111-111111111111',
    '44444444-4444-4444-4444-444444444418',
    'Design Standard',
    'More visible nail art across selected nails.',
    15,
    500,
    true,
    2
  ),
  (
    '55555555-5555-5555-5555-555555555605',
    '11111111-1111-1111-1111-111111111111',
    '44444444-4444-4444-4444-444444444418',
    'Design Detailed',
    'Detailed nail art with layered finish work.',
    20,
    1000,
    true,
    3
  ),
  (
    '55555555-5555-5555-5555-555555555606',
    '11111111-1111-1111-1111-111111111111',
    '44444444-4444-4444-4444-444444444418',
    'Design Premium',
    'Premium multi-nail design with advanced detail.',
    30,
    1500,
    true,
    4
  ),
  (
    '55555555-5555-5555-5555-555555555607',
    '11111111-1111-1111-1111-111111111111',
    '44444444-4444-4444-4444-444444444419',
    'Design Simple',
    'Simple nail art or accent detail.',
    10,
    200,
    true,
    1
  ),
  (
    '55555555-5555-5555-5555-555555555608',
    '11111111-1111-1111-1111-111111111111',
    '44444444-4444-4444-4444-444444444419',
    'Design Standard',
    'More visible nail art across selected nails.',
    15,
    500,
    true,
    2
  ),
  (
    '55555555-5555-5555-5555-555555555609',
    '11111111-1111-1111-1111-111111111111',
    '44444444-4444-4444-4444-444444444419',
    'Design Detailed',
    'Detailed nail art with layered finish work.',
    20,
    1000,
    true,
    3
  ),
  (
    '55555555-5555-5555-5555-555555555610',
    '11111111-1111-1111-1111-111111111111',
    '44444444-4444-4444-4444-444444444419',
    'Design Premium',
    'Premium multi-nail design with advanced detail.',
    30,
    1500,
    true,
    4
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
  ('11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333333', '44444444-4444-4444-4444-444444444401'),
  ('11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333332', '44444444-4444-4444-4444-444444444402'),
  ('11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333332', '44444444-4444-4444-4444-444444444403'),
  ('11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333331', '44444444-4444-4444-4444-444444444404'),
  ('11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333332', '44444444-4444-4444-4444-444444444405'),
  ('11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333333', '44444444-4444-4444-4444-444444444405'),
  ('11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333331', '44444444-4444-4444-4444-444444444406'),
  ('11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333332', '44444444-4444-4444-4444-444444444406'),
  ('11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333333', '44444444-4444-4444-4444-444444444407'),
  ('11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333331', '44444444-4444-4444-4444-444444444408'),
  ('11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333332', '44444444-4444-4444-4444-444444444408'),
  ('11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333333', '44444444-4444-4444-4444-444444444409'),
  ('11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333331', '44444444-4444-4444-4444-444444444410'),
  ('11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333332', '44444444-4444-4444-4444-444444444410'),
  ('11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333331', '44444444-4444-4444-4444-444444444411'),
  ('11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333332', '44444444-4444-4444-4444-444444444411'),
  ('11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333333', '44444444-4444-4444-4444-444444444412'),
  ('11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333333', '44444444-4444-4444-4444-444444444413'),
  ('11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333331', '44444444-4444-4444-4444-444444444414'),
  ('11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333332', '44444444-4444-4444-4444-444444444414'),
  ('11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333331', '44444444-4444-4444-4444-444444444415'),
  ('11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333332', '44444444-4444-4444-4444-444444444415'),
  ('11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333331', '44444444-4444-4444-4444-444444444416'),
  ('11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333332', '44444444-4444-4444-4444-444444444416'),
  ('11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333331', '44444444-4444-4444-4444-444444444417'),
  ('11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333332', '44444444-4444-4444-4444-444444444417'),
  ('11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333331', '44444444-4444-4444-4444-444444444418'),
  ('11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333332', '44444444-4444-4444-4444-444444444418'),
  ('11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333331', '44444444-4444-4444-4444-444444444419'),
  ('11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333332', '44444444-4444-4444-4444-444444444419')
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
  ('66666666-6666-6666-6666-666666666661', '11111111-1111-1111-1111-111111111111', 1, '09:00', '18:30', false, 1),
  ('66666666-6666-6666-6666-666666666662', '11111111-1111-1111-1111-111111111111', 2, '09:00', '18:30', false, 2),
  ('66666666-6666-6666-6666-666666666663', '11111111-1111-1111-1111-111111111111', 3, '09:00', '18:30', false, 3),
  ('66666666-6666-6666-6666-666666666664', '11111111-1111-1111-1111-111111111111', 4, '09:00', '18:30', false, 4),
  ('66666666-6666-6666-6666-666666666665', '11111111-1111-1111-1111-111111111111', 5, '09:00', '18:30', false, 5),
  ('66666666-6666-6666-6666-666666666666', '11111111-1111-1111-1111-111111111111', 6, '09:00', '18:30', false, 6)
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
    '2026-04-10T11:00:00Z',
    'confirmed',
    'Ava Turner',
    'ava.turner@example.com',
    '+44 7700 900111',
    'Prefers a short almond shape with a soft neutral finish.',
    'Returning client. Usually books a shellac-finish acrylic set with light design.',
    4000
  ),
  (
    '99999999-9999-9999-9999-999999999992',
    '11111111-1111-1111-1111-111111111111',
    '88888888-8888-8888-8888-888888888882',
    '33333333-3333-3333-3333-333333333332',
    '2026-04-11',
    '2026-04-11T12:30:00Z',
    '2026-04-11T13:25:00Z',
    'pending',
    'Lina Morris',
    'lina.morris@example.com',
    '+44 7700 900222',
    'Requested premium nail art with the BIAB appointment.',
    'Confirm final design details at check-in.',
    4300
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
    'Fullset Acrylic With Shellac',
    45,
    3500,
    1
  ),
  (
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2',
    '99999999-9999-9999-9999-999999999991',
    '33333333-3333-3333-3333-333333333331',
    null,
    '55555555-5555-5555-5555-555555555552',
    'Design Standard',
    15,
    500,
    2
  ),
  (
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa3',
    '99999999-9999-9999-9999-999999999992',
    '33333333-3333-3333-3333-333333333332',
    '44444444-4444-4444-4444-444444444410',
    null,
    'BIAB/Builder Gel In Bottle',
    25,
    2800,
    1
  ),
  (
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa4',
    '99999999-9999-9999-9999-999999999992',
    '33333333-3333-3333-3333-333333333332',
    null,
    '55555555-5555-5555-5555-555555555590',
    'Design Premium',
    30,
    1500,
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










