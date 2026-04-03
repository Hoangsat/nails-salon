import { formatAddress } from "@/lib/data/formatters";
import { sendLoggedEmailNotification } from "@/lib/notifications/service";
import { renderBookingConfirmationEmail, renderBookingReminderEmail } from "@/lib/notifications/templates";
import type {
  BookingConfirmationEmailData,
  BookingReminderEmailData,
  NotificationAttemptResult,
} from "@/lib/notifications/types";

export type BookingNotificationContextInput = {
  bookingId: string;
  salon: {
    id: string;
    name: string;
    timezone: string;
    currencyCode: string;
    phone: string | null;
    email: string | null;
    addressLine1: string | null;
    addressLine2: string | null;
    city: string | null;
    region: string | null;
    postalCode: string | null;
  };
  customerId?: string | null;
  customerName: string;
  customerEmail: string;
  staffName: string | null;
  startsAt: string;
  endsAt: string;
  totalPriceCents: number;
  lines: Array<{
    label: string;
    durationMinutes: number;
    priceCents: number;
  }>;
};

export function createBookingNotificationContext(
  input: BookingNotificationContextInput,
): BookingConfirmationEmailData {
  return {
    bookingId: input.bookingId,
    salonId: input.salon.id,
    salonName: input.salon.name,
    timezone: input.salon.timezone,
    currencyCode: input.salon.currencyCode,
    customerName: input.customerName,
    customerEmail: input.customerEmail,
    staffName: input.staffName,
    startsAt: input.startsAt,
    endsAt: input.endsAt,
    totalPriceCents: input.totalPriceCents,
    lines: input.lines,
    salonContact: {
      name: input.salon.name,
      email: input.salon.email,
      phone: input.salon.phone,
      address: formatAddress([
        input.salon.addressLine1,
        input.salon.addressLine2,
        input.salon.city,
        input.salon.region,
        input.salon.postalCode,
      ]),
    },
  };
}

export function createBookingReminderTemplateData(
  data: BookingConfirmationEmailData,
  reminderLabel = "24 hours before your appointment",
): BookingReminderEmailData {
  return {
    ...data,
    reminderLabel,
  };
}

export async function sendBookingConfirmationNotification({
  data,
  customerId,
}: {
  data: BookingConfirmationEmailData;
  customerId?: string | null;
}): Promise<NotificationAttemptResult> {
  const rendered = renderBookingConfirmationEmail(data);

  return sendLoggedEmailNotification({
    logPayload: {
      salonId: data.salonId,
      bookingId: data.bookingId,
      customerId: customerId ?? null,
      channel: "email",
      recipient: data.customerEmail,
      templateKey: "booking_confirmation",
      notificationType: "booking_confirmation",
      payload: {
        bookingId: data.bookingId,
        templateKey: "booking_confirmation",
        startsAt: data.startsAt,
        salonName: data.salonName,
        customerName: data.customerName,
      },
    },
    email: {
      to: data.customerEmail,
      subject: rendered.subject,
      html: rendered.html,
      text: rendered.text,
      replyTo: data.salonContact.email,
    },
  });
}

export function renderBookingReminderTemplate(data: BookingReminderEmailData) {
  return renderBookingReminderEmail(data);
}
