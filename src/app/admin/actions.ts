"use server";

import { DateTime } from "luxon";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  getAdminAccessDeniedMessage,
  getAdminConfigErrorMessage,
  getAdminLoginRedirect,
  getCurrentAdminUser,
  isAdminUserAllowed,
  isSupabaseAuthConfigured,
  shouldAllowOpenAdminPreview,
} from "@/lib/auth/supabase-auth";
import { resendBookingConfirmationNotificationById } from "@/lib/notifications/booking-notifications";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { DatabaseBookingStatus } from "@/types/database";
import type { StaffServiceLinkInput } from "@/types/admin";

async function requireAdminClient() {
  if (isSupabaseAuthConfigured()) {
    const currentUser = await getCurrentAdminUser();

    if (!currentUser) {
      redirect(getAdminLoginRedirect("/admin"));
    }

    if (!isAdminUserAllowed(currentUser)) {
      redirect(getAdminLoginRedirect("/admin", getAdminAccessDeniedMessage()));
    }
  } else if (!shouldAllowOpenAdminPreview()) {
    redirect(getAdminLoginRedirect("/admin", getAdminConfigErrorMessage()));
  }

  const client = createServerSupabaseClient();

  if (!client) {
    throw new Error("Supabase must be configured for admin mutations.");
  }

  return client;
}

function readString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function readNullableString(formData: FormData, key: string) {
  const value = readString(formData, key);
  return value ? value : null;
}

function readBoolean(formData: FormData, key: string) {
  return formData.get(key) === "on";
}

function readInteger(formData: FormData, key: string, fallback = 0) {
  const raw = readString(formData, key);
  const value = Number.parseInt(raw, 10);
  return Number.isFinite(value) ? value : fallback;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function revalidatePublicAndAdmin() {
  revalidatePath("/");
  revalidatePath("/services");
  revalidatePath("/gallery");
  revalidatePath("/contact");
  revalidatePath("/booking");
  revalidatePath("/booking/success");
  revalidatePath("/admin");
  revalidatePath("/admin/appointments");
  revalidatePath("/admin/calendar");
  revalidatePath("/admin/customers");
  revalidatePath("/admin/services");
  revalidatePath("/admin/staff");
  revalidatePath("/admin/settings");
  revalidatePath("/admin/theme");
  revalidatePath("/admin/notifications");
}

async function resolveSalonTimezone(salonId: string) {
  const client = await requireAdminClient();
  const { data } = await client.from("salons").select("timezone").eq("id", salonId).maybeSingle();
  return (data?.timezone as string | undefined) ?? "Europe/London";
}

export async function updateBookingStatus(formData: FormData) {
  const client = await requireAdminClient();
  const bookingId = readString(formData, "booking_id");
  const status = readString(formData, "status") as DatabaseBookingStatus;

  if (!bookingId || !status) {
    return;
  }

  await client.from("bookings").update({ status }).eq("id", bookingId);
  revalidatePath("/admin");
  revalidatePath("/admin/appointments");
  revalidatePath("/admin/calendar");
}

export async function resendFailedBookingNotification(formData: FormData) {
  await requireAdminClient();
  const notificationId = readString(formData, "notification_id");

  if (!notificationId) {
    redirect("/admin/notifications?resend=error");
  }

  const result = await resendBookingConfirmationNotificationById(notificationId);
  revalidatePath("/admin/notifications");

  if (result.status === "sent") {
    redirect("/admin/notifications?resend=sent");
  }

  redirect("/admin/notifications?resend=error");
}

export async function upsertService(formData: FormData) {
  const client = await requireAdminClient();
  const serviceId = readString(formData, "service_id");
  const salonId = readString(formData, "salon_id");
  const name = readString(formData, "name");

  if (!salonId || !name) {
    return;
  }

  const payload = {
    salon_id: salonId,
    slug: slugify(readString(formData, "slug") || name),
    name,
    category: readString(formData, "category") || "General",
    short_description: readNullableString(formData, "short_description"),
    description: readNullableString(formData, "description"),
    duration_minutes: readInteger(formData, "duration_minutes", 45),
    price_from_cents: readInteger(formData, "price_from_cents", 0),
    is_featured: readBoolean(formData, "is_featured"),
    is_active: readBoolean(formData, "is_active"),
    sort_order: readInteger(formData, "sort_order", 0),
  };

  if (serviceId) {
    await client.from("services").update(payload).eq("id", serviceId);
  } else {
    await client.from("services").insert(payload);
  }

  revalidatePublicAndAdmin();
}

export async function deleteService(formData: FormData) {
  const client = await requireAdminClient();
  const serviceId = readString(formData, "service_id");

  if (!serviceId) {
    return;
  }

  await client.from("services").delete().eq("id", serviceId);
  revalidatePublicAndAdmin();
}

export async function upsertServiceAddon(formData: FormData) {
  const client = await requireAdminClient();
  const addonId = readString(formData, "addon_id");
  const salonId = readString(formData, "salon_id");
  const serviceId = readString(formData, "service_id");
  const name = readString(formData, "name");

  if (!salonId || !serviceId || !name) {
    return;
  }

  const payload = {
    salon_id: salonId,
    service_id: serviceId,
    name,
    description: readNullableString(formData, "description"),
    duration_minutes: readInteger(formData, "duration_minutes", 0),
    price_cents: readInteger(formData, "price_cents", 0),
    is_active: readBoolean(formData, "is_active"),
    sort_order: readInteger(formData, "sort_order", 0),
  };

  if (addonId) {
    await client.from("service_addons").update(payload).eq("id", addonId);
  } else {
    await client.from("service_addons").insert(payload);
  }

  revalidatePublicAndAdmin();
}

export async function deleteServiceAddon(formData: FormData) {
  const client = await requireAdminClient();
  const addonId = readString(formData, "addon_id");

  if (!addonId) {
    return;
  }

  await client.from("service_addons").delete().eq("id", addonId);
  revalidatePublicAndAdmin();
}

function readStaffAssignments(formData: FormData): StaffServiceLinkInput[] {
  const rawServiceIds = readString(formData, "service_ids");
  const serviceIds = rawServiceIds.split(",").map((value) => value.trim()).filter(Boolean);

  return serviceIds
    .filter((serviceId) => readBoolean(formData, `assign_${serviceId}`))
    .map((serviceId) => ({
      service_id: serviceId,
      custom_duration_minutes: readString(formData, `duration_${serviceId}`)
        ? readInteger(formData, `duration_${serviceId}`)
        : null,
      custom_price_cents: readString(formData, `price_${serviceId}`)
        ? readInteger(formData, `price_${serviceId}`)
        : null,
    }));
}

export async function upsertStaff(formData: FormData) {
  const client = await requireAdminClient();
  const staffId = readString(formData, "staff_id");
  const salonId = readString(formData, "salon_id");
  const firstName = readString(formData, "first_name");
  const lastName = readString(formData, "last_name");

  if (!salonId || !firstName || !lastName) {
    return;
  }

  const displayName = readString(formData, "display_name") || `${firstName} ${lastName}`.trim();
  const payload = {
    salon_id: salonId,
    first_name: firstName,
    last_name: lastName,
    display_name: displayName,
    role: readString(formData, "role") || "Nail Artist",
    bio: readNullableString(formData, "bio"),
    profile_image_url: readNullableString(formData, "profile_image_url"),
    email: readNullableString(formData, "email"),
    phone: readNullableString(formData, "phone"),
    instagram_handle: readNullableString(formData, "instagram_handle"),
    is_featured: readBoolean(formData, "is_featured"),
    is_active: readBoolean(formData, "is_active"),
    sort_order: readInteger(formData, "sort_order", 0),
  };

  let resolvedStaffId = staffId;

  if (staffId) {
    await client.from("staff").update(payload).eq("id", staffId);
  } else {
    const { data } = await client.from("staff").insert(payload).select("id").maybeSingle();
    resolvedStaffId = (data?.id as string | undefined) ?? "";
  }

  if (resolvedStaffId) {
    const assignments = readStaffAssignments(formData);
    await client.from("staff_services").delete().eq("staff_id", resolvedStaffId);

    if (assignments.length) {
      await client.from("staff_services").insert(
        assignments.map((assignment) => ({
          salon_id: salonId,
          staff_id: resolvedStaffId,
          service_id: assignment.service_id,
          custom_duration_minutes: assignment.custom_duration_minutes,
          custom_price_cents: assignment.custom_price_cents,
        })),
      );
    }
  }

  revalidatePublicAndAdmin();
}

export async function deleteStaff(formData: FormData) {
  const client = await requireAdminClient();
  const staffId = readString(formData, "staff_id");

  if (!staffId) {
    return;
  }

  await client.from("staff").delete().eq("id", staffId);
  revalidatePublicAndAdmin();
}

export async function updateSalonSettings(formData: FormData) {
  const client = await requireAdminClient();
  const salonId = readString(formData, "salon_id");

  if (!salonId) {
    return;
  }

  await client
    .from("salons")
    .update({
      name: readString(formData, "name") || "Salon",
      tagline: readNullableString(formData, "tagline"),
      description: readNullableString(formData, "description"),
      phone: readNullableString(formData, "phone"),
      email: readNullableString(formData, "email"),
      address_line_1: readNullableString(formData, "address_line_1"),
      address_line_2: readNullableString(formData, "address_line_2"),
      city: readNullableString(formData, "city"),
      region: readNullableString(formData, "region"),
      postal_code: readNullableString(formData, "postal_code"),
      country_code: readString(formData, "country_code") || "GB",
      website_url: readNullableString(formData, "website_url"),
      facebook_url: readNullableString(formData, "facebook_url"),
      instagram_url: readNullableString(formData, "instagram_url"),
      booking_notice: readNullableString(formData, "booking_notice"),
      timezone: readString(formData, "timezone") || "Europe/London",
      currency_code: readString(formData, "currency_code") || "GBP",
    })
    .eq("id", salonId);

  revalidatePublicAndAdmin();
}

export async function upsertWorkingHours(formData: FormData) {
  const client = await requireAdminClient();
  const rowId = readString(formData, "working_hours_id");
  const salonId = readString(formData, "salon_id");
  const staffId = readNullableString(formData, "staff_id");
  const isClosed = readBoolean(formData, "is_closed");

  if (!salonId) {
    return;
  }

  const payload = {
    salon_id: salonId,
    staff_id: staffId,
    day_of_week: readInteger(formData, "day_of_week", 0),
    opens_at: isClosed ? null : readString(formData, "opens_at") || null,
    closes_at: isClosed ? null : readString(formData, "closes_at") || null,
    is_closed: isClosed,
    sort_order: readInteger(formData, "sort_order", 0),
  };

  if (rowId) {
    await client.from("working_hours").update(payload).eq("id", rowId);
  } else {
    await client.from("working_hours").insert(payload);
  }

  revalidatePublicAndAdmin();
}

export async function deleteWorkingHours(formData: FormData) {
  const client = await requireAdminClient();
  const rowId = readString(formData, "working_hours_id");

  if (!rowId) {
    return;
  }

  await client.from("working_hours").delete().eq("id", rowId);
  revalidatePublicAndAdmin();
}

export async function upsertBlackoutDate(formData: FormData) {
  const client = await requireAdminClient();
  const blackoutId = readString(formData, "blackout_id");
  const salonId = readString(formData, "salon_id");

  if (!salonId) {
    return;
  }

  const timezone = await resolveSalonTimezone(salonId);
  const startsAtLocal = readString(formData, "starts_at_local");
  const endsAtLocal = readString(formData, "ends_at_local");

  if (!startsAtLocal || !endsAtLocal) {
    return;
  }

  const payload = {
    salon_id: salonId,
    staff_id: readNullableString(formData, "staff_id"),
    starts_at: DateTime.fromISO(startsAtLocal, { zone: timezone }).toUTC().toISO(),
    ends_at: DateTime.fromISO(endsAtLocal, { zone: timezone }).toUTC().toISO(),
    reason: readNullableString(formData, "reason"),
  };

  if (blackoutId) {
    await client.from("blackout_dates").update(payload).eq("id", blackoutId);
  } else {
    await client.from("blackout_dates").insert(payload);
  }

  revalidatePublicAndAdmin();
}

export async function deleteBlackoutDate(formData: FormData) {
  const client = await requireAdminClient();
  const blackoutId = readString(formData, "blackout_id");

  if (!blackoutId) {
    return;
  }

  await client.from("blackout_dates").delete().eq("id", blackoutId);
  revalidatePublicAndAdmin();
}

export async function updateThemeSettings(formData: FormData) {
  const client = await requireAdminClient();
  const themeId = readString(formData, "theme_id");
  const salonId = readString(formData, "salon_id");

  if (!salonId) {
    return;
  }

  const payload = {
    salon_id: salonId,
    brand_name: readString(formData, "brand_name") || "Salon",
    primary_color: readString(formData, "primary_color") || "15 73% 56%",
    secondary_color: readString(formData, "secondary_color") || "28 44% 92%",
    accent_color: readString(formData, "accent_color") || "349 47% 84%",
    background_color: readString(formData, "background_color") || "32 45% 98%",
    foreground_color: readString(formData, "foreground_color") || "18 28% 17%",
    heading_font: readString(formData, "heading_font") || "cormorant-garamond",
    body_font: readString(formData, "body_font") || "manrope",
    button_style: readString(formData, "button_style") || "pill",
    border_radius: readString(formData, "border_radius") || "1.4rem",
    hero_image_url: readNullableString(formData, "hero_image_url"),
    hero_image_alt: readNullableString(formData, "hero_image_alt"),
  };

  if (themeId) {
    await client.from("salon_theme_settings").update(payload).eq("id", themeId);
  } else {
    await client.from("salon_theme_settings").upsert(payload, { onConflict: "salon_id" });
  }

  revalidatePublicAndAdmin();
}




