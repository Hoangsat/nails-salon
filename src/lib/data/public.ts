import { cache } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";

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

const defaultSalonSlug = demoSalonProfile.slug;

async function resolveSalonRow(client: SupabaseClient, slug: string) {
  const { data, error } = await client
    .from("salons")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return data as SalonsRow;
}

async function withSalonFallback<T>(
  slug: string,
  query: (client: SupabaseClient, salonRow: SalonsRow) => Promise<T>,
  fallback: () => T,
): Promise<T> {
  const client = createServerSupabaseClient();

  if (!client) {
    return fallback();
  }

  try {
    const salonRow = await resolveSalonRow(client, slug);

    if (!salonRow) {
      return fallback();
    }

    return await query(client, salonRow);
  } catch {
    return fallback();
  }
}

export const getSalonProfile = cache(async (slug = defaultSalonSlug): Promise<SalonProfile> => {
  return withSalonFallback(
    slug,
    async (_client, salonRow) => mapSalonRow(salonRow),
    () => demoSalonDataset.salon,
  );
});

export const getSalonThemeSettings = cache(
  async (slug = defaultSalonSlug): Promise<SalonThemeSettings> => {
    return withSalonFallback(
      slug,
      async (client, salonRow) => {
        const { data, error } = await client
          .from("salon_theme_settings")
          .select("*")
          .eq("salon_id", salonRow.id)
          .maybeSingle();

        if (error || !data) {
          return demoSalonDataset.themeSettings;
        }

        return mapThemeSettingsRow(data as SalonThemeSettingsRow);
      },
      () => demoSalonDataset.themeSettings,
    );
  },
);

export const getSalonStaff = cache(async (slug = defaultSalonSlug): Promise<StaffMember[]> => {
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
        return demoSalonDataset.staff;
      }

      return (data as StaffRow[]).map(mapStaffRow);
    },
    () => demoSalonDataset.staff,
  );
});

export const getSalonWorkingHours = cache(
  async (slug = defaultSalonSlug): Promise<WorkingHoursEntry[]> => {
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
          return demoSalonDataset.workingHours;
        }

        return (data as WorkingHoursRow[]).map(mapWorkingHoursRow);
      },
      () => demoSalonDataset.workingHours,
    );
  },
);

export const getSalonServicesWithAddons = cache(
  async (slug = defaultSalonSlug): Promise<SalonService[]> => {
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
          return demoSalonDataset.services;
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

export const getSalonGallery = cache(async (slug = defaultSalonSlug): Promise<GalleryImage[]> => {
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
        return demoSalonDataset.gallery;
      }

      return (data as GalleryImagesRow[]).map(mapGalleryImageRow);
    },
    () => demoSalonDataset.gallery,
  );
});

export const getSalonReviews = cache(async (slug = defaultSalonSlug): Promise<Review[]> => {
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
        return demoSalonDataset.reviews;
      }

      return (data as ReviewsRow[]).map(mapReviewRow);
    },
    () => demoSalonDataset.reviews,
  );
});

export const getPublicHomePageData = cache(async (slug = defaultSalonSlug) => {
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

export const getPublicContactPageData = cache(async (slug = defaultSalonSlug) => {
  const [salon, workingHours] = await Promise.all([
    getSalonProfile(slug),
    getSalonWorkingHours(slug),
  ]);

  return {
    salon,
    workingHours,
  };
});

export const getPublicBookingPageData = cache(async (slug = defaultSalonSlug) => {
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
