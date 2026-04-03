import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { NotificationsLogRow, NotificationDeliveryStatus } from "@/types/database";
import type { NotificationLogPayload } from "@/lib/notifications/types";

function getNotificationsClient() {
  return createServerSupabaseClient();
}

export async function createNotificationLog(
  input: NotificationLogPayload,
): Promise<NotificationsLogRow | null> {
  const client = getNotificationsClient();

  if (!client) {
    return null;
  }

  const { data } = await client
    .from("notifications_log")
    .insert({
      salon_id: input.salonId,
      booking_id: input.bookingId,
      customer_id: input.customerId ?? null,
      channel: input.channel,
      notification_type: input.notificationType,
      template_key: input.templateKey,
      recipient: input.recipient,
      status: "pending",
      payload: input.payload,
    })
    .select("*")
    .maybeSingle();

  return (data as NotificationsLogRow | null) ?? null;
}

export async function updateNotificationLogStatus(
  notificationId: string,
  status: NotificationDeliveryStatus,
  options?: {
    sentAt?: string | null;
    errorMessage?: string | null;
    payload?: Record<string, unknown>;
  },
) {
  const client = getNotificationsClient();

  if (!client || !notificationId) {
    return;
  }

  const payload: {
    status: NotificationDeliveryStatus;
    sent_at?: string | null;
    error_message?: string | null;
    payload?: Record<string, unknown>;
  } = {
    status,
  };

  if (options && "sentAt" in options) {
    payload.sent_at = options.sentAt ?? null;
  }

  if (options && "errorMessage" in options) {
    payload.error_message = options.errorMessage ?? null;
  }

  if (options?.payload) {
    payload.payload = options.payload;
  }

  await client.from("notifications_log").update(payload).eq("id", notificationId);
}
