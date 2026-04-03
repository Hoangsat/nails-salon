import { DateTime } from "luxon";

import { ANY_AVAILABLE_STAFF_ID, BOOKING_SLOT_INTERVAL_MINUTES } from "@/lib/booking/constants";
import { buildLocalDateTime, formatSlotLabel, getBookingDateInfo } from "@/lib/booking/time";
import type { BookingSlot, StaffSelectionValue } from "@/types/booking";
import type {
  BlackoutDatesRow,
  BookingsRow,
  ServiceAddonsRow,
  ServicesRow,
  StaffRow,
  StaffServicesRow,
  WorkingHoursRow,
} from "@/types/database";

type AvailabilityInput = {
  bookingDate: string;
  timezone: string;
  service: ServicesRow;
  addons: ServiceAddonsRow[];
  staff: StaffRow[];
  staffServices: StaffServicesRow[];
  workingHours: WorkingHoursRow[];
  blackoutDates: BlackoutDatesRow[];
  bookings: BookingsRow[];
  staffSelection: StaffSelectionValue;
};

type DerivedServiceValues = {
  baseDuration: number;
  basePrice: number;
  totalDurationMinutes: number;
  totalPriceCents: number;
};

function overlaps(aStart: number, aEnd: number, bStart: number, bEnd: number) {
  return aStart < bEnd && aEnd > bStart;
}

function getApplicableWorkingRows(
  workingHours: WorkingHoursRow[],
  staffId: string,
  dayOfWeek: number,
) {
  const staffSpecific = workingHours
    .filter((row) => row.day_of_week === dayOfWeek && row.staff_id === staffId)
    .sort((a, b) => a.sort_order - b.sort_order);

  const salonLevel = workingHours
    .filter((row) => row.day_of_week === dayOfWeek && row.staff_id === null)
    .sort((a, b) => a.sort_order - b.sort_order);

  const rows = staffSpecific.length ? staffSpecific : salonLevel;

  if (!rows.length || rows.every((row) => row.is_closed)) {
    return [];
  }

  return rows.filter((row) => !row.is_closed && row.opens_at && row.closes_at);
}

function getDerivedServiceValues(
  service: ServicesRow,
  addons: ServiceAddonsRow[],
  staffLink: StaffServicesRow,
): DerivedServiceValues {
  const addonDuration = addons.reduce((sum, addon) => sum + addon.duration_minutes, 0);
  const addonPrice = addons.reduce((sum, addon) => sum + addon.price_cents, 0);
  const baseDuration = staffLink.custom_duration_minutes ?? service.duration_minutes;
  const basePrice = staffLink.custom_price_cents ?? service.price_from_cents;

  return {
    baseDuration,
    basePrice,
    totalDurationMinutes: baseDuration + addonDuration,
    totalPriceCents: basePrice + addonPrice,
  };
}

export function computeBookingAvailability(input: AvailabilityInput) {
  const { dayOfWeek } = getBookingDateInfo(input.bookingDate, input.timezone);
  const nowInTimezone = DateTime.now().setZone(input.timezone);

  const sortedStaff = [...input.staff].sort((a, b) => a.sort_order - b.sort_order);
  const candidateStaff = sortedStaff.filter((staffMember) => {
    if (input.staffSelection !== ANY_AVAILABLE_STAFF_ID && staffMember.id !== input.staffSelection) {
      return false;
    }

    return input.staffServices.some(
      (link) => link.staff_id === staffMember.id && link.service_id === input.service.id,
    );
  });

  const fallbackQuote = {
    totalDurationMinutes:
      input.service.duration_minutes + input.addons.reduce((sum, addon) => sum + addon.duration_minutes, 0),
    totalPriceCents:
      input.service.price_from_cents + input.addons.reduce((sum, addon) => sum + addon.price_cents, 0),
  };

  const slotMap = new Map<string, BookingSlot>();
  let quote = fallbackQuote;

  for (const staffMember of candidateStaff) {
    const staffLink = input.staffServices.find(
      (link) => link.staff_id === staffMember.id && link.service_id === input.service.id,
    );

    if (!staffLink) {
      continue;
    }

    const serviceValues = getDerivedServiceValues(input.service, input.addons, staffLink);
    if (quote === fallbackQuote) {
      quote = serviceValues;
    }

    const workingRows = getApplicableWorkingRows(input.workingHours, staffMember.id, dayOfWeek);
    const relevantBlackouts = input.blackoutDates.filter(
      (blackout) => blackout.staff_id === null || blackout.staff_id === staffMember.id,
    );
    const relevantBookings = input.bookings.filter(
      (booking) => booking.staff_id === staffMember.id && booking.status !== "cancelled",
    );

    for (const row of workingRows) {
      const intervalStart = buildLocalDateTime(input.bookingDate, row.opens_at ?? "00:00", input.timezone);
      const intervalEnd = buildLocalDateTime(input.bookingDate, row.closes_at ?? "00:00", input.timezone);
      const latestStart = intervalEnd.minus({ minutes: serviceValues.totalDurationMinutes });

      for (
        let slotStart = intervalStart;
        slotStart <= latestStart;
        slotStart = slotStart.plus({ minutes: BOOKING_SLOT_INTERVAL_MINUTES })
      ) {
        if (slotStart.toMillis() < nowInTimezone.toMillis()) {
          continue;
        }

        const slotEnd = slotStart.plus({ minutes: serviceValues.totalDurationMinutes });
        const slotStartUtc = slotStart.toUTC();
        const slotEndUtc = slotEnd.toUTC();
        const slotStartMillis = slotStartUtc.toMillis();
        const slotEndMillis = slotEndUtc.toMillis();

        const intersectsBlackout = relevantBlackouts.some((blackout) =>
          overlaps(
            slotStartMillis,
            slotEndMillis,
            DateTime.fromISO(blackout.starts_at, { zone: "utc" }).toMillis(),
            DateTime.fromISO(blackout.ends_at, { zone: "utc" }).toMillis(),
          ),
        );

        if (intersectsBlackout) {
          continue;
        }

        const intersectsBooking = relevantBookings.some((booking) =>
          overlaps(
            slotStartMillis,
            slotEndMillis,
            DateTime.fromISO(booking.starts_at, { zone: "utc" }).toMillis(),
            DateTime.fromISO(booking.ends_at, { zone: "utc" }).toMillis(),
          ),
        );

        if (intersectsBooking) {
          continue;
        }

        const key = slotStartUtc.toISO();
        const endAt = slotEndUtc.toISO();
        if (!key || !endAt) {
          continue;
        }

        const existing = slotMap.get(key);
        if (existing) {
          existing.availableStaffCount += 1;
          continue;
        }

        slotMap.set(key, {
          startAt: key,
          endAt,
          label: formatSlotLabel(key, input.timezone),
          assignedStaffId: staffMember.id,
          assignedStaffName: staffMember.display_name,
          availableStaffCount: 1,
          totalDurationMinutes: serviceValues.totalDurationMinutes,
          totalPriceCents: serviceValues.totalPriceCents,
        });
      }
    }
  }

  return {
    slots: Array.from(slotMap.values()).sort((a, b) => a.startAt.localeCompare(b.startAt)),
    quote,
  };
}
