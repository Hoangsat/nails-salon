import { PageIntro } from "@/components/sections/page-intro";
import { ServicesCatalogueSection } from "@/components/sections/public-sections";
import { CtaSection } from "@/components/sections/cta-section";
import { getSalonProfile, getSalonServicesWithAddons } from "@/lib/data/public";

export default async function ServicesPage() {
  const [salon, services] = await Promise.all([
    getSalonProfile(),
    getSalonServicesWithAddons(),
  ]);

  return (
    <>
      <PageIntro
        eyebrow="Services"
        title="A service menu that looks ready for real guests"
        description="Services are grouped by category and presented with structured pricing, durations, and add-ons so the page feels closer to a live salon website than a simple brochure page."
      />
      <ServicesCatalogueSection services={services} currencyCode={salon.currencyCode} />
      <CtaSection salon={salon} />
    </>
  );
}
