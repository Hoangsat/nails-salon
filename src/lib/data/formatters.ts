import type { WorkingHoursEntry } from "@/types/salon";

const dayLabels = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export function formatCurrency(cents: number, currencyCode = "GBP", locale = "en-GB") {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currencyCode,
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

export function formatPriceFrom(cents: number, currencyCode = "GBP", locale = "en-GB") {
  return `From ${formatCurrency(cents, currencyCode, locale)}`;
}

export function formatAddonPrice(cents: number, currencyCode = "GBP", locale = "en-GB") {
  return formatCurrency(cents, currencyCode, locale);
}

export function formatDuration(minutes: number) {
  return `${minutes} min`;
}

export function formatReviewLabel(rating: number, sourceLabel: string | null) {
  return sourceLabel ? `${rating}-star · ${sourceLabel}` : `${rating}-star review`;
}

export function formatAddress(parts: Array<string | null | undefined>) {
  return parts.filter(Boolean).join(", ");
}

export function getDayLabel(dayOfWeek: number) {
  return dayLabels[dayOfWeek] ?? "Unknown";
}

export function formatWorkingHoursEntry(entry: WorkingHoursEntry) {
  if (entry.isClosed) {
    return `${getDayLabel(entry.dayOfWeek)} · Closed`;
  }

  const open = entry.opensAt?.slice(0, 5) ?? "--:--";
  const close = entry.closesAt?.slice(0, 5) ?? "--:--";

  return `${getDayLabel(entry.dayOfWeek)} · ${open} - ${close}`;
}
