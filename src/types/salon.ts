export type BookingStatus =
  | "pending"
  | "confirmed"
  | "cancelled"
  | "completed"
  | "no_show";

export type NotificationStatus = "pending" | "sent" | "failed";

export type AccentTone = "soft" | "warm" | "neutral" | "highlight";

export type SalonProfile = {
  id: string;
  slug: string;
  name: string;
  tagline: string | null;
  description: string | null;
  phone: string | null;
  email: string | null;
  addressLine1: string | null;
  addressLine2: string | null;
  city: string | null;
  region: string | null;
  postalCode: string | null;
  countryCode: string;
  timezone: string;
  currencyCode: string;
  websiteUrl: string | null;
  facebookUrl: string | null;
  instagramUrl: string | null;
  bookingNotice: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type SalonThemeSettings = {
  id: string;
  salonId: string;
  brandName: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  foregroundColor: string;
  headingFont: string;
  bodyFont: string;
  buttonStyle: string;
  borderRadius: string;
  heroImageUrl: string | null;
  heroImageAlt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type StaffMember = {
  id: string;
  salonId: string;
  firstName: string;
  lastName: string;
  displayName: string;
  role: string;
  bio: string | null;
  profileImageUrl: string | null;
  email: string | null;
  phone: string | null;
  instagramHandle: string | null;
  isFeatured: boolean;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

export type ServiceAddon = {
  id: string;
  salonId: string;
  serviceId: string;
  name: string;
  description: string | null;
  durationMinutes: number;
  priceCents: number;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

export type SalonService = {
  id: string;
  salonId: string;
  slug: string;
  name: string;
  category: string;
  shortDescription: string | null;
  description: string | null;
  durationMinutes: number;
  priceFromCents: number;
  isFeatured: boolean;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  addons: ServiceAddon[];
  staffIds: string[];
};

export type WorkingHoursEntry = {
  id: string;
  salonId: string;
  staffId: string | null;
  dayOfWeek: number;
  opensAt: string | null;
  closesAt: string | null;
  isClosed: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

export type BlackoutDate = {
  id: string;
  salonId: string;
  staffId: string | null;
  startsAt: string;
  endsAt: string;
  reason: string | null;
  createdAt: string;
};

export type Customer = {
  id: string;
  salonId: string;
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string | null;
  notes: string | null;
  marketingOptIn: boolean;
  createdAt: string;
  updatedAt: string;
};

export type Booking = {
  id: string;
  salonId: string;
  customerId: string | null;
  staffId: string | null;
  bookingDate: string;
  startsAt: string;
  endsAt: string;
  status: BookingStatus;
  customerNameSnapshot: string;
  customerEmailSnapshot: string | null;
  customerPhoneSnapshot: string | null;
  notes: string | null;
  internalNotes: string | null;
  totalPriceCents: number;
  createdAt: string;
  updatedAt: string;
};

export type BookingService = {
  id: string;
  bookingId: string;
  staffId: string | null;
  serviceId: string | null;
  serviceAddonId: string | null;
  lineLabel: string;
  durationMinutes: number;
  priceCents: number;
  sortOrder: number;
  createdAt: string;
};

export type NotificationLog = {
  id: string;
  salonId: string;
  bookingId: string | null;
  customerId: string | null;
  channel: string;
  notificationType: string;
  templateKey: string | null;
  recipient: string | null;
  status: NotificationStatus;
  payload: Record<string, unknown>;
  sentAt: string | null;
  errorMessage: string | null;
  createdAt: string;
};

export type GalleryImage = {
  id: string;
  salonId: string;
  title: string;
  altText: string | null;
  description: string | null;
  imageUrl: string;
  category: string | null;
  accentTone: AccentTone;
  isFeatured: boolean;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
};

export type Review = {
  id: string;
  salonId: string;
  customerId: string | null;
  authorName: string;
  rating: number;
  reviewText: string;
  sourceLabel: string | null;
  isFeatured: boolean;
  isPublished: boolean;
  sortOrder: number;
  createdAt: string;
};


