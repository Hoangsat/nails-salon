import { DateTime } from "luxon";

import { BookingFlow } from "@/components/booking/booking-flow";
import { PageIntro } from "@/components/sections/page-intro";
import { getPublicBookingPageData } from "@/lib/data/public";

export default async function BookingPage() {
  const { salon, services, staff } = await getPublicBookingPageData();
  const minBookingDate = DateTime.now().setZone(salon.timezone).toISODate() ?? "";

  return (
    <>
      <PageIntro
        eyebrow="Booking"
        title="Book an appointment with live availability"
        description="Choose a service, optional add-ons, a preferred artist, and a real bookable time before confirming the appointment and sending a confirmation email."
      />
      <BookingFlow
        salon={{
          id: salon.id,
          name: salon.name,
          currencyCode: salon.currencyCode,
          timezone: salon.timezone,
        }}
        minBookingDate={minBookingDate}
        services={services.map((service) => ({
          id: service.id,
          name: service.name,
          category: service.category,
          shortDescription: service.shortDescription,
          description: service.description,
          durationMinutes: service.durationMinutes,
          priceFromCents: service.priceFromCents,
          addons: service.addons,
          staffIds: service.staffIds,
        }))}
        staff={staff.map((member) => ({
          id: member.id,
          displayName: member.displayName,
          role: member.role,
          profileImageUrl: member.profileImageUrl,
        }))}
      />
    </>
  );
}
