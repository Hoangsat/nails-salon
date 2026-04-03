import { sendWithResend } from "@/lib/notifications/providers/resend";
import type { EmailSendRequest, EmailSendResult } from "@/lib/notifications/types";

export async function sendNotificationEmail(request: EmailSendRequest): Promise<EmailSendResult> {
  return sendWithResend(request);
}
