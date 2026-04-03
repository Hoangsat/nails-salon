import { DateTime } from "luxon";

export function getBookingDateInfo(bookingDate: string, timezone: string) {
  const localStart = DateTime.fromISO(bookingDate, { zone: timezone }).startOf("day");

  if (!localStart.isValid) {
    throw new Error("Invalid booking date.");
  }

  return {
    localStart,
    localEnd: localStart.endOf("day"),
    dayOfWeek: localStart.weekday % 7,
  };
}

export function buildLocalDateTime(bookingDate: string, timeValue: string, timezone: string) {
  const normalizedTime = timeValue.slice(0, 5);
  const dateTime = DateTime.fromISO(`${bookingDate}T${normalizedTime}`, {
    zone: timezone,
  });

  if (!dateTime.isValid) {
    throw new Error("Invalid date/time value.");
  }

  return dateTime;
}

export function formatSlotLabel(startsAtIso: string, timezone: string) {
  return DateTime.fromISO(startsAtIso, { zone: "utc" })
    .setZone(timezone)
    .toFormat("HH:mm");
}

export function isPastBookingDate(bookingDate: string, timezone: string) {
  const { localStart } = getBookingDateInfo(bookingDate, timezone);
  return localStart < DateTime.now().setZone(timezone).startOf("day");
}
