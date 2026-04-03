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
        title="Portfolio-led presentation for the studio's visual identity"
        description="The gallery now uses structured image data in a more social, image-led layout so the demo feels closer to a real nail portfolio than a holding page."
      />
      <GalleryShowcaseSection items={gallery} />
      <CtaSection salon={salon} />
    </>
  );
}
