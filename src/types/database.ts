export type DatabaseBookingStatus =
  | "pending"
  | "confirmed"
  | "cancelled"
  | "completed"
  | "no_show";

export type NotificationDeliveryStatus = "pending" | "sent" | "failed";

export type SalonsRow = {
  id: string;
  slug: string;
  name: string;
  tagline: string | null;
  description: string | null;
  phone: string | null;
  email: string | null;
  address_line_1: string | null;
  address_line_2: string | null;
  city: string | null;
  region: string | null;
  postal_code: string | null;
  country_code: string;
  timezone: string;
  currency_code: string;
  website_url: string | null;
  facebook_url: string | null;
  instagram_url: string | null;
  booking_notice: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type SalonThemeSettingsRow = {
  id: string;
  salon_id: string;
  brand_name: string;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  background_color: string;
  foreground_color: string;
  heading_font: string;
  body_font: string;
  button_style: string;
  border_radius: string;
  hero_image_url: string | null;
  hero_image_alt: string | null;
  created_at: string;
  updated_at: string;
};

export type StaffRow = {
  id: string;
  salon_id: string;
  first_name: string;
  last_name: string;
  display_name: string;
  role: string;
  bio: string | null;
  profile_image_url: string | null;
  email: string | null;
  phone: string | null;
  instagram_handle: string | null;
  is_featured: boolean;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type ServicesRow = {
  id: string;
  salon_id: string;
  slug: string;
  name: string;
  category: string;
  short_description: string | null;
  description: string | null;
  duration_minutes: number;
  price_from_cents: number;
  is_featured: boolean;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type ServiceAddonsRow = {
  id: string;
  salon_id: string;
  service_id: string;
  name: string;
  description: string | null;
  duration_minutes: number;
  price_cents: number;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type StaffServicesRow = {
  salon_id: string;
  staff_id: string;
  service_id: string;
  custom_duration_minutes: number | null;
  custom_price_cents: number | null;
  created_at: string;
};

export type WorkingHoursRow = {
  id: string;
  salon_id: string;
  staff_id: string | null;
  day_of_week: number;
  opens_at: string | null;
  closes_at: string | null;
  is_closed: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type BlackoutDatesRow = {
  id: string;
  salon_id: string;
  staff_id: string | null;
  starts_at: string;
  ends_at: string;
  reason: string | null;
  created_at: string;
};

export type CustomersRow = {
  id: string;
  salon_id: string;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  notes: string | null;
  marketing_opt_in: boolean;
  created_at: string;
  updated_at: string;
};

export type BookingsRow = {
  id: string;
  salon_id: string;
  customer_id: string | null;
  staff_id: string | null;
  booking_date: string;
  starts_at: string;
  ends_at: string;
  status: DatabaseBookingStatus;
  customer_name_snapshot: string;
  customer_email_snapshot: string | null;
  customer_phone_snapshot: string | null;
  notes: string | null;
  internal_notes: string | null;
  total_price_cents: number;
  created_at: string;
  updated_at: string;
};

export type BookingServicesRow = {
  id: string;
  booking_id: string;
  staff_id: string | null;
  service_id: string | null;
  service_addon_id: string | null;
  line_label: string;
  duration_minutes: number;
  price_cents: number;
  sort_order: number;
  created_at: string;
};

export type NotificationsLogRow = {
  id: string;
  salon_id: string;
  booking_id: string | null;
  customer_id: string | null;
  channel: string;
  notification_type: string;
  template_key: string | null;
  recipient: string | null;
  status: NotificationDeliveryStatus;
  payload: Record<string, unknown>;
  sent_at: string | null;
  error_message: string | null;
  created_at: string;
};

export type GalleryImagesRow = {
  id: string;
  salon_id: string;
  title: string;
  alt_text: string | null;
  description: string | null;
  image_url: string;
  category: string | null;
  accent_tone: string;
  is_featured: boolean;
  is_active: boolean;
  sort_order: number;
  created_at: string;
};

export type ReviewsRow = {
  id: string;
  salon_id: string;
  customer_id: string | null;
  author_name: string;
  rating: number;
  review_text: string;
  source_label: string | null;
  is_featured: boolean;
  is_published: boolean;
  sort_order: number;
  created_at: string;
};


export type ShowcaseLeadsRow = {
  id: string;
  name: string;
  email: string;
  salon_name: string | null;
  current_setup: string | null;
  notes: string | null;
  source_page: string;
  created_at: string;
};

