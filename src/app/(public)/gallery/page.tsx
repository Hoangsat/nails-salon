import { PageIntro } from "@/components/sections/page-intro";
import { CtaSection } from "@/components/sections/cta-section";
import { GalleryShowcaseSection } from "@/components/sections/gallery-showcase-section";
import { getSalonGallery, getSalonProfile } from "@/lib/data/public";

export default async function GalleryPage() {
  const [salon, gallery] = await Promise.all([getSalonProfile(), getSalonGallery()]);

  return (
    <>
      <PageIntro
        eyebrow="Gallery"
        title="Recent sets, finishes, and nail design inspiration"
        description="Explore recent work from the studio, from clean everyday finishes to more detailed design-led sets."
      />
      <GalleryShowcaseSection items={gallery} />
      <CtaSection salon={salon} />
    </>
  );
}
