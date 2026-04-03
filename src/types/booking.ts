import { ANY_AVAILABLE_STAFF_ID } from "@/lib/booking/constants";
import type { BookingStatus, NotificationStatus, SalonService, StaffMember } from "@/types/salon";

export type StaffSelectionValue = typeof ANY_AVAILABLE_STAFF_ID | string;

export type BookingAvailabilityRequest = {
  salonId: string;
  serviceId: string;
  addonIds: string[];
  bookingDate: string;
  staffSelection: StaffSelectionValue;
};

export type BookingSlot = {
  startAt: string;
  endAt: string;
  label: string;
  assignedStaffId: string;
  assignedStaffName: string;
  availableStaffCount: number;
  totalDurationMinutes: number;
  totalPriceCents: number;
};

export type BookingAvailabilityResponse = {
  slots: BookingSlot[];
  quote: {
    totalDurationMinutes: number;
    totalPriceCents: number;
  };
};

export type BookingCreateRequest = {
  salonId: string;
  serviceId: string;
  addonIds: string[];
  bookingDate: string;
  selectedSlotStartAt: string;
  staffSelection: StaffSelectionValue;
  customerFullName: string;
  customerEmail: string;
  customerPhone: string;
  customerNotes?: string;
};

export type BookingCreateResponse = {
  bookingId: string;
  notificationStatus: NotificationStatus;
  notificationMessage?: string;
};

export type BookingConfirmationSummary = {
  bookingId: string;
  salonName: string;
  status: BookingStatus;
  startsAt: string;
  endsAt: string;
  timezone: string;
  staffName: string | null;
  customerName: string;
  customerEmail: string | null;
  customerPhone: string | null;
  notes: string | null;
  totalPriceCents: number;
  currencyCode: string;
  lines: Array<{
    id: string;
    label: string;
    durationMinutes: number;
    priceCents: number;
  }>;
};

export type BookingPageProps = {
  salon: {
    id: string;
    name: string;
    currencyCode: string;
    timezone: string;
  };
  minBookingDate: string;
  services: Pick<
    SalonService,
    | "id"
    | "name"
    | "category"
    | "shortDescription"
    | "description"
    | "durationMinutes"
    | "priceFromCents"
    | "addons"
    | "staffIds"
  >[];
  staff: Pick<StaffMember, "id" | "displayName" | "role" | "profileImageUrl">[];
};
