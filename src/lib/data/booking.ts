import { computeBookingAvailability } from "@/lib/booking/availability";
import { ANY_AVAILABLE_STAFF_ID, DEFAULT_BOOKING_STATUS } from "@/lib/booking/constants";
import { getBookingDateInfo, isPastBookingDate } from "@/lib/booking/time";
import { createBookingNotificationContext, sendBookingConfirmationNotification } from "@/lib/notifications/booking-notifications";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type {
  BookingAvailabilityRequest,
  BookingAvailabilityResponse,
  BookingConfirmationSummary,
  BookingCreateRequest,
  BookingCreateResponse,
} from "@/types/booking";
import type {
  BlackoutDatesRow,
  BookingServicesRow,
  BookingsRow,
  SalonsRow,
  ServiceAddonsRow,
  ServicesRow,
  StaffRow,
  StaffServicesRow,
  WorkingHoursRow,
} from "@/types/database";

export class BookingError extends Error {
  status: number;

  constructor(message: string, status = 400) {
    super(message);
    this.status = status;
  }
}

function requireSupabaseClient() {
  const client = createServerSupabaseClient();

  if (!client) {
    throw new BookingError("Supabase is not configured on the server.", 503);
  }

  return client;
}

function normalizeAddonIds(addonIds: string[]) {
  return [...new Set(addonIds.filter(Boolean))];
}

async function loadBookingBaseContext(
  salonId: string,
  serviceId: string,
  addonIds: string[],
  bookingDate: string,
) {
  const client = requireSupabaseClient();
  const normalizedAddonIds = normalizeAddonIds(addonIds);

  const [salonResult, serviceResult, staffServicesResult] = await Promise.all([
    client.from("salons").select("*").eq("id", salonId).eq("is_active", true).maybeSingle(),
    client
      .from("services")
      .select("*")
      .eq("id", serviceId)
      .eq("salon_id", salonId)
      .eq("is_active", true)
      .maybeSingle(),
    client.from("staff_services").select("*").eq("salon_id", salonId).eq("service_id", serviceId),
  ]);

  if (salonResult.error || !salonResult.data) {
    throw new BookingError("Salon not found.", 404);
  }

  if (serviceResult.error || !serviceResult.data) {
    throw new BookingError("Service not found.", 404);
  }

  if (staffServicesResult.error || !staffServicesResult.data?.length) {
    throw new BookingError("No active staff assignments were found for this service.", 400);
  }

  const salon = salonResult.data as SalonsRow;
  if (isPastBookingDate(bookingDate, salon.timezone)) {
    throw new BookingError("Please choose today or a future date.", 400);
  }

  const service = serviceResult.data as ServicesRow;
  const staffServices = staffServicesResult.data as StaffServicesRow[];
  const staffIds = staffServices.map((row) => row.staff_id);
  const { localStart, localEnd, dayOfWeek } = getBookingDateInfo(bookingDate, salon.timezone);

  const addonQuery = normalizedAddonIds.length
    ? client
        .from("service_addons")
        .select("*")
        .eq("salon_id", salonId)
        .eq("service_id", serviceId)
        .eq("is_active", true)
        .in("id", normalizedAddonIds)
    : Promise.resolve({ data: [] as ServiceAddonsRow[], error: null });

  const [addonsResult, staffResult, workingHoursResult, blackoutResult, bookingsResult] = await Promise.all([
    addonQuery,
    client
      .from("staff")
      .select("*")
      .eq("salon_id", salonId)
      .eq("is_active", true)
      .in("id", staffIds)
      .order("sort_order", { ascending: true }),
    client
      .from("working_hours")
      .select("*")
      .eq("salon_id", salonId)
      .eq("day_of_week", dayOfWeek)
      .order("sort_order", { ascending: true }),
    client
      .from("blackout_dates")
      .select("*")
      .eq("salon_id", salonId)
      .lt("starts_at", localEnd.toUTC().toISO() ?? "")
      .gt("ends_at", localStart.toUTC().toISO() ?? ""),
    client.from("bookings").select("*").eq("salon_id", salonId).eq("booking_date", bookingDate),
  ]);

  if (addonsResult.error) {
    throw new BookingError("Unable to load selected add-ons.", 500);
  }

  if (normalizedAddonIds.length !== (addonsResult.data?.length ?? 0)) {
    throw new BookingError("One or more selected add-ons are invalid.", 400);
  }

  if (staffResult.error || !staffResult.data?.length) {
    throw new BookingError("No available staff could be loaded.", 400);
  }

  if (workingHoursResult.error) {
    throw new BookingError("Unable to load working hours.", 500);
  }

  if (blackoutResult.error) {
    throw new BookingError("Unable to load blackout dates.", 500);
  }

  if (bookingsResult.error) {
    throw new BookingError("Unable to load existing bookings.", 500);
  }

  return {
    client,
    salon,
    service,
    addons: (addonsResult.data ?? []) as ServiceAddonsRow[],
    staff: staffResult.data as StaffRow[],
    staffServices,
    workingHours: (workingHoursResult.data ?? []) as WorkingHoursRow[],
    blackoutDates: (blackoutResult.data ?? []) as BlackoutDatesRow[],
    bookings: (bookingsResult.data ?? []) as BookingsRow[],
  };
}

export async function getBookingAvailability(
  request: BookingAvailabilityRequest,
): Promise<BookingAvailabilityResponse> {
  const context = await loadBookingBaseContext(
    request.salonId,
    request.serviceId,
    request.addonIds,
    request.bookingDate,
  );

  if (
    request.staffSelection !== ANY_AVAILABLE_STAFF_ID &&
    !context.staff.some((staffMember) => staffMember.id === request.staffSelection)
  ) {
    throw new BookingError("Selected staff member is not available for this service.", 400);
  }

  return computeBookingAvailability({
    bookingDate: request.bookingDate,
    timezone: context.salon.timezone,
    service: context.service,
    addons: context.addons,
    staff: context.staff,
    staffServices: context.staffServices,
    workingHours: context.workingHours,
    blackoutDates: context.blackoutDates,
    bookings: context.bookings,
    staffSelection: request.staffSelection,
  });
}

export async function createBooking(
  request: BookingCreateRequest,
): Promise<BookingCreateResponse> {
  if (!request.customerFullName.trim()) {
    throw new BookingError("Full name is required.", 400);
  }

  if (!request.customerEmail.trim() || !request.customerEmail.includes("@")) {
    throw new BookingError("A valid email address is required.", 400);
  }

  if (!request.customerPhone.trim()) {
    throw new BookingError("Phone number is required.", 400);
  }

  const context = await loadBookingBaseContext(
    request.salonId,
    request.serviceId,
    request.addonIds,
    request.bookingDate,
  );

  const availability = computeBookingAvailability({
    bookingDate: request.bookingDate,
    timezone: context.salon.timezone,
    service: context.service,
    addons: context.addons,
    staff: context.staff,
    staffServices: context.staffServices,
    workingHours: context.workingHours,
    blackoutDates: context.blackoutDates,
    bookings: context.bookings,
    staffSelection: request.staffSelection,
  });

  const selectedSlot = availability.slots.find((slot) => slot.startAt === request.selectedSlotStartAt);

  if (!selectedSlot) {
    throw new BookingError("That time slot is no longer available. Please choose another slot.", 409);
  }

  const staffLink = context.staffServices.find(
    (link) => link.staff_id === selectedSlot.assignedStaffId && link.service_id === context.service.id,
  );

  if (!staffLink) {
    throw new BookingError("Unable to resolve staff pricing for the selected slot.", 400);
  }

  const baseDuration = staffLink.custom_duration_minutes ?? context.service.duration_minutes;
  const basePrice = staffLink.custom_price_cents ?? context.service.price_from_cents;

  const lines = [
    {
      staff_id: selectedSlot.assignedStaffId,
      service_id: context.service.id,
      service_addon_id: null,
      line_label: context.service.name,
      duration_minutes: baseDuration,
      price_cents: basePrice,
      sort_order: 1,
    },
    ...context.addons.map((addon, index) => ({
      staff_id: selectedSlot.assignedStaffId,
      service_id: null,
      service_addon_id: addon.id,
      line_label: addon.name,
      duration_minutes: addon.duration_minutes,
      price_cents: addon.price_cents,
      sort_order: index + 2,
    })),
  ];

  const { data, error } = await context.client.rpc("create_booking_transaction", {
    p_salon_id: context.salon.id,
    p_staff_id: selectedSlot.assignedStaffId,
    p_booking_date: request.bookingDate,
    p_starts_at: selectedSlot.startAt,
    p_ends_at: selectedSlot.endAt,
    p_customer_full_name: request.customerFullName.trim(),
    p_customer_email: request.customerEmail.trim(),
    p_customer_phone: request.customerPhone.trim(),
    p_customer_notes: request.customerNotes?.trim() ?? null,
    p_total_price_cents: selectedSlot.totalPriceCents,
    p_status: DEFAULT_BOOKING_STATUS,
    p_service_lines: lines,
  });

  if (error) {
    if (error.code === "23P01") {
      throw new BookingError("That slot was just taken. Please choose another time.", 409);
    }

    throw new BookingError("Unable to create the booking right now.", 500);
  }

  const bookingRow = Array.isArray(data) ? data[0] : null;
  if (!bookingRow?.booking_id) {
    throw new BookingError("Booking was created without a confirmation id.", 500);
  }

  const notificationContext = createBookingNotificationContext({
    bookingId: bookingRow.booking_id as string,
    salon: {
      id: context.salon.id,
      name: context.salon.name,
      timezone: context.salon.timezone,
      currencyCode: context.salon.currency_code,
      phone: context.salon.phone,
      email: context.salon.email,
      addressLine1: context.salon.address_line_1,
      addressLine2: context.salon.address_line_2,
      city: context.salon.city,
      region: context.salon.region,
      postalCode: context.salon.postal_code,
    },
    customerId: (bookingRow.customer_id as string | null | undefined) ?? null,
    customerName: request.customerFullName.trim(),
    customerEmail: request.customerEmail.trim(),
    staffName: selectedSlot.assignedStaffName,
    startsAt: selectedSlot.startAt,
    endsAt: selectedSlot.endAt,
    totalPriceCents: selectedSlot.totalPriceCents,
    lines: lines.map((line) => ({
      label: line.line_label,
      durationMinutes: line.duration_minutes,
      priceCents: line.price_cents,
    })),
  });

  const notificationResult = await sendBookingConfirmationNotification({
    data: notificationContext,
    customerId: (bookingRow.customer_id as string | null | undefined) ?? null,
  });

  return {
    bookingId: bookingRow.booking_id as string,
    notificationStatus: notificationResult.status,
    notificationMessage: notificationResult.message,
  };
}

export async function getBookingConfirmationSummary(
  bookingId: string,
): Promise<BookingConfirmationSummary | null> {
  const client = createServerSupabaseClient();

  if (!client || !bookingId) {
    return null;
  }

  const [bookingResult, linesResult] = await Promise.all([
    client.from("bookings").select("*").eq("id", bookingId).maybeSingle(),
    client.from("booking_services").select("*").eq("booking_id", bookingId).order("sort_order", { ascending: true }),
  ]);

  if (bookingResult.error || linesResult.error || !bookingResult.data || !linesResult.data) {
    return null;
  }

  const booking = bookingResult.data as BookingsRow;
  const [salonResult, staffResult] = await Promise.all([
    client
      .from("salons")
      .select("name, currency_code, timezone")
      .eq("id", booking.salon_id)
      .maybeSingle(),
    booking.staff_id
      ? client.from("staff").select("display_name").eq("id", booking.staff_id).maybeSingle()
      : Promise.resolve({ data: null, error: null }),
  ]);

  return {
    bookingId: booking.id,
    salonName: (salonResult.data?.name as string | undefined) ?? "Salon",
    status: booking.status,
    startsAt: booking.starts_at,
    endsAt: booking.ends_at,
    timezone: (salonResult.data?.timezone as string | undefined) ?? "UTC",
    staffName: (staffResult.data?.display_name as string | undefined) ?? null,
    customerName: booking.customer_name_snapshot,
    customerEmail: booking.customer_email_snapshot,
    customerPhone: booking.customer_phone_snapshot,
    notes: booking.notes,
    totalPriceCents: booking.total_price_cents,
    currencyCode: (salonResult.data?.currency_code as string | undefined) ?? "GBP",
    lines: (linesResult.data as BookingServicesRow[]).map((line) => ({
      id: line.id,
      label: line.line_label,
      durationMinutes: line.duration_minutes,
      priceCents: line.price_cents,
    })),
  };
}

