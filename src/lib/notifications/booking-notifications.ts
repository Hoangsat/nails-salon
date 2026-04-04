import { formatAddress } from "@/lib/data/formatters";
import { sendLoggedEmailNotification } from "@/lib/notifications/service";
import { renderBookingConfirmationEmail, renderBookingReminderEmail } from "@/lib/notifications/templates";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type {
  BookingConfirmationEmailData,
  BookingReminderEmailData,
  NotificationAttemptResult,
} from "@/lib/notifications/types";
import type { BookingServicesRow, BookingsRow, NotificationsLogRow } from "@/types/database";

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

export async function resendBookingConfirmationNotificationById(
  notificationId: string,
): Promise<NotificationAttemptResult> {
  const client = createServerSupabaseClient();

  if (!client || !notificationId) {
    return {
      status: "failed",
      message: "Supabase is not configured for notification resend.",
    };
  }

  const { data: notificationData, error: notificationError } = await client
    .from("notifications_log")
    .select("*")
    .eq("id", notificationId)
    .maybeSingle();

  if (notificationError || !notificationData) {
    return {
      status: "failed",
      message: "Notification log entry could not be loaded.",
    };
  }

  const notification = notificationData as NotificationsLogRow;

  if (notification.channel !== "email" || notification.template_key !== "booking_confirmation") {
    return {
      status: "failed",
      message: "Only booking confirmation emails can be resent from this view.",
    };
  }

  if (!notification.booking_id) {
    return {
      status: "failed",
      message: "This notification is not linked to a booking.",
    };
  }

  const [bookingResult, salonResult, linesResult] = await Promise.all([
    client.from("bookings").select("*").eq("id", notification.booking_id).maybeSingle(),
    client.from("salons").select("*").eq("id", notification.salon_id).maybeSingle(),
    client
      .from("booking_services")
      .select("*")
      .eq("booking_id", notification.booking_id)
      .order("sort_order", { ascending: true }),
  ]);

  const booking = bookingResult.data as BookingsRow | null;

  if (bookingResult.error || !booking) {
    return {
      status: "failed",
      message: "Booking details could not be loaded for resend.",
    };
  }

  const salon = salonResult.data;
  if (salonResult.error || !salon) {
    return {
      status: "failed",
      message: "Salon details could not be loaded for resend.",
    };
  }

  if (linesResult.error || !linesResult.data?.length) {
    return {
      status: "failed",
      message: "Booking line items could not be loaded for resend.",
    };
  }

  const staffName = booking.staff_id
    ? ((await client.from("staff").select("display_name").eq("id", booking.staff_id).maybeSingle()).data
        ?.display_name as string | undefined) ?? null
    : null;

  const recipient = booking.customer_email_snapshot ?? notification.recipient;
  if (!recipient) {
    return {
      status: "failed",
      message: "This booking does not have an email recipient.",
    };
  }

  const context = createBookingNotificationContext({
    bookingId: booking.id,
    salon: {
      id: salon.id as string,
      name: salon.name as string,
      timezone: salon.timezone as string,
      currencyCode: salon.currency_code as string,
      phone: (salon.phone as string | null | undefined) ?? null,
      email: (salon.email as string | null | undefined) ?? null,
      addressLine1: (salon.address_line_1 as string | null | undefined) ?? null,
      addressLine2: (salon.address_line_2 as string | null | undefined) ?? null,
      city: (salon.city as string | null | undefined) ?? null,
      region: (salon.region as string | null | undefined) ?? null,
      postalCode: (salon.postal_code as string | null | undefined) ?? null,
    },
    customerId: booking.customer_id,
    customerName: booking.customer_name_snapshot,
    customerEmail: recipient,
    staffName,
    startsAt: booking.starts_at,
    endsAt: booking.ends_at,
    totalPriceCents: booking.total_price_cents,
    lines: (linesResult.data as BookingServicesRow[]).map((line) => ({
      label: line.line_label,
      durationMinutes: line.duration_minutes,
      priceCents: line.price_cents,
    })),
  });

  return sendBookingConfirmationNotification({
    data: context,
    customerId: booking.customer_id,
  });
}

export function renderBookingReminderTemplate(data: BookingReminderEmailData) {
  return renderBookingReminderEmail(data);
}
