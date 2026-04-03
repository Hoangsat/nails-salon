export type EmailProviderConfig = {
  resendApiKey: string;
  fromEmail: string;
  replyToEmail?: string;
};

export function getEmailProviderConfig(): EmailProviderConfig | null {
  const resendApiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL;
  const replyToEmail = process.env.RESEND_REPLY_TO_EMAIL;

  if (!resendApiKey || !fromEmail) {
    return null;
  }

  return {
    resendApiKey,
    fromEmail,
    replyToEmail,
  };
}
