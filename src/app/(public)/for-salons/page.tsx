import { ShowcaseOwnerHeroSection } from "@/components/showcase/showcase-owner-hero-section";
import {
  ShowcaseBenefitsSection,
  ShowcaseComparisonSection,
  ShowcaseDemoRequestSection,
  ShowcaseFaqSection,
  ShowcaseHowItWorksSection,
  ShowcasePricingSection,
} from "@/components/showcase/showcase-sales-sections";
import { ShowcaseThemePreviewSection } from "@/components/showcase/showcase-theme-preview-section";
import { getPublicHomePageData } from "@/lib/data/public";

type ForSalonsPageProps = {
  searchParams?: {
    request?: string | string[];
  };
};

function readSearchParam(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function ForSalonsPage({ searchParams }: ForSalonsPageProps) {
  const requestState = readSearchParam(searchParams?.request);
  const { salon, services, staff, reviews } = await getPublicHomePageData();

  return (
    <>
      <ShowcaseOwnerHeroSection
        salonName={salon.name}
        serviceCount={services.length}
        staffCount={staff.length}
        reviewCount={reviews.length}
      />
      <ShowcaseBenefitsSection />
      <ShowcaseHowItWorksSection />
      <ShowcaseThemePreviewSection />
      <ShowcaseComparisonSection />
      <ShowcasePricingSection />
      <ShowcaseFaqSection />
      <ShowcaseDemoRequestSection requestState={requestState} />
    </>
  );
}
