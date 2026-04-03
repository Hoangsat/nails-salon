import { DateTime } from "luxon";

import { formatCurrency, formatDuration } from "@/lib/data/formatters";
import type {
  BookingConfirmationEmailData,
  BookingReminderEmailData,
  EmailTemplateRender,
  NotificationLineItem,
} from "@/lib/notifications/types";

function escapeHtml(value: string | null | undefined) {
  return (value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatAppointmentDateTime(startsAt: string, timezone: string) {
  const local = DateTime.fromISO(startsAt, { zone: "utc" }).setZone(timezone);
  return {
    dateLabel: local.toFormat("cccc, dd LLLL yyyy"),
    timeLabel: local.toFormat("HH:mm"),
  };
}

function renderLineItems(lines: NotificationLineItem[], currencyCode: string) {
  return lines
    .map(
      (line) => `
        <tr>
          <td style="padding:12px 0;border-bottom:1px solid #e9e0d8;">
            <div style="font-weight:600;color:#2c1f19;">${escapeHtml(line.label)}</div>
            <div style="font-size:13px;color:#716257;">${formatDuration(line.durationMinutes)}</div>
          </td>
          <td style="padding:12px 0;border-bottom:1px solid #e9e0d8;text-align:right;font-weight:600;color:#2c1f19;">${formatCurrency(line.priceCents, currencyCode)}</td>
        </tr>`,
    )
    .join("");
}

function renderTextLines(lines: NotificationLineItem[], currencyCode: string) {
  return lines
    .map((line) => `- ${line.label} (${formatDuration(line.durationMinutes)}) ${formatCurrency(line.priceCents, currencyCode)}`)
    .join("\n");
}

function buildEmailLayout({
  preheader,
  title,
  intro,
  summaryRows,
  lines,
  footer,
  subject,
  textFooter,
  textLines,
}: {
  preheader: string;
  title: string;
  intro: string;
  summaryRows: Array<{ label: string; value: string }>;
  lines: string;
  footer: string;
  subject: string;
  textFooter: string[];
  textLines: string;
}): EmailTemplateRender {
  const html = `
    <div style="margin:0;padding:24px;background:#f7f1ec;font-family:Arial,Helvetica,sans-serif;color:#2c1f19;">
      <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${escapeHtml(preheader)}</div>
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;margin:0 auto;background:#ffffff;border:1px solid #eadfd6;border-radius:24px;overflow:hidden;">
        <tr>
          <td style="padding:32px;background:linear-gradient(135deg,#fff8f4 0%,#f6e3dd 100%);border-bottom:1px solid #eadfd6;">
            <p style="margin:0 0 8px;font-size:12px;letter-spacing:0.18em;text-transform:uppercase;color:#b26b4f;">Booking email</p>
            <h1 style="margin:0;font-size:30px;line-height:1.2;color:#2c1f19;">${escapeHtml(title)}</h1>
            <p style="margin:16px 0 0;font-size:15px;line-height:1.8;color:#5b4a3f;">${escapeHtml(intro)}</p>
          </td>
        </tr>
        <tr>
          <td style="padding:28px 32px;">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-bottom:24px;">
              ${summaryRows
                .map(
                  (row) => `
                    <tr>
                      <td style="padding:8px 0;font-size:13px;text-transform:uppercase;letter-spacing:0.12em;color:#8b7669;">${escapeHtml(row.label)}</td>
                      <td style="padding:8px 0;text-align:right;font-size:15px;font-weight:600;color:#2c1f19;">${escapeHtml(row.value)}</td>
                    </tr>`,
                )
                .join("")}
            </table>
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">
              ${lines}
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding:24px 32px;background:#fcf7f4;border-top:1px solid #eadfd6;font-size:14px;line-height:1.8;color:#5b4a3f;">
            ${footer}
          </td>
        </tr>
      </table>
    </div>
  `;

  const textSummary = summaryRows.map((row) => `${row.label}: ${row.value}`).join("\n");
  const text = [preheader, "", title, intro, "", textSummary, "", "Services", textLines, "", ...textFooter]
    .filter(Boolean)
    .join("\n");

  return {
    subject,
    html,
    text,
  };
}

export function renderBookingConfirmationEmail(
  data: BookingConfirmationEmailData,
): EmailTemplateRender {
  const { dateLabel, timeLabel } = formatAppointmentDateTime(data.startsAt, data.timezone);
  const summaryRows = [
    { label: "Salon", value: data.salonName },
    { label: "Guest", value: data.customerName },
    { label: "Artist", value: data.staffName ?? "Assigned by studio" },
    { label: "Date", value: dateLabel },
    { label: "Time", value: timeLabel },
    { label: "Total", value: formatCurrency(data.totalPriceCents, data.currencyCode) },
  ];

  const footer = `
    <p style="margin:0 0 12px;">If you need to adjust anything, please contact ${escapeHtml(data.salonName)} directly.</p>
    <p style="margin:0;"><strong>Phone:</strong> ${escapeHtml(data.salonContact.phone ?? "Not listed")}</p>
    <p style="margin:8px 0 0;"><strong>Email:</strong> ${escapeHtml(data.salonContact.email ?? "Not listed")}</p>
    <p style="margin:8px 0 0;"><strong>Address:</strong> ${escapeHtml(data.salonContact.address ?? "Not listed")}</p>
  `;

  return buildEmailLayout({
    preheader: `Your appointment at ${data.salonName} is confirmed for ${dateLabel} at ${timeLabel}.`,
    title: `${data.salonName} booking confirmed`,
    intro: `Hello ${data.customerName}, your appointment is confirmed. We are looking forward to welcoming you to the studio.`,
    summaryRows,
    lines: renderLineItems(data.lines, data.currencyCode),
    footer,
    subject: `${data.salonName}: booking confirmed for ${dateLabel}`,
    textLines: renderTextLines(data.lines, data.currencyCode),
    textFooter: [
      `Phone: ${data.salonContact.phone ?? "Not listed"}`,
      `Email: ${data.salonContact.email ?? "Not listed"}`,
      `Address: ${data.salonContact.address ?? "Not listed"}`,
    ],
  });
}

export function renderBookingReminderEmail(
  data: BookingReminderEmailData,
): EmailTemplateRender {
  const { dateLabel, timeLabel } = formatAppointmentDateTime(data.startsAt, data.timezone);
  const summaryRows = [
    { label: "Salon", value: data.salonName },
    { label: "Guest", value: data.customerName },
    { label: "Artist", value: data.staffName ?? "Assigned by studio" },
    { label: "Date", value: dateLabel },
    { label: "Time", value: timeLabel },
    { label: "Reminder", value: data.reminderLabel },
  ];

  const footer = `
    <p style="margin:0 0 12px;">This reminder template is ready for scheduled sending in a later phase.</p>
    <p style="margin:0;"><strong>Phone:</strong> ${escapeHtml(data.salonContact.phone ?? "Not listed")}</p>
    <p style="margin:8px 0 0;"><strong>Email:</strong> ${escapeHtml(data.salonContact.email ?? "Not listed")}</p>
  `;

  return buildEmailLayout({
    preheader: `Reminder: your ${data.salonName} appointment is on ${dateLabel} at ${timeLabel}.`,
    title: `${data.salonName} appointment reminder`,
    intro: `Hello ${data.customerName}, this is a reminder for your upcoming appointment with us.`,
    summaryRows,
    lines: renderLineItems(data.lines, data.currencyCode),
    footer,
    subject: `${data.salonName}: appointment reminder for ${dateLabel}`,
    textLines: renderTextLines(data.lines, data.currencyCode),
    textFooter: [
      `Phone: ${data.salonContact.phone ?? "Not listed"}`,
      `Email: ${data.salonContact.email ?? "Not listed"}`,
      "Reminder scheduling will be added in a later phase.",
    ],
  });
}
