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
        title="A clear service menu for every appointment type"
        description="Browse manicures, pedicures, BIAB, acrylics, removals, and nail design with clear prices and appointment times."
      />
      <ServicesCatalogueSection services={services} currencyCode={salon.currencyCode} />
      <CtaSection salon={salon} />
    </>
  );
}
