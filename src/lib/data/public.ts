import { cache } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";

import { shouldAllowDemoFallback } from "@/lib/config/production-readiness";
import { demoSalonDataset, demoSalonProfile } from "@/lib/data/demo";
import {
  mapGalleryImageRow,
  mapReviewRow,
  mapSalonRow,
  mapServiceAddonRow,
  mapServiceRow,
  mapStaffRow,
  mapThemeSettingsRow,
  mapWorkingHoursRow,
} from "@/lib/data/mappers";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type {
  GalleryImagesRow,
  ReviewsRow,
  SalonThemeSettingsRow,
  SalonsRow,
  ServiceAddonsRow,
  ServicesRow,
  StaffRow,
  StaffServicesRow,
  WorkingHoursRow,
} from "@/types/database";
import type {
  GalleryImage,
  Review,
  SalonProfile,
  SalonService,
  SalonThemeSettings,
  StaffMember,
  WorkingHoursEntry,
} from "@/types/salon";

function resolveDemoFallback<T>(fallback: () => T, errorMessage: string): T {
  if (shouldAllowDemoFallback()) {
    return fallback();
  }

  throw new Error(errorMessage);
}

type LegacySalonRow = Partial<SalonsRow> & { address?: string | null };

function normalizeSalonRow(row: LegacySalonRow): SalonsRow {
  return {
    id: row.id ?? demoSalonProfile.id,
    slug: row.slug ?? demoSalonProfile.slug,
    name: row.name ?? demoSalonProfile.name,
    tagline: row.tagline ?? demoSalonProfile.tagline,
    description: row.description ?? demoSalonProfile.description,
    phone: row.phone ?? demoSalonProfile.phone,
    email: row.email ?? demoSalonProfile.email,
    address_line_1: row.address_line_1 ?? row.address ?? demoSalonProfile.addressLine1,
    address_line_2: row.address_line_2 ?? demoSalonProfile.addressLine2,
    city: row.city ?? demoSalonProfile.city,
    region: row.region ?? demoSalonProfile.region,
    postal_code: row.postal_code ?? demoSalonProfile.postalCode,
    country_code: row.country_code ?? demoSalonProfile.countryCode,
    timezone: row.timezone ?? demoSalonProfile.timezone,
    currency_code: row.currency_code ?? demoSalonProfile.currencyCode,
    website_url: row.website_url ?? demoSalonProfile.websiteUrl,
    facebook_url: row.facebook_url ?? demoSalonProfile.facebookUrl,
    instagram_url: row.instagram_url ?? demoSalonProfile.instagramUrl,
    booking_notice: row.booking_notice ?? demoSalonProfile.bookingNotice,
    is_active: row.is_active ?? demoSalonProfile.isActive,
    created_at: row.created_at ?? demoSalonProfile.createdAt,
    updated_at: row.updated_at ?? row.created_at ?? demoSalonProfile.updatedAt,
  };
}

async function resolveSalonRow(client: SupabaseClient) {
  const attempts = [
    () => client.from("salons").select("*").eq("is_active", true).limit(1).maybeSingle(),
    () => client.from("salons").select("*").limit(1).maybeSingle(),
  ];

  for (const runAttempt of attempts) {
    const { data, error } = await runAttempt();

    if (!error && data) {
      return normalizeSalonRow(data as LegacySalonRow);
    }
  }

  return null;
}

async function withSalonFallback<T>(
  _slug: string | undefined,
  query: (client: SupabaseClient, salonRow: SalonsRow) => Promise<T>,
  fallback: () => T,
): Promise<T> {
  const client = createServerSupabaseClient();

  if (!client) {
    return resolveDemoFallback(fallback, "Supabase is not configured and demo fallback is disabled.");
  }

  try {
    const salonRow = await resolveSalonRow(client);

    if (!salonRow) {
      return fallback();
    }

    return await query(client, salonRow);
  } catch (error) {
    if (shouldAllowDemoFallback()) {
      return fallback();
    }

    throw error;
  }
}

export const getSalonProfile = cache(async (slug = undefined): Promise<SalonProfile> => {
  return withSalonFallback(
    slug,
    async (_client, salonRow) => mapSalonRow(normalizeSalonRow(salonRow as LegacySalonRow)),
    () => demoSalonDataset.salon,
  );
});

export const getSalonThemeSettings = cache(
  async (slug = undefined): Promise<SalonThemeSettings> => {
    return withSalonFallback(
      slug,
      async (client, salonRow) => {
        const { data, error } = await client
          .from("salon_theme_settings")
          .select("*")
          .eq("salon_id", salonRow.id)
          .maybeSingle();

        if (error || !data) {
          return resolveDemoFallback(
            () => demoSalonDataset.themeSettings,
            "Salon theme settings could not be loaded.",
          );
        }

        return mapThemeSettingsRow(data as SalonThemeSettingsRow);
      },
      () => demoSalonDataset.themeSettings,
    );
  },
);

export const getSalonStaff = cache(async (slug = undefined): Promise<StaffMember[]> => {
  return withSalonFallback(
    slug,
    async (client, salonRow) => {
      const { data, error } = await client
        .from("staff")
        .select("*")
        .eq("salon_id", salonRow.id)
        .eq("is_active", true)
        .order("sort_order", { ascending: true });

      if (error || !data) {
        return resolveDemoFallback(() => demoSalonDataset.staff, "Salon staff could not be loaded.");
      }

      return (data as StaffRow[]).map(mapStaffRow);
    },
    () => demoSalonDataset.staff,
  );
});

export const getSalonWorkingHours = cache(
  async (slug = undefined): Promise<WorkingHoursEntry[]> => {
    return withSalonFallback(
      slug,
      async (client, salonRow) => {
        const { data, error } = await client
          .from("working_hours")
          .select("*")
          .eq("salon_id", salonRow.id)
          .is("staff_id", null)
          .order("sort_order", { ascending: true });

        if (error || !data) {
          return resolveDemoFallback(
            () => demoSalonDataset.workingHours,
            "Salon working hours could not be loaded.",
          );
        }

        return (data as WorkingHoursRow[]).map(mapWorkingHoursRow);
      },
      () => demoSalonDataset.workingHours,
    );
  },
);

export const getSalonServicesWithAddons = cache(
  async (slug = undefined): Promise<SalonService[]> => {
    return withSalonFallback(
      slug,
      async (client, salonRow) => {
        const [servicesResult, addonsResult, staffLinksResult] = await Promise.all([
          client
            .from("services")
            .select("*")
            .eq("salon_id", salonRow.id)
            .eq("is_active", true)
            .order("sort_order", { ascending: true }),
          client
            .from("service_addons")
            .select("*")
            .eq("salon_id", salonRow.id)
            .eq("is_active", true)
            .order("sort_order", { ascending: true }),
          client.from("staff_services").select("*").eq("salon_id", salonRow.id),
        ]);

        if (
          servicesResult.error ||
          addonsResult.error ||
          staffLinksResult.error ||
          !servicesResult.data ||
          !addonsResult.data ||
          !staffLinksResult.data
        ) {
          return resolveDemoFallback(
            () => demoSalonDataset.services,
            "Salon services and add-ons could not be loaded.",
          );
        }

        const addonsByService = new Map<string, ReturnType<typeof mapServiceAddonRow>[]>();
        for (const addon of addonsResult.data as ServiceAddonsRow[]) {
          const mapped = mapServiceAddonRow(addon);
          const list = addonsByService.get(mapped.serviceId) ?? [];
          list.push(mapped);
          addonsByService.set(mapped.serviceId, list);
        }

        const staffLinks = staffLinksResult.data as StaffServicesRow[];

        return (servicesResult.data as ServicesRow[]).map((service) =>
          mapServiceRow(
            service,
            addonsByService.get(service.id) ?? [],
            staffLinks.filter((link) => link.service_id === service.id),
          ),
        );
      },
      () => demoSalonDataset.services,
    );
  },
);

export const getSalonGallery = cache(async (slug = undefined): Promise<GalleryImage[]> => {
  return withSalonFallback(
    slug,
    async (client, salonRow) => {
      const { data, error } = await client
        .from("gallery_images")
        .select("*")
        .eq("salon_id", salonRow.id)
        .eq("is_active", true)
        .order("sort_order", { ascending: true });

      if (error || !data) {
        return resolveDemoFallback(() => demoSalonDataset.gallery, "Salon gallery could not be loaded.");
      }

      return (data as GalleryImagesRow[]).map(mapGalleryImageRow);
    },
    () => demoSalonDataset.gallery,
  );
});

export const getSalonReviews = cache(async (slug = undefined): Promise<Review[]> => {
  return withSalonFallback(
    slug,
    async (client, salonRow) => {
      const { data, error } = await client
        .from("reviews")
        .select("*")
        .eq("salon_id", salonRow.id)
        .eq("is_published", true)
        .order("sort_order", { ascending: true });

      if (error || !data) {
        return resolveDemoFallback(() => demoSalonDataset.reviews, "Salon reviews could not be loaded.");
      }

      return (data as ReviewsRow[]).map(mapReviewRow);
    },
    () => demoSalonDataset.reviews,
  );
});

export const getPublicHomePageData = cache(async (slug = undefined) => {
  const [salon, themeSettings, services, gallery, reviews, staff] = await Promise.all([
    getSalonProfile(slug),
    getSalonThemeSettings(slug),
    getSalonServicesWithAddons(slug),
    getSalonGallery(slug),
    getSalonReviews(slug),
    getSalonStaff(slug),
  ]);

  return {
    salon,
    themeSettings,
    services,
    gallery,
    reviews,
    staff,
  };
});

export const getPublicContactPageData = cache(async (slug = undefined) => {
  const [salon, workingHours] = await Promise.all([
    getSalonProfile(slug),
    getSalonWorkingHours(slug),
  ]);

  return {
    salon,
    workingHours,
  };
});

export const getPublicBookingPageData = cache(async (slug = undefined) => {
  const [salon, services, staff] = await Promise.all([
    getSalonProfile(slug),
    getSalonServicesWithAddons(slug),
    getSalonStaff(slug),
  ]);

  return {
    salon,
    services,
    staff,
  };
});
