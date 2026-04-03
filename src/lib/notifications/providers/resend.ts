import { Resend } from "resend";

import { getEmailProviderConfig } from "@/lib/notifications/config";
import type { EmailSendRequest, EmailSendResult } from "@/lib/notifications/types";

export async function sendWithResend(request: EmailSendRequest): Promise<EmailSendResult> {
  const config = getEmailProviderConfig();

  if (!config) {
    return {
      success: false,
      errorMessage: "Email provider is not configured.",
    };
  }

  try {
    const resend = new Resend(config.resendApiKey);
    const response = await resend.emails.send({
      from: config.fromEmail,
      to: request.to,
      subject: request.subject,
      html: request.html,
      text: request.text,
      replyTo: request.replyTo ?? config.replyToEmail,
    });

    if (response.error) {
      return {
        success: false,
        errorMessage: response.error.message,
      };
    }

    return {
      success: true,
      providerMessageId: response.data?.id,
    };
  } catch (error) {
    return {
      success: false,
      errorMessage: error instanceof Error ? error.message : "Unknown email provider error.",
    };
  }
}
