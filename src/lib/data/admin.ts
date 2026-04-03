import { DateTime } from "luxon";
import { unstable_noStore as noStore } from "next/cache";

import { demoSalonDataset, demoSalonProfile, demoThemeSettings } from "@/lib/data/demo";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type {
  BlackoutDatesRow,
  BookingServicesRow,
  BookingsRow,
  CustomersRow,
  NotificationsLogRow,
  SalonThemeSettingsRow,
  SalonsRow,
  ServiceAddonsRow,
  ServicesRow,
  StaffRow,
  StaffServicesRow,
  WorkingHoursRow,
} from "@/types/database";
import type {
  AdminAppointmentDetail,
  AdminAppointmentListItem,
  AdminAppointmentsPageData,
  AdminCalendarColumn,
  AdminCalendarData,
  AdminContext,
  AdminCustomerListItem,
  AdminCustomersData,
  AdminDashboardData,
  AdminNotificationsData,
  AdminReferenceData,
  AdminServiceRecord,
  AdminServicesData,
  AdminSettingsData,
  AdminStaffData,
  AdminStaffRecord,
  AdminThemeData,
} from "@/types/admin";

function demoSalonRow(): SalonsRow {
  return {
    id: demoSalonProfile.id,
    slug: demoSalonProfile.slug,
    name: demoSalonProfile.name,
    tagline: demoSalonProfile.tagline,
    description: demoSalonProfile.description,
    phone: demoSalonProfile.phone,
    email: demoSalonProfile.email,
    address_line_1: demoSalonProfile.addressLine1,
    address_line_2: demoSalonProfile.addressLine2,
    city: demoSalonProfile.city,
    region: demoSalonProfile.region,
    postal_code: demoSalonProfile.postalCode,
    country_code: demoSalonProfile.countryCode,
    timezone: demoSalonProfile.timezone,
    currency_code: demoSalonProfile.currencyCode,
    website_url: demoSalonProfile.websiteUrl,
    instagram_url: demoSalonProfile.instagramUrl,
    booking_notice: demoSalonProfile.bookingNotice,
    is_active: demoSalonProfile.isActive,
    created_at: demoSalonProfile.createdAt,
    updated_at: demoSalonProfile.updatedAt,
  };
}

function demoThemeRow(): SalonThemeSettingsRow {
  return {
    id: demoThemeSettings.id,
    salon_id: demoThemeSettings.salonId,
    brand_name: demoThemeSettings.brandName,
    primary_color: demoThemeSettings.primaryColor,
    secondary_color: demoThemeSettings.secondaryColor,
    accent_color: demoThemeSettings.accentColor,
    background_color: demoThemeSettings.backgroundColor,
    foreground_color: demoThemeSettings.foregroundColor,
    heading_font: demoThemeSettings.headingFont,
    body_font: demoThemeSettings.bodyFont,
    button_style: demoThemeSettings.buttonStyle,
    border_radius: demoThemeSettings.borderRadius,
    hero_image_url: demoThemeSettings.heroImageUrl,
    hero_image_alt: demoThemeSettings.heroImageAlt,
    created_at: demoThemeSettings.createdAt,
    updated_at: demoThemeSettings.updatedAt,
  };
}

function demoStaffRows(): StaffRow[] {
  return demoSalonDataset.staff.map((staff) => ({
    id: staff.id,
    salon_id: staff.salonId,
    first_name: staff.firstName,
    last_name: staff.lastName,
    display_name: staff.displayName,
    role: staff.role,
    bio: staff.bio,
    profile_image_url: staff.profileImageUrl,
    email: staff.email,
    phone: staff.phone,
    instagram_handle: staff.instagramHandle,
    is_featured: staff.isFeatured,
    is_active: staff.isActive,
    sort_order: staff.sortOrder,
    created_at: staff.createdAt,
    updated_at: staff.updatedAt,
  }));
}

function demoServiceRows(): ServicesRow[] {
  return demoSalonDataset.services.map((service) => ({
    id: service.id,
    salon_id: service.salonId,
    slug: service.slug,
    name: service.name,
    category: service.category,
    short_description: service.shortDescription,
    description: service.description,
    duration_minutes: service.durationMinutes,
    price_from_cents: service.priceFromCents,
    is_featured: service.isFeatured,
    is_active: service.isActive,
    sort_order: service.sortOrder,
    created_at: service.createdAt,
    updated_at: service.updatedAt,
  }));
}

function demoAddonRows(): ServiceAddonsRow[] {
  return demoSalonDataset.services.flatMap((service) =>
    service.addons.map((addon) => ({
      id: addon.id,
      salon_id: addon.salonId,
      service_id: addon.serviceId,
      name: addon.name,
      description: addon.description,
      duration_minutes: addon.durationMinutes,
      price_cents: addon.priceCents,
      is_active: addon.isActive,
      sort_order: addon.sortOrder,
      created_at: addon.createdAt,
      updated_at: addon.updatedAt,
    })),
  );
}

function demoStaffServiceRows(): StaffServicesRow[] {
  const services = demoSalonDataset.services;
  return services.flatMap((service) =>
    service.staffIds.map((staffId) => ({
      salon_id: service.salonId,
      staff_id: staffId,
      service_id: service.id,
      custom_duration_minutes: null,
      custom_price_cents: null,
      created_at: service.createdAt,
    })),
  );
}

function demoWorkingHourRows(): WorkingHoursRow[] {
  return demoSalonDataset.workingHours.map((entry) => ({
    id: entry.id,
    salon_id: entry.salonId,
    staff_id: entry.staffId,
    day_of_week: entry.dayOfWeek,
    opens_at: entry.opensAt,
    closes_at: entry.closesAt,
    is_closed: entry.isClosed,
    sort_order: entry.sortOrder,
    created_at: entry.createdAt,
    updated_at: entry.updatedAt,
  }));
}

function demoBlackoutRows(): BlackoutDatesRow[] {
  return demoSalonDataset.blackoutDates.map((entry) => ({
    id: entry.id,
    salon_id: entry.salonId,
    staff_id: entry.staffId,
    starts_at: entry.startsAt,
    ends_at: entry.endsAt,
    reason: entry.reason,
    created_at: entry.createdAt,
  }));
}

function demoCustomerRows(): CustomersRow[] {
  return demoSalonDataset.customers.map((customer) => ({
    id: customer.id,
    salon_id: customer.salonId,
    first_name: customer.firstName,
    last_name: customer.lastName,
    email: customer.email,
    phone: customer.phone,
    notes: customer.notes,
    marketing_opt_in: customer.marketingOptIn,
    created_at: customer.createdAt,
    updated_at: customer.updatedAt,
  }));
}

function demoBookingRows(): BookingsRow[] {
  return demoSalonDataset.bookings.map((booking) => ({
    id: booking.id,
    salon_id: booking.salonId,
    customer_id: booking.customerId,
    staff_id: booking.staffId,
    booking_date: booking.bookingDate,
    starts_at: booking.startsAt,
    ends_at: booking.endsAt,
    status: booking.status,
    customer_name_snapshot: booking.customerNameSnapshot,
    customer_email_snapshot: booking.customerEmailSnapshot,
    customer_phone_snapshot: booking.customerPhoneSnapshot,
    notes: booking.notes,
    internal_notes: booking.internalNotes,
    total_price_cents: booking.totalPriceCents,
    created_at: booking.createdAt,
    updated_at: booking.updatedAt,
  }));
}

function demoBookingServiceRows(): BookingServicesRow[] {
  return demoSalonDataset.bookingServices.map((line) => ({
    id: line.id,
    booking_id: line.bookingId,
    staff_id: line.staffId,
    service_id: line.serviceId,
    service_addon_id: line.serviceAddonId,
    line_label: line.lineLabel,
    duration_minutes: line.durationMinutes,
    price_cents: line.priceCents,
    sort_order: line.sortOrder,
    created_at: line.createdAt,
  }));
}

function demoNotificationRows(): NotificationsLogRow[] {
  return demoSalonDataset.notifications.map((notification) => ({
    id: notification.id,
    salon_id: notification.salonId,
    booking_id: notification.bookingId,
    customer_id: notification.customerId,
    channel: notification.channel,
    notification_type: notification.notificationType,
    template_key: notification.templateKey,
    recipient: notification.recipient,
    status: notification.status,
    payload: notification.payload,
    sent_at: notification.sentAt,
    error_message: notification.errorMessage,
    created_at: notification.createdAt,
  }));
}

async function resolveAdminContext(): Promise<{ client: ReturnType<typeof createServerSupabaseClient>; context: AdminContext }> {
  noStore();
  const client = createServerSupabaseClient();
  const fallbackSalon = demoSalonRow();

  if (!client) {
    return {
      client,
      context: {
        salon: fallbackSalon,
        isDemoMode: true,
      },
    };
  }

  const preferredSalon = await client
    .from("salons")
    .select("*")
    .eq("slug", demoSalonProfile.slug)
    .eq("is_active", true)
    .maybeSingle();

  if (preferredSalon.data) {
    return {
      client,
      context: {
        salon: preferredSalon.data as SalonsRow,
        isDemoMode: false,
      },
    };
  }

  const fallbackQuery = await client
    .from("salons")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  return {
    client,
    context: {
      salon: (fallbackQuery.data as SalonsRow | null) ?? fallbackSalon,
      isDemoMode: !fallbackQuery.data,
    },
  };
}

function buildAppointmentListItems(
  bookings: BookingsRow[],
  staff: StaffRow[],
  customers: CustomersRow[],
): AdminAppointmentListItem[] {
  const staffMap = new Map(staff.map((member) => [member.id, member.display_name]));
  const customerMap = new Map(customers.map((customer) => [customer.id, customer]));

  return bookings.map((booking) => {
    const customer = booking.customer_id ? customerMap.get(booking.customer_id) ?? null : null;

    return {
      booking,
      customerName: customer
        ? `${customer.first_name} ${customer.last_name}`.trim()
        : booking.customer_name_snapshot,
      customerEmail: customer?.email ?? booking.customer_email_snapshot,
      customerPhone: customer?.phone ?? booking.customer_phone_snapshot,
      staffName: booking.staff_id ? staffMap.get(booking.staff_id) ?? null : null,
    };
  });
}

async function getReadDataset() {
  const { client, context } = await resolveAdminContext();

  if (!client || context.isDemoMode) {
    return {
      context,
      salon: context.salon,
      themeSettings: demoThemeRow(),
      staff: demoStaffRows(),
      services: demoServiceRows(),
      addons: demoAddonRows(),
      staffServices: demoStaffServiceRows(),
      workingHours: demoWorkingHourRows(),
      blackoutDates: demoBlackoutRows(),
      customers: demoCustomerRows(),
      bookings: demoBookingRows(),
      bookingServices: demoBookingServiceRows(),
      notifications: demoNotificationRows(),
    };
  }

  const salonId = context.salon.id;
  const [themeResult, staffResult, servicesResult, addonsResult, staffServicesResult, workingHoursResult, blackoutResult, customersResult, bookingsResult, bookingServicesResult, notificationsResult] = await Promise.all([
    client.from("salon_theme_settings").select("*").eq("salon_id", salonId).maybeSingle(),
    client.from("staff").select("*").eq("salon_id", salonId).order("sort_order", { ascending: true }),
    client.from("services").select("*").eq("salon_id", salonId).order("sort_order", { ascending: true }),
    client.from("service_addons").select("*").eq("salon_id", salonId).order("sort_order", { ascending: true }),
    client.from("staff_services").select("*").eq("salon_id", salonId),
    client.from("working_hours").select("*").eq("salon_id", salonId).order("sort_order", { ascending: true }),
    client.from("blackout_dates").select("*").eq("salon_id", salonId).order("starts_at", { ascending: true }),
    client.from("customers").select("*").eq("salon_id", salonId).order("created_at", { ascending: false }),
    client.from("bookings").select("*").eq("salon_id", salonId).order("starts_at", { ascending: false }),
    client.from("booking_services").select("*").order("sort_order", { ascending: true }),
    client.from("notifications_log").select("*").eq("salon_id", salonId).order("created_at", { ascending: false }),
  ]);

  return {
    context,
    salon: context.salon,
    themeSettings: (themeResult.data as SalonThemeSettingsRow | null) ?? demoThemeRow(),
    staff: (staffResult.data as StaffRow[] | null) ?? [],
    services: (servicesResult.data as ServicesRow[] | null) ?? [],
    addons: (addonsResult.data as ServiceAddonsRow[] | null) ?? [],
    staffServices: (staffServicesResult.data as StaffServicesRow[] | null) ?? [],
    workingHours: (workingHoursResult.data as WorkingHoursRow[] | null) ?? [],
    blackoutDates: (blackoutResult.data as BlackoutDatesRow[] | null) ?? [],
    customers: (customersResult.data as CustomersRow[] | null) ?? [],
    bookings: (bookingsResult.data as BookingsRow[] | null) ?? [],
    bookingServices: (bookingServicesResult.data as BookingServicesRow[] | null) ?? [],
    notifications: (notificationsResult.data as NotificationsLogRow[] | null) ?? [],
  };
}

export async function getAdminReferenceData(): Promise<AdminReferenceData> {
  const dataset = await getReadDataset();
  return {
    context: dataset.context,
    services: dataset.services,
    staff: dataset.staff,
    workingHours: dataset.workingHours,
    blackoutDates: dataset.blackoutDates,
    themeSettings: dataset.themeSettings,
  };
}

export async function getAdminDashboardData(): Promise<AdminDashboardData> {
  const dataset = await getReadDataset();
  const todayDate = DateTime.now().setZone(dataset.salon.timezone).toISODate() ?? "";
  const appointments = buildAppointmentListItems(dataset.bookings, dataset.staff, dataset.customers);

  return {
    context: dataset.context,
    todayDate,
    metrics: {
      appointmentsToday: dataset.bookings.filter((booking) => booking.booking_date === todayDate).length,
      upcomingAppointments: dataset.bookings.filter((booking) => booking.booking_date >= todayDate).length,
      activeServicesCount: dataset.services.filter((service) => service.is_active).length,
      activeStaffCount: dataset.staff.filter((member) => member.is_active).length,
    },
    recentBookings: appointments.slice(0, 6),
  };
}

export async function getAdminAppointmentsData(options?: {
  date?: string;
  status?: string;
  selectedBookingId?: string;
}): Promise<AdminAppointmentsPageData> {
  const dataset = await getReadDataset();
  const dateFilter = options?.date ?? "";
  const statusFilter = options?.status ?? "all";

  const filteredBookings = dataset.bookings.filter((booking) => {
    if (dateFilter && booking.booking_date !== dateFilter) {
      return false;
    }

    if (statusFilter !== "all" && booking.status !== statusFilter) {
      return false;
    }

    return true;
  });

  const appointments = buildAppointmentListItems(filteredBookings, dataset.staff, dataset.customers);
  const selectedBookingId = options?.selectedBookingId ?? appointments[0]?.booking.id ?? "";
  const selectedBase = appointments.find((item) => item.booking.id === selectedBookingId) ?? null;
  const selectedDetail: AdminAppointmentDetail | null = selectedBase
    ? {
        ...selectedBase,
        customer: selectedBase.booking.customer_id
          ? dataset.customers.find((customer) => customer.id === selectedBase.booking.customer_id) ?? null
          : null,
        lines: dataset.bookingServices.filter((line) => line.booking_id === selectedBase.booking.id),
      }
    : null;

  return {
    context: dataset.context,
    dateFilter,
    statusFilter,
    appointments,
    selectedAppointment: selectedDetail,
  };
}

export async function getAdminCalendarData(date?: string): Promise<AdminCalendarData> {
  const dataset = await getReadDataset();
  const targetDate = date ?? DateTime.now().setZone(dataset.salon.timezone).toISODate() ?? "";
  const dayBookings = dataset.bookings.filter((booking) => booking.booking_date === targetDate);
  const appointmentLookup = buildAppointmentListItems(dayBookings, dataset.staff, dataset.customers);
  const events = appointmentLookup.map((item) => ({
    bookingId: item.booking.id,
    customerName: item.customerName,
    status: item.booking.status,
    startsAt: item.booking.starts_at,
    endsAt: item.booking.ends_at,
    totalPriceCents: item.booking.total_price_cents,
    staffId: item.booking.staff_id,
    staffName: item.staffName,
  }));

  const columns: AdminCalendarColumn[] = dataset.staff
    .filter((member) => member.is_active)
    .map((member) => ({
      staffId: member.id,
      staffName: member.display_name,
      role: member.role,
      events: events.filter((event) => event.staffId === member.id),
    }));

  const hourRows = dataset.workingHours.filter((entry) => entry.staff_id === null && !entry.is_closed);
  const startHour = hourRows.length
    ? Math.min(...hourRows.map((entry) => Number(entry.opens_at?.slice(0, 2) ?? 9)))
    : 9;
  const endHour = hourRows.length
    ? Math.max(...hourRows.map((entry) => Number(entry.closes_at?.slice(0, 2) ?? 18)))
    : 18;

  return {
    context: dataset.context,
    date: targetDate,
    timezone: dataset.salon.timezone,
    range: {
      startHour,
      endHour: Math.max(endHour, startHour + 8),
    },
    columns,
    unassignedEvents: events.filter((event) => !event.staffId),
  };
}

export async function getAdminCustomersData(): Promise<AdminCustomersData> {
  const dataset = await getReadDataset();
  const customers: AdminCustomerListItem[] = dataset.customers.map((customer) => {
    const bookings = dataset.bookings.filter((booking) => booking.customer_id === customer.id);
    return {
      customer,
      fullName: `${customer.first_name} ${customer.last_name}`.trim(),
      bookingCount: bookings.length,
      latestBookingDate: bookings[0]?.booking_date ?? null,
    };
  });

  return {
    context: dataset.context,
    customers,
  };
}

export async function getAdminServicesData(): Promise<AdminServicesData> {
  const dataset = await getReadDataset();
  const services: AdminServiceRecord[] = dataset.services.map((service) => ({
    service,
    addons: dataset.addons.filter((addon) => addon.service_id === service.id),
    assignedStaffIds: dataset.staffServices
      .filter((link) => link.service_id === service.id)
      .map((link) => link.staff_id),
  }));

  return {
    context: dataset.context,
    services,
  };
}

export async function getAdminStaffData(): Promise<AdminStaffData> {
  const dataset = await getReadDataset();
  const staff: AdminStaffRecord[] = dataset.staff.map((member) => ({
    staff: member,
    assignments: dataset.staffServices
      .filter((link) => link.staff_id === member.id)
      .map((link) => {
        const service = dataset.services.find((entry) => entry.id === link.service_id);
        return {
          serviceId: link.service_id,
          serviceName: service?.name ?? "Unknown service",
          category: service?.category ?? "General",
          customDurationMinutes: link.custom_duration_minutes,
          customPriceCents: link.custom_price_cents,
        };
      }),
  }));

  return {
    context: dataset.context,
    services: dataset.services,
    staff,
  };
}

export async function getAdminSettingsData(): Promise<AdminSettingsData> {
  const dataset = await getReadDataset();
  return {
    context: dataset.context,
    workingHours: dataset.workingHours.filter((row) => row.staff_id === null),
    blackoutDates: dataset.blackoutDates,
    staff: dataset.staff,
  };
}

export async function getAdminThemeData(): Promise<AdminThemeData> {
  const dataset = await getReadDataset();
  return {
    context: dataset.context,
    themeSettings: dataset.themeSettings,
  };
}

export async function getAdminNotificationsData(): Promise<AdminNotificationsData> {
  const dataset = await getReadDataset();
  return {
    context: dataset.context,
    notifications: dataset.notifications.map((notification) => {
      const booking = notification.booking_id
        ? dataset.bookings.find((entry) => entry.id === notification.booking_id) ?? null
        : null;
      const customer = notification.customer_id
        ? dataset.customers.find((entry) => entry.id === notification.customer_id) ?? null
        : null;

      return {
        notification,
        bookingLabel: booking ? `${booking.booking_date} ${booking.customer_name_snapshot}` : null,
        customerName: customer ? `${customer.first_name} ${customer.last_name}`.trim() : null,
      };
    }),
  };
}

export async function getRuntimeThemeSettingsRow(): Promise<SalonThemeSettingsRow> {
  const dataset = await getReadDataset();
  return dataset.themeSettings;
}


