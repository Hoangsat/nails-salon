import { CtaSection } from "@/components/sections/cta-section";
import { GalleryPreviewSection } from "@/components/sections/gallery-preview-section";
import { HeroSection } from "@/components/sections/hero-section";
import { ReviewsPreviewSection } from "@/components/sections/reviews-preview-section";
import { ServicesPreviewSection } from "@/components/sections/services-preview-section";
import { ValuePropositionSection } from "@/components/sections/value-proposition-section";
import { WhyChooseUsSection } from "@/components/sections/why-choose-us-section";
import { getPublicHomePageData } from "@/lib/data/public";
import { getFeaturedServices } from "@/lib/data/selectors";

export default async function HomePage() {
  const { salon, themeSettings, services, gallery, reviews, staff } = await getPublicHomePageData();
  const featuredServices = getFeaturedServices(services, 3);

  return (
    <>
      <HeroSection
        salon={salon}
        themeSettings={themeSettings}
        services={featuredServices}
        staff={staff}
        gallery={gallery.slice(0, 3)}
      />
      <ValuePropositionSection
        salon={salon}
        featuredServices={featuredServices}
        staff={staff}
        reviews={reviews}
      />
      <ServicesPreviewSection services={featuredServices} currencyCode={salon.currencyCode} />
      <WhyChooseUsSection />
      <GalleryPreviewSection items={gallery.slice(0, 3)} />
      <ReviewsPreviewSection reviews={reviews.slice(0, 3)} />
      <CtaSection salon={salon} />
    </>
  );
}
