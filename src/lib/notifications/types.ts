import type { NotificationDeliveryStatus } from "@/types/database";

export type NotificationChannel = "email";
export type NotificationTemplateKey = "booking_confirmation" | "booking_reminder";

export type EmailTemplateRender = {
  subject: string;
  html: string;
  text: string;
};

export type NotificationEmailContact = {
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
};

export type NotificationLineItem = {
  label: string;
  durationMinutes: number;
  priceCents: number;
};

export type BookingNotificationBaseData = {
  bookingId: string;
  salonId: string;
  salonName: string;
  timezone: string;
  currencyCode: string;
  customerName: string;
  customerEmail: string;
  staffName: string | null;
  startsAt: string;
  endsAt: string;
  totalPriceCents: number;
  lines: NotificationLineItem[];
  salonContact: NotificationEmailContact;
};

export type BookingConfirmationEmailData = BookingNotificationBaseData;

export type BookingReminderEmailData = BookingNotificationBaseData & {
  reminderLabel: string;
};

export type EmailSendRequest = {
  to: string;
  subject: string;
  html: string;
  text: string;
  replyTo?: string | null;
};

export type EmailSendResult = {
  success: boolean;
  providerMessageId?: string;
  errorMessage?: string;
};

export type NotificationLogPayload = {
  salonId: string;
  bookingId: string | null;
  customerId?: string | null;
  channel: NotificationChannel;
  recipient: string | null;
  templateKey: NotificationTemplateKey;
  notificationType: string;
  payload: Record<string, unknown>;
};

export type NotificationAttemptResult = {
  status: NotificationDeliveryStatus;
  message?: string;
  logId?: string;
};
