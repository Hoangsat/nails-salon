import { DateTime } from "luxon";

import { sendNotificationEmail } from "@/lib/notifications/email";
import { createNotificationLog, updateNotificationLogStatus } from "@/lib/notifications/logger";
import type {
  EmailTemplateRender,
  NotificationAttemptResult,
  NotificationLogPayload,
} from "@/lib/notifications/types";

export async function sendLoggedEmailNotification({
  logPayload,
  email,
}: {
  logPayload: NotificationLogPayload;
  email: EmailTemplateRender & { to: string; replyTo?: string | null };
}): Promise<NotificationAttemptResult> {
  const log = await createNotificationLog(logPayload);
  const sendResult = await sendNotificationEmail({
    to: email.to,
    subject: email.subject,
    html: email.html,
    text: email.text,
    replyTo: email.replyTo,
  });

  if (sendResult.success) {
    if (log?.id) {
      await updateNotificationLogStatus(log.id, "sent", {
        sentAt: DateTime.utc().toISO(),
        payload: {
          ...logPayload.payload,
          providerMessageId: sendResult.providerMessageId ?? null,
        },
      });
    }

    return {
      status: "sent",
      logId: log?.id,
    };
  }

  if (log?.id) {
    await updateNotificationLogStatus(log.id, "failed", {
      errorMessage: sendResult.errorMessage ?? "Unknown notification error.",
    });
  }

  return {
    status: "failed",
    message: sendResult.errorMessage ?? "Unable to send email notification.",
    logId: log?.id,
  };
}
