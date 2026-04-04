import type { ThemeConfig } from "@/types/theme";
import type {
  GalleryImagesRow,
  ReviewsRow,
  SalonThemeSettingsRow,
  SalonsRow,
  ServiceAddonsRow,
  ServicesRow,
  StaffRow,
  StaffServicesRow,
  WorkingHoursRow,
} from "@/types/database";
import type {
  AccentTone,
  GalleryImage,
  Review,
  SalonProfile,
  SalonService,
  SalonThemeSettings,
  ServiceAddon,
  StaffMember,
  WorkingHoursEntry,
} from "@/types/salon";

const accentToneValues: AccentTone[] = ["soft", "warm", "neutral", "highlight"];

function toAccentTone(value: string): AccentTone {
  return accentToneValues.includes(value as AccentTone)
    ? (value as AccentTone)
    : "soft";
}

export function mapSalonRow(row: SalonsRow): SalonProfile {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    tagline: row.tagline,
    description: row.description,
    phone: row.phone,
    email: row.email,
    addressLine1: row.address_line_1,
    addressLine2: row.address_line_2,
    city: row.city,
    region: row.region,
    postalCode: row.postal_code,
    countryCode: row.country_code,
    timezone: row.timezone,
    currencyCode: row.currency_code,
    websiteUrl: row.website_url,
    facebookUrl: row.facebook_url,
    instagramUrl: row.instagram_url,
    bookingNotice: row.booking_notice,
    isActive: row.is_active,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapThemeSettingsRow(row: SalonThemeSettingsRow): SalonThemeSettings {
  return {
    id: row.id,
    salonId: row.salon_id,
    brandName: row.brand_name,
    primaryColor: row.primary_color,
    secondaryColor: row.secondary_color,
    accentColor: row.accent_color,
    backgroundColor: row.background_color,
    foregroundColor: row.foreground_color,
    headingFont: row.heading_font,
    bodyFont: row.body_font,
    buttonStyle: row.button_style,
    borderRadius: row.border_radius,
    heroImageUrl: row.hero_image_url,
    heroImageAlt: row.hero_image_alt,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapStaffRow(row: StaffRow): StaffMember {
  return {
    id: row.id,
    salonId: row.salon_id,
    firstName: row.first_name,
    lastName: row.last_name,
    displayName: row.display_name,
    role: row.role,
    bio: row.bio,
    profileImageUrl: row.profile_image_url,
    email: row.email,
    phone: row.phone,
    instagramHandle: row.instagram_handle,
    isFeatured: row.is_featured,
    isActive: row.is_active,
    sortOrder: row.sort_order,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapServiceAddonRow(row: ServiceAddonsRow): ServiceAddon {
  return {
    id: row.id,
    salonId: row.salon_id,
    serviceId: row.service_id,
    name: row.name,
    description: row.description,
    durationMinutes: row.duration_minutes,
    priceCents: row.price_cents,
    isActive: row.is_active,
    sortOrder: row.sort_order,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapServiceRow(
  row: ServicesRow,
  addons: ServiceAddon[] = [],
  staffLinks: StaffServicesRow[] = [],
): SalonService {
  return {
    id: row.id,
    salonId: row.salon_id,
    slug: row.slug,
    name: row.name,
    category: row.category,
    shortDescription: row.short_description,
    description: row.description,
    durationMinutes: row.duration_minutes,
    priceFromCents: row.price_from_cents,
    isFeatured: row.is_featured,
    isActive: row.is_active,
    sortOrder: row.sort_order,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    addons,
    staffIds: staffLinks.map((link) => link.staff_id),
  };
}

export function mapWorkingHoursRow(row: WorkingHoursRow): WorkingHoursEntry {
  return {
    id: row.id,
    salonId: row.salon_id,
    staffId: row.staff_id,
    dayOfWeek: row.day_of_week,
    opensAt: row.opens_at,
    closesAt: row.closes_at,
    isClosed: row.is_closed,
    sortOrder: row.sort_order,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapGalleryImageRow(row: GalleryImagesRow): GalleryImage {
  return {
    id: row.id,
    salonId: row.salon_id,
    title: row.title,
    altText: row.alt_text,
    description: row.description,
    imageUrl: row.image_url,
    category: row.category,
    accentTone: toAccentTone(row.accent_tone),
    isFeatured: row.is_featured,
    isActive: row.is_active,
    sortOrder: row.sort_order,
    createdAt: row.created_at,
  };
}

export function mapReviewRow(row: ReviewsRow): Review {
  return {
    id: row.id,
    salonId: row.salon_id,
    customerId: row.customer_id,
    authorName: row.author_name,
    rating: row.rating,
    reviewText: row.review_text,
    sourceLabel: row.source_label,
    isFeatured: row.is_featured,
    isPublished: row.is_published,
    sortOrder: row.sort_order,
    createdAt: row.created_at,
  };
}

export function createThemeConfigFromSettings(
  theme: SalonThemeSettings,
  fallbackHeroImage = "/images/hero-nails.svg",
): ThemeConfig {
  return {
    brandName: theme.brandName,
    colors: {
      background: theme.backgroundColor,
      foreground: theme.foregroundColor,
      card: "0 0% 100%",
      "card-foreground": theme.foregroundColor,
      popover: "0 0% 100%",
      "popover-foreground": theme.foregroundColor,
      primary: theme.primaryColor,
      "primary-foreground": "36 100% 98%",
      secondary: theme.secondaryColor,
      "secondary-foreground": "18 26% 22%",
      muted: "32 28% 93%",
      "muted-foreground": "20 14% 41%",
      accent: theme.accentColor,
      "accent-foreground": "340 30% 24%",
      destructive: "0 72% 55%",
      "destructive-foreground": "0 0% 100%",
      border: "24 24% 84%",
      input: "24 24% 84%",
      ring: theme.primaryColor,
    },
    fonts: {
      body: theme.bodyFont as ThemeConfig["fonts"]["body"],
      heading: theme.headingFont as ThemeConfig["fonts"]["heading"],
    },
    buttonStyle: theme.buttonStyle as ThemeConfig["buttonStyle"],
    borderRadius: theme.borderRadius,
    heroImage: theme.heroImageUrl ?? fallbackHeroImage,
  };
}


